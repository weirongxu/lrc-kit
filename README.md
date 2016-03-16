# lrc kit [![CircleCI branch](https://img.shields.io/circleci/project/weirongxu/lrc-kit/master.svg)](https://circleci.com/gh/weirongxu/lrc-kit)
lrc parser and runner

## Install
```shell
npm i -S lrc-kit
```

## Lrc

### Usage
parse lyric
```javascript
// es5
var Lrc = require('lrc-kit').Lrc;
// es6
import {Lrc} from 'lrc-kit';

var lrc = Lrc.parse('[ar:Lyrics artist]\n[00:09.010]i guess you\'re my creep tonight');
lrc.info
// {'ar': 'Lyrics artist'}
lrc.lyrics
// [{content: "i guess you're my creep tonight", timestamp: 9.01}]
```

make lyric
```javascript
var lrc = new Lrc();
lrc.info['ar'] = 'Lyrics artist';
lrc.lyrics.push({
    content: "i guess you're my creep tonight",
    timestamp: 9.01,
});
lrc.toString()
// [ar:Lyrics artist]\r\n[00:09.010]i guess you\'re my creep tonight
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
    'length': 'music length2:50',
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

- **lrc.toString()**
    generate lyric string

## Runner

### Usage
```javascript
// es5
var Runner = require('lrc-kit').Runner;
// es6
import {Runner} from 'lrc-kit';

var runner = Runner(Lrc.parse());
audio.addEventListener('timeupdate', () => {
    runner.updateTime(audio.currentTime)
    var lyric = runner.curLyric();
    // or
    var lyric = runner.getLyric(runner.curIndex());
    lyric
    // {content: "i guess you're my creep tonight", timestamp: 9.01}
});

runner.lrc.lyrics.push({
    content: "Now i can't tell my left form right",
    timestamp: 17.3,
});
// must call lrcUpdate() when update lyrics
runner.lrcUpdate();
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
