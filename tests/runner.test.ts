import { Lrc, Runner } from '../src/lrc-kit';
import { lrcText } from './fixtures';

let lrc: Lrc;
let runner: Runner;

beforeAll(() => {
  lrc = Lrc.parse(lrcText);
  runner = new Runner(lrc);
});

test('should get info', function() {
  expect(runner.getInfo()).toEqual(lrc.info);
});

test('should get all lyrics', function() {
  expect(runner.getLyrics()).toEqual(lrc.lyrics);
});

test('first get lyric', function() {
  expect(runner.curIndex()).toEqual(-1);
  expect(() => runner.getLyric()).toThrowError('Index not exist');
});

test('index should be 0 when before 2nd lyric', function() {
  runner.timeUpdate(lrc.lyrics[1].timestamp - 0.1);
  expect(runner.curIndex()).toEqual(0);
});

test('index should be -1 when timestamp is 0', function() {
  runner.timeUpdate(0);
  expect(runner.curIndex()).toEqual(-1);
});

test('index should be 1 when in 1st lyric', function() {
  runner.timeUpdate(lrc.lyrics[1].timestamp);
  expect(runner.curIndex()).toEqual(1);
});

test('index should be 2 when after 3rd lyric', function() {
  runner.timeUpdate(lrc.lyrics[2].timestamp + 0.1);
  expect(runner.curIndex()).toEqual(2);
});

test('index should be 3 when before 5th lyric', function() {
  runner.timeUpdate(lrc.lyrics[4].timestamp - 0.1);
  expect(runner.curIndex()).toEqual(3);
});

test('index should be 4 when after 5th lyric', function() {
  runner.timeUpdate(lrc.lyrics[4].timestamp + 0.1);
  expect(runner.curIndex()).toEqual(4);
});

test('index should be last when timestamp is NEGATIVE_INFINITY', function() {
  runner.timeUpdate(Number.NEGATIVE_INFINITY);
  expect(runner.curIndex()).toEqual(-1);
});

test('index should be last when timestamp is POSITIVE_INFINITY', function() {
  runner.timeUpdate(10000000);
  expect(runner.curIndex()).toEqual(lrc.lyrics.length - 1);

  runner.timeUpdate(Number.POSITIVE_INFINITY);
  expect(runner.curIndex()).toEqual(lrc.lyrics.length - 1);
});

test('should run along the timestamp', function() {
  runner = new Runner(lrc);
  var lyrics = [
    "i guess you're my creep tonight",
    'The way you knock me off my feet',
    "Now i can't tell my left form right",
    "You only see me when I'm weak",
    "I can't believe the things I hear me say",
    "And I don't even recognize myself",
    "why can't I get out of my own way"
  ];
  var curIndex = 0;
  for (var time = 0; time < 30 * 60; ++time) {
    runner.timeUpdate(time);
    try {
      var lyric = runner.curLyric();
      if (lyric.content != lyrics[curIndex]) {
        expect(lyric.content).toEqual(lyrics[++curIndex]);
      }
    } catch (e) {
      expect(e.message).toEqual('Index not exist');
    }
  }
});

test('should sorted when update lyrics', function() {
  runner = new Runner(
    Lrc.parse(`
      [00:03.00]third
      [00:02.00]second
    `)
  );
  expect(runner.lrc.toString()).toEqual(
    ['[00:02.00]second', '[00:03.00]third'].join('\r\n')
  );
  runner.lrc.lyrics.push({
    timestamp: 1,
    content: 'first'
  });
  runner.lrcUpdate();
  expect(runner.lrc.toString()).toEqual(
    ['[00:01.00]first', '[00:02.00]second', '[00:03.00]third'].join('\r\n')
  );
});

test('should offset lyrics', function() {
  [
    {
      source: ['[offset:+1000]', '[00:01.00]one', '[00:02.00]two'],
      result: ['[00:02.00]one', '[00:03.00]two']
    },
    {
      source: [
        '[offset:-2000]',
        '[00:01.00]one',
        '[00:02.00]two',
        '[00:03.00]three'
      ],
      result: ['[00:00.00]one', '[00:00.00]two', '[00:01.00]three']
    }
  ].forEach(it => {
    runner = new Runner(Lrc.parse(it.source.join('\r\n')));
    expect(runner.lrc.toString()).toEqual(it.result.join('\r\n'));
  });
});
