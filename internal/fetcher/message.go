package fetcher

import (
	"encoding/json"
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
	Raid      int       `json:"raid"`
	RoomId    string    `json:"roomId"`
	Msg       string    `json:"msg"`
	Timestamp time.Time `json:"timestamp"`
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
	msg, roomId, raidStr := safeGetMsg(tweetMatch, 1), safeGetMsg(tweetMatch, 2), safeGetMsg(tweetMatch, 3)
	raidInt, found := m.nameIDMap[raidStr]

	if !found && raidStr != "" {
		log.Printf("%s\n%s", "Unknown raid", rawText)
		return nil
	}

	return &RaidMsg{
		RoomId:    roomId,
		Msg:       msg,
		Raid:      raidInt,
		Timestamp: timestamp,
	}
}

// newMessageHandler creates a new messageHandler if raid.json exists at root
func newMessageHandler() *messageHandler {
	tempRaids, tempRaidIDMap := loadRaidData()
	return &messageHandler{
		nameIDMap: tempRaidIDMap,
		raids:     tempRaids,
	}
}

func loadRaidData() ([]raid, map[string]int) {
	file, ioErr := os.ReadFile(raidFilePath)
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

	return tempRaids, tempRaidIDMap
}
