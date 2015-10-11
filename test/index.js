var sinon = require('sinon'),
    react = require('react'),
    expect = require('chai').expect,
    testUtils = require('react-addons-test-utils'),
    falcorShapesPropTypes = require('../index');

describe('Conversion function', function() {

  describe('shape to convert', function() {
    it('throws when not object', function() {
      expect(falcorShapesPropTypes.bind(this, 'foo')).to.throw
      expect(falcorShapesPropTypes.bind(this, 1)).to.throw
      expect(falcorShapesPropTypes.bind(this, [4])).to.throw
      expect(falcorShapesPropTypes.bind(this, {})).to.not.throw
      expect(falcorShapesPropTypes.bind(this, {foo: 'bar'})).to.not.throw
    });
  })

  describe('propType validation', function() {

    var warnStub;
    var errorStub;

    function assertWarnOrError(shouldCall, matches) {

      var call;

      // 0.13.x uses console.warn
      // 0.14.x uses console.error
      if (warnStub.called) {
        call = warnStub.getCall(0);
      } else if (errorStub.called) {
        call = errorStub.getCall(0);
      }

      expect(!!call).to.equal(shouldCall);

      if (shouldCall) {
        matches.forEach(function(match) {
          expect(call.args[0]).to.match(match);
        });
      }
    }

    beforeEach('stub console.warn', function() {
      warnStub = sinon.stub(console, 'warn');
      errorStub = sinon.stub(console, 'error');
    });

    afterEach('restore stub', function() {
      console.warn.restore();
      console.error.restore();
    });

    describe('simple object', function() {

      var Component;

      before('setup component', function() {

        Component = react.createClass({
          displayName: 'Component',
          propTypes: falcorShapesPropTypes({
            people: true
          }),
          render: function() { return react.createElement('div', {}, 'hi'); }
        });

      });

      it('should pass', function() {

        var props = {people: 'hi'},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(false);

      })

      it('should fail when missing prop', function() {

        var props = {};

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(true, [
          /Failed propType/,
          /Required prop `.*` was not specified in `Component`/
        ]);

      });

    });

    describe('optionality', function() {

      var Component;

      before('setup component', function() {

        Component = react.createClass({
          displayName: 'Component',
          propTypes: falcorShapesPropTypes(
            {
              people: true
            },
            true
          ),
          render: function() { return react.createElement('div', {}, 'hi'); }
        });

      });

      it('should pass', function() {

        var props = {people: 'hi'},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(false);

      })

      it('should pass when missing prop', function() {

        var props = {};

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(false);

      });

    });

    describe('nested object', function() {

      var Component;

      before('setup component', function() {

        Component = react.createClass({
          displayName: 'Component',
          propTypes: falcorShapesPropTypes({
            people: {
              name: true
            }
          }),
          render: function() { return react.createElement('div', {}, 'hi'); }
        });

      });

      it('should pass', function() {

        var props = {people: {name: 'hi'}},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(false);

      })

      it('should fail when missing nested prop', function() {

        var props = {people: {}},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(true, [
          /Failed propType/,
          /Required prop `.*` was not specified in `Component`/
        ])

      });

      it('should fail when no nesting at all', function() {

        var props = {people: 'hi'},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(true, [
          /Failed propType/,
          /Invalid prop `.*` of type `string` supplied to `Component`, expected `object`/
        ])

      });

    });

    describe('nested array', function() {

      var Component;

      before('setup component', function() {

        Component = react.createClass({
          displayName: 'Component',
          propTypes: falcorShapesPropTypes({
            people: {
              $: [
                {from: 0, to: 1},
                {
                  name: true
                }
              ]
            }
          }),
          render: function() { return react.createElement('div', {}, 'hi'); }
        });

      });

      it('should pass with correctly formed array-like object', function() {

        var props = {people: {
              0: {name: 'hi'},
              1: {name: 'ho'}
            }},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(false);

      });

      it('should pass with some indecies missing', function() {

        var props = {people: {
              0: {name: 'hi'}
            }},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(false);

      });

      it('should pass with empty array-like object', function() {

        var props = {people: {}},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(false);

      });

      it('should pass with array-like object containing unrelated keys', function() {

        var props = {people: {hi: 'ho'}},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(false);

      });

      it('should fail when actual array passed instead of array-like object', function() {

        var props = {people: []},
            call;

       // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(true, [
          /Failed propType/,
          /Invalid prop `.*` of type `array` supplied to `Component`, expected `object`/
        ]);

      });

      it('should fail when array-like element shape incorrect', function() {

        var props = {
              people: {
                0: 'hi'
              }
            },
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        assertWarnOrError(true, [
          /Failed propType/,
          /Warning: Failed propType: Invalid prop `.*` of type `string` supplied to `Component`, expected `object`./
        ])

      });
    });

    // Array ranges should be ended with `to` or `length`
    describe('incorrect bounds for collection', function() {

      it('should work when bounds start at index 0', function() {

        var shape = {
          people: {
            $: [
              {from: 0, to: 10},
              {
                name: true
              }
            ]
          }
        };

        expect(falcorShapesPropTypes.bind(this, shape)).to.not.throw;

      });

      it('should work when bounds start at index non-0', function() {

        var shape = {
          people: {
            $: [
              {from: 5, to: 10},
              {
                name: true
              }
            ]
          }
        };

        expect(falcorShapesPropTypes.bind(this, shape)).to.not.throw;

      });

      it('should work when length === 0', function() {

        var shape = {
          people: {
            $: [
              {from: 0, length: 0},
              {
                name: true
              }
            ]
          }
        };

        expect(falcorShapesPropTypes.bind(this, shape)).to.not.throw;

      });

      it('should work when length > 0', function() {

        var shape = {
          people: {
            $: [
              {from: 0, length: 7},
              {
                name: true
              }
            ]
          }
        };

        expect(falcorShapesPropTypes.bind(this, shape)).to.not.throw;

      });

      it('should throw when end bounds missing', function() {

        var shape = {
          people: {
            $: [
              {from: 0},
              {
                name: true
              }
            ]
          }
        };

        expect(falcorShapesPropTypes.bind(this, shape)).to.throw;

      });

      it('should throw when end bounds less than from', function() {

        var shape = {
          people: {
            $: [
              {from: 10, to: 4},
              {
                name: true
              }
            ]
          }
        };

        expect(falcorShapesPropTypes.bind(this, shape)).to.throw;

      });

      it('should throw when length < 0', function() {

        var shape = {
          people: {
            $: [
              {from: 10, length: -1},
              {
                name: true
              }
            ]
          }
        };

        expect(falcorShapesPropTypes.bind(this, shape)).to.throw;

      });

    });

  });

});
