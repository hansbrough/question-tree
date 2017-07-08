/*
* Common handlebars helpers
*/
define([
  'handlebars'
  ],
  function(Handlebars){

  /* -- Register Handlebar Helpers--*/
  Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {
    if (arguments.length < 3){
      throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    var operator	= options.hash.operator || "==",
        result,
        operators	= {
          '==': function(l,r) { return l === r; },
          '===': function(l,r) { return l === r; },
          '!=': function(l,r) { return l !== r; },
          '<': function(l,r) { return l < r; },
          '>': function(l,r) { return l > r; },
          '<=': function(l,r) { return l <= r; },
          '>=': function(l,r) { return l >= r; },
          'typeof': function(l,r) { return typeof l === r; }
        };

    if (!operators[operator]){
      throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
    }

    result = operators[operator](lvalue,rvalue);

    if( result ) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }

  });

  Handlebars.registerHelper("uc", function(string_to_encode) {
    return encodeURIComponent(string_to_encode);
  });

  Handlebars.registerHelper('stripes', function (index) {
    return (index % 2 == 0 ? 'even' : 'odd');
  });

  Handlebars.registerHelper('nl2br', function (text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
  });

  Handlebars.registerHelper('addWhitelistedMarkup', function (text) {
    var urlPattern = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;
    var whitespacePattern = /(\r\n|\n|\r)/gm;

    //support line breaks by inserting br nodes
    text = Handlebars.escapeExpression(text);
    text = text.replace(whitespacePattern, '<br>');

    //wrap url's w/anchor
    text = text.replace(urlPattern, function(url){
      url = Handlebars.escapeExpression(url);
      return "<a href='" + url + "' target='_blank'>" + url + "</a>";
    });

    return new Handlebars.SafeString(text);
  });

  return Handlebars;

});
