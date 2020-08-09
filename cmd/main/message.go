package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"regexp"
	"strings"
)

var (
	roomIDMsgRegex = regexp.MustCompile("(?P<Desc>.*)(?P<ID>[0-9A-Z]{8})")
	raidRegex      = regexp.MustCompile("(?P<Boss>Lv.*)")
)

// RaidMsg is a struct of a raid tweet
type RaidMsg struct {
	Raid      int    `json:"raid"`
	RoomID    string `json:"roomId"`
	Msg       string `json:"msg"`
	Timestamp string `json:"timestamp"`
}

// Raid is a struct of a raid config
type Raid struct {
	En       string `json:"en"`
	Jp       string `json:"jp"`
	Image    string `json:"image"`
	Category string `json:"category"`
	Element  string `json:"element"`
}

// MessageHandler handles tweet message transformation
type MessageHandler struct {
	nameIDMap map[string]int
	raids     []Raid
}

func safeGetMsg(matches []string, id int) string {
	if id > len(matches) {
		return ""
	}
	return matches[id]
}

// NewRaidMsg create a raidmsg from a tweet
func (m MessageHandler) NewRaidMsg(rawText string, time string) *RaidMsg {
	idMsgMatch := roomIDMsgRegex.FindStringSubmatch(rawText)
	raidMatch := raidRegex.FindStringSubmatch(rawText)
	roomID, msg, raid := safeGetMsg(idMsgMatch, 2), safeGetMsg(idMsgMatch, 1), safeGetMsg(raidMatch, 1)
	raid = strings.TrimSpace(raid)

	raidID, found := m.nameIDMap[raid]
	if !found && raid != "" {
		log.Printf("%s: %s", "Unknown raid", raid)
	}

	return &RaidMsg{
		RoomID:    strings.TrimSpace(roomID),
		Msg:       strings.TrimSpace(msg),
		Raid:      raidID,
		Timestamp: time,
	}
}

// NewMessageHandler creates a new MessageHandler if raid.json exists at root
func NewMessageHandler() *MessageHandler {
	path := "../../raid.json"
	file, ioErr := ioutil.ReadFile(path)
	if ioErr != nil {
		log.Fatal(ioErr)
	}

	var tempRaids []Raid
	var tempRaidIDMap = make(map[string]int)

	jsonErr := json.Unmarshal(file, &tempRaids)
	if jsonErr != nil {
		log.Fatal(jsonErr)
	}

	for i, r := range tempRaids {
		tempRaidIDMap[r.En] = i
		tempRaidIDMap[r.Jp] = i
	}

	return &MessageHandler{
		nameIDMap: tempRaidIDMap,
		raids:     tempRaids,
	}
}
