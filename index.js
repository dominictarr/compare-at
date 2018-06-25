var typewise = require('typewiselite')

function isObject (o) {
  return o && 'object' == typeof o
}

function compareIsObject (a, b, cmp) {
  if(!isObject(a) && !isObject(b))
    return cmp(a, b)
  else if (isObject(a) && !isObject(b))
    return 1
  else if (!isObject(a) && isObject(b))
    return -1
}

function comparePath(a, b, path, cmp) {
  var key, a_v, b_v, result
  for(var i = 0; i < path.length; i++) {
    key = path[i]; a_v = a[key]; b_v = b[key]
    if(a_v == null || b_v == null)
      return a_v == null ? b_v == null ? 0 : -1 : 1

    if(result = compareIsObject(a_v, b_v, cmp))
      return result
    else {
      a = a[key]
      b = b[key]
    }
  }
  //if it gets through the path, and they are both still objects
  //treat them as equal, which will fall through to the next comparison
  return 0
}

module.exports = function (paths, cmp) {
  cmp = cmp || typewise
  return function (a, b) {
    var result
    if(a == null && b == null) return 0
    for(var i = 0; i < paths.length; i++) {
      result = compareIsObject(a, b, cmp) || comparePath(a, b, paths[i], cmp)
      if(result) return result
    }
    return 0
  }
}

module.exports.hasPath = function (path) {
  return function (obj) {
    if(!obj) return !path.length
    for(var i = 0; i < path.length; i++) {
      if(!Object.hasOwnProperty.call(obj, path[i])) return false
      var value = obj[path[i]]
      if(isObject(value)) obj = value
    }
    return true
  }
}
module.exports.comparePath = comparePath





