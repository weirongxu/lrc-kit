import { parseLine, LineType } from './line-parser';

export interface Lyric {
  timestamp: number;
  content: string;
}

export interface CombineLyric {
  timestamps: number[];
  content: string;
}

export type Info = Record<string, string>;

export function padZero(num: number | string, size: number = 2): string {
  while (num.toString().split('.')[0].length < size) num = '0' + num;
  return num as string;
}

/**
 * get lrc time string
 * @example
 * Lrc.timestampToString(143.54)
 * // return '02:23.54':
 * @param timestamp second timestamp
 */
export function timestampToString(timestamp: number): string {
  return `${padZero(Math.floor(timestamp / 60))}:${padZero(
    (timestamp % 60).toFixed(2),
  )}`;
}

export type LineFormat = '\r\n' | '\r' | '\n';

export interface ToStringOptions {
  combine: boolean;
  sort: boolean;
  lineFormat: LineFormat;
}

export class Lrc {
  info: Info = {};
  lyrics: Lyric[] = [];

  /**
   * parse lrc text and return a Lrc object
   */
  static parse(text: string) {
    const lyrics: Lyric[] = [];
    const info: Info = {};
    text
      .split(/\r\n|[\n\r]/g)
      .map((line) => {
        return parseLine(line);
      })
      .forEach((line) => {
        switch (line.type) {
          case LineType.INFO:
            info[line.key] = line.value;
            break;
          case LineType.TIME:
            line.timestamps.forEach((timestamp) => {
              lyrics.push({
                timestamp: timestamp,
                content: line.content,
              });
            });
            break;
          default:
            break;
        }
      });
    var lrc = new this();
    lrc.lyrics = lyrics;
    lrc.info = info;
    return lrc;
  }

  offset(offsetTime: number) {
    this.lyrics.forEach((lyric) => {
      lyric.timestamp += offsetTime;
      if (lyric.timestamp < 0) {
        lyric.timestamp = 0;
      }
    });
  }

  clone() {
    function clonePlainObject<T extends Record<any, any>>(obj: T) {
      const newObj: T = {} as T;
      for (const key in obj) {
        newObj[key] = obj[key];
      }
      return newObj;
    }
    const lrc = new Lrc();
    lrc.info = clonePlainObject(this.info);
    lrc.lyrics = this.lyrics.reduce(
      (ret, lyric) => {
        ret.push(clonePlainObject(lyric));
        return ret;
      },
      [] as Lyric[],
    );
    return lrc;
  }

  /**
   * get lrc text
   * @param opts.combine lyrics combine by same content
   * @param opts.sort lyrics sort by timestamp
   * @param opts.lineFormat newline format
   */
  toString(opts: Partial<ToStringOptions> = {}) {
    opts.combine = 'combine' in opts ? opts.combine : true;
    opts.lineFormat = 'lineFormat' in opts ? opts.lineFormat : '\r\n';
    opts.sort = 'sort' in opts ? opts.sort : true;

    const lines: string[] = [],
      lyricsMap: Record<string, number[]> = {},
      lyricsList: CombineLyric[] = [];

    // generate info
    for (const key in this.info) {
      lines.push(`[${key}:${this.info[key]}]`);
    }

    if (opts.combine) {
      // uniqueness
      this.lyrics.forEach((lyric) => {
        if (lyric.content in lyricsMap) {
          lyricsMap[lyric.content].push(lyric.timestamp);
        } else {
          lyricsMap[lyric.content] = [lyric.timestamp];
        }
      });

      // sorted
      for (var content in lyricsMap) {
        if (opts.sort) {
          lyricsMap[content].sort();
        }
        lyricsList.push({
          timestamps: lyricsMap[content],
          content: content,
        });
      }

      if (opts.sort) {
        lyricsList.sort((a, b) => a.timestamps[0] - b.timestamps[0]);
      }

      // generate lyrics
      lyricsList.forEach((lyric) => {
        lines.push(
          `[${lyric.timestamps
            .map((timestamp) => timestampToString(timestamp))
            .join('][')}]${lyric.content || ''}`,
        );
      });
    } else {
      this.lyrics.forEach((lyric) => {
        lines.push(
          `[${timestampToString(lyric.timestamp)}]${lyric.content || ''}`,
        );
      });
    }

    return lines.join(opts.lineFormat);
  }
}
