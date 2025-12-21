// match `[12:30.1][12:30.2]`
export const TAGS_REGEXP = /^((?:\[[^\]]+\])+|(?:<[^>]+>)+)/;
// match `[ti: The Title]`
export const INFO_REGEXP = /^\s*(\w+)\s*:(.*)$/;
// match `[512:34.1] lyric content`
export const TIME_REGEXP = /^\s*(\d+)\s*:\s*(\d+(\s*[\.:]\s*\d+)?)\s*$/;
// match `<12:30.1> word` with tags
export const WORDTIME_REGEXP = /<\d+:\d+\.\d+>/g;

export enum LineType {
  INVALID = 'INVALID',
  INFO = 'INFO',
  TIME = 'TIME',
}

export interface InvalidLine {
  type: LineType.INVALID;
}

export interface TimeLine {
  type: LineType.TIME;
  timestamps: number[];
  wordTimestamps: {timestamp: number, content: string}[];
  rawContent: string;
  content: string;
}

export interface InfoLine {
  type: LineType.INFO;
  key: string;
  value: string;
}

export function parseTags(line: string): null | [string[], string] {
  line = line.trim();
  const matches = TAGS_REGEXP.exec(line);
  if (matches === null) {
    return null;
  }
  const tag = matches[0];
  const content = line.substr(tag.length);
  return [tag.slice(1, -1).split(/\]\s*\[/), content];
}

export function parseTime(tags: string[], content: string): TimeLine {
  const timestamps: number[] = [];
  const wordTimestamps: {timestamp: number, content: string}[] = [];
  tags.forEach((tag) => {
    const matches = TIME_REGEXP.exec(tag)!;
    const minutes = parseFloat(matches[1]);
    const seconds = parseFloat(
      matches[2].replace(/\s+/g, '').replace(':', '.'),
    );
    timestamps.push(minutes * 60 + seconds);
  });
  let cleanContents = content.split(WORDTIME_REGEXP).map((f, i, s) => f.substring(1, i+1 < s.length ? Math.max(1, f.length-1) : undefined) )
  const wordTMatches = content.match(WORDTIME_REGEXP);
  if (wordTMatches) {
    cleanContents.shift()
    wordTMatches.forEach((wordTag, i) => {
      const parsedTags = parseTags(wordTag);
      const [tags] = parsedTags!;
      const matches = TIME_REGEXP.exec(tags[0])!;
      const minutes = parseFloat(matches[1]);
      const seconds = parseFloat(
        matches[2].replace(/\s+/g, '').replace(':', '.'),
      );
      wordTimestamps.push({
        timestamp: minutes * 60 + seconds,
        content: cleanContents[i],
      });
    });
  }
  return {
    type: LineType.TIME,
    timestamps,
    wordTimestamps,
    rawContent: content.trim(),
    content: cleanContents.join(''),
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
 */
export function parseLine(line: string): InfoLine | TimeLine | InvalidLine {
  const parsedTags = parseTags(line);
  try {
    if (parsedTags) {
      const [tags, content] = parsedTags;
      if (TIME_REGEXP.test(tags[0])) {
        return parseTime(tags, content);
      } else {
        return parseInfo(tags[0]);
      }
    }
    return {
      type: LineType.INVALID,
    };
  } catch (_e) {
    return {
      type: LineType.INVALID,
    };
  }
}
