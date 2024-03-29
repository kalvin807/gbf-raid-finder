package clients

import (
	"log"

	twitterV2 "github.com/g8rswimmer/go-twitter/v2"
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
	tweetStream *twitterV2.TweetStream

	// Twitter client
	tweetClient *twitterV2.Client

	tweetStreamSignal chan bool

	// TweetStream status
	tweetStatus bool
}

// NewHub create a Hub instance that managing all client/server communications
func NewHub(tweetClient *twitterV2.Client) *Hub {
	return &Hub{
		register:          make(chan *Client),
		unregister:        make(chan *Client),
		clients:           make(map[*Client]bool),
		broadcast:         make(chan *fetcher.RaidMsg),
		activeClientCount: 0,
		tweetClient:       tweetClient,
		tweetStatus:       false,
		tweetStreamSignal: make(chan bool),
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
		go fetcher.TweetStreamHandler(h.tweetStream, h.broadcast, h.tweetStreamSignal)
	}
}

func (h *Hub) unregisterClient(client *Client) {
	if _, ok := h.clients[client]; ok {
		delete(h.clients, client)
		close(client.send)
		h.activeClientCount--
		// if h.activeClientCount == 0 {
		// 	log.Println("No connected client, Stream now stops")
		// 	h.tweetStreamSignal <- true
		// 	h.tweetStatus = false
		// }
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
