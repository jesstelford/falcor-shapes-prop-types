'use strict';

var React = require('react');

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

module.exports = function falcorShapesPropTypes(path) {
  return transform(path, function(result, subPath, key) {
    result[key] = calculatePropTypes(subPath)
  });
}

function calculatePropTypes(path) {

  var propTypes,
      innerShape;

  if (Object.prototype.toString.call(path) === '[object Object]') {

    if (Object.prototype.toString.call(path['$']) === '[object Array]') {

      // flag it as an array
      propTypes = React.PropTypes.arrayOf(
        // recurse with the correct sub-shape
        calculatePropTypes(path['$'][1])
      ).isRequired;

    } else {

      // which we determine by remapping each key in `path`
      innerShape = transform(path, function (result, path, key) {
        //
        // recurse with a regular object
        result[key] = calculatePropTypes(path);

      })

      // it's a shape
      propTypes = React.PropTypes.shape(innerShape).isRequired;

    }

    return propTypes;

  } else {
    // leaf node, stop recursion
    return React.PropTypes.any.isRequired
  }

}
