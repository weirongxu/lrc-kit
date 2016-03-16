module.exports = function(cnx){
  var LineParser = cnx.LineParser;

  describe('INFO TYPE', function(){
    it('get info type', function(){
      var lp = new LineParser('[ti: Song title]');
      lp.type.should.equal(LineParser.TYPE.INFO);
    });
    [
      [
        'basic',
        '[test: raidou]',
        'test',
        'raidou',
      ],
      [
        'trim',
        '[ test : raidou ]',
        'test',
        'raidou',
      ],
    ]
    .forEach(function(fixture){
      it(fixture[0], function(){
        var lp = new LineParser(fixture[1]);
        lp.key.should.equal(fixture[2]);
        lp.value.should.equal(fixture[3]);
      });
    });
  });
  describe('TIME TYPE', function(){
    it('get time type', function(){
      var lp = new LineParser('[10:10.10]hello');
      lp.type.should.equal(LineParser.TYPE.TIME);
    });
    [
      [
        'basic',
        '[1:10.10]hello',
        1*60+10.10,
        'hello',
      ],
      [
        'use ":" instead of "."',
        '[1:10:10]hello',
        1*60+10.10,
        'hello',
      ],
      [
        'content tirm',
        '[1:10.10] hello ',
        1*60+10.10,
        'hello',
      ],
      [
        'time tirm1',
        '[ 1 : 10 . 10 ] hello ',
        1*60+10.10,
        'hello',
      ],
      [
        'prefix 0',
        '[01:010.010] hello ',
        1*60+10.01,
        'hello',
      ],
      [
        'prefix space',
        '  [1:00] hello',
        1*60,
        'hello',
      ],
    ]
    .forEach(function(fixture){
      it(fixture[0], function(){
        var lp = new LineParser(fixture[1]);
        lp.timestamp.should.equal(fixture[2]);
        lp.content.should.equal(fixture[3]);
      });
    });
  });
  describe('INVALID TYPE', function(){
    it('get invalid type', function(){
      [
        '',
        'test',
        '[:]',
      ]
      .forEach(function(fixture) {
        var lp = new LineParser(fixture);
        lp.type.should.equal(LineParser.TYPE.INVALID);
      });
    });
  });
};
