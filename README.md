# Falcor Shapes Prop Types

Conversion from falcor-shapes to React propTypes.

## Usage

```javascript
var falcorShapesPropTypes = require('falcor-shapes-prop-types');

var shape = {
  people: {
    length: true,
    $: [
      {from: 0, to: 100},
      {
        name: {
          first: true,
          last: true
        },
        age: true
      }
    ]
  }
};

var propTypes = falcorShapesPropTypes(shape);
```

This is the equivalent of writing:

```javascript
var propTypes = {
  people: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      name: React.PropTypes.shape({
        first: React.PropTypes.any.isRequired,
        last: React.PropTypes.any.isRequired
      }),
      age: React.PropTypes.any.isRequired
    })
  )
}
```
