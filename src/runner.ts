import { Lrc } from './lrc';

export class Runner {
  offset: boolean;
  _currentIndex: number;
  lrc!: Lrc;

  constructor(lrc: Lrc = new Lrc(), offset: boolean = true) {
    this.offset = offset;
    this._currentIndex = -1;
    this.setLrc(lrc);
  }

  setLrc(lrc: Lrc) {
    this.lrc = lrc.clone();
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
      const offset = parseInt(this.lrc.info.offset) / 1000;
      if (!isNaN(offset)) {
        this.lrc.offset(offset);
        delete this.lrc.info.offset;
      }
    }
  }

  _sort() {
    this.lrc.lyrics.sort((a, b) => a.timestamp - b.timestamp);
  }

  timeUpdate(timestamp: number) {
    if (this._currentIndex >= this.lrc.lyrics.length) {
      this._currentIndex = this.lrc.lyrics.length - 1;
    } else if (this._currentIndex < -1) {
      this._currentIndex = -1;
    }
    this._currentIndex = this._findIndex(timestamp, this._currentIndex);
  }

  _findIndex(timestamp: number, startIndex: number): number {
    const curFrontTimestamp =
      startIndex == -1
        ? Number.NEGATIVE_INFINITY
        : this.lrc.lyrics[startIndex].timestamp;

    const curBackTimestamp =
      startIndex == this.lrc.lyrics.length - 1
        ? Number.POSITIVE_INFINITY
        : this.lrc.lyrics[startIndex + 1].timestamp;

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

  getInfo() {
    return this.lrc.info;
  }

  getLyrics() {
    return this.lrc.lyrics;
  }

  getLyric(index: number = this.curIndex()) {
    if (index >= 0 && index <= this.lrc.lyrics.length - 1) {
      return this.lrc.lyrics[index];
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
