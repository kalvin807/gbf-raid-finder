package main

import (
	"log"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	EnableCompression: true,
	ReadBufferSize:    1024,
	WriteBufferSize:   1024,
}

// ClientConfigMsg is a struct that server expected to receive from client
type clientConfigMsg struct {
	Config string `json:"config"`
	Raid   []int  `json:"raid"`
}

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan *RaidMsg

	// Set of raid this client listen to
	raid map[int]bool
}

// readPump pumps messages from the websocket connection to the hub.
func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	for {
		var msg clientConfigMsg
		err := c.conn.ReadJSON(&msg)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		var tempRaidConfig = make(map[int]bool)
		for _, raidID := range msg.Raid {
			tempRaidConfig[raidID] = true
		}
		c.raid = tempRaidConfig
	}
}

// writePump pumps messages from the hub to the websocket connection.
func (c *Client) writePump() {
	defer func() {
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if c.raid[message.Raid] {
				c.conn.WriteJSON(message)
			}
		}
	}
}

// serveWs handles websocket requests from the peer.
func makeWsClient(hub *Hub, conn *websocket.Conn) {
	client := &Client{hub: hub, conn: conn, send: make(chan *RaidMsg, 256), raid: make(map[int]bool)}
	client.hub.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}
