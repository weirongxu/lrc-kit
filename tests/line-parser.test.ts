import { parseLine, LineType, InfoLine, TimeLine } from '../src/line-parser';

test('get info type', () => {
  var lp = parseLine('[ti: Song title]');
  expect(lp.type).toEqual(LineType.INFO);
});

[
  ['basic', '[test: raidou]', 'test', 'raidou'],
  ['trim', '[ test : raidou ]', 'test', 'raidou'],
].forEach(([desc, line, key, value]) => {
  test('info type ' + desc, () => {
    const lp = parseLine(line) as InfoLine;
    expect(lp.key).toEqual(key);
    expect(lp.value).toEqual(value);
  });
});

test('get time type', () => {
  const lp = parseLine('[10:10.10]hello');
  expect(lp.type).toEqual(LineType.TIME);
});

([
  [
    'basic',
    '[1:10.10]hello',
    [1 * 60 + 10.1],
    'hello',
  ],
  [
    'use ":" instead of "."',
    '[1:10:10]hello',
    [1 * 60 + 10.1],
    'hello',
  ],
  [
    'content tirm',
    '[1:10.10] hello ',
    [1 * 60 + 10.1],
    'hello',
  ],
  [
    'time tirm1',
    '[ 1 : 10 . 10 ] hello ',
    [1 * 60 + 10.1],
    'hello',
  ],
  [
    'prefix 0',
    '[01:010.010] hello ',
    [1 * 60 + 10.01],
    'hello',
  ],
  [
    'prefix space',
    '  [1:00] hello',
    [1 * 60],
    'hello',
  ],
  [
    'two timestamps',
    ' [1 : 00 ][ 2: 00] hello',
    [1 * 60, 2 * 60],
    'hello',
  ],
  [
    'three timestamps',
    ' [1:00 ]  [  2:00] [ 3:01 ]  hello',
    [1 * 60, 2 * 60, 3 * 60 + 1],
    'hello',
  ],
] as [string, string, number[], string][]).forEach(
  ([desc, line, timestamps, content]) => {
    test('time type ' + desc, () => {
      var lp = parseLine(line) as TimeLine;
      expect(lp.timestamps).toEqual(timestamps);
      expect(lp.content).toEqual(content);
    });
  },
);

test('get invalid type', () => {
  ['', 'test', '[:]'].forEach((fixture) => {
    var lp = parseLine(fixture);
    expect(lp.type).toEqual(LineType.INVALID);
  });
});
