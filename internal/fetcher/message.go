package fetcher

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"regexp"
	"strings"
)

var (
	roomIDMsgRegex = regexp.MustCompile("(?P<Desc>.*)(?P<ID>[0-9A-Z]{8})")
	raidRegex      = regexp.MustCompile(".*\n.*\n([^\n]+)")
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
	return matches[id]
}

// newRaidMsg create a raidmsg from a tweet
func (m messageHandler) newRaidMsg(rawText string, time string) *RaidMsg {
	idMsgMatch := roomIDMsgRegex.FindStringSubmatch(rawText)
	raidMatch := raidRegex.FindStringSubmatch(rawText)
	roomID, msg, raid := safeGetMsg(idMsgMatch, 2), safeGetMsg(idMsgMatch, 1), safeGetMsg(raidMatch, 1)
	raid = strings.TrimSpace(raid)

	raidID, found := m.nameIDMap[raid]
	if !found && raid != "" {
		log.Printf("%s: %s", "Unknown raid", raid)
		return nil
	}
	return &RaidMsg{
		RoomID:    strings.TrimSpace(roomID),
		Msg:       strings.TrimSpace(msg),
		Raid:      raidID,
		Timestamp: time,
	}

}

// NewmessageHandler creates a new messageHandler if raid.json exists at root
func newMessageHandler() *messageHandler {
	path := "../../static/raid.json"
	file, ioErr := ioutil.ReadFile(path)
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
