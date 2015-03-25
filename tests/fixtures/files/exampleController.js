// Created with webapp-feature Yeoman generator
//
// ---- Controllers ----
// Controllers listen for and handle route changes within the application. See below
// how this application's default (empty) route links to the availability action.
//
// The purpose of each public method in the controller is to set up all of the
// model instances that views need to render and then instantiate a few high level
// view controllers or views to the page.
//
// Beyond this, the controller has no responsibility, it's getting all of the setup
// out of the way so the views and view-controllers can render.
// ----

var Router = require('ampersand-router');
var React = require('react');

module.exports = Router.extend({

  routes: {
    "": "index"
  },

  initialize: function(options) {
    this.instances = options.instances;
  },

  index: function() {
    React.render(<div className="test"></div>, document.body);
  }

});
