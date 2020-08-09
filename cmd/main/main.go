package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

var addr = flag.String("a", ":8080", "http service address")

func serveHome(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL)
	if r.URL.Path != "/" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "../../web/home.html")
}

func setupLog() {
	file, err := os.OpenFile("../../logs.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
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

	hub := newHub()
	go hub.run()

	apiKey, apiSecert := os.Getenv("TWITTER_API_KEY"), os.Getenv("TWITTER_API_SECERT")
	accessKey, accessSecert := os.Getenv("TWITTER_ACCESS_KEY"), os.Getenv("TWITTER_ACCESS_SECERT")

	if apiKey == "" || apiSecert == "" || accessKey == "" || accessSecert == "" {
		log.Fatal("Missing twitter credentials in .env)")
	}

	client := MakeTwitterClient(apiKey, apiSecert, accessKey, accessSecert)
	quit := make(chan bool)
	go TweetStreamController(client, quit, hub)

	http.HandleFunc("/", serveHome)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})
	err := http.ListenAndServe(*addr, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
