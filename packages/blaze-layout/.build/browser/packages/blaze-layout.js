(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages\blaze-layout\layout.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//XXX Infinite loop issue in this circumstance:                                                                       // 1
// {{#Layout template="MyLayout"}}                                                                                    // 2
//  {{> yield}}                                                                                                       // 3
// {{/Layout}}                                                                                                        // 4
//                                                                                                                    // 5
// because content does a yield lookup for the main region, which in turn                                             // 6
// yields, which results in a stack overflow.                                                                         // 7
                                                                                                                      // 8
var isLogging = false;                                                                                                // 9
                                                                                                                      // 10
var log = function (msg) {                                                                                            // 11
  if (!isLogging)                                                                                                     // 12
    return;                                                                                                           // 13
                                                                                                                      // 14
  if (arguments.length > 1)                                                                                           // 15
    msg = _.toArray(arguments).join(' ');                                                                             // 16
  console.log('%c<BlazeLayout> ' + msg, 'color: green; font-weight: bold; font-size: 1.3em;');                        // 17
};                                                                                                                    // 18
                                                                                                                      // 19
/*****************************************************************************/                                       // 20
/* Meteor Functions */                                                                                                // 21
/*                                                                                                                    // 22
 * These are copied from Core because we need to throw an error at lookup time                                        // 23
 * if a template is not found. The Component.lookup method does not give us a                                         // 24
 * way to do that. We should construct a proper pull request and send to Meteor.                                      // 25
 * Probably the ability to pass a not found callback or something to the lookup                                       // 26
 * method as an option.                                                                                               // 27
/*****************************************************************************/                                       // 28
var findComponentWithProp = function (id, comp) {                                                                     // 29
  while (comp) {                                                                                                      // 30
    if (typeof comp[id] !== 'undefined')                                                                              // 31
      return comp;                                                                                                    // 32
    comp = comp.parent;                                                                                               // 33
  }                                                                                                                   // 34
  return null;                                                                                                        // 35
};                                                                                                                    // 36
                                                                                                                      // 37
var getComponentData = function (comp) {                                                                              // 38
  comp = findComponentWithProp('data', comp);                                                                         // 39
  return (comp ?                                                                                                      // 40
          (typeof comp.data === 'function' ?                                                                          // 41
           comp.data() : comp.data) :                                                                                 // 42
          null);                                                                                                      // 43
};                                                                                                                    // 44
/*****************************************************************************/                                       // 45
/* End Meteor Functions */                                                                                            // 46
/*****************************************************************************/                                       // 47
                                                                                                                      // 48
/**                                                                                                                   // 49
 * Find a template object.                                                                                            // 50
 *                                                                                                                    // 51
 * Similar to Component.lookupTemplate with two differences:                                                          // 52
 *                                                                                                                    // 53
 * 1. Throw an error if we can't find the template. This is useful in debugging                                       // 54
 * vs. silently failing.                                                                                              // 55
 *                                                                                                                    // 56
 * 2. If the template is a property on the component, don't call                                                      // 57
 * getComponentData(self), thereby creating an unnecessary data dependency. This                                      // 58
 * was initially causing problems with {{> yield}}                                                                    // 59
 */                                                                                                                   // 60
var lookupTemplate = function (name) {                                                                                // 61
  // self should be an instance of Layout                                                                             // 62
  var self = this;                                                                                                    // 63
  var comp;                                                                                                           // 64
  var result;                                                                                                         // 65
  var contentBlocksByRegion = self._contentBlocksByRegion;                                                            // 66
                                                                                                                      // 67
  if (!name)                                                                                                          // 68
    throw new Error("BlazeLayout: You must pass a name to lookupTemplate");                                           // 69
                                                                                                                      // 70
  if (contentBlocksByRegion[name]) {                                                                                  // 71
    result = contentBlocksByRegion[name];                                                                             // 72
  } else if ((comp = findComponentWithProp(name, self))) {                                                            // 73
    result = comp[name];                                                                                              // 74
  } else if (_.has(Template, name)) {                                                                                 // 75
    result = Template[name];                                                                                          // 76
  } else if (result = UI._globalHelper(name)) {}                                                                      // 77
                                                                                                                      // 78
  if (typeof result === 'function' && !result._isEmboxedConstant) {                                                   // 79
    return function (/* args */ ) {                                                                                   // 80
      // modified from Core to call function in context of the                                                        // 81
      // component, not a data context.                                                                               // 82
      return result.apply(self, arguments);                                                                           // 83
    }                                                                                                                 // 84
  } else if (result) {                                                                                                // 85
    return result                                                                                                     // 86
  } else {                                                                                                            // 87
    throw new Error("BlazeLayout: Sorry, couldn't find a template named " + name + ". Are you sure you defined it?"); // 88
  }                                                                                                                   // 89
}                                                                                                                     // 90
                                                                                                                      // 91
Layout = UI.Component.extend({                                                                                        // 92
  kind: 'Layout',                                                                                                     // 93
                                                                                                                      // 94
  init: function () {                                                                                                 // 95
    var self = this;                                                                                                  // 96
                                                                                                                      // 97
    var layout = this;                                                                                                // 98
                                                                                                                      // 99
    var tmpl = Deps.nonreactive(function () {                                                                         // 100
      return self.get('template') || self.template || '_defaultLayout';                                               // 101
    });                                                                                                               // 102
                                                                                                                      // 103
    var tmplDep = new Deps.Dependency;                                                                                // 104
                                                                                                                      // 105
    // get the initial data value                                                                                     // 106
    var data = Deps.nonreactive(function () { return self.get(); });                                                  // 107
    var dataDep = new Deps.Dependency;                                                                                // 108
    var regions = this._regions = new ReactiveDict;                                                                   // 109
    var content = this.__content;                                                                                     // 110
                                                                                                                      // 111
    // a place to put content defined like this:                                                                      // 112
    // {{#contentFor region="footer"}}content{{/contentFor}}                                                          // 113
    // this will be searched in the lookup chain.                                                                     // 114
    var contentBlocksByRegion = this._contentBlocksByRegion = {};                                                     // 115
                                                                                                                      // 116
    /**                                                                                                               // 117
    * instance methods                                                                                                // 118
    */                                                                                                                // 119
                                                                                                                      // 120
    this.template = function (value) {                                                                                // 121
      if (typeof value !== 'undefined') {                                                                             // 122
                                                                                                                      // 123
        // make sure we convert false and null                                                                        // 124
        // values to the _defaultLayout so when                                                                       // 125
        // we compare to our existing template                                                                        // 126
        // we don't re-render the default layout                                                                      // 127
        // unnecessarily.                                                                                             // 128
        // XXX this is a problem becuase this _defaultLayout                                                          // 129
        // will never get found becuase it's a helper on the layout                                                   // 130
        // instance                                                                                                   // 131
        if (value === false || value === null)                                                                        // 132
          value = '_defaultLayout';                                                                                   // 133
                                                                                                                      // 134
        if (!EJSON.equals(value, tmpl)) {                                                                             // 135
          tmpl = value;                                                                                               // 136
          tmplDep.changed();                                                                                          // 137
        }                                                                                                             // 138
      } else {                                                                                                        // 139
        tmplDep.depend();                                                                                             // 140
        //XXX changed to just return tmpl instead                                                                     // 141
        //of a _defaultLayout                                                                                         // 142
        return tmpl;                                                                                                  // 143
      }                                                                                                               // 144
    };                                                                                                                // 145
                                                                                                                      // 146
    var emboxedData = UI.emboxValue(function () {                                                                     // 147
      log('return data()');                                                                                           // 148
      dataDep.depend();                                                                                               // 149
      return data;                                                                                                    // 150
    });                                                                                                               // 151
                                                                                                                      // 152
    this.setData = function (value) {                                                                                 // 153
      log('setData', value);                                                                                          // 154
      if (!EJSON.equals(value, data)) {                                                                               // 155
        data = value;                                                                                                 // 156
        dataDep.changed();                                                                                            // 157
      }                                                                                                               // 158
    };                                                                                                                // 159
                                                                                                                      // 160
    this.getData = function () {                                                                                      // 161
      return emboxedData();                                                                                           // 162
    };                                                                                                                // 163
                                                                                                                      // 164
    this.data = function () {                                                                                         // 165
      return self.getData();                                                                                          // 166
    };                                                                                                                // 167
                                                                                                                      // 168
    /**                                                                                                               // 169
     * Set a region template.                                                                                         // 170
     *                                                                                                                // 171
     * If you want to get the template for a region                                                                   // 172
     * you need to call this._regions.get('key');                                                                     // 173
     *                                                                                                                // 174
     */                                                                                                               // 175
    this.setRegion = function (key, value) {                                                                          // 176
      if (arguments.length < 2) {                                                                                     // 177
        value = key;                                                                                                  // 178
        key = 'main';                                                                                                 // 179
      } else if (typeof key === 'undefined') {                                                                        // 180
        key = 'main';                                                                                                 // 181
      }                                                                                                               // 182
                                                                                                                      // 183
      regions.set(key, value);                                                                                        // 184
    };                                                                                                                // 185
                                                                                                                      // 186
    //TODO add test                                                                                                   // 187
    this.getRegionKeys = function () {                                                                                // 188
      return _.keys(regions.keys);                                                                                    // 189
    };                                                                                                                // 190
                                                                                                                      // 191
    //TODO add test                                                                                                   // 192
    this.clearRegion = function (key) {                                                                               // 193
      regions.set(key, null);                                                                                         // 194
    };                                                                                                                // 195
                                                                                                                      // 196
    // define a yield region to render templates into                                                                 // 197
    this.yield = UI.Component.extend({                                                                                // 198
      init: function () {                                                                                             // 199
        var self = this;                                                                                              // 200
                                                                                                                      // 201
        var data = Deps.nonreactive(function () { return self.get(); });                                              // 202
        var region;                                                                                                   // 203
                                                                                                                      // 204
        if (_.isString(data))                                                                                         // 205
          region = data;                                                                                              // 206
        else if (_.isObject(data))                                                                                    // 207
          region = data.region || 'main';                                                                             // 208
        else                                                                                                          // 209
          region = 'main';                                                                                            // 210
                                                                                                                      // 211
        self.region = region;                                                                                         // 212
                                                                                                                      // 213
        // reset the data function to use the layout's                                                                // 214
        // data                                                                                                       // 215
        this.data = function () {                                                                                     // 216
          return layout.getData();                                                                                    // 217
        };                                                                                                            // 218
      },                                                                                                              // 219
                                                                                                                      // 220
      render: function () {                                                                                           // 221
        var self = this;                                                                                              // 222
        var region = self.region;                                                                                     // 223
                                                                                                                      // 224
        // returning a function tells UI.materialize to                                                               // 225
        // create a computation. then, if the region template                                                         // 226
        // changes, this comp will be rerun and the new template                                                      // 227
        // will get put on the screen.                                                                                // 228
        return function () {                                                                                          // 229
          var regions = layout._regions;                                                                              // 230
          // create a reactive dep                                                                                    // 231
          var tmpl = regions.get(region);                                                                             // 232
                                                                                                                      // 233
          if (tmpl)                                                                                                   // 234
            return lookupTemplate.call(layout, tmpl);                                                                 // 235
          else if (region === 'main' && content) {                                                                    // 236
            return content;                                                                                           // 237
          }                                                                                                           // 238
          else                                                                                                        // 239
            return null;                                                                                              // 240
        };                                                                                                            // 241
      }                                                                                                               // 242
    });                                                                                                               // 243
                                                                                                                      // 244
    // render content into a yield region using markup. when you call setRegion                                       // 245
    // manually, you specify a string, not a content block. And the                                                   // 246
    // lookupTemplate method uses this string name to find the template. Since                                        // 247
    // contentFor creates anonymous content we need a way to add this into the                                        // 248
    // lookup chain. But then we need to destroy it if it's not used anymore.                                         // 249
    // not sure how to do this.                                                                                       // 250
    this.contentFor = UI.Component.extend({                                                                           // 251
      init: function () {                                                                                             // 252
        var self = this;                                                                                              // 253
        var data = Deps.nonreactive(function () { return self.get(); });                                              // 254
                                                                                                                      // 255
        var region;                                                                                                   // 256
                                                                                                                      // 257
        if (_.isString(data))                                                                                         // 258
          region = data;                                                                                              // 259
        else if (_.isObject(data))                                                                                    // 260
          region = data.region;                                                                                       // 261
                                                                                                                      // 262
        self.region = region;                                                                                         // 263
                                                                                                                      // 264
        if (!region)                                                                                                  // 265
          throw new Error("{{#contentFor}} requires a region argument like this: {{#contentFor region='footer'}}");   // 266
      },                                                                                                              // 267
                                                                                                                      // 268
      render: function () {                                                                                           // 269
        var self = this;                                                                                              // 270
        var region = self.region;                                                                                     // 271
                                                                                                                      // 272
        var contentBlocksByRegion = layout._contentBlocksByRegion;                                                    // 273
                                                                                                                      // 274
        if (contentBlocksByRegion[region]) {                                                                          // 275
          delete contentBlocksByRegion[region];                                                                       // 276
        }                                                                                                             // 277
                                                                                                                      // 278
        // store away the content block so we can find it during lookup                                               // 279
        // which happens in the yield function.                                                                       // 280
        contentBlocksByRegion[region] = self.__content;                                                               // 281
                                                                                                                      // 282
        // this will just set the region to itself but when the lookupTemplate                                        // 283
        // function searches it will check contentBlocksByRegion first, so we'll                                      // 284
        // find the content block there.                                                                              // 285
        layout.setRegion(region, region);                                                                             // 286
                                                                                                                      // 287
        // don't render anything for now. let the yield template control this.                                        // 288
        return null;                                                                                                  // 289
      }                                                                                                               // 290
    });                                                                                                               // 291
                                                                                                                      // 292
    this._defaultLayout = function () {                                                                               // 293
      return UI.block(function () {                                                                                   // 294
        return lookupTemplate.call(layout, 'yield');                                                                  // 295
      });                                                                                                             // 296
    };                                                                                                                // 297
  },                                                                                                                  // 298
                                                                                                                      // 299
  render: function () {                                                                                               // 300
    var self = this;                                                                                                  // 301
    // return a function to create a reactive                                                                         // 302
    // computation. so if the template changes                                                                        // 303
    // the layout is re-endered.                                                                                      // 304
    return function () {                                                                                              // 305
      // reactive                                                                                                     // 306
      var tmplName = self.template();                                                                                 // 307
                                                                                                                      // 308
      //XXX hack to make work with null/false values.                                                                 // 309
      //see this.template = in ctor function.                                                                         // 310
      if (tmplName === '_defaultLayout')                                                                              // 311
        return self._defaultLayout;                                                                                   // 312
      else if (tmplName) {                                                                                            // 313
        return lookupTemplate.call(self, tmplName);                                                                   // 314
      }                                                                                                               // 315
      else {                                                                                                          // 316
        return self['yield'];                                                                                         // 317
      }                                                                                                               // 318
    };                                                                                                                // 319
  }                                                                                                                   // 320
});                                                                                                                   // 321
                                                                                                                      // 322
/**                                                                                                                   // 323
 * Put Layout into the template lookup chain so                                                                       // 324
 * we can do this:                                                                                                    // 325
 * {{#Layout template="MyLayout"}}                                                                                    // 326
 *  Some content                                                                                                      // 327
 * {{/Layout}}                                                                                                        // 328
 */                                                                                                                   // 329
Template.Layout = Layout;                                                                                             // 330
                                                                                                                      // 331
BlazeUIManager = function (router) {                                                                                  // 332
  var self = this;                                                                                                    // 333
  this.router = router;                                                                                               // 334
  this._component = null;                                                                                             // 335
                                                                                                                      // 336
  _.each([                                                                                                            // 337
    'setRegion',                                                                                                      // 338
    'clearRegion',                                                                                                    // 339
    'getRegionKeys',                                                                                                  // 340
    'getData',                                                                                                        // 341
    'setData'                                                                                                         // 342
  ], function (method) {                                                                                              // 343
    self[method] = function () {                                                                                      // 344
      if (self._component) {                                                                                          // 345
        return self._component[method].apply(this, arguments);                                                        // 346
      }                                                                                                               // 347
    };                                                                                                                // 348
  });                                                                                                                 // 349
                                                                                                                      // 350
  // proxy the "layout" method to the underlying component's                                                          // 351
  // "template" method.                                                                                               // 352
  self.layout = function () {                                                                                         // 353
    if (self._component)                                                                                              // 354
      return self._component.template.apply(self, arguments);                                                         // 355
    else                                                                                                              // 356
      throw new Error('Layout has not been rendered yet');                                                            // 357
  };                                                                                                                  // 358
};                                                                                                                    // 359
                                                                                                                      // 360
BlazeUIManager.prototype = {                                                                                          // 361
  render: function (props, parentComponent) {                                                                         // 362
    this._component = UI.render(Layout.extend(props || {}), parentComponent || UI.body);                              // 363
    return this._component;                                                                                           // 364
  },                                                                                                                  // 365
                                                                                                                      // 366
  insert: function (parentDom, parentComponent, props) {                                                              // 367
    UI.DomRange.insert(this.render(props, parentComponent).dom, parentDom || document.body);                          // 368
  }                                                                                                                   // 369
};                                                                                                                    // 370
                                                                                                                      // 371
var findComponentOfKind = function (kind, comp) {                                                                     // 372
  while (comp) {                                                                                                      // 373
    if (comp.kind === kind)                                                                                           // 374
      return comp;                                                                                                    // 375
    comp = comp.parent;                                                                                               // 376
  }                                                                                                                   // 377
  return null;                                                                                                        // 378
};                                                                                                                    // 379
                                                                                                                      // 380
// Override {{> yield}} and {{#contentFor}} to find the closest                                                       // 381
// enclosing layout                                                                                                   // 382
var origLookup = UI.Component.lookup;                                                                                 // 383
UI.Component.lookup = function (id, opts) {                                                                           // 384
  if (id === 'yield') {                                                                                               // 385
    throw new Error("Sorry, would you mind using {{> yield}} instead of {{yield}}? It helps the Blaze engine.");      // 386
  } else if (id === 'contentFor') {                                                                                   // 387
    var layout = findComponentOfKind('Layout', this);                                                                 // 388
    if (!layout)                                                                                                      // 389
      throw new Error("Couldn't find a Layout component in the rendered component tree");                             // 390
    else {                                                                                                            // 391
      return layout[id];                                                                                              // 392
    }                                                                                                                 // 393
  } else {                                                                                                            // 394
    return origLookup.apply(this, arguments);                                                                         // 395
  }                                                                                                                   // 396
};                                                                                                                    // 397
                                                                                                                      // 398
var origLookupTemplate = UI.Component.lookupTemplate;                                                                 // 399
UI.Component.lookupTemplate = function (id, opts) {                                                                   // 400
  if (id === 'yield') {                                                                                               // 401
    var layout = findComponentOfKind('Layout', this);                                                                 // 402
    if (!layout)                                                                                                      // 403
      throw new Error("Couldn't find a Layout component in the rendered component tree");                             // 404
    else {                                                                                                            // 405
      return layout[id];                                                                                              // 406
    }                                                                                                                 // 407
  } else {                                                                                                            // 408
    return origLookupTemplate.apply(this, arguments);                                                                 // 409
  }                                                                                                                   // 410
};                                                                                                                    // 411
                                                                                                                      // 412
if (Package['iron-router']) {                                                                                         // 413
  Package['iron-router'].Router.configure({                                                                           // 414
    uiManager: new BlazeUIManager                                                                                     // 415
  });                                                                                                                 // 416
}                                                                                                                     // 417
                                                                                                                      // 418
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
