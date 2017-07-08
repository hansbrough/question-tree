//The build will inline common dependencies in this file.

requirejs.config({
    baseUrl: '/assets/js',
    paths: {
        'text':'./lib/text',
        'jquery':'./lib/jquery-2.2.1.min',
        'underscore':'./lib/underscore-min',
        'backbone':'./lib/backbone-min',
        'marionette':'./lib/backbone.marionette',
        'backbone.radio':'./lib/backbone.radio',
        'marionette_overrides':'./lib/backbone.marionette.overrides',
        'handlebars':'./lib/handlebars.min',
        'handlebars_helpers':'./lib/handlebars/common.helpers',
        'mixins':'./lib/mixins'
    },
    shim: {
        'backbone': {
          deps: ['jquery', 'underscore'],
          exports: 'Backbone'
        },
        'backbone.marionette': {
          deps:['backbone']
        },
        'underscore': {
            exports: '_'
        }
    },
    inlineText: false
});
