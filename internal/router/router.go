package router

import (
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/kalvin807/gbf-raid-finder/internal/clients"
	"github.com/kalvin807/gbf-raid-finder/internal/fetcher"
	"github.com/labstack/echo/v4"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
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

func addCacheHeader(c *echo.Response) {
	// Must revalidate
	header := (*c).Header()
	header.Set("Cache-Control", "no-cache, max-age=0")
	header.Set("Last-Modified", cacheSince)
	header.Set("Expires", cacheUntil)
}

// SetUpRoute set up endpoints for websocket and static files
func SetUpRoute(e *echo.Echo, hub *clients.Hub) {

	e.GET("/", func(c echo.Context) error {
		c.Response().Header().Set("Referer", "https://gbf-api.kalvin.io")
		return c.Redirect(http.StatusFound, "https://gbf.kalvin.io/")
	})

	e.GET("/raid", func(c echo.Context) error {
		addCacheHeader(c.Response())
		return c.File(raidFilePath)
	})

	e.GET("/category", func(c echo.Context) error {
		addCacheHeader(c.Response())
		return c.File(categoryFilePath)
	})

	e.GET("/ws", func(c echo.Context) error {
		conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
		if err != nil {
			return err
		}
		clients.MakeWsClient(hub, conn)
		return nil
	})
}
