package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
	"github.com/kalvin807/gbf-raid-finder/internal/clients"
	"github.com/kalvin807/gbf-raid-finder/internal/fetcher"
	"github.com/kalvin807/gbf-raid-finder/internal/router"
)

func setupLog() {
	if _, err := os.Stat("log"); os.IsNotExist(err) {
		errDir := os.MkdirAll("log", 0755)
		if errDir != nil {
			log.Fatal(err)
		}
	}

	file, err := os.OpenFile("./log/run.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal(err)
	}

	log.SetOutput(file)
	log.Println("Go start farm in gbf!")
}

func main() {
	setupLog()

	dotenvErr := godotenv.Load(".env")
	if dotenvErr != nil {
		log.Println("Error loading .env file")
	}

	apiKey, apiSecert := os.Getenv("TWITTER_API_KEY"), os.Getenv("TWITTER_API_SECERT")
	accessKey, accessSecert := os.Getenv("TWITTER_ACCESS_KEY"), os.Getenv("TWITTER_ACCESS_SECERT")

	if apiKey == "" || apiSecert == "" || accessKey == "" || accessSecert == "" {
		log.Fatal("Missing twitter credentials in .env)")
	}

	client := fetcher.MakeTwitterClient(apiKey, apiSecert, accessKey, accessSecert)
	hub := clients.NewHub(client)

	go hub.Run()

	r := httprouter.New()
	router.SetUpRoute(r, hub)

	err := http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
