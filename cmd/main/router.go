package main

import (
	"log"
	"net/http"
	"os"

	"github.com/julienschmidt/httprouter"
)

func makeRouter() *httprouter.Router {
	router := httprouter.New()
	return router
}

func cors(w http.ResponseWriter, r *http.Request) {
	fnURL := os.Getenv("FRONT_END_URL")
	origin := r.Header["Origin"][0]
	header := w.Header()
	if origin == fnURL {
		header.Set("Access-Control-Allow-Methods", w.Header().Get("Allow"))
		header.Set("Access-Control-Allow-Origin", fnURL)
		header.Set("Vary", "Origin")
	}
}

func setUpRoute(router *httprouter.Router, hub *Hub) {
	staticFileServer := http.FileServer(http.Dir("../../static"))
	router.GET("/static/*filepath", func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		cors(w, r)
		r.URL.Path = p.ByName("filepath")
		staticFileServer.ServeHTTP(w, r)
	})

	router.HandlerFunc("GET", "/ws", func(w http.ResponseWriter, r *http.Request) {
		upgrader.CheckOrigin = func(r *http.Request) bool {
			fnURL := os.Getenv("FRONT_END_URL")
			origin := r.Header["Origin"][0]
			if origin == fnURL {
				return true
			}
			return false
		}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		makeWsClient(hub, conn)
	})
}
