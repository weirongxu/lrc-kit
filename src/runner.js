import Lrc from './lrc'
import clone from 'lodash/cloneDeep'

export default class Runner {
  /**
   * @param {Lrc} lrc
   */
  constructor(lrc = new Lrc(), offset=true) {
    this.offset = offset
    this._currentIndex = -1
    this.setLrc(lrc)
  }

  /**
   *  @param {Lrc} lrc
   */
  setLrc(lrc) {
    this.lrc = clone(lrc)
    this.lrcUpdate()
  }

  lrcUpdate() {
    if (this.offset) {
      this._offsetAlign()
    }
    this._sort()
  }

  _offsetAlign() {
    if ('offset' in this.lrc.info) {
      var offset = parseInt(this.lrc.info.offset) / 1000
      if (! isNaN(offset)) {
        this.lrc.offset(offset)
        delete this.lrc.info.offset
      }
    }
  }

  _sort() {
    this.lrc.lyrics.sort((a, b) => a.timestamp - b.timestamp)
  }

  /**
   *  @param {number} timestamp
   */
  timeUpdate(timestamp) {
    if (this._currentIndex >= this.lrc.lyrics.length) {
      this._currentIndex = this.lrc.lyrics.length - 1
    } else if (this._currentIndex < -1) {
      this._currentIndex = -1
    }
    this._currentIndex = this._findIndex(timestamp, this._currentIndex)
  }

  _findIndex(timestamp, startIndex) {
    var curFrontTimestamp = startIndex == -1 ?
      Number.NEGATIVE_INFINITY : this.lrc.lyrics[startIndex].timestamp

    var curBackTimestamp = (startIndex == this.lrc.lyrics.length - 1) ?
      Number.POSITIVE_INFINITY : this.lrc.lyrics[startIndex+1].timestamp

    if (timestamp < curFrontTimestamp) {
      return this._findIndex(timestamp, startIndex-1)
    } else if (timestamp === curBackTimestamp) {
      if (curBackTimestamp === Number.POSITIVE_INFINITY) {
        return startIndex
      } else {
        return startIndex+1
      }
    } else if (timestamp > curBackTimestamp) {
      return this._findIndex(timestamp, startIndex+1)
    } else {
      return startIndex
    }
  }

  getInfo() {
    return this.lrc.info
  }

  getLyrics() {
    return this.lrc.lyrics
  }

  /**
   *  @return {Object} {''}
   */
  getLyric(index = this.curIndex()) {
    if (index >= 0 && index <= this.lrc.lyrics.length - 1) {
      return this.lrc.lyrics[index]
    } else {
      throw new Error('Index not exist')
    }
  }

  curIndex() {
    return this._currentIndex
  }

  curLyric() {
    return this.getLyric()
  }
}
