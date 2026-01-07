import { parseLine, LineType } from './line-parser';

export interface Lyric {
  timestamp: number;
  wordTimestamps?: { timestamp: number; content: string }[];
  rawContent: string;
  content: string;
}

export interface CombineLyric {
  timestamps: number[];
  rawContent: string;
  content: string;
}

export type Info = Record<string, string>;

export function padZero(num: number | string, size: number = 2): string {
  while (num.toString().split('.')[0].length < size) num = `0${num}`;
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

export type ParseOptions = {
  enhanced?: boolean;
};

export interface ToStringOptions {
  combine: boolean;
  sort: boolean;
  lineFormat: LineFormat;
}

export class Lrc {
  info: Info = {};
  lyrics: Lyric[] = [];
  plain: string = '';

  /**
   * parse lrc text and return a Lrc object
   */
  static parse(text: string, options?: ParseOptions) {
    const lyrics: Lyric[] = [];
    const info: Info = {};
    let plain: string = '';

    const lines = text.split(/\r\n|[\n\r]/g).map((line) => {
      return parseLine(line, options);
    });

    for (const line of lines) {
      switch (line.type) {
        case LineType.INFO:
          info[line.key] = line.value;
          break;
        case LineType.TIME:
          for (const timestamp of line.timestamps) {
            lyrics.push({
              timestamp,
              wordTimestamps: line.wordTimestamps,
              rawContent: line.rawContent,
              content: line.content,
            });

            plain += `${line.content}\n`;
          }
          break;
        default:
          break;
      }
    }
    const lrc = new this();
    lrc.lyrics = lyrics;
    lrc.info = info;
    lrc.plain = plain;
    return lrc;
  }

  offset(offsetTime: number) {
    for (const lyric of this.lyrics) {
      lyric.timestamp += offsetTime;
      if (lyric.timestamp < 0) {
        lyric.timestamp = 0;
      }
    }
  }

  clone() {
    function clonePlainObject<T extends object>(obj: T): T {
      return JSON.parse(JSON.stringify(obj));
    }
    const lrc = new Lrc();
    lrc.info = clonePlainObject(this.info);
    lrc.lyrics = clonePlainObject(this.lyrics);
    return lrc;
  }

  /**
   * get lrc text
   * @param opts.combine lyrics combine by same content
   * @param opts.sort lyrics sort by timestamp
   * @param opts.lineFormat newline format
   */
  toString({
    combine = true,
    lineFormat = '\r\n',
    sort = true,
  }: Partial<ToStringOptions> = {}) {
    const lines: string[] = [];

    // generate info
    for (const [key, value] of Object.entries(this.info)) {
      lines.push(`[${key}:${value}]`);
    }

    if (combine) {
      const lyricsMap: Record<string, [number[], string]> = {};
      const lyricsList: CombineLyric[] = [];

      // uniqueness
      for (const lyric of this.lyrics) {
        if (lyric.rawContent in lyricsMap) {
          lyricsMap[lyric.rawContent][0].push(lyric.timestamp);
        } else {
          lyricsMap[lyric.rawContent] = [[lyric.timestamp], lyric.rawContent];
        }
      }

      // sorted
      for (const [content, value] of Object.entries(lyricsMap)) {
        lyricsList.push({
          timestamps: value[0],
          rawContent: value[1],
          content,
        });
      }

      if (sort) {
        lyricsList.sort((a, b) => a.timestamps[0] - b.timestamps[0]);
      }

      // generate lyrics
      for (const lyric of lyricsList) {
        lines.push(
          `[${lyric.timestamps
            .map((timestamp) => timestampToString(timestamp))
            .join('][')}]${lyric.rawContent || ''}`,
        );
      }
    } else {
      for (const lyric of this.lyrics) {
        lines.push(
          `[${timestampToString(lyric.timestamp)}]${lyric.content || ''}`,
        );
      }
    }

    return lines.join(lineFormat);
  }
}
