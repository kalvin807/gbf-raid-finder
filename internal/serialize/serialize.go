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
	msgPb := &RaidMessage{}
	msgPb.RoomId = string(msg.RoomId)
	msgPb.Raid = int32(msg.Raid)
	msgPb.Msg = msg.Msg
	msgPb.Timestamp = msg.Timestamp.Format(time.RFC3339)
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

	return &ClientConfigMsg{Config: subReqPb.Config, Raid: subReqPb.Raid}, nil
}
