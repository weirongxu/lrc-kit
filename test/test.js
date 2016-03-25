var fs = require('fs')
var fixtures = {}

[
  'main.lrc'
].forEach((name) => {
  fixtures[name] = fs.readFileSync(__dirname + '/fixtures/' + name, 'utf-8')
})

var lrcKit = require('../src/lrc-kit')

var context =  {...lrcKit, fixtures}

function load_specs(path) {
  require(path)(context)
}

describe('Lrc', function() {
  describe('LineParser', function () {
    load_specs('./specs/line-parser')
  })
  describe('parse', function () {
    load_specs('./specs/parse')
  })
  describe('create', function () {
    load_specs('./specs/create')
  })
  describe('runner', function(){
    load_specs('./specs/runner')
  })
})
