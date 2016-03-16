'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _is_js = require('is_js');

var _is_js2 = _interopRequireDefault(_is_js);

var _lineParser = require('./line-parser');

var _lineParser2 = _interopRequireDefault(_lineParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lrc = function () {
  function Lrc() {
    _classCallCheck(this, Lrc);

    this.info = {};
    this.lyrics = [];
  }

  _createClass(Lrc, [{
    key: 'toString',


    /**
     * get lrc text
     * @param {string} [lineFormat=\r\n]
     * @return {string}
     */
    value: function toString() {
      var lineFormat = arguments.length <= 0 || arguments[0] === undefined ? '\r\n' : arguments[0];

      var lines = [];
      for (var key in this.info) {
        lines.push('[' + key + ':' + this.info[key] + ']');
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.lyrics[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var lyric = _step.value;

          lines.push('[' + Lrc.createTimestamp(lyric.timestamp) + ']' + (lyric.content || ''));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return lines.join(lineFormat);
    }
  }], [{
    key: 'parse',


    /**
     * parse lrc text and return a Lrc object
     * @param {string} text
     * @return {Lrc}
     */
    value: function parse(text) {
      var lyrics = [];
      var info = {};
      text.split(/\r\n|[\n\r]/g).map(function (line) {
        return new _lineParser2.default(line);
      }).forEach(function (line) {
        switch (line.type) {
          case _lineParser2.default.TYPE.INFO:
            info[line.key] = line.value;
            break;
          case _lineParser2.default.TYPE.TIME:
            lyrics.push({
              timestamp: line.timestamp,
              content: line.content
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
  }, {
    key: 'checkLyricObject',
    value: function checkLyricObject(lyric) {
      return _is_js2.default.object(lyric) && 'timestamp' in lyric && _is_js2.default.number(lyric.timestamp) && 'content' in lyric && _is_js2.default.string(lyric.content);
    }
  }, {
    key: 'padZero',
    value: function padZero(num) {
      var size = arguments.length <= 1 || arguments[1] === undefined ? 2 : arguments[1];

      if (_is_js2.default.number(num)) {
        num = num.toString();
      }
      while (num.split('.')[0].length < size) {
        num = '0' + num;
      }return num;
    }

    /**
     * get lrc time string
     * @example
     * // return '02:23.54':
     * Lrc.createTimestamp(143.54);
     * @param {number} timestamp second timestamp
     * @return {string}
     */

  }, {
    key: 'createTimestamp',
    value: function createTimestamp(timestamp) {
      return this.padZero(parseInt(timestamp / 60)) + ':' + this.padZero((timestamp % 60).toFixed(2));
    }
  }]);

  return Lrc;
}();

exports.default = Lrc;