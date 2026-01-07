# LRC Kit

[![NPM version](https://img.shields.io/npm/v/lrc-kit.svg?style=flat-square)](https://npmjs.com/package/lrc-kit)
[![NPM downloads](https://img.shields.io/npm/dm/lrc-kit.svg?style=flat-square)](https://npmjs.com/package/lrc-kit)
[![Build Status](https://img.shields.io/travis/weirongxu/lrc-kit/master.svg?style=flat-square)](https://travis-ci.com/weirongxu/lrc-kit)

lrc parser and runner

## Install

npm

```shell
npm i -S lrc-kit
```

## Lrc

### Usage

import

```javascript
import { Lrc } from 'lrc-kit';
```

parse lyric

```javascript
const lrc = Lrc.parse(`
  [ti:Title]
  [ar:Lyrics artist]
  [00:09.010][00:30.000]i guess you're my creep tonight
`);

lrc.info;
// { ti: 'Title', ar: 'Lyrics artist' }

lrc.lyrics;
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
const lrc = new Lrc();
lrc.info['ar'] = 'Lyrics artist';
lrc.lyrics.push({
    content: "i guess you're my creep tonight",
    timestamp: 9.01,
});
lrc.lyrics.push({
    content: "i guess you're my creep tonight",
    timestamp: 30.0,
});

lrc.toString();
// [ar:Lyrics artist]
// [00:30.00][00:09.01]i guess you're my creep tonight

lrc.toString({ combine: false });
// [ar:Lyrics artist]
// [00:09.01]i guess you're my creep tonight
// [00:30.00]i guess you're my creep tonight

lrc.offset(-3);
lrc.toString();
// [ar:Lyrics artist]
// [00:27.00][00:06.01]i guess you're my creep tonight
```

### Enhanced format

foobar2000 and A2 formats embed per-word timestamps.

```javascript
const enhancedFoobar2000Text = `
[ar:Enhanced Artist]
[ti:Enhanced Format]
[00:05.000] hello [00:06.000] world
[00:09.250] feel [00:10.500] the [00:11.750] rhythm [00:13.000] rise
`;

const enhancedLrc = Lrc.parse(enhancedFoobar2000Text, { enhanced: true });
const lyric = enhancedLrc.lyrics[0];

lyric.timestamp;
// 5

lyric.content;
// "hello world"

lyric.wordTimestamps;
// [{ timestamp: 5, content: 'hello ' }, { timestamp: 6, content: 'world' }]
```

```javascript
const enhancedA2Text = `
[ar:Enhanced A2]
[ti:A2 Format]
[00:02.000] <00:02.500> spark <00:03.000> light
[00:04.000] <00:04.500> flow <00:05.000> onward
`;

const enhancedA2Lrc = Lrc.parse(enhancedA2Text, { enhanced: true });
const a2Lyric = enhancedA2Lrc.lyrics[0];

a2Lyric.timestamp;
// 2

a2Lyric.content;
// "spark light"

a2Lyric.wordTimestamps;
// [{ timestamp: 2.5, content: '<00:02.500> spark ' }, { timestamp: 3, content: '<00:03.000> light' }]
```

### API

**Lrc.parse(text)**:
parse lyirc text and return a lrc object

**Lrc methods**

-   **lrc.info**
    lyric info plain object

```json
{
    "ar": "Lyrics artist",
    "al": "Album where the song is from",
    "ti": "Lyrics (song) title",
    "au": "Creator of the Songtext",
    "length": "music length, such as 2:50",
    "by": "Creator of the LRC file",
    "offset": "+/- Overall timestamp adjustment in milliseconds, + shifts time up, - shifts down",
    "re": "The player or editor that created the LRC file",
    "ve": "version of program"
}
```

-   **lrc.lyrics**
    lyric array

```json
[
    {
        "content": "hello world",
        "timestamp": 5,
        "rawContent": " hello [00:06.000] world",
        "wordTimestamps": [
            { "timestamp": 5, "content": "hello " },
            { "timestamp": 6, "content": "world" }
        ]
    },
    {
        "content": "feel the rhythm rise",
        "timestamp": 9.25,
        "rawContent": " feel [00:10.500] the [00:11.750] rhythm [00:13.000] rise",
        "wordTimestamps": [
            { "timestamp": 9.25, "content": "feel " },
            { "timestamp": 10.5, "content": "the " },
            { "timestamp": 11.75, "content": "rhythm " },
            { "timestamp": 13, "content": "rise" }
        ]
    }
]
```

-   **lrc.offset(offset)**
    offset all lyrics

-   **lrc.toString(options)**
    generate lyric string
    -   options.combine (boolean) lyrics combine by same content
    -   options.sort (boolean) lyrics sort by timestamp
    -   options.lineFormat (string) newline format

## Runner

### Usage

import

```javascript
import { Runner } from 'lrc-kit';
```

run

```javascript
const runner = new Runner(Lrc.parse(enhancedFoobar2000Text));

audio.addEventListener('timeupdate', () => {
    runner.timeUpdate(audio.currentTime);
    const lyric = runner.curLyric();
    // or
    const lyric = runner.getLyric(runner.curIndex());

    lyric.content;
    // "hello world"

    lyric.rawContent;
    // " hello [00:06.000] world"

    lyric.timestamp;
    // 5

    lyric.wordTimestamps;
    // [{ timestamp: 5, content: 'hello ' }, { timestamp: 6, content: 'world' }]

    const wordIndexes = runner.curWordIndexes();
    wordIndexes;
    // { wordIndex: 1, charStartIndex: 6, charEndIndex: 11 }
});

// Modify lyric
runner.lrc.lyrics.push({
    content: "Now i can't tell my left form right",
    timestamp: 17.3,
});
runner.lrcUpdate(); // Must call lrcUpdate() when update lyrics
```

### API

**new Runner(lrc = new Lrc(), offset=true)**

-   `lrc` lrc object
-   `offset` parse lrc.info.offset if offset is true

**Runner methods**

-   **runner.setLrc(lrc)** reset the lrc object
-   **runner.lrcUpdate()** call it when lrc updated
-   **runner.timeUpdate(timestamp)** time update
-   **runner.getInfo()** get `runner.lrc.info`
-   **runner.getLyrics()** get `runner.lrc.lyrics`
-   **runner.curIndex()** current index
-   **runner.curWordIndexes()** current word indexes, including character index
-   **runner.curLyric()** current lyric

## License

[MIT](./LICENSE)
