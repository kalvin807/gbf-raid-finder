package router

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"
	"github.com/kalvin807/gbf-raid-finder/internal/clients"
	"github.com/kalvin807/gbf-raid-finder/internal/fetcher"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 2048,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var (
	raidFilePath     = fetcher.GetFilePath("/static/raid.json")
	categoryFilePath = fetcher.GetFilePath("/static/category.json")
	cacheSince       = time.Now().Format(http.TimeFormat)
	cacheUntil       = time.Now().AddDate(0, 0, 7).Format(http.TimeFormat)
)

func setCache(w *http.ResponseWriter) {
	// Must revalidate
	header := (*w).Header()
	header.Set("Cache-Control", "no-cache, max-age=0")
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

func fileHandler(filePath string) http.Handler {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		setCache(&w)
		http.ServeFile(w, r, filePath)
	})
	return handler
}

// SetUpRoute set up endpoints for websocket and static files
func SetUpRoute(router *httprouter.Router, hub *clients.Hub) {

	router.GET("/", func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		http.Redirect(w, r, "https://kalvin807.github.io/gbf-raid-finder/", http.StatusTemporaryRedirect)
	})

	router.Handler("GET", "/raid", fileHandler(raidFilePath))
	router.Handler("GET", "/category", fileHandler(categoryFilePath))

	router.GET("/ws", func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		clients.MakeWsClient(hub, conn)
	})
}
