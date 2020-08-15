package main

import (
	"html"
	"log"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
)

// MakeTweetStream create uplink with twitter api
func MakeTweetStream(client *twitter.Client) *twitter.Stream {
	params := &twitter.StreamFilterParams{
		Track:         []string{"参加者募集！", "I need backup!"},
		StallWarnings: twitter.Bool(true),
	}

	stream, err := client.Streams.Filter(params)
	log.Println("Twitter Stream Started")

	if err != nil {
		log.Println(err)
	}

	return stream
}

// TweetStreamHandler Start stream
func TweetStreamHandler(stream *twitter.Stream, raidChan chan *RaidMsg) {
	msgHandler := NewMessageHandler()
	demux := twitter.NewSwitchDemux()
	demux.Tweet = func(tweet *twitter.Tweet) {
		// Make sure it is from GBF
		if tweet.Source == `<a href="http://granbluefantasy.jp/" rel="nofollow">グランブルー ファンタジー</a>` {
			msg := msgHandler.NewRaidMsg(html.UnescapeString(tweet.Text), tweet.CreatedAt)
			if msg != nil {
				raidChan <- msg
			}
		}
	}
	demux.HandleChan(stream.Messages)
}

// MakeTwitterClient create a twitter client for fetching data from twitter.com
func MakeTwitterClient(apiKey string, apiSecert string, accessKey string, accessSecert string) *twitter.Client {
	config := oauth1.NewConfig(apiKey, apiSecert)
	token := oauth1.NewToken(accessKey, accessSecert)
	httpClient := config.Client(oauth1.NoContext, token)
	client := twitter.NewClient(httpClient)
	return client
}
