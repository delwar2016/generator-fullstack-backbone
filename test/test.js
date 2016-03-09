/*global describe:true, beforeEach:true, it:true */
'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var helpers = yeoman.test;
var assert = yeoman.assert;
var fs = require('fs');
var test = require('./helper.js');

var config = [
    '{',
    '  "generator-fullstack-backbone": {',
    '    "appName": "Temp",',
    '    "includeRequireJS": false,',
    '    "includeModernizr": false,',
    '    "cssUILib": "sassBootstrap",',
    '    "serverRouteName": "api",',
    '    "entryIndex": "index.html"',
    '  }',
    '}'
].join('\n');
describe('test.js fullstack backbone generator ', function () {
    beforeEach(function (done) {
        var deps = [
            [helpers.createDummyGenerator(), 'mocha:app']
        ];
        helpers.run(path.join(__dirname, '../generators/app'))
            .inTmpDir(function () {
                fs.writeFileSync('.yo-rc.json', config);
            })
            .withArguments(['temp'])
            .withOptions({skipInstall: true})
            .withPrompts({
                features: ['modernizr'],
                cssUILib: 'sassMaterialize'
            })
            .withGenerators(deps)
            .on('end', done);
    });
    describe('create expected files', function () {
        it('check created files', function () {
            var expectedContent = [
                ['app/scripts/routes/all.js', /Views.Doctor/],
                ['bower.json', /"name": "Temp"/],
                ['Gruntfile.js', /'compass:server'/]
            ];
            var expected = [
                'app/404.html',
                'app/500.html',
                'app/favicon.ico',
                'app/robots.txt',
                '.gitignore',
                '.bowerrc',
                '.editorconfig',
                '.yo-rc.json',
                'app/scripts/main.js',
                'app/scripts/collections/doctors.js',
                'app/scripts/models/doctor.js',
                'app/scripts/views/doctor.js',
                'app/scripts/templates/doctor.ejs',
                'app/styles/sass/main.scss',
                'server/api/doctors/doctors.controller.js',
                'server/app.js',
                'server/config/express.js',
                'server/config/seed.js',
                'server/config/environment/development.js',
                'server/config/environment/index.js',
                'server/models/doctor.model.js',
                'test/app/collections/doctors.spec.js',
                'test/app/models/doctor.spec.js',
                'test/app/views/doctor.spec.js',
                'test/server/doctor.spec.js',
                'karma.conf.js',
                'pm2.json'
            ];

            assert.file(expected);
            assert.fileContent(expectedContent);
        });
    });

    describe('creates model', function () {
        it('without failure', function (done) {
            test.createSubGenerator(config, 'model', function () {
                var expectedContent = [
                    ['app/scripts/models/foo.js', /Models.Foo = Backbone.Model.extend\(\{/],
                    ['server/models/foo.model.js', /var FooSchema = new Schema\(\{/]
                ];
                assert.fileContent(expectedContent);
                done();
            });
        });
    });

    describe('creates collection', function () {
        it('without failure', function (done) {
            test.createSubGenerator(config, 'collection', function () {
                var expectedContent = [
                    ['app/scripts/collections/foos.js', /Collections.Foos = Backbone.Collection.extend\(\{/],
                    ['server/api/foos/index.js', /module.exports = router/],
                    ['server/routes/api.js', /app.use\(\'\/foos\'/]
                ];
                assert.fileContent(expectedContent);
                done();
            });
        });
    });
    describe('creates view', function () {
        it('without failure', function (done) {
            test.createSubGenerator(config, 'view', function () {
                var expectedContent = [
                    ['app/scripts/views/foo.js', /Views.Foo = Backbone.View.extend\(\{(.|\n)*app\/scripts\/templates\/foo.ejs/]
                ];
                assert.fileContent(expectedContent);
                assert.file('app/scripts/templates/foo.ejs');
            });
            done();
        });
    });
});
