'use strict';

var React = require('react'),
    objectAssign = require('object-assign');

// Poor man's implementation of lodash/object/transform
function transform(obj, callback) {
  var key,
      result = {};
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      callback(result, obj[key], key);
    }
  }
  return result;
}

/**
 * @param path Object The Falcor Shapes Path Object
 * @param optional Boolean Set every path as optional
 *
 * @return Object The propTypes object ready to add to a React Component
 */
module.exports = function falcorShapesPropTypes(path, optional) {
  return transform(path, function(result, subPath, key) {
    result[key] = calculatePropTypes(subPath, !!optional)
  });
}

function calculatePropTypes(path, optional, forceOptional) {

  var key,
      keyTo,
      propTypes,
      innerShape = {},
      arrayBounds,
      innerPropTypes;

  if (Object.prototype.toString.call(path) === '[object Object]') {

    // Check for the special collection marker
    if (Object.prototype.toString.call(path['$']) === '[object Array]') {

      arrayBounds = path['$'][0];

      if (typeof arrayBounds.to !== 'undefined') {
        keyTo = arrayBounds.to;
      } else if (typeof arrayBounds.length !== 'undefined') {
        keyTo = arrayBounds.from + arrayBounds.length - 1
      } else if (process.env.NODE_ENV !== 'production') {
        // TODO: Give context in error output
        throw new Error('Must specify either `to` or `length` for an array.');
      }

      // recurse once - the shape is the same for every array item.
      // Also - make sure it's optional
      innerPropTypes = calculatePropTypes(path['$'][1], optional, true);

      // Flacor returns items as an object keyed with the requested incidies.
      // This is to support sparse arrays, so we must do the same here.
      for (key = arrayBounds.from; key <= keyTo; key++) {
        innerShape[key] = innerPropTypes;
      }

    }

    // which we determine by remapping each key in `path`
    objectAssign(innerShape, transform(path, function (result, subPath, key) {

      // skip over the special array identifier
      if (key === '$') {
        return;
      }

      // recurse with a regular object
      result[key] = calculatePropTypes(subPath, optional);

    }));

    // it's a shape
    propTypes = React.PropTypes.shape(innerShape);

    if (!(optional || forceOptional)) {
      propTypes = propTypes.isRequired;
    }

    return propTypes;

  } else {

    // leaf node, stop recursion
    if (optional || forceOptional) {
      return React.PropTypes.any;
    } else {
      return React.PropTypes.any.isRequired
    }
  }

}
