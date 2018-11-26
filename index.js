var typewise = require('typewiselite')
var nested = require('libnested')

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
  return a < b ? -1 ? a > b : 1 : 0
  if(a === b) return 0
  throw new Error('did not have path:')
}

function compareValuePath (a, target, paths, cmp) {
  if(!Array.isArray(target)) throw new Error('target must be array of values')
  if(target.length != paths.length) throw new Error('target values must be same length as path, expected:'+path.length+' was:'+target.length)
  var path, a_v, b_v, result
  for(var i = 0; i < paths.length; i++) {
    if(result = cmp(nested.get(a, paths[i]), target[i]))
      return result
  }
  //if it made past the whole path, must be equal
  return 0
}

exports = module.exports = function (paths, cmp) {
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

function hasPath (obj, path) {
  if(!obj) return !path.length
  for(var i = 0; i < path.length; i++) {
    if(!Object.hasOwnProperty.call(obj, path[i])) return false
    var value = obj[path[i]]
    if(isObject(value)) obj = value
    else return i + 1 == path.length
  }
  return true
}
exports.hasPath = function (paths) {
  return function (obj) {
    for(var i  = 0; i < paths.length; i++)
      if(!(result = hasPath(obj, paths[i]))) return result
    return true
  }
}

exports.createCompareValuePath = function (paths, cmp) {
  cmp = cmp || typewise
  return function (a, target) {
    return compareValuePath(a, target, paths, cmp)
  }
}

exports.comparePath = comparePath
exports.compareValuePath = compareValuePath
exports.getValuePath = function (object, paths) {
  return paths.map(function (path) {
    return nested.get(object, path)
  })
}
exports.valuePathToObject = function (vp, paths) {
  var o = {}
  paths.forEach(function (path, i) {
    nested.set(o, path, vp[i])
  })
  return o
}

//accepts either an array of values, or an object

exports.createCompareAuto = function (paths, cmp) {
  var compareAt = module.exports(paths, cmp)
  var compareAtValues = module.exports.createCompareValuePath(paths, cmp)

  return function (value, target) {
    if(Array.isArray(target)) {
      return compareAtValues(value, target)
    } else
      return compareAt(value, target)
  }
}

