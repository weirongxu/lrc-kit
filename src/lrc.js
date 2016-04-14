import is from 'is_js'
import LineParser from './line-parser'

export default class Lrc {
  info = {}
  lyrics = []

  /**
   * parse lrc text and return a Lrc object
   * @param {string} text
   * @return {Lrc}
   */
  static parse(text) {
    var lyrics = []
    var info = {}
    text
    .split(/\r\n|[\n\r]/g)
    .map((line) => {
      return new LineParser(line)
    })
    .forEach((line) => {
      switch (line.type) {
      case LineParser.TYPE.INFO:
        info[line.key] = line.value
        break
      case LineParser.TYPE.TIME:
        line.timestamps.forEach((timestamp) => {
          lyrics.push({
            timestamp: timestamp,
            content: line.content,
          })
        })
        break
      default:
        break
      }
    })
    var lrc = new this()
    lrc.lyrics = lyrics
    lrc.info = info
    return lrc
  }

  static checkLyricObject(lyric) {
    return is.object(lyric)
      && 'timestamp' in lyric && is.number(lyric.timestamp)
      && 'content' in lyric && is.string(lyric.content)
  }

  static padZero(num, size=2) {
    if (is.number(num)) {
      num = num.toString()
    }
    while (num.split('.')[0].length < size) num = '0' + num
    return num
  }

  /**
   * get lrc time string
   * @example
   * Lrc.timestampToString(143.54)
   * // return '02:23.54':
   * @param {number} timestamp second timestamp
   * @return {string}
   */
  static timestampToString(timestamp) {
    return `${this.padZero(parseInt(timestamp / 60))}:${this.padZero((timestamp % 60).toFixed(2))}`
  }

  offset(offsetTime) {
    this.lyrics.forEach((lyric) => {
      lyric.timestamp += offsetTime
      if (lyric.timestamp < 0) {
        lyric.timestamp = 0
      }
    })
  }

  /**
   * get lrc text
   * @param {object} opts options
   * @param {boolean} opts.combine lyrics combine by same content
   * @param {boolean} opts.sort lyrics sort by timestamp
   * @param {string} opts.lineFormat newline format
   * @return {string}
   */
  toString(opts={}) {
    opts.combine = 'combine' in opts ? opts.combine : true
    opts.lineFormat = 'lineFormat' in opts ? opts.lineFormat : '\r\n'
    opts.sort = 'sort' in opts ? opts.sort : true
    var lines = [], lyricsMap = {}, lyricsList = []

    // generate info
    for (let key in this.info) {
      lines.push(`[${key}:${this.info[key]}]`)
    }

    if (opts.combine) {
      // uniqueness
      this.lyrics.forEach((lyric) => {
        if (lyric.content in lyricsMap) {
          lyricsMap[lyric.content].push(lyric.timestamp)
        } else {
          lyricsMap[lyric.content] = [lyric.timestamp]
        }
      })
      // sorted
      for (var content in lyricsMap) {
        if (opts.sort) {
          lyricsMap[content].sort()
        }
        lyricsList.push({
          timestamps: lyricsMap[content],
          content: content,
        })
      }

      if (opts.sort) {
        lyricsList.sort((a, b) => a.timestamps[0] - b.timestamps[0])
      }

      // generate lyrics
      lyricsList.forEach((lyric) => {
        lines.push(`[${
          lyric.timestamps.map((timestamp) => 
            Lrc.timestampToString(timestamp)
          ).join('][')
        }]${lyric.content || ''}`)
      })
    } else {
      this.lyrics.forEach((lyric) => {
        lines.push(
          `[${Lrc.timestampToString(lyric.timestamp)}]${lyric.content || ''}`)
      })
    }

    return lines.join(opts.lineFormat)
  }
}
