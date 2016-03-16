import Lrc from './lrc';
import clone from 'clone';

export default class Runner {
  /**
   * @param {Lrc} lrc
   */
  constructor(lrc = new Lrc(), offset=true) {
    this.offset = offset;
    this._currentIndex = -1;
    this.setLrc(lrc);
  }

  /**
   *  @param {Lrc} lrc
   */
  setLrc(lrc) {
    this.lrc = clone(lrc);
    this.lrcUpdate();
  }

  lrcUpdate() {
    if (this.offset) {
      this._offsetAlign();
    }
    this._sort();
  }

  _offsetAlign() {
    if ('offset' in this.lrc.info) {
      var offset = parseInt(this.lrc.info.offset) / 1000;
      if (! isNaN(offset)) {
        this.getLyrics().forEach((lyric) => {
          lyric.timestamp += offset;
          if (lyric.timestamp < 0) {
            lyric.timestamp = 0;
          }
        });
        delete this.lrc.info.offset;
      }
    }
  }

  _sort() {
    this.getLyrics().sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   *  @param {number} timestamp
   */
  timeUpdate(timestamp) {
    this._currentIndex = this._findIndex(timestamp);
  }

  _findIndex(timestamp, startIndex=this.curIndex()) {
    var curFrontTimestamp, curBackTimestamp;

    if (startIndex <= -1) {
      curFrontTimestamp = Number.NEGATIVE_INFINITY;
    } else {
      curFrontTimestamp = this.getLyrics()[startIndex].timestamp;
    }

    if (startIndex >= this.getLyrics().length - 1) {
      curBackTimestamp = Number.POSITIVE_INFINITY;
    } else {
      curBackTimestamp = this.getLyrics()[startIndex+1].timestamp;
    }

    if (timestamp < curFrontTimestamp) {
      return this._findIndex(timestamp, startIndex-1);
    } else if (timestamp === curBackTimestamp) {
      if (curBackTimestamp === Number.POSITIVE_INFINITY) {
        return startIndex;
      } else {
        return startIndex+1;
      }
    } else if (timestamp > curBackTimestamp) {
      return this._findIndex(timestamp, startIndex+1);
    }

    return startIndex;
  }

  getInfo() {
    return this.lrc.info;
  }

  getLyrics() {
    return this.lrc.lyrics;
  }

  /**
   *  @return {Object} {''}
   */
  getLyric(index = this.curIndex()) {
    if (index >= 0 && index <= this.getLyrics().length - 1) {
      return this.getLyrics()[index];
    } else {
      throw new Error('Index not exist');
    }
  }

  curIndex() {
    return this._currentIndex;
  }

  curLyric() {
    return this.getLyric();
  }
}
