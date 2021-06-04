package twitterFetcher

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"
	"regexp"
	"strings"
	"time"
)

var (
	tweetRegex   = regexp.MustCompile(`(?m)((?s).*?)([0-9A-F]{8}).*?\n.*?\n(.*?)$`)
	raidFilePath = GetFilePath("/static/raid.json")
)

// RaidMsg is a struct of a raid tweet
type RaidMsg struct {
	Raid      int    `json:"raid"`
	RoomID    string `json:"roomId"`
	Msg       string `json:"msg"`
	Timestamp string `json:"timestamp"`
}

// raid is a struct of a raid config
type raid struct {
	En       string `json:"en"`
	Jp       string `json:"jp"`
	Image    string `json:"image"`
	Category string `json:"category"`
	Element  string `json:"element"`
}

// messageHandler handles tweet message transformation
type messageHandler struct {
	nameIDMap map[string]int
	raids     []raid
}

func safeGetMsg(matches []string, id int) string {
	if id > len(matches) {
		return ""
	}
	return strings.TrimSpace(matches[id])
}

// GetFilePath gives the path of the raid.json
func GetFilePath(dir string) string {
	path, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}
	return path + dir
}

// newRaidMsg create a raidmsg from a tweet
func (m messageHandler) newRaidMsg(rawText string, timestamp time.Time) *RaidMsg {
	tweetMatch := tweetRegex.FindStringSubmatch(rawText)
	msg, roomID, raid := safeGetMsg(tweetMatch, 1), safeGetMsg(tweetMatch, 2), safeGetMsg(tweetMatch, 3)
	raidID, found := m.nameIDMap[raid]

	if !found && raid != "" {
		//log.Printf("%s\n%s", "Unknown raid", rawText)
		return nil
	}

	return &RaidMsg{
		RoomID:    roomID,
		Msg:       msg,
		Raid:      raidID,
		Timestamp: timestamp.Format(time.RFC3339),
	}
}

// NewmessageHandler creates a new messageHandler if raid.json exists at root
func newMessageHandler() *messageHandler {
	file, ioErr := ioutil.ReadFile(raidFilePath)
	if ioErr != nil {
		log.Fatal(ioErr)
	}

	var tempRaids []raid
	var tempRaidIDMap = make(map[string]int)

	jsonErr := json.Unmarshal(file, &tempRaids)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}

	for i, r := range tempRaids {
		tempRaidIDMap[r.En] = i
		tempRaidIDMap[r.Jp] = i
	}

	return &messageHandler{
		nameIDMap: tempRaidIDMap,
		raids:     tempRaids,
	}
}
