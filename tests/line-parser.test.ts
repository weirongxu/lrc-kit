import { parseLine, LineType, InfoLine, TimeLine } from '../src/line-parser';

test('get info type', () => {
  var lp = parseLine('[ti: Song title]');
  expect(lp.type).toEqual(LineType.INFO);
});

test('info type basic', () => {
  const lp = parseLine('[test: raidou]') as InfoLine;
  expect(lp.key).toEqual('test');
  expect(lp.value).toEqual('raidou');
});

test('info type trim', () => {
  const lp = parseLine('  [ test : raidou ]') as InfoLine;
  expect(lp.key).toEqual('test');
  expect(lp.value).toEqual('raidou');
});

describe('time type', () => {
  test('get type', () => {
    const lp = parseLine('[10:10.10]hello');
    expect(lp.type).toEqual(LineType.TIME);
  });

  test('basic', () => {
    var lp = parseLine('[1:10.10]hello') as TimeLine;
    expect(lp.timestamps).toEqual([1 * 60 + 10.1]);
    expect(lp.content).toEqual('hello');
  });

  test('use ":" instead of "."', () => {
    var lp = parseLine('[1:10:10]hello') as TimeLine;
    expect(lp.timestamps).toEqual([1 * 60 + 10.1]);
    expect(lp.content).toEqual('hello');
  });

  test('content tirm', () => {
    var lp = parseLine('[1:10.10] hello ') as TimeLine;
    expect(lp.timestamps).toEqual([1 * 60 + 10.1]);
    expect(lp.content).toEqual('hello');
  });

  test('time tirm1', () => {
    var lp = parseLine('[ 1 : 10 . 10 ] hello ') as TimeLine;
    expect(lp.timestamps).toEqual([1 * 60 + 10.1]);
    expect(lp.content).toEqual('hello');
  });

  test('prefix 0', () => {
    var lp = parseLine('[01:010.010] hello ') as TimeLine;
    expect(lp.timestamps).toEqual([1 * 60 + 10.01]);
    expect(lp.content).toEqual('hello');
  });

  test('prefix space', () => {
    var lp = parseLine('  [1:00] hello') as TimeLine;
    expect(lp.timestamps).toEqual([1 * 60]);
    expect(lp.content).toEqual('hello');
  });

  test('two timestamps', () => {
    var lp = parseLine(' [1 : 00 ][ 2: 00] hello') as TimeLine;
    expect(lp.timestamps).toEqual([1 * 60, 2 * 60]);
    expect(lp.content).toEqual('hello');
  });

  test('three timestamps', () => {
    var lp = parseLine(' [1:00 ]  [  2:00] [ 3:01 ]  hello') as TimeLine;
    expect(lp.timestamps).toEqual([1 * 60, 2 * 60, 3 * 60 + 1]);
    expect(lp.content).toEqual('hello');
  });

  test('with options', () => {
    var lp = parseLine(' [1:00 ]  [  2:00] [ 3:01 ]  hello', {
      enhanced: false,
    }) as TimeLine;
    expect(lp.timestamps).toEqual([1 * 60, 2 * 60, 3 * 60 + 1]);
    expect(lp.content).toEqual('hello');
  });
});

describe('time enhanced type', () => {
  test('captures inline word timestamps', () => {
    const line = '[10:10.10] <10:10.12> hello <10:11.02> world';
    const lp = parseLine(line) as TimeLine;

    expect(lp.timestamps).toEqual([10 * 60 + 10.1]);
    expect(lp.rawContent).toEqual('<10:10.12> hello <10:11.02> world');
    expect(lp.content).toEqual('hello world');
    expect(lp.wordTimestamps).toEqual([
      { timestamp: 10 * 60 + 10.12, content: ' hello ' },
      { timestamp: 10 * 60 + 11.02, content: 'world' },
    ]);
  });

  test('captures inline word timestamps less space', () => {
    const line = '[10:10.10]<10:10.12>hello <10:11.02>world';
    const lp = parseLine(line, { enhanced: true }) as TimeLine;

    expect(lp.timestamps).toEqual([10 * 60 + 10.1]);
    expect(lp.rawContent).toEqual('<10:10.12>hello <10:11.02>world');
    expect(lp.content).toEqual('hello world');
    expect(lp.wordTimestamps).toEqual([
      { timestamp: 10 * 60 + 10.12, content: 'hello ' },
      { timestamp: 10 * 60 + 11.02, content: 'world' },
    ]);
  });

  test('ignores empty word timestamps', () => {
    const line = '[10:10.10]<10:10.12>   <10:11.02>world';
    const lp = parseLine(line) as TimeLine;

    expect(lp.timestamps).toEqual([10 * 60 + 10.1]);
    expect(lp.rawContent).toEqual('<10:10.12>   <10:11.02>world');
    expect(lp.content).toEqual('world');
    expect(lp.wordTimestamps).toEqual([
      { timestamp: 10 * 60 + 11.02, content: 'world' },
    ]);
  });

  test('square tags for word timestamps', () => {
    const line = '[10:10.10] hello [10:11.02] world';
    const lp = parseLine(line, { enhanced: true }) as TimeLine;

    expect(lp.timestamps).toEqual([10 * 60 + 10.1]);
    expect(lp.rawContent).toEqual('hello [10:11.02] world');
    expect(lp.content).toEqual('hello world');
    expect(lp.wordTimestamps).toEqual([
      { timestamp: 10 * 60 + 10.1, content: 'hello ' },
      { timestamp: 10 * 60 + 11.02, content: 'world' },
    ]);
  });

  test('square tags for word timestamps less space', () => {
    const line = '[10:10.10]hello [10:11.02]world';
    const lp = parseLine(line, { enhanced: true }) as TimeLine;

    expect(lp.timestamps).toEqual([10 * 60 + 10.1]);
    expect(lp.rawContent).toEqual('hello [10:11.02]world');
    expect(lp.content).toEqual('hello world');
    expect(lp.wordTimestamps).toEqual([
      { timestamp: 10 * 60 + 10.1, content: 'hello ' },
      { timestamp: 10 * 60 + 11.02, content: 'world' },
    ]);
  });

  test('no enhanced parsing when disabled', () => {
    const line = '[10:10.10] <10:10.12> hello <10:11.02> world';
    const lp = parseLine(line, { enhanced: false }) as TimeLine;

    expect(lp.timestamps).toEqual([10 * 60 + 10.1]);
    expect(lp.rawContent).toEqual('<10:10.12> hello <10:11.02> world');
    expect(lp.content).toEqual('<10:10.12> hello <10:11.02> world');
    expect(lp.wordTimestamps).toEqual(undefined);
  });
});

test('get invalid type', () => {
  let lp = parseLine('');
  expect(lp.type).toEqual(LineType.INVALID);

  lp = parseLine('test');
  expect(lp.type).toEqual(LineType.INVALID);

  lp = parseLine('[:]');
  expect(lp.type).toEqual(LineType.INVALID);
});
