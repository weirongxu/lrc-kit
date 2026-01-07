import { Lrc, Lyric } from './lrc';

export class Runner {
  readonly offset: boolean;
  private _currentIndex: number;
  private _currentWordPartIndex: number;
  private _lrc: Lrc;
  private _currentWordStartIndex: number;
  private _currentWordEndIndex: number;

  constructor(lrc: Lrc = new Lrc(), offset: boolean = true) {
    this.offset = offset;
    this._currentIndex = -1;
    this._currentWordPartIndex = -1;
    this._currentWordStartIndex = -1;
    this._currentWordEndIndex = -1;
    this._lrc = lrc.clone();
    this.lrcUpdate();
  }

  get lrc(): Lrc {
    return this._lrc;
  }

  set lrc(lrc: Lrc) {
    this._lrc = lrc.clone();
    this.lrcUpdate();
  }

  lrcUpdate() {
    if (this.offset) {
      this._offsetAlign();
    }
    this._sort();
  }

  private _offsetAlign() {
    if ('offset' in this.lrc.info) {
      const offset = parseInt(this.lrc.info.offset) / 1000;
      if (!isNaN(offset)) {
        this.lrc.offset(offset);
        delete this.lrc.info.offset;
      }
    }
  }

  private _sort() {
    this.lrc.lyrics.sort((a, b) => a.timestamp - b.timestamp);
    this.lrc.lyrics.forEach((line) => {
      line.wordTimestamps?.sort((a, b) => a.timestamp - b.timestamp);
    });
  }

  timeUpdate(timestamp: number) {
    this._currentIndex = this._findIndex(timestamp);
    const words = this.lrc.lyrics[this._currentIndex]?.wordTimestamps;
    if (words && words.length > 0) {
      this._currentWordPartIndex = this._findWordIndex(timestamp, words);
      if (this._currentWordPartIndex !== -1) {
        const aheadWords = words.slice(0, this._currentWordPartIndex + 1);
        const currentWord = aheadWords[aheadWords.length - 1];
        this._currentWordEndIndex = aheadWords.reduce(
          (sum, word) => sum + word.content.length,
          0,
        );
        this._currentWordStartIndex =
          this._currentWordEndIndex - currentWord.content.length;
        return;
      }
    }
    this._currentWordPartIndex = -1;
    this._currentWordStartIndex = -1;
    this._currentWordEndIndex = -1;
  }

  private _findIndex(timestamp: number): number {
    const nextIndex = this.lrc.lyrics.findIndex(
      (lyric, i) => lyric.timestamp > timestamp,
    );
    if (nextIndex === -1) return this.lrc.lyrics.length - 1;
    return nextIndex - 1;
  }

  private _findWordIndex(
    timestamp: number,
    wordTimestamps: { timestamp: number; content: string }[],
  ): number {
    const nextIndex = wordTimestamps.findIndex(
      (word) => word.timestamp > timestamp,
    );
    if (nextIndex === -1) return wordTimestamps.length - 1;
    return nextIndex - 1;
  }

  getInfo() {
    return this.lrc.info;
  }

  getLyrics() {
    return this.lrc.lyrics;
  }

  getLyric(index: number = this.curIndex()): Lyric {
    if (index < 0) return this.lrc.lyrics[0];
    if (index > this.lrc.lyrics.length - 1)
      return this.lrc.lyrics[this.lrc.lyrics.length - 1];
    return this.lrc.lyrics[index];
  }

  curIndex() {
    return this._currentIndex;
  }

  curWordIndexes(): {
    wordIndex: number;
    charStartIndex: number;
    charEndIndex: number;
  } | null {
    if (this._currentWordPartIndex === -1) return null;
    return {
      wordIndex: this._currentWordPartIndex,
      charStartIndex: this._currentWordStartIndex,
      charEndIndex: this._currentWordEndIndex,
    };
  }

  curLyric() {
    return this.getLyric();
  }
}
