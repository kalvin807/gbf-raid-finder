package airTableFetcher

import (
	"os"

	"github.com/fabioberger/airtable-go"
)

type RaidRecord struct {
	Fields struct {
		Name_en  string `json:"name_en"`
		Name_jp  string `json:"name_jp"`
		Category string `json:"category"`
		Element  string `json:"element"`
		Hash     string `json:"hash"`
	} `json:"fields"`
}

type CategoryRecord struct {
	Fields struct {
		Name_en string `json:"name_en"`
		Name_jp string `json:"name_jp"`
		Id      string `json:"id"`
	} `json:"fields"`
}

func GetClient() *airtable.Client {
	baseID := os.Getenv("AIRTABLE_BASE_ID")
	token := os.Getenv("AIRTABLE_TOKEN")
	client, _ := airtable.New(token, baseID)
	return client
}

func FetchRaid(client airtable.Client) []RaidRecord {
	data := []RaidRecord{}
	if err := client.ListRecords("raid", &data); err != nil {
		panic(err)
	}
	return data
}

func FetchCategory(client airtable.Client) []CategoryRecord {
	data := []CategoryRecord{}
	if err := client.ListRecords("category", &data); err != nil {
		panic(err)
	}
	return data
}
