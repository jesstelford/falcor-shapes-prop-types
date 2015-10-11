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
  people: React.PropTypes.shape({
    length: React.PropTypes.any.isRequired,
    '0': React.PropTypes.shape({
      name: React.PropTypes.shape({
        first: React.PropTypes.any.isRequired,
        last: React.PropTypes.any.isRequired
      }),
      age: React.PropTypes.any.isRequired
    })
    '1': // Repeated
    // ...
    '100': // ...
  })
}
```

Note that we end up with a `.shape` for key `people`. This is because Falcor
does not return a real array for collections. Instead it returns an object keyed
with the indicies requested, which is how Falcor supports sparse arrays.

You'll also notice these indicies are not marked as `.isRequired` since they may
not be returned by Falcor in its dataset.

### Optionality

You can force all props to be optional (ie; *not* `.isRequired`) by setting the
second parameter of `falcorShapesPropTypes` to `false`:

```javascript
var falcorShapesPropTypes = require('falcor-shapes-prop-types');

var shape = {
  people: {
    name: true
  }
};

var propTypes = falcorShapesPropTypes(shape, false);
```

This is the equivalent of writing:

```javascript
var propTypes = {
  people: React.PropTypes.shape({
    name: React.PropTypes.any // no .isRequired
  }) // no .isRequired
}
```

## Compatibility

Tested & works with React versions:

* 0.13.x
* 0.14.x

## Contributing

Pull Requests are welcome!

This is a truly open open source project: If your contributions are of a high
quality, I will give you push permissions to make direct changes in the future.
