import { Lrc, Runner } from '../src/lrc-kit';
import { enhancedLrcFoobar2000Text, lrcText } from './fixtures';

let lrc: Lrc;
let runner: Runner;

beforeAll(() => {
  lrc = Lrc.parse(lrcText);
  runner = new Runner(lrc);
});

test('should get info', function () {
  expect(runner.getInfo()).toEqual(lrc.info);
});

test('should get all lyrics', function () {
  expect(runner.getLyrics()).toEqual(lrc.lyrics);
});

test('first get lyric', function () {
  expect(runner.curIndex()).toEqual(-1);
  expect(runner.getLyric()).toEqual(lrc.lyrics[0]);
});

test('index should be 0 when before 2nd lyric', function () {
  runner.timeUpdate(lrc.lyrics[1].timestamp - 0.1);
  expect(runner.curIndex()).toEqual(0);
});

test('index shouble be -1 when timestamp is -1', function () {
  runner.timeUpdate(-1);
  expect(runner.curIndex()).toEqual(-1);
});

test('index should be -1 when timestamp is 0', function () {
  runner.timeUpdate(0);
  expect(runner.curIndex()).toEqual(-1);
});

test('index should be 1 when in 1st lyric', function () {
  runner.timeUpdate(lrc.lyrics[1].timestamp);
  expect(runner.curIndex()).toEqual(1);
});

test('index should be 2 when after 3rd lyric', function () {
  runner.timeUpdate(lrc.lyrics[2].timestamp + 0.1);
  expect(runner.curIndex()).toEqual(2);
});

test('index should be 3 when before 5th lyric', function () {
  runner.timeUpdate(lrc.lyrics[4].timestamp - 0.1);
  expect(runner.curIndex()).toEqual(3);
});

test('index should be 4 when after 5th lyric', function () {
  runner.timeUpdate(lrc.lyrics[4].timestamp + 0.1);
  expect(runner.curIndex()).toEqual(4);
});

test('index should be last when timestamp is NEGATIVE_INFINITY', function () {
  runner.timeUpdate(Number.NEGATIVE_INFINITY);
  expect(runner.curIndex()).toEqual(-1);
});

test('index should be last when timestamp is POSITIVE_INFINITY', function () {
  runner.timeUpdate(10000000);
  expect(runner.curIndex()).toEqual(lrc.lyrics.length - 1);

  runner.timeUpdate(Number.POSITIVE_INFINITY);
  expect(runner.curIndex()).toEqual(lrc.lyrics.length - 1);
});

test('should sorted when update lyrics', function () {
  runner = new Runner(
    Lrc.parse(`
      [00:03.00]third
      [00:02.00]second
    `),
  );
  expect(runner.lrc.toString()).toEqual(
    ['[00:02.00]second', '[00:03.00]third'].join('\r\n'),
  );
  runner.lrc.lyrics.push({
    timestamp: 1,
    content: 'first',
    rawContent: 'first',
  });
  runner.lrcUpdate();
  expect(runner.lrc.toString()).toEqual(
    ['[00:01.00]first', '[00:02.00]second', '[00:03.00]third'].join('\r\n'),
  );
});

test('should offset lyrics', function () {
  [
    {
      source: ['[offset:+1000]', '[00:01.00]one', '[00:02.00]two'],
      result: ['[00:02.00]one', '[00:03.00]two'],
    },
    {
      source: [
        '[offset:-2000]',
        '[00:01.00]one',
        '[00:02.00]two',
        '[00:03.00]three',
      ],
      result: ['[00:00.00]one', '[00:00.00]two', '[00:01.00]three'],
    },
  ].forEach((it) => {
    runner = new Runner(Lrc.parse(it.source.join('\r\n')));
    expect(runner.lrc.toString()).toEqual(it.result.join('\r\n'));
  });
});

test('should expose enhanced word bounds', () => {
  runner = new Runner(Lrc.parse(enhancedLrcFoobar2000Text, { enhanced: true }));
  runner.timeUpdate(5);
  let curIndex: number;
  let curWordIndexes: {
    wordIndex: number;
    charStartIndex: number;
    charEndIndex: number;
  } | null;
  let content: string;
  const getCurWord = () =>
    content.slice(curWordIndexes?.charStartIndex, curWordIndexes?.charEndIndex);

  curIndex = runner.curIndex();
  curWordIndexes = runner.curWordIndexes();
  content = runner.getLyric().content;
  expect(curIndex).toEqual(0);
  expect(curWordIndexes).toEqual({
    wordIndex: 0,
    charStartIndex: 0,
    charEndIndex: 5,
  });
  expect(content).toEqual('hello world');
  expect(getCurWord()).toEqual('hello');

  runner.timeUpdate(6.5);
  curIndex = runner.curIndex();
  curWordIndexes = runner.curWordIndexes();
  content = runner.getLyric().content;
  expect(curIndex).toEqual(0);
  expect(curWordIndexes).toEqual({
    wordIndex: 1,
    charStartIndex: 6,
    charEndIndex: 11,
  });
  expect(content).toEqual('hello world');
  expect(getCurWord()).toEqual('world');

  runner.timeUpdate(10.7);
  curIndex = runner.curIndex();
  curWordIndexes = runner.curWordIndexes();
  content = runner.getLyric().content;
  expect(curIndex).toEqual(1);
  expect(curWordIndexes).toEqual({
    wordIndex: 1,
    charStartIndex: 5,
    charEndIndex: 8,
  });
  expect(content).toEqual('feel the rhythm rise');
  expect(getCurWord()).toEqual('the');

  runner.timeUpdate(15.6);
  curIndex = runner.curIndex();
  curWordIndexes = runner.curWordIndexes();
  content = runner.getLyric().content;
  expect(curIndex).toEqual(2);
  expect(curWordIndexes).toEqual({
    wordIndex: 0,
    charStartIndex: 0,
    charEndIndex: 11,
  });
  expect(content).toEqual('deeper hook');
  expect(getCurWord()).toEqual('deeper hook');
});
