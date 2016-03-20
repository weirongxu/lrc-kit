module.exports = function(cnx){
  var Runner = cnx.Runner;
  var Lrc = cnx.Lrc;

  var lrc = Lrc.parse(cnx.fixtures['main.lrc'])
  var runner = new Runner(lrc);

  it('should get info', function(){
    runner.getInfo().should.deepEqual(lrc.info);
  });

  it('should get all lyrics', function(){
    runner.getLyrics().should.deepEqual(lrc.lyrics);
  });

  it('first get lyric', function(){
    runner.curIndex().should.equal(-1);
    (function() {
      runner.getLyric();
    }).should.throw('Index not exist');
  });

  describe('get lyric', function(){
    before(function() {
      runner = new Runner(lrc);
    });

    it('index should be 0 when before 2nd lyric', function(){
      runner.timeUpdate(lrc.lyrics[1].timestamp - .1);
      runner.curIndex().should.equal(0);
    });

    it('index should be -1 when timestamp is 0', function(){
      runner.timeUpdate(0);
      runner.curIndex().should.equal(-1);
    });

    it('index should be 1 when in 1st lyric', function(){
      runner.timeUpdate(lrc.lyrics[1].timestamp);
      runner.curIndex().should.equal(1);
    });

    it('index should be 2 when after 3rd lyric', function(){
      runner.timeUpdate(lrc.lyrics[2].timestamp + .1);
      runner.curIndex().should.equal(2);
    });

    it('index should be 3 when before 5th lyric', function(){
      runner.timeUpdate(lrc.lyrics[4].timestamp - .1);
      runner.curIndex().should.equal(3);
    });

    it('index should be 4 when after 5th lyric', function(){
      runner.timeUpdate(lrc.lyrics[4].timestamp + .1);
      runner.curIndex().should.equal(4);
    });

    it('index should be last when timestamp is NEGATIVE_INFINITY', function(){
      runner.timeUpdate(Number.NEGATIVE_INFINITY);
      runner.curIndex().should.equal(-1);
    });

    it('index should be last when timestamp is POSITIVE_INFINITY', function(){
      runner.timeUpdate(10000000);
      runner.curIndex().should.equal(lrc.lyrics.length - 1);

      runner.timeUpdate(Number.POSITIVE_INFINITY);
      runner.curIndex().should.equal(lrc.lyrics.length - 1);
    });
  });

  it('should run along the timestamp', function() {
    runner = new Runner(lrc);
    var lyrics = [
      "i guess you're my creep tonight",
      "The way you knock me off my feet",
      "Now i can't tell my left form right",
      "You only see me when I'm weak",
      "I can't believe the things I hear me say",
      "And I don't even recognize myself",
      "why can't I get out of my own way",
    ];
    var curIndex = 0;
    for (var time=0; time < 30 * 60; ++time) {
      runner.timeUpdate(time);
      try {
        var lyric = runner.curLyric();
        if (lyric.content != lyrics[curIndex]) {
          lyric.content.should.equal(lyrics[++curIndex]);
        }
      } catch(e) {
        e.message.should.equal('Index not exist');
      }
    }
  });

  it('should sorted when update lyrics', function() {
    runner = new Runner(Lrc.parse(`
      [00:03.00]third
      [00:02.00]second
    `));
    runner.lrc.toString().should.equal([
      '[00:02.00]second',
      '[00:03.00]third',
    ].join('\r\n'));
    runner.lrc.lyrics.push({
      timestamp: 1,
      content: 'first',
    });
    runner.lrcUpdate();
    runner.lrc.toString().should.equal([
      '[00:01.00]first',
      '[00:02.00]second',
      '[00:03.00]third',
    ].join('\r\n'));
  });

  it('should offset lyrics', function() {
    [
      {
        source: [
          '[offset:+1000]',
          '[00:01.00]one',
          '[00:02.00]two',
        ],
        result: [
          '[00:02.00]one',
          '[00:03.00]two',
        ],
      },
      {
        source: [
          '[offset:-2000]',
          '[00:01.00]one',
          '[00:02.00]two',
          '[00:03.00]three',
        ],
        result: [
          '[00:00.00]one',
          '[00:00.00]two',
          '[00:01.00]three',
        ],
      },
    ].forEach((it) => {
      runner = new Runner(Lrc.parse(it.source.join('\r\n')));
      runner.lrc.toString().should.equal(it.result.join('\r\n'));
    });
  });
};
