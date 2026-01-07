import { Lrc } from '../src/lrc-kit';
import {
  enhancedLrcA2Text,
  enhancedLrcFoobar2000Text,
  lrcText,
} from './fixtures';
import { ensureLyric } from './util';

test('parse lyric', () => {
  const l = Lrc.parse(lrcText, { enhanced: false });
  expect(l.info).toEqual({
    ar: 'Lyrics artist',
    al: 'Album where the song is from',
    ti: 'Lyrics (song) title',
    au: 'Creator of the Songtext',
    length: '2:50',
    by: 'Creator of the LRC file',
    offset:
      '+/- Overall timestamp adjustment in milliseconds, + shifts time up, - shifts down',
    re: 'The player or editor that created the LRC file',
    ve: 'version of program',
  });

  const expectedLyrics = [
    {
      content: "i guess you're my creep tonight",
      timestamp: 9.01,
    },
    {
      content: 'The way you knock me off my feet',
      timestamp: 12.08,
    },
    {
      content: "Now i can't tell my left form right",
      timestamp: 17.3,
    },
    {
      content: "You only see me when I'm weak",
      timestamp: 20.39,
    },
    {
      content: "I can't believe the things I hear me say",
      timestamp: 24.04,
    },
    {
      content: "And I don't even recognize myself",
      timestamp: 28.08,
    },
    {
      content: "And I don't even recognize myself",
      timestamp: 28.08,
    },
    {
      content: "why can't I get out of my own way",
      timestamp: 32.26,
    },
  ];

  expect(l.lyrics).toEqual(
    expectedLyrics.map(({ content, timestamp }) => ({
      content,
      timestamp,
      rawContent: content,
    })),
  );
});

test('parse enhanced foobar2000 format lyric', () => {
  const l = Lrc.parse(enhancedLrcFoobar2000Text, { enhanced: true });

  expect(l.info.ti).toBe('Enhanced Format');

  const lyric = ensureLyric(l.lyrics, 0);
  expect(lyric.timestamp).toBe(5);
  expect(lyric.content).toBe('hello world');
  expect(lyric.rawContent).toBe('hello [00:06.000] world');
  expect(lyric.wordTimestamps).toEqual([
    { timestamp: 5, content: 'hello ' },
    { timestamp: 6, content: 'world' },
  ]);

  const secondLyric = ensureLyric(l.lyrics, 1);
  const thirdLyric = ensureLyric(l.lyrics, 2);
  expect(l.lyrics).toHaveLength(3);
  expect(secondLyric.content).toBe('feel the rhythm rise');
  const secondWordTimestamps = secondLyric.wordTimestamps ?? [];
  expect(secondWordTimestamps.map((wt) => wt.timestamp)).toEqual([
    9.25, 10.5, 11.75, 13,
  ]);
  expect(secondWordTimestamps.map((wt) => wt.content.trim())).toEqual([
    'feel',
    'the',
    'rhythm',
    'rise',
  ]);
  expect(thirdLyric.content).toBe('deeper hook');
  expect(thirdLyric.wordTimestamps).toEqual([
    { timestamp: 15.5, content: 'deeper hook' },
  ]);
});

test('parse enhanced A2 format lyric', () => {
  const l = Lrc.parse(enhancedLrcA2Text, { enhanced: true });

  expect(l.info.ti).toBe('A2 Format');
  expect(l.lyrics).toHaveLength(2);

  const firstLyric = ensureLyric(l.lyrics, 0);
  const secondLyric = ensureLyric(l.lyrics, 1);
  expect(firstLyric.timestamp).toBe(2);
  expect(firstLyric.content).toBe('spark light');
  const firstWordTimestamps = firstLyric.wordTimestamps ?? [];
  expect(firstWordTimestamps.map((wt) => wt.timestamp)).toEqual([2.5, 3]);
  expect(firstWordTimestamps.map((wt) => wt.content.trim())).toEqual([
    'spark',
    'light',
  ]);

  expect(secondLyric.timestamp).toBe(4);
  expect(secondLyric.content).toBe('flow onward');
  const secondA2WordTimestamps = secondLyric.wordTimestamps ?? [];
  expect(secondA2WordTimestamps.map((wt) => wt.timestamp)).toEqual([4.5, 5]);
  expect(secondA2WordTimestamps.map((wt) => wt.content.trim())).toEqual([
    'flow',
    'onward',
  ]);
});
