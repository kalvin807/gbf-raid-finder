package router

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/NYTimes/gziphandler"
	"github.com/fabioberger/airtable-go"
	"github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"
	"github.com/kalvin807/gbf-raid-finder/internal/clients"
	airTableFetcher "github.com/kalvin807/gbf-raid-finder/internal/fetcher/airtable"
	"github.com/tdewolff/minify"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 2048,
	CheckOrigin: func(r *http.Request) bool {
		return checkOrigin(r)
	},
}

var (
	cacheSince = time.Now().Format(http.TimeFormat)
	cacheUntil = time.Now().AddDate(0, 0, 1).Format(http.TimeFormat)
	m          = minify.New()
)

func setCache(w *http.ResponseWriter) {
	// Must revalidate
	header := (*w).Header()
	header.Set("Cache-Control", "no-cache")
	header.Set("Last-Modified", cacheSince)
	header.Set("Expires", cacheUntil)
}

func checkOrigin(r *http.Request) bool {
	fnURL := os.Getenv("FRONT_END_URL")
	origin := r.Header.Get("Origin")
	if origin == "" || origin == fnURL {
		return true
	}
	return false
}

func serveAirTable(table string, client airtable.Client) http.Handler {
	fetchAirTable := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mw := m.ResponseWriter(w, r)
		defer mw.Close()
		w = mw
		setCache(&w)
		w.Header().Set("Content-Type", "application/json")
		var jsonData []byte
		if table == "raid" {
			data := airTableFetcher.FetchRaid(client)
			jsonData, _ = json.Marshal(data)
		} else {
			data := airTableFetcher.FetchCategory(client)
			jsonData, _ = json.Marshal(data)
		}
		w.Write(jsonData)
	})
	return gziphandler.GzipHandler(fetchAirTable)
}

// SetUpRoute set up endpoints for websocket and static files
func SetUpRoute(router *httprouter.Router, hub *clients.Hub) {
	airTableClient := airTableFetcher.GetClient()
	router.GET("/", func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		http.Redirect(w, r, "https://kalvin807.github.io/gbf-raid-finder/", http.StatusTemporaryRedirect)
	})

	router.Handler("GET", "/raid", serveAirTable("raid", *airTableClient))
	router.Handler("GET", "/category", serveAirTable("category", *airTableClient))

	router.GET("/ws", func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		clients.MakeWsClient(hub, conn)
	})
}
