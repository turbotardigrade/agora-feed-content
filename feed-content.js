const agora = require("./agora.js")
const fs = require("fs")
const path = require('path');
const through2 = require('through2');
const crypto = require('crypto');
const parse = require('JSONStream')

const labels = require('./clean_labels.json');
const MAX_DELAY = 7000;
const MIN_DELAY = 2000;

var i = 0;
data = [];

function request(e, next) {
    if (!e.title) {
	e.title = "";
    }
    if (!e.content) {
	e.content = "";
    }
    agora.request({
	command: "postPost",
	arguments: {
	    "title": e.title,
	    "content": e.content
	}
    }, next);
}

function next(result) {    
    console.log(++i)
    console.log(result);
    if (result.error) {
	console.log(result.error);
    }

    if (i == data.length || i >= 15) {
	console.log('Done feeding');
	//agora.quit();
	return;
    }

    setTimeout(() => {request(data[i], next)},
	       (Math.random() * (MAX_DELAY - MIN_DELAY)) + MIN_DELAY);
}

fs.createReadStream(path.join(__dirname, '/clean_node_data/data_node01.json'))
    .pipe(parse.parse())
    .pipe(through2({objectMode: true}, function (chunk, encoding, done) {
	data.push(chunk);
	done();
    }))
    .on('finish', () => {
	console.log('Number of posts to be fed:', data.length);
	request(data[i], next);
    });
