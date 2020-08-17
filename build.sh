#!/bin/sh

DIR="bin"
FILE="app"

if [ -d "$DIR" ]; then rm -Rf $DIR; fi

mkdir $DIR
go mod download
GOARCH=amd64 GOOS=linux go build -o $DIR/$FILE

echo "Binary File Built"
