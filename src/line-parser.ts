import type { ParseOptions } from './lrc';

// match `[12:30.1][12:30.2]`
export const SQUARE_TAGS_REGEXP = /^(?:\s*\[[^\]]+\])+/;

// match `ti: The Title`
export const INFO_REGEXP = /^\s*(\w+)\s*:(.*)$/;

// match `512:34.1`
export const TIME_REGEXP = /^\s*(\d+)\s*:\s*(\d+(\s*[.:]\s*\d+)?)\s*$/;

// match `<12:30.1> word` (A2 extension) | `[12:30.1] word` (Foobar2000)
export const ENHANCED_TAG_WORD_REGEXP = /[<[](\d+:\d+(?:\.\d+)?)[>\]]([^[<]*)/;

export enum LineType {
  INVALID = 'INVALID',
  INFO = 'INFO',
  TIME = 'TIME',
}

export interface InvalidLine {
  type: LineType.INVALID;
}

interface TimeWordTimestamp {
  timestamp: number;
  content: string;
}

export interface TimeLine {
  type: LineType.TIME;
  timestamps: number[];
  wordTimestamps?: TimeWordTimestamp[];
  rawContent: string;
  content: string;
}

export interface InfoLine {
  type: LineType.INFO;
  key: string;
  value: string;
}

export function parseSquareTags(
  line: string,
): null | { tags: string[]; rawContent: string } {
  line = line.trim();
  const matches = SQUARE_TAGS_REGEXP.exec(line);
  if (matches === null) {
    return null;
  }
  const tag = matches[0];
  const content = line.slice(tag.length);
  return {
    tags: tag.slice(1, -1).split(/\]\s*\[/),
    rawContent: content,
  };
}

function parseTimestamp(str: string): number | null {
  const matches = TIME_REGEXP.exec(str);
  if (!matches) return null;
  const minutes = parseFloat(matches[1]);
  const seconds = parseFloat(matches[2].replace(/\s+/g, '').replace(':', '.'));
  return minutes * 60 + seconds;
}

export function parseEnhancedWords(
  timestamps: number[],
  rawContent: string,
): TimeLine | null {
  const wordTimestamps: TimeWordTimestamp[] = [];
  let stripContent = '';
  let stripIndex = 0;
  const pushContent = (timestamp: number, wordContent: string) => {
    if (!wordContent.trim()) return;
    if (stripContent.endsWith(' ') && wordContent.startsWith(' ')) {
      wordContent = wordContent.trimStart();
    }
    stripContent += wordContent;
    wordTimestamps.push({
      timestamp,
      content: wordContent,
    });
  };

  const firstMatches = ENHANCED_TAG_WORD_REGEXP.exec(rawContent);
  const firstTimestamp = timestamps[timestamps.length - 1];
  const firstContent = firstMatches
    ? rawContent.slice(0, firstMatches.index)
    : rawContent;
  pushContent(firstTimestamp, firstContent);

  if (firstMatches)
    while (stripIndex < rawContent.length) {
      const wordMatches = ENHANCED_TAG_WORD_REGEXP.exec(
        rawContent.slice(stripIndex),
      );
      if (!wordMatches) break;
      stripIndex += wordMatches.index + wordMatches[0].length;
      const timestamp = parseTimestamp(wordMatches[1]);
      if (timestamp === null) continue;
      const wordContent = wordMatches[2];
      pushContent(timestamp, wordContent);
    }

  return {
    type: LineType.TIME,
    timestamps,
    content: stripContent.trim(),
    rawContent,
    wordTimestamps,
  };
}

export function parseTime(
  tags: string[],
  rawContent: string,
  { enhanced = true }: ParseOptions = {},
): TimeLine {
  const timestamps = tags
    .map((tag) => parseTimestamp(tag))
    .filter((it) => it !== null);
  rawContent = rawContent.trim();

  if (enhanced) {
    const parsedWords = parseEnhancedWords(timestamps, rawContent);
    if (parsedWords) return parsedWords;
  }

  return {
    type: LineType.TIME,
    timestamps,
    rawContent,
    content: rawContent,
  };
}

export function parseInfo(tag: string): InfoLine {
  const matches = INFO_REGEXP.exec(tag)!;
  return {
    type: LineType.INFO,
    key: matches[1].trim(),
    value: matches[2].trim(),
  };
}

/**
 * line parse lrc of timestamp
 * @example
 * const lp = parseLine('[ti: Song title]')
 * lp.type === LineParser.TYPE.INFO
 * lp.key === 'ti'
 * lp.value === 'Song title'
 *
 * const lp = parseLine('[10:10.10]hello')
 * lp.type === LineParser.TYPE.TIME
 * lp.timestamps === [10*60+10.10]
 * lp.content === 'hello'
 *
 * const lp = parseLine('[10:10.10] <10:10.12> hello <10:11.02> world')
 * lp.type === LineParser.TYPE.TIME
 * lp.timestamps === [10*60+10.10]
 * lp.content === 'hello world'
 * lp.wordTimestamps === [
 *  { timestamp: 10*60+10.12, content: 'hello' },
 *  { timestamp: 10*60+11.02, content: 'world' }
 * ]
 */
export function parseLine(
  line: string,
  options?: ParseOptions,
): InfoLine | TimeLine | InvalidLine {
  const parsedTags = parseSquareTags(line);
  try {
    if (parsedTags) {
      const { tags, rawContent } = parsedTags;
      if (TIME_REGEXP.test(tags[0])) {
        return parseTime(tags, rawContent, options);
      } else {
        return parseInfo(tags[0]);
      }
    }
    return {
      type: LineType.INVALID,
    };
  } catch {
    return {
      type: LineType.INVALID,
    };
  }
}
