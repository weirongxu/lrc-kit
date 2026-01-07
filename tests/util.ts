import { type Lyric } from '../src/lrc';

export const ensureLyric = (lyrics: Lyric[], index: number) => {
  const lyric = lyrics[index];
  if (!lyric) {
    throw new Error(`Lyric at index ${index} not found`);
  }
  return lyric;
};
