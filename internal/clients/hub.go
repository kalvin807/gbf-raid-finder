package clients

import (
	"log"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/kalvin807/gbf-raid-finder/internal/fetcher"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan *fetcher.RaidMsg

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	// Number of active client
	activeClientCount int16

	// Twitter live message stream
	tweetStream *twitter.Stream

	// Twitter client
	tweetClient *twitter.Client

	// TweetStream status
	tweetStatus bool
}

// NewHub create a Hub instance that managing all client/server communcations
func NewHub(tweetClient *twitter.Client) *Hub {
	return &Hub{
		register:          make(chan *Client),
		unregister:        make(chan *Client),
		clients:           make(map[*Client]bool),
		broadcast:         make(chan *fetcher.RaidMsg),
		activeClientCount: 0,
		tweetClient:       tweetClient,
		tweetStatus:       false,
	}
}

// Run start the hub main loop
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.registerClient(client)
		case client := <-h.unregister:
			h.unregisterClient(client)
		case message := <-h.broadcast:
			h.broadcastMessage(message)
		}
	}
}

func (h *Hub) registerClient(client *Client) {
	h.clients[client] = true
	h.activeClientCount++
	if !h.tweetStatus {
		log.Println("New client connected but stream stopped, Stream now starts")
		h.tweetStream = fetcher.MakeTweetStream(h.tweetClient)
		h.tweetStatus = true
		go fetcher.TweetStreamHandler(h.tweetStream, h.broadcast)
	}
}

func (h *Hub) unregisterClient(client *Client) {
	if _, ok := h.clients[client]; ok {
		delete(h.clients, client)
		close(client.send)
		h.activeClientCount--
		if h.activeClientCount == 0 {
			log.Println("No connected client, Stream now stops")
			h.tweetStream.Stop()
			h.tweetStatus = false
		}
	}
}

func (h *Hub) broadcastMessage(message *fetcher.RaidMsg) {
	for client := range h.clients {
		select {
		case client.send <- message:
		default:
			close(client.send)
			delete(h.clients, client)
		}
	}
}
