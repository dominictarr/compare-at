var tape = require('tape')
var compareAt = require('./')

var cmp = compareAt([['foo', 'bar']])

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
  t.deepEqual(expected.map(compareAt.hasPath(['foo', 'bar'])), [
    false, false, false, false, false,
    true, true, true, true, true
  ])
  t.end()
})

tape('compare each pair', function (t) {
  var input = expected.filter(compareAt.hasPath(['foo', 'bar']))
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





