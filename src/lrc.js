import is from 'is_js';
import LineParser from './line-parser';

export default class Lrc {
  info = {};
  lyrics = [];

  /**
   * parse lrc text and return a Lrc object
   * @param {string} text
   * @return {Lrc}
   */
  static parse(text) {
    var lyrics = [];
    var info = {};
    text
    .split(/\r\n|[\n\r]/g)
    .map((line) => {
      return new LineParser(line);
    })
    .forEach((line) => {
      switch (line.type) {
      case LineParser.TYPE.INFO:
        info[line.key] = line.value;
        break;
      case LineParser.TYPE.TIME:
        lyrics.push({
          timestamp: line.timestamp,
          content: line.content,
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

  static checkLyricObject(lyric) {
    return is.object(lyric)
      && 'timestamp' in lyric && is.number(lyric.timestamp)
      && 'content' in lyric && is.string(lyric.content);
  }

  static padZero(num, size=2) {
    if (is.number(num)) {
      num = num.toString();
    }
    while (num.split('.')[0].length < size) num = '0' + num;
    return num;
  }

  /**
   * get lrc time string
   * @example
   * // return '02:23.54':
   * Lrc.createTimestamp(143.54);
   * @param {number} timestamp second timestamp
   * @return {string}
   */
  static createTimestamp(timestamp) {
    return `${this.padZero(parseInt(timestamp / 60))}:${this.padZero((timestamp % 60).toFixed(2))}`;
  }

  offset(offsetTime) {
    this.lyrics.forEach((lyric) => {
      lyric.timestamp += offsetTime;
      if (lyric.timestamp < 0) {
        lyric.timestamp = 0;
      }
    });
  }

  /**
   * get lrc text
   * @param {string} [lineFormat=\r\n]
   * @return {string}
   */
  toString(lineFormat='\r\n') {
    let lines = [];
    for (let key in this.info) {
      lines.push(`[${key}:${this.info[key]}]`);
    }
    this.lyrics.forEach((lyric) => {
      lines.push(
        `[${Lrc.createTimestamp(lyric.timestamp)}]${lyric.content || ''}`);
    });
    return lines.join(lineFormat);
  }
}
