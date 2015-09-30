var sinon = require('sinon'),
    react = require('react/addons'),
    expect = require('chai').expect,
    falcorShapesPropTypes = require('../index');

var testUtils = react.addons.TestUtils;

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

    beforeEach('stub console.warn', function() {
      warnStub = sinon.stub(console, 'warn');
    });

    afterEach('restore stub', function() {
      console.warn.restore();
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

        expect(warnStub.called).to.equal(false);

      })

      it('should fail when missing prop', function() {

        var props = {},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        // Get the warning printed
        call = warnStub.getCall(0);

        expect(warnStub.calledOnce).to.equal(true);
        expect(call.args[0]).to.match(/Failed propType/);
        expect(call.args[0]).to.match(/Required prop `people` was not specified in `Component`/);

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

        expect(warnStub.called).to.equal(false);

      })

      it('should fail when missing nested prop', function() {

        var props = {people: {}},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        // Get the warning printed
        call = warnStub.getCall(0);

        expect(warnStub.calledOnce).to.equal(true);
        expect(call.args[0]).to.match(/Failed propType/);
        expect(call.args[0]).to.match(/Required prop `name` was not specified in `Component`/);

      });

      it('should fail when no nesting at all', function() {

        var props = {people: 'hi'},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        // Get the warning printed
        call = warnStub.getCall(0);

        expect(warnStub.calledOnce).to.equal(true);
        expect(call.args[0]).to.match(/Failed propType/);
        expect(call.args[0]).to.match(/Invalid prop `people` of type `string` supplied to `Component`, expected `object`/);

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
                {from: 0, to: 10},
                {
                  name: true
                }
              ]
            }
          }),
          render: function() { return react.createElement('div', {}, 'hi'); }
        });

      });

      it('should pass with correctly formed array elements', function() {

        var props = {people: [{name: 'hi'}]},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        expect(warnStub.called).to.equal(false);

      });

      it('should pass with empty array', function() {

        var props = {people: []},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        expect(warnStub.called).to.equal(false);

      });

      it('should fail when object passed instead of array', function() {

        var props = {people: {name: 'hi'}},
            call;

       // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        call = warnStub.getCall(0);

        expect(warnStub.calledOnce).to.equal(true);
        expect(call.args[0]).to.match(/Failed propType/);
        expect(call.args[0]).to.match(/Invalid prop `people` of type `object` supplied to `Component`, expected an array/);

      });

      it('should fail when non-array passed instead of array', function() {

        var props = {people: 'hi'},
            call;

       // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        call = warnStub.getCall(0);

        expect(warnStub.calledOnce).to.equal(true);
        expect(call.args[0]).to.match(/Failed propType/);
        expect(call.args[0]).to.match(/Invalid prop `people` of type `string` supplied to `Component`, expected an array/);

      });

      // FIXME: This test fails, but it does NOT fail when the exact same
      // situation is run in the browser. WTF?
      // ie; Here, we expect it to warn about `name` missing. It does not.
      // In the browser, we expect the same, and it DOES :(
      it.skip('should fail when array shape incorrect', function() {

        var props = {people: [{blah: 'hi'}]},
            call;

        // rendering triggers the warning
        testUtils.renderIntoDocument(
          react.createElement(Component, props)
        );

        call = warnStub.getCall(0);

        expect(warnStub.calledOnce).to.equal(true);
        expect(call.args[0]).to.match(/Failed propType/);
        expect(call.args[0]).to.match(/Invalid prop `people` of type `object` supplied to `Component`, expected an array/);

      });

    });

  });

});
