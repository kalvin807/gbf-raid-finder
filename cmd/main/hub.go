package main

import (
	"log"

	"github.com/dghubble/go-twitter/twitter"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan *RaidMsg

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

func newHub(tweetClient *twitter.Client) *Hub {
	return &Hub{
		register:          make(chan *Client),
		unregister:        make(chan *Client),
		clients:           make(map[*Client]bool),
		broadcast:         make(chan *RaidMsg),
		activeClientCount: 0,
		tweetClient:       tweetClient,
		tweetStatus:       false,
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			h.activeClientCount++
			// Start stream if stream is stopped
			if !h.tweetStatus {
				log.Println("New client connected but stream stopped, Stream now starts")
				h.tweetStream = MakeTweetStream(h.tweetClient)
				h.tweetStatus = true
				go TweetStreamHandler(h.tweetStream, h.broadcast)
			}
		case client := <-h.unregister:
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
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
