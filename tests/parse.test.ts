import { Lrc } from '../src/lrc-kit';
import { lrcText } from './fixtures';

test('parse lyric', () => {
  const l = Lrc.parse(lrcText);
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
    ve: 'version of program'
  });
  expect(l.lyrics).toEqual([
    {
      content: "i guess you're my creep tonight",
      timestamp: 9.01
    },
    {
      content: 'The way you knock me off my feet',
      timestamp: 12.08
    },
    {
      content: "Now i can't tell my left form right",
      timestamp: 17.3
    },
    {
      content: "You only see me when I'm weak",
      timestamp: 20.39
    },
    {
      content: "I can't believe the things I hear me say",
      timestamp: 24.04
    },
    {
      content: "And I don't even recognize myself",
      timestamp: 28.08
    },
    {
      content: "And I don't even recognize myself",
      timestamp: 28.08
    },
    {
      content: "why can't I get out of my own way",
      timestamp: 32.26
    }
  ]);
});


