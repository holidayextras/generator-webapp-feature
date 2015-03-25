var assert = require('yeoman-generator').assert;
var findParentDir = require('find-parent-dir');
var fs = require('fs');
var helpers = require('yeoman-generator').test;
var path = require('path');
var sinon = require('sinon');
var rmdir = require('rmdir');

describe('webapp-feature generator', function(){

  describe('running the generator', function(){
    beforeEach(function(done){
      helpers.testDirectory(path.join(__dirname, 'tmp'), function() {
        fs.mkdirSync('code');
        fs.writeFileSync('code/index.js', 'fooBar');
        fs.writeFileSync('package.json', JSON.stringify({name:'test project'}));
        
        done();
      });
    });
    
    afterEach(function(done){
      rmdir( path.join(__dirname, 'tmp'), done);
    });
    
    describe('when required', function(){
      var app;
      
      beforeEach(function(){
        app = require('../../../generators/app');
      });
      
      afterEach(function(){
        app = null;
      });
      
      it('does not throw an error', function(){
        assert.ok(app);
      });
    });
    
    describe('when inside a project with a code directory', function(){
      beforeEach(function(done){
        this.app = helpers.createGenerator('webapp-feature', [ '../../../../generators/app']);
  
        this.promptSpy = sinon.spy(this.app, 'prompt');
        helpers.mockPrompt(this.app, {
          name: 'test'
        });
        
        this.app.run();
        this.app.on('end', done)
      });
      
      afterEach(function(){
        this.promptSpy.restore();
      });
    
      describe('promptingName()', function(){
        it('should prompt for a feature name', function(){
          assert.equal(this.promptSpy.args[0][0].name, 'name');
        });
      });
      
      describe('scaffoldDirectories()', function(){
        it('should create feature directory', function(){
          assert.file(path.join(__dirname, 'tmp', 'code/test'));
        });
        it('should create feature controllers directory', function(){
          assert.file(path.join(__dirname, 'tmp', 'code/test/controllers'));
        });
        it('should create feature style directory', function(){
          assert.file(path.join(__dirname, 'tmp', 'code/test/style'));
        });
        it('should create feature view_controllers directory', function(){
          assert.file(path.join(__dirname, 'tmp', 'code/test/view_controllers'));
        });
        it('should create feature views directory', function(){
          assert.file(path.join(__dirname, 'tmp', 'code/test/views'));
        });
      });
      
      describe('writingController()', function(){
        var controllerPath = path.join(__dirname, 'tmp', 'code/test/controllers/testController.js');
        
        it('should create controller file', function(){
          assert.file(controllerPath);
        });
        it('should have the expected content', function(){
          var expectedContent = fs.readFileSync(path.resolve(__dirname,'../../fixtures/files/exampleController.js'));
          var actualContent = fs.readFileSync(controllerPath);
          assert.equal(actualContent.toString(), expectedContent.toString());
        });
      });
      
    });
    
    describe('when inside a direct with no parent directory containing a package.json file', function(){
      beforeEach(function(){
        this.errorCallback = sinon.spy();
  
        this.app = helpers.createGenerator('webapp-feature', [ '../../../../generators/app']);
        this.app.on('error', this.errorCallback);
        
        this.findParentDirSync = sinon.stub(findParentDir, 'sync').returns(null);
        this.app.run();
      });
      
      afterEach(function(){
        this.findParentDirSync.restore();
        this.errorCallback.reset();
      });
      
      describe('initialize()', function(){
        it('should error', function(){
          assert.ok(this.errorCallback.called);
        });
      });
    });
    
    describe('when inside a project with no code directory', function(){
      beforeEach(function(){
        this.errorCallback = sinon.spy();
  
        this.app = helpers.createGenerator('webapp-feature', [ '../../../../generators/app']);
        this.app.on('error', this.errorCallback);
        
        this.findParentDirSync = sinon.stub(findParentDir, 'sync').returns('some/fake/dir');
        this.fsExistsSync = sinon.stub(fs, 'existsSync').returns(false);
        this.app.run();
      });
      
      afterEach(function(){
        this.errorCallback.reset();
        this.findParentDirSync.restore();
        this.fsExistsSync.restore();
      });
      
      describe('initialize()', function(){
        it('should error', function(){
          assert.ok(this.errorCallback.called);
        });
      });
    });
    
    describe('when inside project with no code/index.js', function(){
      beforeEach(function(){
        this.errorCallback = sinon.spy();

        this.app = helpers.createGenerator('webapp-feature', [ '../../../../generators/app']);
        this.app.on('error', this.errorCallback);

        this.findParentDirSync = sinon.stub(findParentDir, 'sync').returns(null);
        this.fsExistsSync = sinon.stub(fs, 'existsSync');
        this.fsExistsSync.onFirstCall().returns(true); // code dir
        this.fsExistsSync.onSecondCall().returns(false); // code/index.js
        this.fsExistsSync.returns(true);
        
        this.app.run();
      });
      
      afterEach(function(){
        this.errorCallback.reset();
        this.findParentDirSync.restore();
        this.fsExistsSync.restore();
      });
      
      describe('initialize()', function(){
        it('should error', function(){
          assert.ok(this.errorCallback.called);
        });
      });
    });
  });
  
  describe('generator functions', function(){
    beforeEach(function(){
      this.app = helpers.createGenerator('webapp-feature', ['../../../../generators/app']);
    });
    
    describe('promptingName()', function(){
      beforeEach(function(){
        this.promptSpy = sinon.stub(this.app, 'prompt').callsArgWith(1, {name:'test'});
        this.app.promptingName();
      });
      
      afterEach(function(){
        this.promptSpy.restore();
      });
      
      it('calls this.prompt()', function(){
        assert.ok(this.promptSpy.called);  
      });
      
      it('assigns name to generator instance', function(){
        assert.equal(this.app.name, 'test');
      });
    });
    
    describe('configuringVariables()', function(){
      beforeEach(function(){
        this.app.name = 'foo-bar';
        this.app.configuringVariables();
      });
      
      it('assigns the camel cased name to generator instance', function(){
        assert.equal(this.app.camelName, 'fooBar');
      });
      
      it('assigns the capitalized version of the name to generator instance', function(){
        assert.equal(this.app.capitalizedName, 'FooBar');
      });
    });
    
    describe('scaffoldDirectories()', function(){
      beforeEach(function(){
        this.mkdirStub = sinon.stub(this.app, 'mkdir');
        this.app.camelName = 'fooBar';
        this.app.scaffoldDirectories();
      });
      
      it('calls mkdir for controllers dir', function(){
        assert.ok(this.mkdirStub.calledWith('fooBar/controllers'));
      });
      
      it('calls mkdir for style dir', function(){
        assert.ok(this.mkdirStub.calledWith('fooBar/style'));
      });
      it('calls mkdir for view_controllers dir', function(){
        assert.ok(this.mkdirStub.calledWith('fooBar/view_controllers'));
      });
      it('calls mkdir for views dir', function(){
        assert.ok(this.mkdirStub.calledWith('fooBar/views'));
      });
    });
    
    describe('writingController()', function(){
      beforeEach(function(){
        this.copyTplStub = sinon.stub(this.app.fs, 'copyTpl');
        this.app.name = 'foo-bar';
        this.app.camelName = 'fooBar';
        this.app.writingController();
      });

      it('calls copyTpl with controller template', function(){
        assert.ok(this.copyTplStub.args[0][0].match(/featureController\.js$/))
      });
      
      it('calls copyTpl with correct destination path', function(){
        assert.ok(this.copyTplStub.args[0][1].match(/fooBar\/controllers\/fooBarController\.js$/));
      });
      
      it('calls copyTpl with correct template variables', function(){
        assert.equal(JSON.stringify(this.copyTplStub.args[0][2]), JSON.stringify({name:'foo-bar'}));
      });
    });
    
    describe('_validateName()', function(){
      it('returns true if name is valid', function(){
        assert.ok(this.app._validateName('Perfectly-ValidName'));
      });
      
      it('returns an error message if the name is not valid', function(){
        assert.equal(this.app._validateName('1nV@lid_nam3'), 'Feature name can only include letters and dashes "-"');
      });
    });
    
    describe('writingIndexUpdate()', function(){
      beforeEach(function(){
        fs.mkdirSync(path.join(__dirname, 'tmp'));
        fs.mkdirSync(path.join(__dirname, 'tmp', 'code'));

        this.templateFilePath = path.resolve(__dirname,'../../fixtures/files/templateIndex.js');
        this.destinationFilePath =  path.resolve(__dirname, 'tmp/code/index.js')

        this.templateContent = fs.readFileSync(this.templateFilePath);
        fs.writeFileSync(this.destinationFilePath, this.templateContent);
        
        this.app.destinationRoot(path.join(__dirname, 'tmp', 'code'));
        
        this.app.camelName = 'testFeature';
        this.app.capitalizedName = 'TestFeature';
        
        this.app.writingIndexUpdate();
      });
      
      afterEach(function(done){
        rmdir( path.join(__dirname, 'tmp'), done);
      });
      
      it('updates the content of the index.js file', function(){
        this.expectedContent = fs.readFileSync(path.resolve(__dirname,'../../fixtures/files/expectedIndex.js'));
        this.actualContent = fs.readFileSync(this.destinationFilePath);
        assert.equal(this.actualContent.toString(), this.expectedContent.toString());
      });
    });
  });

});