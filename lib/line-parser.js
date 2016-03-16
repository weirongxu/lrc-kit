'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LineParser =

/**
 * line parse lrc of timestamp
 * @example
 * // TODO
 * @constructs
 * @param {string} text
 */

// match `[ti: The Title]`
function LineParser(text) {
  _classCallCheck(this, LineParser);

  this.type = LineParser.TYPE.INVALID;

  if (LineParser.TIME_REGEXP.test(text)) {
    var matchs = LineParser.TIME_REGEXP.exec(text);
    var minutes = parseFloat(matchs[1]);
    var seconds = parseFloat(matchs[2].replace(/\s+/g, '').replace(':', '.'));
    this.timestamp = minutes * 60 + seconds;
    this.content = text.substr(matchs.index + matchs[0].length).trim();
    this.type = LineParser.TYPE.TIME;
  } else if (LineParser.INFO_REGEXP.test(text)) {
    var _matchs = LineParser.INFO_REGEXP.exec(text);
    this.key = _matchs[1].trim();
    this.value = _matchs[2].trim();
    this.type = LineParser.TYPE.INFO;
  } else {
    this.type = LineParser.TYPE.INVALID;
  }
}
// match `[512:34.1] lyric content`
;

LineParser.INFO_REGEXP = /\[\s*(\w+)\s*:(.*)\]/;
LineParser.TIME_REGEXP = /\[\s*(\d+)\s*:\s*(\d+(\s*[\.:]\s*\d+)?)\s*\]/;
LineParser.TYPE = {
  INVALID: 0,
  INFO: 1,
  TIME: 2
};
exports.default = LineParser;