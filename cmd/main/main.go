package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

var addr = flag.String("a", ":8080", "http service address")

func setupLog() {
	file, err := os.OpenFile("../../logs.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal(err)
	}

	log.SetOutput(file)
	log.Println("Go start farm in gbf!")
}

func main() {
	flag.Parse()

	setupLog()

	dotenvErr := godotenv.Load("../../.env")
	if dotenvErr != nil {
		log.Fatal("Error loading .env file")
	}

	apiKey, apiSecert := os.Getenv("TWITTER_API_KEY"), os.Getenv("TWITTER_API_SECERT")
	accessKey, accessSecert := os.Getenv("TWITTER_ACCESS_KEY"), os.Getenv("TWITTER_ACCESS_SECERT")

	if apiKey == "" || apiSecert == "" || accessKey == "" || accessSecert == "" {
		log.Fatal("Missing twitter credentials in .env)")
	}

	client := MakeTwitterClient(apiKey, apiSecert, accessKey, accessSecert)
	hub := newHub(client)

	go hub.run()

	router := makeRouter()
	setUpRoute(router, hub)

	err := http.ListenAndServe(*addr, router)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
