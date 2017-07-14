var LrcKit =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Runner = exports.Lrc = exports.LineParser = undefined;

	var _lineParser = __webpack_require__(1);

	var _lineParser2 = _interopRequireDefault(_lineParser);

	var _lrc = __webpack_require__(2);

	var _lrc2 = _interopRequireDefault(_lrc);

	var _runner = __webpack_require__(3);

	var _runner2 = _interopRequireDefault(_runner);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.LineParser = _lineParser2.default;
	exports.Lrc = _lrc2.default;
	exports.Runner = _runner2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LineParser = function () {
	  _createClass(LineParser, null, [{
	    key: 'parseTags',

	    // match `[ti: The Title]`
	    value: function parseTags(line) {
	      line = line.trim();
	      var matchs = LineParser.TAGS_REGEXP.exec(line);
	      var tag = matchs[0];
	      var content = line.substr(tag.length);
	      return [tag.slice(1, -1).split(/\]\s*\[/), content];
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

	    // match `[512:34.1] lyric content`

	    // match `[12:30.1][12:30.2]`

	  }]);

	  function LineParser(line) {
	    _classCallCheck(this, LineParser);

	    this.type = LineParser.TYPE.INVALID;

	    try {
	      var _LineParser$parseTags = LineParser.parseTags(line),
	          _LineParser$parseTags2 = _slicedToArray(_LineParser$parseTags, 2),
	          tags = _LineParser$parseTags2[0],
	          content = _LineParser$parseTags2[1];

	      if (LineParser.TIME_REGEXP.test(tags[0])) {
	        this.parseAsTime(tags, content);
	      } else if (LineParser.INFO_REGEXP.test(tags[0])) {
	        this.parseAsInfo(tags[0]);
	      } else {
	        this.type = LineParser.TYPE.INVALID;
	      }
	    } catch (e) {
	      this.type = LineParser.TYPE.INVALID;
	    }
	  }

	  _createClass(LineParser, [{
	    key: 'parseAsTime',
	    value: function parseAsTime(tags, content) {
	      var timestamps = [];
	      tags.forEach(function (tag) {
	        var matchs = LineParser.TIME_REGEXP.exec(tag);
	        var minutes = parseFloat(matchs[1]);
	        var seconds = parseFloat(matchs[2].replace(/\s+/g, '').replace(':', '.'));
	        timestamps.push(minutes * 60 + seconds);
	      });
	      this.timestamps = timestamps;
	      this.content = content.trim();
	      this.type = LineParser.TYPE.TIME;
	    }
	  }, {
	    key: 'parseAsInfo',
	    value: function parseAsInfo(tag) {
	      var matchs = LineParser.INFO_REGEXP.exec(tag);
	      this.key = matchs[1].trim();
	      this.value = matchs[2].trim();
	      this.type = LineParser.TYPE.INFO;
	    }
	  }]);

	  return LineParser;
	}();

	LineParser.TAGS_REGEXP = /^(\[.+\])+/;
	LineParser.INFO_REGEXP = /^\s*(\w+)\s*:(.*)$/;
	LineParser.TIME_REGEXP = /^\s*(\d+)\s*:\s*(\d+(\s*[\.:]\s*\d+)?)\s*$/;
	LineParser.TYPE = {
	  INVALID: 0,
	  INFO: 1,
	  TIME: 2
	};
	exports.default = LineParser;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _lineParser = __webpack_require__(1);

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
	    key: 'offset',
	    value: function offset(offsetTime) {
	      this.lyrics.forEach(function (lyric) {
	        lyric.timestamp += offsetTime;
	        if (lyric.timestamp < 0) {
	          lyric.timestamp = 0;
	        }
	      });
	    }
	  }, {
	    key: 'clone',
	    value: function clone() {
	      function clonePlainObject(obj) {
	        var newObj = {};
	        for (var key in obj) {
	          newObj[key] = obj[key];
	        }
	        return newObj;
	      }
	      var lrc = new this.constructor();
	      lrc.info = clonePlainObject(this.info);
	      lrc.lyrics = this.lyrics.reduce(function (ret, lyric) {
	        ret.push(clonePlainObject(lyric));
	        return ret;
	      }, []);
	      return lrc;
	    }

	    /**
	     * get lrc text
	     * @param {object} opts options
	     * @param {boolean} opts.combine lyrics combine by same content
	     * @param {boolean} opts.sort lyrics sort by timestamp
	     * @param {string} opts.lineFormat newline format
	     * @return {string}
	     */

	  }, {
	    key: 'toString',
	    value: function toString() {
	      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      opts.combine = 'combine' in opts ? opts.combine : true;
	      opts.lineFormat = 'lineFormat' in opts ? opts.lineFormat : '\r\n';
	      opts.sort = 'sort' in opts ? opts.sort : true;
	      var lines = [],
	          lyricsMap = {},
	          lyricsList = [];

	      // generate info
	      for (var key in this.info) {
	        lines.push('[' + key + ':' + this.info[key] + ']');
	      }

	      if (opts.combine) {
	        // uniqueness
	        this.lyrics.forEach(function (lyric) {
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
	            content: content
	          });
	        }

	        if (opts.sort) {
	          lyricsList.sort(function (a, b) {
	            return a.timestamps[0] - b.timestamps[0];
	          });
	        }

	        // generate lyrics
	        lyricsList.forEach(function (lyric) {
	          lines.push('[' + lyric.timestamps.map(function (timestamp) {
	            return Lrc.timestampToString(timestamp);
	          }).join('][') + ']' + (lyric.content || ''));
	        });
	      } else {
	        this.lyrics.forEach(function (lyric) {
	          lines.push('[' + Lrc.timestampToString(lyric.timestamp) + ']' + (lyric.content || ''));
	        });
	      }

	      return lines.join(opts.lineFormat);
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
	            line.timestamps.forEach(function (timestamp) {
	              lyrics.push({
	                timestamp: timestamp,
	                content: line.content
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
	  }, {
	    key: 'padZero',
	    value: function padZero(num) {
	      var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

	      while (num.toString().split('.')[0].length < size) {
	        num = '0' + num;
	      }return num;
	    }

	    /**
	     * get lrc time string
	     * @example
	     * Lrc.timestampToString(143.54)
	     * // return '02:23.54':
	     * @param {number} timestamp second timestamp
	     * @return {string}
	     */

	  }, {
	    key: 'timestampToString',
	    value: function timestampToString(timestamp) {
	      return this.padZero(parseInt(timestamp / 60)) + ':' + this.padZero((timestamp % 60).toFixed(2));
	    }
	  }]);

	  return Lrc;
	}();

	exports.default = Lrc;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _lrc = __webpack_require__(2);

	var _lrc2 = _interopRequireDefault(_lrc);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Runner = function () {
	  /**
	   * @param {Lrc} lrc
	   */
	  function Runner() {
	    var lrc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _lrc2.default();
	    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

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
	      this.lrc = lrc.clone();
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
	          this.lrc.offset(offset);
	          delete this.lrc.info.offset;
	        }
	      }
	    }
	  }, {
	    key: '_sort',
	    value: function _sort() {
	      this.lrc.lyrics.sort(function (a, b) {
	        return a.timestamp - b.timestamp;
	      });
	    }

	    /**
	     *  @param {number} timestamp
	     */

	  }, {
	    key: 'timeUpdate',
	    value: function timeUpdate(timestamp) {
	      if (this._currentIndex >= this.lrc.lyrics.length) {
	        this._currentIndex = this.lrc.lyrics.length - 1;
	      } else if (this._currentIndex < -1) {
	        this._currentIndex = -1;
	      }
	      this._currentIndex = this._findIndex(timestamp, this._currentIndex);
	    }
	  }, {
	    key: '_findIndex',
	    value: function _findIndex(timestamp, startIndex) {
	      var curFrontTimestamp = startIndex == -1 ? Number.NEGATIVE_INFINITY : this.lrc.lyrics[startIndex].timestamp;

	      var curBackTimestamp = startIndex == this.lrc.lyrics.length - 1 ? Number.POSITIVE_INFINITY : this.lrc.lyrics[startIndex + 1].timestamp;

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
	      } else {
	        return startIndex;
	      }
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
	      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.curIndex();

	      if (index >= 0 && index <= this.lrc.lyrics.length - 1) {
	        return this.lrc.lyrics[index];
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

/***/ })
/******/ ]);