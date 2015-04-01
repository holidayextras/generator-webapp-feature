var camelCase = require('camel-case');
var capitalize = require('capitalize');
var findParentDir = require('find-parent-dir');
var fs = require('fs');
var generators = require('yeoman-generator');
var path = require('path');
var snakeCase = require('snake-case');

module.exports = generators.Base.extend({
  
  initializing: function(){
    var destinationRootDirectory = findParentDir.sync(path.resolve('./'), 'package.json' );
    if(!destinationRootDirectory) this.env.error('Cannot find root of project (directory containing package.json file).');

    var codeDirectory = path.resolve(destinationRootDirectory, 'code');
    if(!fs.existsSync(codeDirectory)) this.env.error('Code directory does not exist in root of project.');
    
    // check code directory has an index.js file
    if(!fs.existsSync(path.join(codeDirectory, 'index.js'))) this.env.error('No index.js file found in code directory');
    
    this.destinationRoot(codeDirectory);
  },
  
  promptingName: function(){
    var done = this.async();
    
    this.prompt({
      type: 'input',
      name: 'name',
      message: 'feature name',
      validate: this._validateName
    }, function(answers){
      this.name = answers.name;
      done();
    }.bind(this));
  },
  
  configuringVariables: function(){
    this.snakeName = snakeCase(this.name);
    this.camelName = camelCase(this.name);
    this.capitalizedName = capitalize(this.camelName);
  },
  
  scaffoldDirectories: function(){
    this.mkdir(this.snakeName + '/controllers');
    this.mkdir(this.snakeName + '/style');
    this.mkdir(this.snakeName + '/view_controllers');
    this.mkdir(this.snakeName + '/views');
  },
  
  writingController: function(){
    this.fs.copyTpl(
      this.templatePath('feature_controller.js'),
      this.destinationPath(this.snakeName + '/controllers/' + this.snakeName + '_controller.js'),
      {name: this.name}
    );
  },
  
  writingMainLess: function(){
    this.fs.copyTpl(
      this.templatePath('main.less'),
      this.destinationPath(this.snakeName + '/style/main.less'),
      {name: this.name}
    );
  },
  
  writingIndexUpdate: function(){
    // update index with new feature
    var filePath = 'index.js';
    var indexContent = this.readFileAsString(filePath);
    
    var requireHook = '//====== yeoman requireHook =====//';
    var requireString = "var " + this.capitalizedName + "Controller = require('./" + this.snakeName + "/controllers/" + this.snakeName + "_controller');";
    
    var instantiateHook = '//===== yeoman controllerHook =====//';
    var instantiateString = this.camelName + "Controller: new " + this.capitalizedName + "Controller({instances: this.instances}),";
    
    if(indexContent.indexOf(requireString) === -1) {
      indexContent = indexContent.replace(requireHook, requireString + '\n' + requireHook);
    } else {
      this.log('Require statement for ' + this.name + 'already exists in code/index.js');
    }
    
    if(indexContent.indexOf(instantiateString) === -1) {
      indexContent = indexContent.replace(instantiateHook, instantiateString + '\n      ' + instantiateHook);
    } else {
      this.log('Instantiation of ' + this.capitalizedName + 'Controller already included in code/index.js');
    }
    
    this.writeFileFromString(indexContent, filePath);
  },
  
  _validateName: function(input){
    if(!input.match(/^[a-zA-Z\-]+$/)) return 'Feature name can only include letters and dashes "-"';
    return true;
  }
  
});