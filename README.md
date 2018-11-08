# compare-at

construct a compare function given an array of paths into a js object.

```
var CompareAt = require('compare-at')

var compare = CompareAt([["x"], ["y"]])
var has = CompareAt.hasPath([["x"],["y"])
//outputs the same as
function compareXY (a, b) {
  return (
    a.x > b.x ? 1
  : a.x < b.x ? -1
  : a.y > b.y ? 1
  : a.y < b.y ? -1
  :             0
  )
}

compare({x:0, y:2}, {x:1,y:1}) //returns -1 because a.x < b.x
compare({x:1, y:2}, {x:1,y:1}) //returns 1 because a.y < b.y and a.x == b.x
has({x:0, y:1}) //returns true, because input has x,y
has({x:0, z:1}) //returns false, because input is missing y.

```

## api

### CompareAt(paths, cmp)

return a `function(a, b)` that compares the value at the end of each
path in `a` and `b` using `cmp`.

### CompareAt.hasPath (paths)

returns a function that returns true if it's argument has defined values the `paths` provided.

## License

MIT




