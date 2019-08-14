import { Lrc, timestampToString } from '../src/lrc-kit';

let lrc: Lrc;

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
  lrc.lyrics = [
    {
      timestamp: 15.05,
      content: 'test',
    },
  ];
  expect(lrc.toString()).toEqual(
    ['[re:raidou]', '[ve:1.00]', `[${timestampToString(15.05)}]test`].join(
      '\r\n',
    ),
  );

  // append lyric
  lrc.lyrics.push({
    timestamp: 19.21,
    content: 'test2',
  });
  expect(lrc.toString()).toEqual(
    [
      '[re:raidou]',
      '[ve:1.00]',
      `[${timestampToString(15.05)}]test`,
      `[${timestampToString(19.21)}]test2`,
    ].join('\r\n'),
  );

  // prepend lyrics
  lrc.lyrics.splice(0, 0, {
    timestamp: 13.13,
    content: 'test3',
  });
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
  lrc.lyrics.splice(0, 0, {
    timestamp: 10.23,
    content: 'insertBefore',
  });
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
  lrc.lyrics.splice(1, 0, {
    timestamp: 12.23,
    content: 'insertAfter',
  });
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
  lrc.lyrics = [
    {
      timestamp: 15.05,
      content: 'test',
    },
  ];
  expect(lrc.toString()).toEqual(
    ['[re:raidou]', '[ve:1.00]', `[${timestampToString(15.05)}]test`].join(
      '\r\n',
    ),
  );
});

test('should sort', () => {
  lrc.lyrics = [
    {
      timestamp: 16.05,
      content: 'test2',
    },
    {
      timestamp: 15.05,
      content: 'test',
    },
  ];
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
  lrc.lyrics = [
    {
      timestamp: 15.05,
      content: 'test',
    },
    {
      timestamp: 16.05,
      content: 'test',
    },
  ];
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
  lrc.lyrics = [
    {
      timestamp: 15.05,
      content: 'test',
    },
  ];
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
  newLrc.lyrics.forEach(function(lyric, index) {
    expect(lyric).not.toBe(lrc.lyrics[index]);
  });
});
