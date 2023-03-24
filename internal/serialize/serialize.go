package serialize

import (
	"log"
	"time"

	"github.com/kalvin807/gbf-raid-finder/internal/fetcher"
	"google.golang.org/protobuf/proto"
)

// ClientConfigMsg is a struct that server expected to receive from client
type ClientConfigMsg struct {
	Config string  `json:"config"`
	Raid   []int32 `json:"raid"`
}

func SerializeMessage(msg *fetcher.RaidMsg) ([]byte, error) {
	msgPb := createRaidMessageFromRaidMsg(msg)
	out, err := proto.Marshal(msgPb)
	if err != nil {
		log.Println("Failed to encode:", err)
		return nil, nil
	}
	return out, nil
}

func DeserializeSubscribeRequest(bytes []byte) (*ClientConfigMsg, error) {
	subReqPb := &SubscribeRequest{}

	if err := proto.Unmarshal(bytes, subReqPb); err != nil {
		log.Println("Failed to parse:", err)
		return nil, nil
	}

	return createClientConfigMsgFromSubscribeRequest(subReqPb), nil
}

func createRaidMessageFromRaidMsg(msg *fetcher.RaidMsg) *RaidMessage {
	return &RaidMessage{
		RoomId:    msg.RoomId,
		Raid:      int32(msg.Raid),
		Msg:       msg.Msg,
		Timestamp: msg.Timestamp.Format(time.RFC3339),
	}
}

func createClientConfigMsgFromSubscribeRequest(subReqPb *SubscribeRequest) *ClientConfigMsg {
	return &ClientConfigMsg{
		Config: subReqPb.Config,
		Raid:   subReqPb.Raid,
	}
}
