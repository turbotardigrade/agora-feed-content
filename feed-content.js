const agora = require("./agora-backend/agora.js")
const fs = require("fs")
const path = require('path');
const through2 = require('through2');

const MAX_DELAY = 0;
const MIN_DELAY = 0;

const parse = require('JSONStream')
const results = []

let i = 0;
fs.createReadStream(path.join(__dirname, 'data.json'))
  .pipe(parse.parse())
  .pipe(through2({objectMode: true}, function (chunk, encoding, done) {
    var self = this;
    setTimeout(function () {
      self.push(chunk);
      done();
    }, (Math.random() * (MAX_DELAY - MIN_DELAY)) + MIN_DELAY);
  }))
  .on('data', function(e) {
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
    }, function(result) {
      console.log(++i)
      console.log(result);
      if (result.error) {
        console.log(e);
      }
    })
  })
  .on('end', function() {
    agora.quit();
  })
