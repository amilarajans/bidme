(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages\blaze-layout\template.layout-test.js                                                          //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
                                                                                                          // 1
Template.__define__("LayoutOne", (function() {                                                            // 2
  var self = this;                                                                                        // 3
  var template = this;                                                                                    // 4
  return "one";                                                                                           // 5
}));                                                                                                      // 6
                                                                                                          // 7
Template.__define__("LayoutTwo", (function() {                                                            // 8
  var self = this;                                                                                        // 9
  var template = this;                                                                                    // 10
  return "two";                                                                                           // 11
}));                                                                                                      // 12
                                                                                                          // 13
Template.__define__("LayoutWithData", (function() {                                                       // 14
  var self = this;                                                                                        // 15
  var template = this;                                                                                    // 16
  return [ "layout ", function() {                                                                        // 17
    return Spacebars.mustache(self.lookup("title"));                                                      // 18
  } ];                                                                                                    // 19
}));                                                                                                      // 20
                                                                                                          // 21
Template.__define__("LayoutWithDataAndYields", (function() {                                              // 22
  var self = this;                                                                                        // 23
  var template = this;                                                                                    // 24
  return [ "layout ", function() {                                                                        // 25
    return Spacebars.mustache(self.lookup("title"));                                                      // 26
  }, "\n  ", Spacebars.include(self.lookupTemplate("yield")), "\n  ", Spacebars.TemplateWith(function() { // 27
    return {                                                                                              // 28
      region: Spacebars.call("footer")                                                                    // 29
    };                                                                                                    // 30
  }, UI.block(function() {                                                                                // 31
    var self = this;                                                                                      // 32
    return Spacebars.include(self.lookupTemplate("yield"));                                               // 33
  })) ];                                                                                                  // 34
}));                                                                                                      // 35
                                                                                                          // 36
Template.__define__("LayoutWithOneYield", (function() {                                                   // 37
  var self = this;                                                                                        // 38
  var template = this;                                                                                    // 39
  return [ "layout\n", Spacebars.include(self.lookupTemplate("yield")) ];                                 // 40
}));                                                                                                      // 41
                                                                                                          // 42
Template.__define__("LayoutWithTwoYields", (function() {                                                  // 43
  var self = this;                                                                                        // 44
  var template = this;                                                                                    // 45
  return [ Spacebars.include(self.lookupTemplate("yield")), "\n", Spacebars.TemplateWith(function() {     // 46
    return {                                                                                              // 47
      region: Spacebars.call("footer")                                                                    // 48
    };                                                                                                    // 49
  }, UI.block(function() {                                                                                // 50
    var self = this;                                                                                      // 51
    return Spacebars.include(self.lookupTemplate("yield"));                                               // 52
  })) ];                                                                                                  // 53
}));                                                                                                      // 54
                                                                                                          // 55
Template.__define__("ChildWithData", (function() {                                                        // 56
  var self = this;                                                                                        // 57
  var template = this;                                                                                    // 58
  return [ "child ", function() {                                                                         // 59
    return Spacebars.mustache(self.lookup("title"));                                                      // 60
  } ];                                                                                                    // 61
}));                                                                                                      // 62
                                                                                                          // 63
Template.__define__("FooterWithData", (function() {                                                       // 64
  var self = this;                                                                                        // 65
  var template = this;                                                                                    // 66
  return [ "footer ", function() {                                                                        // 67
    return Spacebars.mustache(self.lookup("title"));                                                      // 68
  } ];                                                                                                    // 69
}));                                                                                                      // 70
                                                                                                          // 71
Template.__define__("One", (function() {                                                                  // 72
  var self = this;                                                                                        // 73
  var template = this;                                                                                    // 74
  return "one";                                                                                           // 75
}));                                                                                                      // 76
                                                                                                          // 77
Template.__define__("Two", (function() {                                                                  // 78
  var self = this;                                                                                        // 79
  var template = this;                                                                                    // 80
  return "two";                                                                                           // 81
}));                                                                                                      // 82
                                                                                                          // 83
Template.__define__("DefaultMainRegion", (function() {                                                    // 84
  var self = this;                                                                                        // 85
  var template = this;                                                                                    // 86
  return Spacebars.include(self.lookupTemplate("Layout"), UI.block(function() {                           // 87
    var self = this;                                                                                      // 88
    return "\n    ok\n  ";                                                                                // 89
  }));                                                                                                    // 90
}));                                                                                                      // 91
                                                                                                          // 92
Template.__define__("ContentForTests", (function() {                                                      // 93
  var self = this;                                                                                        // 94
  var template = this;                                                                                    // 95
  return [ "main\n  ", Spacebars.TemplateWith(function() {                                                // 96
    return {                                                                                              // 97
      region: Spacebars.call("footer")                                                                    // 98
    };                                                                                                    // 99
  }, UI.block(function() {                                                                                // 100
    var self = this;                                                                                      // 101
    return Spacebars.include(self.lookupTemplate("contentFor"), UI.block(function() {                     // 102
      var self = this;                                                                                    // 103
      return "\n    footer\n  ";                                                                          // 104
    }));                                                                                                  // 105
  })) ];                                                                                                  // 106
}));                                                                                                      // 107
                                                                                                          // 108
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages\blaze-layout\layout-test.js                                                                   //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
String.prototype.compact = function () {                                                                  // 1
  return this.trim().replace(/\s/g, '').replace(/\n/g, '');                                               // 2
};                                                                                                        // 3
                                                                                                          // 4
var renderComponent = function (cmp, parent, props) {                                                     // 5
  var inst = UI.render(cmp.extend(props || {}));                                                          // 6
  UI.DomRange.insert(inst.dom, parent);                                                                   // 7
  return inst;                                                                                            // 8
};                                                                                                        // 9
                                                                                                          // 10
var renderLayout = function (parent, props) {                                                             // 11
  return renderComponent(Layout, parent, props);                                                          // 12
};                                                                                                        // 13
                                                                                                          // 14
var withRenderedComponent = function (cmp, props, cb) {                                                   // 15
  if (arguments.length < 3) {                                                                             // 16
    cb = props;                                                                                           // 17
    props = {};                                                                                           // 18
  }                                                                                                       // 19
                                                                                                          // 20
  var screen = document.createElement('div');                                                             // 21
  document.body.appendChild(screen);                                                                      // 22
  var inst = renderComponent(cmp, screen, props);                                                         // 23
                                                                                                          // 24
  try {                                                                                                   // 25
    cb(inst, screen);                                                                                     // 26
  } finally {                                                                                             // 27
    document.body.removeChild(screen);                                                                    // 28
  }                                                                                                       // 29
};                                                                                                        // 30
                                                                                                          // 31
var withRenderedLayout = function (props, cb) {                                                           // 32
  if (arguments.length < 2) {                                                                             // 33
    cb = props;                                                                                           // 34
    props = {};                                                                                           // 35
  }                                                                                                       // 36
                                                                                                          // 37
  var screen = document.createElement('div');                                                             // 38
  document.body.appendChild(screen);                                                                      // 39
  var inst = renderLayout(screen, props);                                                                 // 40
                                                                                                          // 41
  try {                                                                                                   // 42
    cb(inst, screen);                                                                                     // 43
  } finally {                                                                                             // 44
    document.body.removeChild(screen);                                                                    // 45
  }                                                                                                       // 46
};                                                                                                        // 47
                                                                                                          // 48
Tinytest.add('layout - rendering dynamic templates', function (test) {                                    // 49
  withRenderedLayout({template: 'LayoutOne'}, function (layout, screen) {                                 // 50
    test.equal(screen.innerHTML.trim(), 'one', 'initial layout template not rendered');                   // 51
                                                                                                          // 52
    layout.template('LayoutTwo');                                                                         // 53
    Deps.flush();                                                                                         // 54
    test.equal(screen.innerHTML.trim(), 'two', 'calling template method should change layout template');  // 55
  });                                                                                                     // 56
});                                                                                                       // 57
                                                                                                          // 58
Tinytest.add('layout - dynamic data', function (test) {                                                   // 59
  withRenderedLayout({template: 'LayoutWithData'}, function (layout, screen) {                            // 60
    var renderCount = 1;                                                                                  // 61
                                                                                                          // 62
    layout.rendered = function () {                                                                       // 63
      renderCount++;                                                                                      // 64
    };                                                                                                    // 65
                                                                                                          // 66
    test.equal(renderCount, 1, 'layout should have only rendered once');                                  // 67
    test.equal(screen.innerHTML.trim(), 'layout', 'initial layout not rendered');                         // 68
                                                                                                          // 69
    layout.setData({title: 'test'});                                                                      // 70
    Deps.flush();                                                                                         // 71
    test.equal(screen.innerHTML.trim(), 'layout test', 'layout data context not changed');                // 72
                                                                                                          // 73
    test.equal(renderCount, 1, 'layout should have only rendered once');                                  // 74
  });                                                                                                     // 75
});                                                                                                       // 76
                                                                                                          // 77
Tinytest.add('layout - yield into main region with default layout', function (test) {                     // 78
  withRenderedLayout(function (layout, screen) {                                                          // 79
    layout.setRegion('One');                                                                              // 80
    Deps.flush();                                                                                         // 81
    test.equal(screen.innerHTML.trim(), 'one', 'could not render into main region with default layout');  // 82
  });                                                                                                     // 83
});                                                                                                       // 84
                                                                                                          // 85
Tinytest.add('layout - default main region using Layout template', function (test) {                      // 86
  withRenderedComponent(Template.DefaultMainRegion, function (cmp, screen) {                              // 87
    test.equal(screen.innerHTML.trim(), 'ok', 'default main region should be __content');                 // 88
  });                                                                                                     // 89
});                                                                                                       // 90
                                                                                                          // 91
Tinytest.add('layout - dynamic yield regions', function (test) {                                          // 92
  withRenderedLayout({template: 'LayoutWithTwoYields'}, function (layout, screen) {                       // 93
    var renderedCount = 1;                                                                                // 94
    layout.rendered = function () { renderedCount++; };                                                   // 95
                                                                                                          // 96
    var oneRenderCount = 0;                                                                               // 97
    Template.One.rendered = function () { oneRenderCount++; };                                            // 98
                                                                                                          // 99
    layout.setRegion('One');                                                                              // 100
    Deps.flush();                                                                                         // 101
    test.equal(screen.innerHTML.compact(), 'one', 'main region should be "one"');                         // 102
    test.equal(oneRenderCount, 1, 'template should have been rendered into layout');                      // 103
                                                                                                          // 104
    // should be equivalent to above                                                                      // 105
    layout.setRegion('main', 'One');                                                                      // 106
    Deps.flush();                                                                                         // 107
    test.equal(screen.innerHTML.compact(), 'one', 'main region should be "one"');                         // 108
    test.equal(oneRenderCount, 1, 'template already rendered so should not be rendered again');           // 109
                                                                                                          // 110
    layout.setRegion('footer', 'Two');                                                                    // 111
    Deps.flush();                                                                                         // 112
    test.equal(screen.innerHTML.compact(), 'onetwo', 'both yield regions should have rendered');          // 113
  });                                                                                                     // 114
});                                                                                                       // 115
                                                                                                          // 116
Tinytest.add('layout - contentFor helper', function (test) {                                              // 117
  withRenderedLayout({template: 'LayoutWithTwoYields'}, function (layout, screen) {                       // 118
    layout.setRegion('ContentForTests');                                                                  // 119
    Deps.flush();                                                                                         // 120
    test.equal(screen.innerHTML.compact(), 'mainfooter', 'contentFor helper should render into yield');   // 121
  });                                                                                                     // 122
});                                                                                                       // 123
                                                                                                          // 124
Tinytest.add('layout - global layout data context', function (test) {                                     // 125
  withRenderedLayout({template: 'LayoutWithData'}, function (layout, screen) {                            // 126
    var layoutRenderCount = 1;                                                                            // 127
    layout.rendered = function () { layoutRenderCount++; };                                               // 128
    test.equal(screen.innerHTML.compact(), 'layout');                                                     // 129
                                                                                                          // 130
    layout.setData({title:'1'});                                                                          // 131
    Deps.flush();                                                                                         // 132
    test.equal(screen.innerHTML.compact(), 'layout1', 'data context should be set on layout');            // 133
    test.equal(layoutRenderCount, 1, 'layout should not re-render');                                      // 134
                                                                                                          // 135
    layout.setData({title:'2'});                                                                          // 136
    Deps.flush();                                                                                         // 137
    test.equal(screen.innerHTML.compact(), 'layout2', 'data context should be set on layout');            // 138
    test.equal(layoutRenderCount, 1, 'layout should not re-render');                                      // 139
  });                                                                                                     // 140
});                                                                                                       // 141
                                                                                                          // 142
Tinytest.add('layout - data with yield regions', function (test) {                                        // 143
  withRenderedLayout({template: 'LayoutWithDataAndYields'}, function (layout, screen) {                   // 144
    var layoutRenderCount = 1;                                                                            // 145
    layout.rendered = function () { layoutRenderCount++; };                                               // 146
                                                                                                          // 147
    var childRenderCount = 0;                                                                             // 148
    var footerRenderCount = 0;                                                                            // 149
    Template.ChildWithData.rendered = function () { childRenderCount++; };                                // 150
    Template.FooterWithData.rendered = function () { footerRenderCount++; };                              // 151
                                                                                                          // 152
    layout.setRegion('main', 'ChildWithData');                                                            // 153
    layout.setRegion('footer', 'FooterWithData');                                                         // 154
    Deps.flush();                                                                                         // 155
                                                                                                          // 156
    test.equal(childRenderCount, 1);                                                                      // 157
    test.equal(footerRenderCount, 1);                                                                     // 158
    test.equal(layoutRenderCount, 1);                                                                     // 159
    test.equal(screen.innerHTML.compact(), 'layoutchildfooter');                                          // 160
                                                                                                          // 161
    layout.setData({title:'1'});                                                                          // 162
    Deps.flush();                                                                                         // 163
                                                                                                          // 164
    test.equal(childRenderCount, 1);                                                                      // 165
    test.equal(footerRenderCount, 1);                                                                     // 166
    test.equal(layoutRenderCount, 1);                                                                     // 167
    test.equal(screen.innerHTML.compact(), 'layout1child1footer1');                                       // 168
                                                                                                          // 169
    layout.setData({title:'2'});                                                                          // 170
    Deps.flush();                                                                                         // 171
                                                                                                          // 172
    test.equal(childRenderCount, 1);                                                                      // 173
    test.equal(footerRenderCount, 1);                                                                     // 174
    test.equal(layoutRenderCount, 1);                                                                     // 175
    test.equal(screen.innerHTML.compact(), 'layout2child2footer2');                                       // 176
  });                                                                                                     // 177
});                                                                                                       // 178
                                                                                                          // 179
Tinytest.add('layout - layout template not found in lookup', function (test) {                            // 180
  var div = document.createElement('div');                                                                // 181
  document.body.appendChild(div);                                                                         // 182
                                                                                                          // 183
  try {                                                                                                   // 184
    var layout;                                                                                           // 185
                                                                                                          // 186
    test.throws(function () {                                                                             // 187
      layout = renderComponent(Layout, div, {                                                             // 188
        template: 'SomeBogusTemplateThatDoesNotExist'                                                     // 189
      });                                                                                                 // 190
    }, /BlazeLayout/); // this checks the error is a BlazeLayout error                                    // 191
                                                                                                          // 192
  } finally {                                                                                             // 193
    document.body.removeChild(div);                                                                       // 194
  }                                                                                                       // 195
});                                                                                                       // 196
                                                                                                          // 197
Tinytest.add('layout - region templates not found in lookup', function (test) {                           // 198
  var div = document.createElement('div');                                                                // 199
  document.body.appendChild(div);                                                                         // 200
                                                                                                          // 201
  try {                                                                                                   // 202
    var layout = renderComponent(Layout, div);                                                            // 203
                                                                                                          // 204
    test.throws(function () {                                                                             // 205
      layout.setRegion('SomeBogusTemplate');                                                              // 206
      // _throwFirstError means it will actually throw                                                    // 207
      // instead of just logging to the console                                                           // 208
      Deps.flush({_throwFirstError: true});                                                               // 209
    }, /BlazeLayout/);                                                                                    // 210
                                                                                                          // 211
  } finally {                                                                                             // 212
    document.body.removeChild(div);                                                                       // 213
  }                                                                                                       // 214
});                                                                                                       // 215
                                                                                                          // 216
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
