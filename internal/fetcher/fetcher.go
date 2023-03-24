package fetcher

import (
	"context"
	"encoding/json"
	"fmt"
	"html"
	"log"
	"net/http"
	"time"

	"github.com/dghubble/go-twitter/twitter"
	"github.com/dghubble/oauth1"
	twitterV2 "github.com/g8rswimmer/go-twitter/v2"
)

func AddGBFRaidTwitterRules(client *twitterV2.Client) {
	streamRules := []twitterV2.TweetSearchStreamRule{{
		Value: "参加者募集！",
		Tag:   "JP",
	}, {
		Value: "I need backup!",
		Tag:   "EN",
	}}

	_, err := client.TweetSearchStreamAddRule(context.Background(), streamRules, false)
	if err != nil {
		log.Panicf("tweet search stream add rule callout error: %v", err)
	}
}

func IsGBFRaidTwitterRuleSet(client *twitterV2.Client) bool {
	searchStreamRules, err := client.TweetSearchStreamRules(context.Background(), []twitterV2.TweetSearchStreamRuleID{})
	if err != nil {
		log.Panicf("tweet search stream rule callout error: %v", err)
	}
	// Loop over rules, check if the rule is set. Require both JP and EN rule to be set
	isENset := false
	isJPset := false
	for _, rule := range searchStreamRules.Rules {
		if rule.Tag == "JP" {
			isJPset = true
		}
		if rule.Tag == "EN" {
			isENset = true
		}
	}

	return isENset && isJPset
}

func SetGBFRaidTwitterRules(client *twitterV2.Client) {
	if !IsGBFRaidTwitterRuleSet(client) {
		AddGBFRaidTwitterRules(client)
	}
}

// MakeTweetStream create uplink with twitter api
func MakeTweetStream(client *twitterV2.Client) *twitterV2.TweetStream {
	opts := twitterV2.TweetSearchStreamOpts{
		Expansions:  []twitterV2.Expansion{"attachments.media_keys", "author_id"},
		UserFields:  []twitterV2.UserField{"username", "profile_image_url", "url"},
		MediaFields: []twitterV2.MediaField{"url", "preview_image_url"},
		TweetFields: []twitterV2.TweetField{"created_at", "source"},
	}

	stream, err := client.TweetSearchStream(context.Background(), opts)
	log.Println("Twitter Stream Started")
	if err != nil {
		log.Println(err)
	}
	return stream
}

// TweetStreamHandler Start stream
func TweetStreamHandler(stream *twitterV2.TweetStream, raidChan chan *RaidMsg) {
	msgHandler := newMessageHandler()
	func() {
		defer stream.Close()
		for {
			select {

			case tm := <-stream.Tweets():
				tmb, err := json.Marshal(tm)
				if err != nil {
					log.Printf("error decoding system message %v", err)
				}
				log.Println(string(tmb))
				for _, tweet := range tm.Raw.Tweets {
					handleTweet(msgHandler, raidChan, tweet)
				}
			case sm := <-stream.SystemMessages():
				smb, err := json.Marshal(sm)
				if err != nil {
					log.Printf("error decoding system message %v", err)
				}

				log.Println("system")
				log.Println(string(smb))
			case de := <-stream.DisconnectionError():
				ded, err := json.Marshal(de)
				if err != nil {
					log.Printf("error decoding disconnect message %v", err)
				}

				log.Println("disconnect")
				log.Println(string(ded))
			case strErr := <-stream.Err():
				log.Println("error")
				log.Println(strErr)
			default:
			}
			if !stream.Connection() {
				log.Println("connection lost")
				return
			}
		}
	}()
}

func handleTweet(msgHandler *messageHandler, raidChan chan *RaidMsg, tweet *twitterV2.TweetObj) {
	creationTime := tweet.CreatedAt
	// FIXME: Error handling
	parsedTime, _ := time.Parse(time.RFC3339, creationTime)
	msg := msgHandler.newRaidMsg(html.UnescapeString(tweet.Text), parsedTime)
	if msg != nil {
		raidChan <- msg
	}
}

// MakeTwitterClient create a twitter client for fetching data from twitter.com
func MakeTwitterClient(apiKey string, apiSecret string, accessKey string, accessSecret string) *twitter.Client {
	config := oauth1.NewConfig(apiKey, apiSecret)
	token := oauth1.NewToken(accessKey, accessSecret)
	httpClient := config.Client(oauth1.NoContext, token)
	client := twitter.NewClient(httpClient)
	return client
}

type authorize struct {
	Token string
}

func (a authorize) Add(req *http.Request) {
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", a.Token))
}

func MakeTwitterV2Client(bearerToken string) *twitterV2.Client {
	return &twitterV2.Client{
		Authorizer: authorize{
			Token: bearerToken,
		},
		Client: http.DefaultClient,
		Host:   "https://api.twitter.com",
	}
}
