module.exports = function(cnx) {
  var Lrc = cnx.Lrc
  var lrc

  before(function() {
    lrc = new Lrc()
  })


  it('timestampToString', function(){
    Lrc.timestampToString(143.54).should.equal('02:23.54')
    Lrc.timestampToString(3.21).should.equal('00:03.21')
  })

  describe('modify lyrics', function() {
    it('set lyrics', function(){
      lrc.info['re'] = 'raidou'
      lrc.info['ve'] = '1.00'
      lrc.lyrics = [{
        timestamp: 15.05,
        content: 'test',
      }]
      lrc.toString().should.deepEqual(
        [
          '[re:raidou]',
          '[ve:1.00]',
          `[${Lrc.timestampToString(15.05)}]test`,
        ].join('\r\n')
      )
    })

    it('append lyric', function(){
      lrc.lyrics.push({
        timestamp: 19.21,
        content: 'test2',
      })
      lrc.toString().should.deepEqual(
        [
          '[re:raidou]',
          '[ve:1.00]',
          `[${Lrc.timestampToString(15.05)}]test`,
          `[${Lrc.timestampToString(19.21)}]test2`,
        ].join('\r\n')
      )
    })

    it('prepend lyrics', function(){
      lrc.lyrics.splice(0, 0, {
        timestamp: 13.13,
        content: 'test3',
      })
      lrc.toString().should.deepEqual(
        [
          '[re:raidou]',
          '[ve:1.00]',
          `[${Lrc.timestampToString(13.13)}]test3`,
          `[${Lrc.timestampToString(15.05)}]test`,
          `[${Lrc.timestampToString(19.21)}]test2`,
        ].join('\r\n')
      )
    })

    it('insertBefore lyrics', function(){
      lrc.lyrics.splice(0, 0, {
        timestamp: 10.23,
        content: 'insertBefore',
      })
      lrc.toString().should.deepEqual(
        [
          '[re:raidou]',
          '[ve:1.00]',
          `[${Lrc.timestampToString(10.23)}]insertBefore`,
          `[${Lrc.timestampToString(13.13)}]test3`,
          `[${Lrc.timestampToString(15.05)}]test`,
          `[${Lrc.timestampToString(19.21)}]test2`,
        ].join('\r\n')
      )
    })

    it('insertAfter lyrics', function(){
      lrc.lyrics.splice(1, 0, {
        timestamp: 12.23,
        content: 'insertAfter',
      })
      lrc.toString().should.deepEqual(
        [
          '[re:raidou]',
          '[ve:1.00]',
          `[${Lrc.timestampToString(10.23)}]insertBefore`,
          `[${Lrc.timestampToString(12.23)}]insertAfter`,
          `[${Lrc.timestampToString(13.13)}]test3`,
          `[${Lrc.timestampToString(15.05)}]test`,
          `[${Lrc.timestampToString(19.21)}]test2`,
        ].join('\r\n')
      )
    })

    it('reset lyrics', function(){
      lrc.lyrics = [
        {
          timestamp: 15.05,
          content: 'test',
        }
      ]
      lrc.toString().should.deepEqual(
        [
          '[re:raidou]',
          '[ve:1.00]',
          `[${Lrc.timestampToString(15.05)}]test`,
        ].join('\r\n')
      )
    })
  })

  it('should sort', function(){
    lrc.lyrics = [
      {
        timestamp: 16.05,
        content: 'test2',
      },
      {
        timestamp: 15.05,
        content: 'test',
      },
    ]
    lrc.toString({sort: false}).should.deepEqual(
      [
        `[${Lrc.timestampToString(16.05)}]test2`,
        `[${Lrc.timestampToString(15.05)}]test`,
      ].join('\r\n')
    )
    lrc.toString().should.deepEqual(
      [
        `[${Lrc.timestampToString(15.05)}]test`,
        `[${Lrc.timestampToString(16.05)}]test2`,
      ].join('\r\n')
    )
  })

  it('should combine time', function(){
    lrc.lyrics = [
      {
        timestamp: 15.05,
        content: 'test',
      },
      {
        timestamp: 16.05,
        content: 'test',
      },
    ]
    lrc.toString({combine: false}).should.deepEqual(
      [
        `[${Lrc.timestampToString(15.05)}]test`,
        `[${Lrc.timestampToString(16.05)}]test`,
      ].join('\r\n')
    )
    lrc.toString().should.deepEqual(
      [
        `[${Lrc.timestampToString(15.05)}][${Lrc.timestampToString(16.05)}]test`
      ].join('\r\n')
    )
  })

  it('should offset time', function(){
    lrc.lyrics = [
      {
        timestamp: 15.05,
        content: 'test',
      }
    ]
    lrc.offset(1)
    lrc.toString().should.deepEqual(
      [
        `[${Lrc.timestampToString(16.05)}]test`,
      ].join('\r\n')
    )
    lrc.offset(-2)
    lrc.toString().should.deepEqual(
      [
        `[${Lrc.timestampToString(14.05)}]test`,
      ].join('\r\n')
    )
  })

  it('should clone', function() {
    let newLrc = lrc.clone()
    newLrc.info.should.deepEqual(lrc.info)
    newLrc.info.should.not.equal(lrc.info)
    newLrc.lyrics.should.deepEqual(lrc.lyrics)
    newLrc.lyrics.should.not.equal(lrc.lyrics)
    newLrc.lyrics.forEach(function(lyric, index) {
      lyric.should.not.equal(lrc.lyrics[index])
    })
  })
}
