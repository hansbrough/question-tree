/*-- MARIONETTE OVERRIDES and ADDITIONS--*/
define(['backbone','marionette','handlebars_helpers'], function (Backbone, Marionette, Handlebars) {
  Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
    //console.log("Marionette.TemplateCache.prototype.compileTemplate rawTemplate:",rawTemplate);
    //use handlebars instead of the default underscore
    return Handlebars.compile(rawTemplate);
  };

  Marionette.TemplateCache.storeTemplate = function (templateId, template) {
    //console.log("Backbone.Marionette.TemplateCache.storeTemplate: ",templateId);
    // compile template and store in cache
    template = Backbone.Marionette.TemplateCache.prototype.compileTemplate(template);
    if (templateId[0] != "#"){
      templateId = "#" + templateId;
    }
    var cachedTemplate = new Backbone.Marionette.TemplateCache(templateId);
    cachedTemplate.compiledTemplate = template;
    Backbone.Marionette.TemplateCache.templateCaches[templateId] = cachedTemplate;
  };

});
