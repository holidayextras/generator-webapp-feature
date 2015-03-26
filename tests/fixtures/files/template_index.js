// -----------
// This is the entry point for the application. Declare any instances you want to
// make available across the entire application here and add them to this.instances.
//
// This is also a good place to set up your controllers, which will listen for and
// handle route changes in the application.
//
// We make the application available on window.app so we have an entry point in the
// browser's JS console.
// ----

var ProductsController = require('./products/controllers/products_controller');
//====== yeoman requireHook =====//
var HapiSdk = require('hapi-sdk');
var Config = require('clientconfig');

window.app = {
  initalize: function() {

    // 1. Set up instances we want to be available throughout the application
    this.instances = {
      config: Config,
      hapi: new HapiSdk(Config.sdk.token, {
        sid:'',
        testMode: Config.sdk.testMode
      }),
    }

    // 2. Set up controllers to handle route changes & page setup.
    this.controllers = {
      productsController: new ProductsController({instances: this.instances}),
      //===== yeoman controllerHook =====//
    }

    // 3. Start the application
    this.controllers.productsController.history.start(); // Only needs to be called on one defined controller.
  }
};

window.app.initalize();
