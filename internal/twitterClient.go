package main

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
)

var roomIDMsgRegex = regexp.MustCompile("(?P<Desc>.*)(?P<ID>[0-9A-Z]{8})")
var bossRegex = regexp.MustCompile("(?P<Boss>Lv.*)")

// RaidMsg is a struct of a raid tweet
type RaidMsg struct {
	Boss   string `json:"boss"`
	RoomID string `json:"roomId"`
	Msg    string `json:"msg"`
}

func safeGetMsg(matches []string, id int) string {
	if id > len(matches) {
		return ""
	}
	return matches[id]
}

// NewRaidMsg create a raidmsg from a tweet
func NewRaidMsg(rawText string) *RaidMsg {
	idMsgMatch := roomIDMsgRegex.FindStringSubmatch(rawText)
	bossMatch := bossRegex.FindStringSubmatch(rawText)
	roomID, msg, boss := safeGetMsg(idMsgMatch, 2), safeGetMsg(idMsgMatch, 1), safeGetMsg(bossMatch, 1)

	//bossMatch :=
	return &RaidMsg{
		RoomID: strings.TrimSpace(roomID),
		Msg:    strings.TrimSpace(msg),
		Boss:   strings.TrimSpace(boss),
	}
}

// TweetStreamController Start stream
func TweetStreamController(client *twitter.Client, tweetQuit chan bool, hub *Hub) {
	params := &twitter.StreamFilterParams{
		Track:         []string{"参加者募集！"},
		StallWarnings: twitter.Bool(true),
	}
	stream, _ := client.Streams.Filter(params)
	defer stream.Stop()
	demux := twitter.NewSwitchDemux()
	demux.Tweet = func(tweet *twitter.Tweet) {
		msg := NewRaidMsg(tweet.Text)
		hub.broadcast <- msg
	}
	for message := range stream.Messages {
		select {
		case <-tweetQuit:
			fmt.Printf("Stopping stream")
			stream.Stop()
			return
		default:
			demux.Handle(message)
		}
	}
}

func makeTwitterClient() *twitter.Client {
	config := oauth1.NewConfig("lMWebVnRlJ2ksKQLACzKnMwr7", "Il9LvX0MrqMk8rwOXngRRzFTzuhf03Tw7tmeujAlJ5705FGbex")
	token := oauth1.NewToken("843490459-ipPprd68yaOEQ4yglgRJ1Pw8juKE0Gx2PY4t9iHM", "jTLdWv99dZpY9rCyee00bAGfO6TUoRmyqfe1Eu1UXG6WD")
	httpClient := config.Client(oauth1.NoContext, token)
	client := twitter.NewClient(httpClient)
	return client
}
