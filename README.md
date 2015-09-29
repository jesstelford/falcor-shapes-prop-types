# Falcor Shapes Prop Types

Conversion from [falcor-shapes](https://github.com/marcello3d/falcor-shapes) to
[React propTypes](https://facebook.github.io/react/docs/reusable-components.html#prop-validation).

[![NPM](https://nodei.co/npm/falcor-shapes-prop-types.png?downloads=true)](https://nodei.co/npm/falcor-shapes-prop-types/)

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

## Contributing

Pull Requests are welcome!

This is a truly open open source project: If your contributions are of a high
quality, I will give you push permissions to make direct changes in the future.
