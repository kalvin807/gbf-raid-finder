package util

import (
	"io"
	"log"
	"os"

	"github.com/caarlos0/env/v6"
	"github.com/joho/godotenv"
)

type Config struct {
	Port                string `env:"PORT" envDefault:"8080"`
	TwitterApiKey       string `env:"TWITTER_API_KEY,notEmpty"`
	TwitterApiSecret    string `env:"TWITTER_API_SECRET,notEmpty"`
	TwitterAccessKey    string `env:"TWITTER_ACCESS_KEY,notEmpty"`
	TwitterAccessSecret string `env:"TWITTER_ACCESS_SECRET,notEmpty"`
}

func SetupLog() {
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
	mw := io.MultiWriter(os.Stdout, file)
	log.SetOutput(mw)
	log.Println("Go start farm in gbf!")
}

func LoadConfig() *Config {
	env_var := os.Getenv("ENV")
	if env_var != "PROD" { // load .env file if ENV is not PROD
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file, missing .env?")
		}
	}
	cfg := &Config{}
	if err := env.Parse(cfg); err != nil {
		log.Fatal(err)
	}
	return cfg
}
