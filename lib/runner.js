'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lrc = require('./lrc');

var _lrc2 = _interopRequireDefault(_lrc);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Runner = function () {
  /**
   * @param {Lrc} lrc
   */

  function Runner() {
    var lrc = arguments.length <= 0 || arguments[0] === undefined ? new _lrc2.default() : arguments[0];
    var offset = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, Runner);

    this.offset = offset;
    this._currentIndex = -1;
    this.setLrc(lrc);
  }

  /**
   *  @param {Lrc} lrc
   */


  _createClass(Runner, [{
    key: 'setLrc',
    value: function setLrc(lrc) {
      this.lrc = (0, _clone2.default)(lrc);
      this.lrcUpdate();
    }
  }, {
    key: 'lrcUpdate',
    value: function lrcUpdate() {
      if (this.offset) {
        this._offsetAlign();
      }
      this._sort();
    }
  }, {
    key: '_offsetAlign',
    value: function _offsetAlign() {
      if ('offset' in this.lrc.info) {
        var offset = parseInt(this.lrc.info.offset) / 1000;
        if (!isNaN(offset)) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.getLyrics()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var lyric = _step.value;

              lyric.timestamp += offset;
              if (lyric.timestamp < 0) {
                lyric.timestamp = 0;
              }
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

          delete this.lrc.info.offset;
        }
      }
    }
  }, {
    key: '_sort',
    value: function _sort() {
      this.getLyrics().sort(function (a, b) {
        return a.timestamp - b.timestamp;
      });
    }

    /**
     *  @param {number} timestamp
     */

  }, {
    key: 'timeUpdate',
    value: function timeUpdate(timestamp) {
      this._currentIndex = this._findIndex(timestamp);
    }
  }, {
    key: '_findIndex',
    value: function _findIndex(timestamp) {
      var startIndex = arguments.length <= 1 || arguments[1] === undefined ? this.curIndex() : arguments[1];

      var curFrontTimestamp, curBackTimestamp;

      if (startIndex <= -1) {
        curFrontTimestamp = Number.NEGATIVE_INFINITY;
      } else {
        curFrontTimestamp = this.getLyrics()[startIndex].timestamp;
      }

      if (startIndex >= this.getLyrics().length - 1) {
        curBackTimestamp = Number.POSITIVE_INFINITY;
      } else {
        curBackTimestamp = this.getLyrics()[startIndex + 1].timestamp;
      }

      if (timestamp < curFrontTimestamp) {
        return this._findIndex(timestamp, startIndex - 1);
      } else if (timestamp === curBackTimestamp) {
        if (curBackTimestamp === Number.POSITIVE_INFINITY) {
          return startIndex;
        } else {
          return startIndex + 1;
        }
      } else if (timestamp > curBackTimestamp) {
        return this._findIndex(timestamp, startIndex + 1);
      }

      return startIndex;
    }
  }, {
    key: 'getInfo',
    value: function getInfo() {
      return this.lrc.info;
    }
  }, {
    key: 'getLyrics',
    value: function getLyrics() {
      return this.lrc.lyrics;
    }

    /**
     *  @return {Object} {''}
     */

  }, {
    key: 'getLyric',
    value: function getLyric() {
      var index = arguments.length <= 0 || arguments[0] === undefined ? this.curIndex() : arguments[0];

      if (index >= 0 && index <= this.getLyrics().length - 1) {
        return this.getLyrics()[index];
      } else {
        throw new Error('Index not exist');
      }
    }
  }, {
    key: 'curIndex',
    value: function curIndex() {
      return this._currentIndex;
    }
  }, {
    key: 'curLyric',
    value: function curLyric() {
      return this.getLyric();
    }
  }]);

  return Runner;
}();

exports.default = Runner;