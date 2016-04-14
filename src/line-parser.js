export default class LineParser {
  // match `[12:30.1][12:30.2]`
  static TAGS_REGEXP = /^(\[.+\])+/
  // match `[ti: The Title]`
  static INFO_REGEXP = /^\s*(\w+)\s*:(.*)$/
  // match `[512:34.1] lyric content`
  static TIME_REGEXP = /^\s*(\d+)\s*:\s*(\d+(\s*[\.:]\s*\d+)?)\s*$/
  static TYPE = {
    INVALID: 0,
    INFO: 1,
    TIME: 2,
  }

  type = LineParser.TYPE.INVALID

  static parseTags(line) {
    line = line.trim()
    var matchs = LineParser.TAGS_REGEXP.exec(line)
    var tag = matchs[0]
    var content = line.substr(tag.length)
    return [tag.slice(1, -1).split(/\]\s*\[/), content]
  }

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
   * lp.timestamps === [10*60+10.10]
   * lp.content === 'hello'
   * @constructs
   * @param {string} line
   */
  constructor(line) {
    try {
      var [tags, content] = LineParser.parseTags(line)
      if (LineParser.TIME_REGEXP.test(tags[0])) {
        this.parseAsTime(tags, content)
      } else if (LineParser.INFO_REGEXP.test(tags[0])) {
        this.parseAsInfo(tags[0])
      } else {
        this.type = LineParser.TYPE.INVALID
      }
    } catch(e) {
      this.type = LineParser.TYPE.INVALID
    }
  }

  parseAsTime(tags, content) {
    var timestamps = []
    tags.forEach((tag) => {
      var matchs = LineParser.TIME_REGEXP.exec(tag)
      var minutes = parseFloat(matchs[1])
      var seconds = parseFloat(matchs[2].replace(/\s+/g, '').replace(':', '.'))
      timestamps.push(minutes * 60 + seconds)
    })
    this.timestamps = timestamps
    this.content = content.trim()
    this.type = LineParser.TYPE.TIME
  }

  parseAsInfo(tag) {
    var matchs = LineParser.INFO_REGEXP.exec(tag)
    this.key = matchs[1].trim()
    this.value = matchs[2].trim()
    this.type = LineParser.TYPE.INFO
  }
}
