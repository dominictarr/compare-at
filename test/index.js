var tape = require('tape')
var CompareAt = require('../')
var paths = [['foo', 'bar']]
var cmp = CompareAt([['foo', 'bar']])

var expected = [
  null,
  true,
  10,
  [1,2,3],
  {foo: {baz: true}},
  {foo: {bar: true}},
  {foo: {bar: 0}},
  {foo: {bar: 1}},
  {foo: {bar: 2}},
  {foo: {bar: 3}}
]

function shuffle () { return Math.random() - 0.5 }

tape('compare each pair', function (t) {
  for(var i = 0; i < expected.length; i++) {
    for(var j = 0; j < expected.length; j++) {
      var result = cmp(expected[i], expected[j])
      if(i == j) t.equals(result, 0) //always equal to self
      else if(result > 0) t.ok(i > j)
      //permit partial orders
    }
  }
  t.end()
})

tape('has path', function (t) {
  t.deepEqual(expected.map(CompareAt.hasPath([['foo', 'bar']])), [
    false, false, false, false, false,
    true, true, true, true, true
  ])
  t.end()
})

tape('compare each pair', function (t) {
  var input = expected.filter(CompareAt.hasPath(['foo', 'bar']))
  console.log(input)
  for(var i = 0; i < input.length; i++) {
    for(var j = 0; j < input.length; j++) {
      var result = cmp(input[i], input[j])
      t.equal(result < 0, i < j)
      t.equal(result > 0, i > j)
      t.equal(result == 0, i == j)
    }
  }
  t.end()
})

tape('sort array', function (t) {
  t.deepEqual(expected.slice().sort(shuffle).sort(cmp), expected)
  t.end()
})

var a = require('fs').readFileSync(
  require('path').join(__dirname,'output.dljson'), 'utf8'
).split(/\n\n/).filter(Boolean).map(JSON.parse)

tape('real data', function (t) {
//  console.log(a)
  var paths = [['value','content','type'], ['value', 'timestamp']]
  var compare = CompareAt(paths)
  var has = CompareAt.hasPath(paths)
  a.filter(has).sort(compare).forEach(function (e) {
    console.log(e.value.content.type, e.value.timestamp)
  })

  t.end()
})

tape('compare to path', function (t) {
  expected.forEach(function (object, i) {
    console.log(object, paths)
    var vp = CompareAt.getValuePath(object, paths)
    var compareVP = CompareAt.createCompareValuePath(paths)
    var compareAuto = CompareAt.createCompareAuto(paths)
    var compareAt = CompareAt(paths)
    if(vp[0] != undefined) {
      t.deepEqual(expected.filter(function (v) {
        return compareVP(v, vp) === 0
      }), [expected[i]])

      t.deepEqual(expected.filter(function (v) {
        return compareAuto(v, vp) === 0
      }), [expected[i]])

      t.deepEqual(expected.filter(function (v) {
        return compareAuto(v, CompareAt.valuePathToObject(vp, paths)) === 0
      }), [expected[i]])

      t.deepEqual(expected.filter(function (v) {
        return compareAt(v, CompareAt.valuePathToObject(vp, paths)) === 0
      }), [expected[i]])
    }
  })
  t.end()
})

