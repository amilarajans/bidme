(function(){
UI.body.contentParts.push(UI.Component.extend({render: (function() {
  var self = this;
  return Spacebars.include(self.lookupTemplate("login"));
})}));
Meteor.startup(function () { if (! UI.body.INSTANTIATED) { UI.body.INSTANTIATED = true; UI.DomRange.insert(UI.render(UI.body).dom, document.body); } });

Template.__define__("login", (function() {
  var self = this;
  var template = this;
  return HTML.Raw('<div class="container">\n\n        <form class="form-signin" role="form">\n            <h2 class="form-signin-heading">Please sign in</h2>\n            <input type="email" class="form-control" placeholder="Email address" id="email" required="" autofocus="">\n            <input type="password" class="form-control" placeholder="Password" id="password" required="">\n            <!-- <label class="checkbox">\n                <input type="checkbox" value="remember-me">Remember me\n            </label> -->\n            <button class="btn btn-lg btn-primary btn-block" type="submit" id="login">Sign in</button>\n        </form>\n\n    </div>');
}));

})();
