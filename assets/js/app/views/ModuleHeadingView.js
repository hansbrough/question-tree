/* global window */
/*
* Search Results View
* includes dom node handler logic
*/

define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'marionette_overrides',
  'app/collections/moduleHeadingCollection',
  'text!'+_baseUrl+'/assets/js/app/templates/survey_heading.tmpl?noext'
  ],
  function($, _, Backbone, Marionette, overrides, Collection, headingTmpl){
    //compile and cache the template. register a partial for use in the template.
    Marionette.TemplateCache.storeTemplate('heading', headingTmpl);

    var CSS_FADEOUT      = 'fade-out',
        CSS_FADEIN       = 'fade-in',
        CSS_HIDE         = 'hidden';

    var treatmentsView = Marionette.View.extend({
        template: Marionette.TemplateCache.get('#heading'),
        initialize: function(options){
          //console.log("HeadingView initialize: ",options);
          options = options || {};
          this.collection = new Collection();
          this.currentModule  = options.defaultModule || 'introduction';
          this.listenTo(this.collection, "reset", this.render);

          _.bindAll(this,'initialize','render');
        },
        render: function(model){
          //console.log("render header view");
          var payload     = model.toJSON(),
              nextModId   = payload[0].id,
              currModId   = this.currentModule,
              $container  = this.$el,
              templFunc   = this.template,
              $prevHead   = $container.find('.module.title');
          //console.log("...",currModId," ",nextModId );
          //inject properties to change tmpl rendering.
          payload[0].classNames = CSS_HIDE;

          $prevHead.addClass(CSS_FADEOUT).removeClass(CSS_FADEIN).removeClass(CSS_HIDE);
          //replace header with new header in a faded out state, then fade in.
          window.setTimeout(function(){
            $container.removeClass(currModId).addClass(nextModId);
            $prevHead.replaceWith( templFunc({RESULTS: payload}) );
            $container.find('.module.title').addClass(CSS_FADEIN);
          }, 200);

          this.currentModule = nextModId;
        }

    });
    // Our module now returns our view
    return treatmentsView;
});
