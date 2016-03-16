module.exports = function(cnx) {
  var Lrc = cnx.Lrc;

  it('createTimestamp', function(){
    var lrc = new Lrc();
    Lrc.createTimestamp(143.54).should.equal('02:23.54');
    Lrc.createTimestamp(3.21).should.equal('00:03.21');
  });

  var lrc = new Lrc();

  it('set lyrics', function(){
    lrc.info['re'] = 'raidou';
    lrc.info['ve'] = '1.00';
    lrc.lyrics = [{
      timestamp: 15.05,
      content: 'test',
    }];
    lrc.toString().should.deepEqual(
      [
        '[re:raidou]',
        '[ve:1.00]',
        `[${Lrc.createTimestamp(15.05)}]test`,
      ].join('\r\n')
    );
  });

  it('append lyric', function(){
    lrc.lyrics.push({
      timestamp: 19.21,
      content: 'test2',
    });
    lrc.toString().should.deepEqual(
      [
        '[re:raidou]',
        '[ve:1.00]',
        `[${Lrc.createTimestamp(15.05)}]test`,
        `[${Lrc.createTimestamp(19.21)}]test2`,
      ].join('\r\n')
    );
  });

  it('prepend lyrics', function(){
    lrc.lyrics.splice(0, 0, {
      timestamp: 27.13,
      content: 'test3',
    });
    lrc.toString().should.deepEqual(
      [
        '[re:raidou]',
        '[ve:1.00]',
        `[${Lrc.createTimestamp(27.13)}]test3`,
        `[${Lrc.createTimestamp(15.05)}]test`,
        `[${Lrc.createTimestamp(19.21)}]test2`,
      ].join('\r\n')
    );
  });

  it('insertBefore lyrics', function(){
    lrc.lyrics.splice(0, 0, {
      timestamp: 10.23,
      content: 'insertBefore',
    });
    lrc.toString().should.deepEqual(
      [
        '[re:raidou]',
        '[ve:1.00]',
        `[${Lrc.createTimestamp(10.23)}]insertBefore`,
        `[${Lrc.createTimestamp(27.13)}]test3`,
        `[${Lrc.createTimestamp(15.05)}]test`,
        `[${Lrc.createTimestamp(19.21)}]test2`,
      ].join('\r\n')
    );
  });

  it('insertAfter lyrics', function(){
    lrc.lyrics.splice(1, 0, {
      timestamp: 10.23,
      content: 'insertAfter',
    });
    lrc.toString().should.deepEqual(
      [
        '[re:raidou]',
        '[ve:1.00]',
        `[${Lrc.createTimestamp(10.23)}]insertBefore`,
        `[${Lrc.createTimestamp(10.23)}]insertAfter`,
        `[${Lrc.createTimestamp(27.13)}]test3`,
        `[${Lrc.createTimestamp(15.05)}]test`,
        `[${Lrc.createTimestamp(19.21)}]test2`,
      ].join('\r\n')
    );
  });

  it('reset lyrics', function(){
    lrc.lyrics = [
      {
        timestamp: 15.05,
        content: 'test',
      }
    ];
    lrc.toString().should.deepEqual(
      [
        '[re:raidou]',
        '[ve:1.00]',
        `[${Lrc.createTimestamp(15.05)}]test`,
      ].join('\r\n')
    );
  });
};
