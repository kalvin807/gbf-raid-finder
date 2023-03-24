package main

import (
	"github.com/kalvin807/gbf-raid-finder/internal/clients"
	"github.com/kalvin807/gbf-raid-finder/internal/fetcher"
	"github.com/kalvin807/gbf-raid-finder/internal/router"
	"github.com/kalvin807/gbf-raid-finder/internal/util"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	util.SetupLog()

	cfg := util.LoadConfig()

	client := fetcher.MakeTwitterV2Client(
		cfg.TwitterBearerToken,
	)
	fetcher.SetGBFRaidTwitterRules(client)
	hub := clients.NewHub(client)
	go hub.Run()

	/**
	 * Router
	**/

	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.Decompress())
	e.Use(middleware.Gzip())
	e.Use(middleware.CORS())

	router.SetUpRoute(e, hub)

	// Start server
	e.Logger.Fatal(e.Start(":" + cfg.Port))
}
