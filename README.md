# WebApp-Feature Generator

## About this generator
---

The [WebApp template](https://github.com/holidayextras/webapp-template) projects split different functionality into "features". 
This generator provides a quick method to add a new feature to an app.

For more information on how we define a feature see the [WebApp template documentation](https://github.com/holidayextras/webapp-template#what-constitutes-a-feature-anyway).

This generator relies on your terminal's CWD to be in either the root or a child directory of a WebApp template project.
Inside your code directory a new directory will be created:

```
path/to/code
├ [featureName]
│ ├ controllers
│ │ └ [featureName]_controller.js
│ ├ style
│ │ └ main.less
│ ├ view_controllers
│ └ views
```

The generator intentionally does not provide files for each of the directories created.
This is because not all of the directories created will be required.
For instance you may not require the style directory, or at the time of your first commit you may not require a view_controller.
If this is the case then delete any non-required directories before committing.

This generator will also update your `code/index.js` file for your webapp to automatically tie the new feature into the app.

### Controllers
Inside the `controllers` directory you will find the `[featureName]_controller.js`.
This is the entry point for your feature and extends the [ampersand-router](https://github.com/ampersandjs/ampersand-router).
In here you can define the routes which your feature will serve and the implementation of these routes.
For instance, by default an index route is defined which outputs an html `div`, with the features name as a class value, into the document.body.

A controller will typically instantiate the data models and then use either the views or the view controllers to render the models on the page.

### Style
Here you can provide any styles for your feature. These should be written into `.less` files.
A `main.less` file is already provided to get you started.
In here you can provide style overrides specific to this feature.

### View_controllers
A view controller is responsible for user input within a certain portion of a page.
In doing so it should render views which control specific elements to be displayed.
They are required by the controllers and in turn require views.

### Views
A view is a small portion of the generated DOM to be rendered to the page. These can be built using the [ui-component generators](https://github.com/holidayextras/generator-ui-component)

## Installation
---

You will require some globally installed packages in order to effectively run the generators:

`npm i -g yo`

This will install the [Yeoman](http://yeoman.io/) tool.

Following this you can then install this generator directly from GitHub:

`npm i -g holidayextras/generator-webapp-feature`

## Usage
---

To run the generator you can simply run:

`yo`

This will bring up the Yeoman CLI which allows to select and run the `webapp-feature` as well as any other generators you may have installed.

Alternatively you can run the webapp-feature generator directly:

`yo webapp-feature`

You will be prompted for a name for your feature. The feature will then be installed into the `code` directory of the current app.

## Tests
---

To run the tests:

`npm test`

## Troubleshooting

## Updating webapp-template `code/index.js`

To do this it relies on two comment lines in the `code/index.js` file. 
To effectively use this generator it is suggested that you ensure that the following are present within your `code/index.js` file:

- `//====== yeoman requireHook =====//`
    
    for the require statement make sure the above is at the top of the file with the other calls to `require()`.
- `//===== yeoman controllerHook =====//`

    to automatically insert the controller into those used by the app ensure the above is written in the JSON object for the instantiation of `this.controllers = {}`.

These comments are required for the [Yeoman Hooks](http://remy.bach.me.uk/blog/2013/10/updating-existing-files-with-yeoman/) to update the file.
If they are not present the generator will not error, but you will have to manually update the `code/index.js` file.

*If you use the latest version of the webapp-template as the base of your app then the hooks should already be provided.*