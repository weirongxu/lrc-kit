import { Lrc, timestampToString } from '../src/lrc-kit';

let lrc: Lrc;

const makeLyric = (timestamp: number, content: string) => ({
  timestamp,
  content,
  rawContent: content,
});

beforeEach(() => {
  lrc = new Lrc();
});

test('timestampToString', () => {
  expect(timestampToString(143.54)).toEqual('02:23.54');
  expect(timestampToString(3.21)).toEqual('00:03.21');
});

describe('modify lyrics', () => {
  lrc = new Lrc();

  // set lyrics
  lrc.info['re'] = 'raidou';
  lrc.info['ve'] = '1.00';
  lrc.lyrics = [makeLyric(15.05, 'test')];
  expect(lrc.toString()).toEqual(
    ['[re:raidou]', '[ve:1.00]', `[${timestampToString(15.05)}]test`].join(
      '\r\n',
    ),
  );

  // append lyric
  lrc.lyrics.push(makeLyric(19.21, 'test2'));
  expect(lrc.toString()).toEqual(
    [
      '[re:raidou]',
      '[ve:1.00]',
      `[${timestampToString(15.05)}]test`,
      `[${timestampToString(19.21)}]test2`,
    ].join('\r\n'),
  );

  // prepend lyrics
  lrc.lyrics.splice(0, 0, makeLyric(13.13, 'test3'));
  expect(lrc.toString()).toEqual(
    [
      '[re:raidou]',
      '[ve:1.00]',
      `[${timestampToString(13.13)}]test3`,
      `[${timestampToString(15.05)}]test`,
      `[${timestampToString(19.21)}]test2`,
    ].join('\r\n'),
  );

  // insertBefore lyrics
  lrc.lyrics.splice(0, 0, makeLyric(10.23, 'insertBefore'));
  expect(lrc.toString()).toEqual(
    [
      '[re:raidou]',
      '[ve:1.00]',
      `[${timestampToString(10.23)}]insertBefore`,
      `[${timestampToString(13.13)}]test3`,
      `[${timestampToString(15.05)}]test`,
      `[${timestampToString(19.21)}]test2`,
    ].join('\r\n'),
  );

  // insertAfter lyrics
  lrc.lyrics.splice(1, 0, makeLyric(12.23, 'insertAfter'));
  expect(lrc.toString()).toEqual(
    [
      '[re:raidou]',
      '[ve:1.00]',
      `[${timestampToString(10.23)}]insertBefore`,
      `[${timestampToString(12.23)}]insertAfter`,
      `[${timestampToString(13.13)}]test3`,
      `[${timestampToString(15.05)}]test`,
      `[${timestampToString(19.21)}]test2`,
    ].join('\r\n'),
  );

  // reset lyrics
  lrc.lyrics = [makeLyric(15.05, 'test')];
  expect(lrc.toString()).toEqual(
    ['[re:raidou]', '[ve:1.00]', `[${timestampToString(15.05)}]test`].join(
      '\r\n',
    ),
  );
});

test('should sort', () => {
  lrc.lyrics = [makeLyric(16.05, 'test2'), makeLyric(15.05, 'test')];
  expect(lrc.toString({ sort: false })).toEqual(
    [
      `[${timestampToString(16.05)}]test2`,
      `[${timestampToString(15.05)}]test`,
    ].join('\r\n'),
  );
  expect(lrc.toString()).toEqual(
    [
      `[${timestampToString(15.05)}]test`,
      `[${timestampToString(16.05)}]test2`,
    ].join('\r\n'),
  );
});

test('should combine time', () => {
  lrc.lyrics = [makeLyric(15.05, 'test'), makeLyric(16.05, 'test')];
  expect(lrc.toString({ combine: false })).toEqual(
    [
      `[${timestampToString(15.05)}]test`,
      `[${timestampToString(16.05)}]test`,
    ].join('\r\n'),
  );
  expect(lrc.toString()).toEqual(
    [`[${timestampToString(15.05)}][${timestampToString(16.05)}]test`].join(
      '\r\n',
    ),
  );
});

test('should offset time', () => {
  lrc.lyrics = [makeLyric(15.05, 'test')];
  lrc.offset(1);
  expect(lrc.toString()).toEqual(
    [`[${timestampToString(16.05)}]test`].join('\r\n'),
  );
  lrc.offset(-2);
  expect(lrc.toString()).toEqual(
    [`[${timestampToString(14.05)}]test`].join('\r\n'),
  );
});

test('should clone', () => {
  let newLrc = lrc.clone();
  expect(newLrc.info).toEqual(lrc.info);
  expect(newLrc.info).not.toBe(lrc.info);
  expect(newLrc.lyrics).toEqual(lrc.lyrics);
  expect(newLrc.lyrics).not.toBe(lrc.lyrics);
  for (const [index, lyric] of newLrc.lyrics.entries()) {
    expect(lyric).not.toBe(lrc.lyrics[index]);
  }
});
