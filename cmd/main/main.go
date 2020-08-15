package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
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

func makeRouter() *httprouter.Router {
	router := httprouter.New()
	router.GlobalOPTIONS = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Access-Control-Request-Method") != "" {
			// Set CORS headers
			w.Header().Set("Access-Control-Allow-Methods", w.Header().Get("Allow"))
			w.Header().Set("Access-Control-Allow-Origin", "*")
		}
	})
	return router
}

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
	router.HandlerFunc("GET", "/", serveHome)
	fileServer := http.FileServer(http.Dir("../../static"))
	router.GET("/static/*filepath", func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {

		w.Header().Set("Access-Control-Allow-Methods", w.Header().Get("Allow"))
		w.Header().Set("Access-Control-Allow-Origin", "*")

		r.URL.Path = p.ByName("filepath")
		fileServer.ServeHTTP(w, r)
	})
	router.HandlerFunc("GET", "/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})
	err := http.ListenAndServe(*addr, router)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
