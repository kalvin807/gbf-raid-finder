# GBFinder Omega - グラブル救援検索・マグナ

A realtime twitter message filter that use to fetch all GBF raid message in twitter written in Go and Vue.js

> Very very welcome any kind of involvement (PR, issues...)  

> Idea wanted for the name of this raid finder :smile:

## Installation

0. Clone this project to your local environment.

### Prepare your Twitter API key

1. Apply a Twitter Developer Account [here](https://developer.twitter.com/en/apply-for-access).
2. Create a project
3. Generate and save both access key/secret and api key/secret

### Backend

1. Install go in your system
2. At project root create a .env with following content
```env
    FRONT_END_URL=<Url to the frontend for CORS setting>
    TWITTER_ACCESS_KEY=<access key>
    TWITTER_ACCESS_SECRET=<access secret>
    TWITTER_API_KEY=<api key>
    TWITTER_API_SECRET=<api secret>
```
3. Fetch go modules by `go get`
4. Start the backend server by `go run`

### Frontend

1. Switch to directory `/web/`
2. Create a .env file in `/web/`
```env
    WEBSOCKET_URI=<Url to the websocket endpoint>
    BACKEND_URL=<Url to the backend>
```
3. Download node modules with `yarn install`
4. Start the frontend server with `yarn dev`


## Thanks to
- GBF Raiders, Granblue Raid Finder... etc to giving me ideas and raid information
- GBF Wiki
- Every who used this tool!
- KMR and Cygames for creating this farm simulator - granblue fantasy
