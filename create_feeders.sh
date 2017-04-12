#!/bin/sh

NUM=$1
PW=$2

if [ $# -eq 0 ]; then
    echo "Use like this:"
    echo "\t./create_feeders.sh [feederID 01-08, 18-26] [zip archieve password]"
    exit
fi

echo "Creating feeder${NUM}"

npm i

mkdir -p feeder$NUM/clean_node_data
cp -r agora.js clean_labels.json feed-content.js node_modules peerbackend package.json feeder$NUM

cd clean_node_data
unzip -o -P $PW -p data_node$NUM.zip > data.json
if [ $? -ne 0 ]; then
    echo "Error on unzipping. Right PW provided?"
fi
cp data.json ../feeder$NUM/clean_node_data/data_node01.json

cd ..
cp models/post01.pkl feeder$NUM/peerbackend/dist/post.pkl

cd feeder$NUM
./peerbackend/peerbackend --init

echo "feeder${NUM} created"
