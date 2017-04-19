#!/bin/sh

NUM=$1
PW=$2

if [ $# -eq 0 ]; then
    echo "Use like this:"
    echo "\t./create_feeders.sh [feederID 01-08, 18-26] [zip archieve password]"
    exit
fi

echo "Creating feeder${NUM}"

# Install dependencies
npm i

# Duplicate code for new feeder 
mkdir -p feeder$NUM/clean_node_data
cp -r agora.js clean_labels.json feed-content.js node_modules peerbackend package.json feeder$NUM

# Add data to node
cd clean_node_data
unzip -o -P $PW -p data_node$NUM.zip > data.json
if [ $? -ne 0 ]; then
    echo "Error on unzipping. Right PW provided?"
fi
cp data.json ../feeder$NUM/clean_node_data/data_node01.json

# Add machine learning model to feeder
cd ..
cp models/post01.pkl feeder$NUM/peerbackend/dist/post.pkl

# Special tasks if the feeder is a spammer
if [ $NUM -gt "18" ]; then
    echo "Generated feeder is a spammer"

    # Spammers don't pull content from other people
    cd feeder$NUM
    sed -ie "s/'--noComments'/'--noComments', '--noPull'/g" agora.js
    cd ..
fi

# Initialize agora node of spamer
cd feeder$NUM
./peerbackend/peerbackend --init

# Done
echo "feeder${NUM} created"
