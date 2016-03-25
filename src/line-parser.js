export default class LineParser {
  // match `[ti: The Title]`
  static INFO_REGEXP = /\[\s*(\w+)\s*:(.*)\]/
  // match `[512:34.1] lyric content`
  static TIME_REGEXP = /\[\s*(\d+)\s*:\s*(\d+(\s*[\.:]\s*\d+)?)\s*\]/
  static TYPE = {
    INVALID: 0,
    INFO: 1,
    TIME: 2,
  }

  type = LineParser.TYPE.INVALID

  /**
   * line parse lrc of timestamp
   * @example
   * var lp = new LineParser('[ti: Song title]')
   * lp.type === LineParser.TYPE.INFO
   * lp.key === 'ti'
   * lp.value === 'Song title'
   *
   * var lp = new LineParser('[10:10.10]hello')
   * lp.type === LineParser.TYPE.TIME
   * lp.timestamp === 10*60+10.10
   * lp.content === 'hello'
   * @constructs
   * @param {string} text
   */
  constructor(text) {
    if (LineParser.TIME_REGEXP.test(text)) {
      let matchs = LineParser.TIME_REGEXP.exec(text)
      let minutes = parseFloat(matchs[1])
      let seconds = parseFloat(matchs[2].replace(/\s+/g, '').replace(':', '.'))
      this.timestamp = minutes * 60 + seconds
      this.content = text.substr(matchs.index + matchs[0].length).trim()
      this.type = LineParser.TYPE.TIME
    } else if (LineParser.INFO_REGEXP.test(text)) {
      let matchs = LineParser.INFO_REGEXP.exec(text)
      this.key = matchs[1].trim()
      this.value = matchs[2].trim()
      this.type = LineParser.TYPE.INFO
    } else {
      this.type = LineParser.TYPE.INVALID
    }
  }
}
