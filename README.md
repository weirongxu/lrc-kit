# LRC Kit

[![NPM version](https://img.shields.io/npm/v/lrc-kit.svg?style=flat-square)](https://npmjs.com/package/lrc-kit)
[![NPM downloads](https://img.shields.io/npm/dm/lrc-kit.svg?style=flat-square)](https://npmjs.com/package/lrc-kit)
[![Build Status](https://img.shields.io/travis/weirongxu/lrc-kit/master.svg?style=flat-square)](https://travis-ci.com/weirongxu/lrc-kit)

lrc parser and runner

## Install
bower
```shell
bower i -S lrc-kit
```

npm
```shell
npm i -S lrc-kit
```

## Lrc

### Usage
import for browser with bower
```javascript
var Lrc = LrcKit.Lrc
```

import for CommonJS
```javascript
var Lrc = require('lrc-kit').Lrc
```

parse lyric
```javascript
var lrc = Lrc.parse(`
  [ti:Title]
  [ar:Lyrics artist]
  [00:09.010][00:30.000]i guess you're my creep tonight
`)

lrc.info
// { ti: 'Title', ar: 'Lyrics artist' }

lrc.lyrics
// [{
//   content: "i guess you're my creep tonight",
//   timestamp: 9.01
// }, {
//   content: "i guess you're my creep tonight",
//   timestamp: 30.0
// }]
```

make lyric
```javascript
var lrc = new Lrc()
lrc.info['ar'] = 'Lyrics artist'
lrc.lyrics.push({
    content: "i guess you're my creep tonight",
    timestamp: 9.01,
})
lrc.lyrics.push({
    content: "i guess you're my creep tonight",
    timestamp: 30.0,
})

lrc.toString()
// [ar:Lyrics artist]
// [00:30.00][00:09.01]i guess you're my creep tonight

lrc.toString({combine: false})
// [ar:Lyrics artist]
// [00:09.01]i guess you're my creep tonight
// [00:30.00]i guess you're my creep tonight


lrc.offset(-3)
lrc.toString()
// [ar:Lyrics artist]
// [00:27.00][00:06.01]i guess you're my creep tonight

```

### API

**Lrc.parse(text)**: 
parse lyirc text and return a lrc object

**Lrc object**

 - **lrc.info**
    lyric info plain object  
```
{
    'ar': 'Lyrics artist',
    'al': 'Album where the song is from',
    'ti': 'Lyrics (song) title',
    'au': 'Creator of the Songtext',
    'length': 'music length, such as 2:50',
    'by': 'Creator of the LRC file',
    'offset': '+/- Overall timestamp adjustment in milliseconds, + shifts time up, - shifts down',
    're': 'The player or editor that created the LRC file',
    've': 'version of program',
}
```

- **lrc.lyrics**
    lyric array
```
[
    {
        content: "i guess you're my creep tonight",
        timestamp: 9.01,
    },
    {
        content: "The way you knock me off my feet",
        timestamp: 12.08,
    },
]
```

- **lrc.offset(offset)**
    offset all lyrics

- **lrc.toString(options)**
    generate lyric string
    - options.combine (boolean) lyrics combine by same content
    - options.sort (boolean) lyrics sort by timestamp
    - options.lineFormat (string) newline format

## Runner

### Usage
import for browser with bower
```javascript
var Runner = LrcKit.Runner
```

import for CommonJS
```javascript
var Runner = require('lrc-kit').Runner
```

run
```javascript
var runner = new Runner(Lrc.parse(...))

audio.addEventListener('timeupdate', () => {
    runner.updateTime(audio.currentTime)
    var lyric = runner.curLyric()
    // or
    var lyric = runner.getLyric(runner.curIndex())

    lyric
    // {
    //    content: "i guess you're my creep tonight",
    //    timestamp: 9.01
    // }
})

// Modify lyric
runner.lrc.lyrics.push({
    content: "Now i can't tell my left form right",
    timestamp: 17.3,
})
runner.lrcUpdate() // Must call lrcUpdate() when update lyrics
```

### API

**new Runner(lrc = new Lrc(), offset=true)**
- `lrc` lrc object
- `offset` parse lrc.info.offset if offset is true

**Runner object**
- **runner.setLrc(lrc)** reset the lrc object
- **runner.lrcUpdate()** call it when lrc updated
- **runner.timeUpdate(timestamp)** time update
- **runner.getInfo()** get `runner.lrc.info`
- **runner.getLyrics()** get `runner.lrc.lyrics`
- **runner.curIndex()** current index
- **runner.curLyric()** current lyric

## License

[MIT](./LICENSE)
