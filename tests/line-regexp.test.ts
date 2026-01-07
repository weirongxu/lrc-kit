import {
  SQUARE_TAGS_REGEXP,
  INFO_REGEXP,
  TIME_REGEXP,
  ENHANCED_TAG_WORD_REGEXP,
} from '../src/line-parser';

describe('SQUARE_TAGS_REGEXP', () => {
  test('matches stacked tags at the start of a line', () => {
    const line = '[12:30.1][12:30.2]lyrics';
    const match = SQUARE_TAGS_REGEXP.exec(line);
    expect(match).not.toBeNull();
    expect(match?.[0]).toBe('[12:30.1][12:30.2]');
  });

  test('returns no match when there is no leading bracket tag', () => {
    expect(SQUARE_TAGS_REGEXP.test('lyrics without tags')).toBe(false);
  });
});

describe('INFO_REGEXP', () => {
  test('captures the key and value around the colon', () => {
    const match = INFO_REGEXP.exec('  ti  :   The Title ');
    expect(match?.[1]).toBe('ti');
    expect(match?.[2]).toBe('   The Title ');
  });

  test('rejects lines without a colon separator', () => {
    expect(INFO_REGEXP.test('title without colon')).toBe(false);
  });
});

describe('TIME_REGEXP', () => {
  test('accepts minutes and seconds with a dot decimal', () => {
    const match = TIME_REGEXP.exec('512:34.1');
    expect(match?.[1]).toBe('512');
    expect(match?.[2]).toBe('34.1');
  });

  test('accepts a colon as the fractional separator', () => {
    const match = TIME_REGEXP.exec('1:10:10');
    expect(match?.[1]).toBe('1');
    expect(match?.[2]).toBe('10:10');
  });

  test('rejects non-numeric segments', () => {
    expect(TIME_REGEXP.test('not a time')).toBe(false);
  });
});

describe('ENHANCED_TAG_WORD_REGEXP', () => {
  test('captures timestamp and word after angle brackets', () => {
    const match = ENHANCED_TAG_WORD_REGEXP.exec('<12:30.1> word');
    expect(match?.[1]).toBe('12:30.1');
    expect(match?.[2]).toBe(' word');
  });

  test('captures timestamp and word after square brackets', () => {
    const match = ENHANCED_TAG_WORD_REGEXP.exec('[12:30.1]word');
    expect(match?.[1]).toBe('12:30.1');
    expect(match?.[2]).toBe('word');
  });

  test('does not match when the bracket is missing', () => {
    expect(ENHANCED_TAG_WORD_REGEXP.exec('12:30.1 word')).toBeNull();
  });
});
