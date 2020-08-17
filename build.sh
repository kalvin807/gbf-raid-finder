#!/bin/sh

DIR="bin"
FILE="app"

if [ -d "$DIR" ]; then rm -Rf $DIR; fi

mkdir $DIR
go mod download
go build -o $DIR/$FILE

echo "Binary File Built"
