package router

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"
	"github.com/kalvin807/gbf-raid-finder/internal/clients"
)

var upgrader = websocket.Upgrader{
	EnableCompression: true,
	ReadBufferSize:    1024,
	WriteBufferSize:   1024,
}

func cors(w http.ResponseWriter, r *http.Request) {
	if checkOrigin(r) {
		header := w.Header()
		header.Set("Access-Control-Allow-Methods", w.Header().Get("Allow"))
		header.Set("Access-Control-Allow-Origin", os.Getenv("FRONT_END_URL"))
		header.Set("Vary", "Origin")
	}
}

func checkOrigin(r *http.Request) bool {
	fnURL := os.Getenv("FRONT_END_URL")
	if origin := r.Header.Get("Origin"); origin != "" && origin == fnURL {
		return true
	}
	return false
}

// SetUpRoute set up endpoints for websocket and static files
func SetUpRoute(router *httprouter.Router, hub *clients.Hub) {
	staticFileServer := http.FileServer(http.Dir("static"))
	router.GET("/static/*filepath", func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		cors(w, r)
		r.URL.Path = p.ByName("filepath")
		staticFileServer.ServeHTTP(w, r)
	})

	router.HandlerFunc("GET", "/ws", func(w http.ResponseWriter, r *http.Request) {
		upgrader.CheckOrigin = func(r *http.Request) bool {
			if checkOrigin(r) {
				return true
			}
			return false
		}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		clients.MakeWsClient(hub, conn)
	})
}
