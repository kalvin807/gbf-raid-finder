package clients

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
	"github.com/kalvin807/gbf-raid-finder/internal/fetcher"
	"github.com/kalvin807/gbf-raid-finder/internal/serialize"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = pongWait * 9 / 10
)

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan *fetcher.RaidMsg

	// Set of raid this client listen to
	raid map[int]bool
}

// readPump pumps messages from the websocket connection to the hub.
func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, buf, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		updatedRaidConfig := c.updateRaidConfig(buf)
		c.raid = updatedRaidConfig
	}
}

func (c *Client) updateRaidConfig(buf []byte) map[int]bool {
	msg, _ := serialize.DeserializeSubscribeRequest(buf)

	tempRaidConfig := make(map[int]bool)
	for _, raidID := range msg.Raid {
		tempRaidConfig[int(raidID)] = true
	}

	return tempRaidConfig
}

// writePump pumps messages from the hub to the websocket connection.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if c.raid[message.Raid] {
				buf, err := serialize.SerializeMessage(message)
				if err != nil {
					continue
				}
				c.conn.WriteMessage(websocket.BinaryMessage, buf)
			}
		}
	}
}

// MakeWsClient starts a client connect from websocket
func MakeWsClient(hub *Hub, conn *websocket.Conn) {
	client := &Client{hub: hub, conn: conn, send: make(chan *fetcher.RaidMsg, 256), raid: make(map[int]bool)}
	client.hub.register <- client

	// Allow collection of memory referenced by the caller by doing all work in new goroutines.
	go client.writePump()
	go client.readPump()
}
