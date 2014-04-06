(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages\iron-router\test\test_helpers.js                                                          //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
Router.configure({                                                                                    // 1
  autoRender: false,                                                                                  // 2
  autoStart: false                                                                                    // 3
});                                                                                                   // 4
                                                                                                      // 5
// setup some publications to test behaviour                                                          // 6
if (Meteor.isServer) {                                                                                // 7
  Meteor.publish({                                                                                    // 8
    neverReady: function() {}                                                                         // 9
  });                                                                                                 // 10
}                                                                                                     // 11
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages\iron-router\test\both\route.js                                                            //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
/*                                                                                                    // 1
 * Tests for Route                                                                                    // 2
 */                                                                                                   // 3
                                                                                                      // 4
var paths = {                                                                                         // 5
  explicit: '/posts',                                                                                 // 6
  required: '/posts/:param',                                                                          // 7
  multi: '/posts/:paramOne/:paramTwo',                                                                // 8
  optional: '/posts/:paramOne/:paramTwo?',                                                            // 9
  simpleOptional: '/:param?',                                                                         // 10
  twoOptional: '/:paramOne?/:paramTwo?',                                                              // 11
  mixedOptional: '/:paramOne?/:paramTwo/:paramThree?',                                                // 12
  wildcard: '/posts/*',                                                                               // 13
  namedWildcard: '/posts/:file(*)',                                                                   // 14
  regex: /^\/commits\/(\d+)\.\.(\d+)/                                                                 // 15
};                                                                                                    // 16
                                                                                                      // 17
Tinytest.add('Route - matching', function (test) {                                                    // 18
  var route = new Route(Router, 'explicit', {                                                         // 19
    path: paths.explicit                                                                              // 20
  });                                                                                                 // 21
  test.isTrue(route.test('/posts'));                                                                  // 22
  test.isTrue(route.exec('/posts'));                                                                  // 23
  test.isTrue(route.test('/posts/'));                                                                 // 24
  test.isFalse(route.test('/posts/1'));                                                               // 25
  test.isNull(route.exec('/posts/1'));                                                                // 26
                                                                                                      // 27
  route = new Route(Router, 'required', {                                                             // 28
    path: paths.required                                                                              // 29
  });                                                                                                 // 30
  test.isTrue(route.test('/posts/1'));                                                                // 31
  test.isTrue(route.exec('/posts/1'));                                                                // 32
  test.isTrue(route.test('/posts/1/'));                                                               // 33
  test.isTrue(route.exec('/posts/1/'));                                                               // 34
  test.isFalse(route.test('/posts/1/2'));                                                             // 35
  test.isNull(route.exec('/posts/1/2'));                                                              // 36
                                                                                                      // 37
  route = new Route(Router, 'multi', {                                                                // 38
    path: paths.multi                                                                                 // 39
  });                                                                                                 // 40
  test.isTrue(route.test('/posts/1/2'));                                                              // 41
  test.isTrue(route.exec('/posts/1/2'));                                                              // 42
  test.isTrue(route.test('/posts/1/2/'));                                                             // 43
  test.isTrue(route.exec('/posts/1/2/'));                                                             // 44
  test.isFalse(route.test('/posts/1/2/3'));                                                           // 45
  test.isNull(route.exec('/posts/1/2/3'));                                                            // 46
                                                                                                      // 47
  route = new Route(Router, 'optional', {                                                             // 48
    path: paths.optional                                                                              // 49
  });                                                                                                 // 50
  test.isTrue(route.test('/posts/1'));                                                                // 51
  test.isTrue(route.exec('/posts/1'));                                                                // 52
  test.isTrue(route.test('/posts/1/2'));                                                              // 53
  test.isTrue(route.exec('/posts/1/2'));                                                              // 54
  test.isTrue(route.test('/posts/1/2/'));                                                             // 55
  test.isTrue(route.exec('/posts/1/2/'));                                                             // 56
  test.isFalse(route.test('/posts/1/2/3'));                                                           // 57
  test.isNull(route.exec('/posts/1/2/3'));                                                            // 58
                                                                                                      // 59
  route = new Route(Router, 'simpleOptional', {                                                       // 60
    path: paths.simpleOptional                                                                        // 61
  });                                                                                                 // 62
  test.isTrue(route.test('/'));                                                                       // 63
  test.isTrue(route.exec('/'));                                                                       // 64
  test.isTrue(route.test('/1'));                                                                      // 65
  test.isTrue(route.exec('/1'));                                                                      // 66
  test.isTrue(route.test('/1/'));                                                                     // 67
  test.isTrue(route.exec('/1/'));                                                                     // 68
  test.isFalse(route.test('/1/2'));                                                                   // 69
  test.isNull(route.exec('/1/2'));                                                                    // 70
                                                                                                      // 71
  route = new Route(Router, 'twoOptional', {                                                          // 72
    path: paths.twoOptional                                                                           // 73
  });                                                                                                 // 74
  test.isTrue(route.test('/'));                                                                       // 75
  test.isTrue(route.exec('/'));                                                                       // 76
  test.isTrue(route.test('/1'));                                                                      // 77
  test.isTrue(route.exec('/1'));                                                                      // 78
  test.isTrue(route.test('/1/'));                                                                     // 79
  test.isTrue(route.exec('/1/'));                                                                     // 80
  test.isTrue(route.test('/1/2'));                                                                    // 81
  test.isTrue(route.exec('/1/2'));                                                                    // 82
  test.isTrue(route.test('/1/2/'));                                                                   // 83
  test.isTrue(route.exec('/1/2/'));                                                                   // 84
  test.isFalse(route.test('/1/2/3'));                                                                 // 85
  test.isNull(route.exec('/1/2/3'));                                                                  // 86
                                                                                                      // 87
  route = new Route(Router, 'mixedOptional', {                                                        // 88
    path: paths.mixedOptional                                                                         // 89
  });                                                                                                 // 90
  test.isFalse(route.test('/'));                                                                      // 91
  test.isNull(route.exec('/'));                                                                       // 92
  test.isTrue(route.test('/1'));                                                                      // 93
  test.isTrue(route.exec('/1'));                                                                      // 94
  test.isTrue(route.test('/1/'));                                                                     // 95
  test.isTrue(route.exec('/1/'));                                                                     // 96
  test.isTrue(route.test('/1/2'));                                                                    // 97
  test.isTrue(route.exec('/1/2'));                                                                    // 98
  test.isTrue(route.test('/1/2/'));                                                                   // 99
  test.isTrue(route.exec('/1/2/'));                                                                   // 100
  test.isTrue(route.test('/1/2/3'));                                                                  // 101
  test.isTrue(route.exec('/1/2/3'));                                                                  // 102
  test.isTrue(route.test('/1/2/3/'));                                                                 // 103
  test.isTrue(route.exec('/1/2/3/'));                                                                 // 104
  test.isFalse(route.test('/1/2/3/4'));                                                               // 105
  test.isNull(route.exec('/1/2/3/4'));                                                                // 106
                                                                                                      // 107
  route = new Route(Router, 'wildcard', {                                                             // 108
    path: paths.wildcard                                                                              // 109
  });                                                                                                 // 110
  test.isTrue(route.test('/posts/1/2'));                                                              // 111
  test.isTrue(route.exec('/posts/1/2'));                                                              // 112
  test.isTrue(route.test('/posts/1/2/3'));                                                            // 113
  test.isTrue(route.exec('/posts/1/2/3'));                                                            // 114
  test.isTrue(route.test('/posts/1/2/3/4'));                                                          // 115
  test.isTrue(route.exec('/posts/1/2/3/4'));                                                          // 116
                                                                                                      // 117
  route = new Route(Router, 'namedWildcard', {                                                        // 118
    path: paths.namedWildcard                                                                         // 119
  });                                                                                                 // 120
  test.isTrue(route.test('/posts/path/to/file'));                                                     // 121
  test.isTrue(route.exec('/posts/path/to/file'));                                                     // 122
                                                                                                      // 123
  route = new Route(Router, 'regex', {                                                                // 124
    path: paths.regex                                                                                 // 125
  });                                                                                                 // 126
  test.isTrue(route.test('/commits/123..456'));                                                       // 127
  test.isTrue(route.exec('/commits/123..456'));                                                       // 128
});                                                                                                   // 129
                                                                                                      // 130
Tinytest.add('Route - params', function (test) {                                                      // 131
  var route = new Route(Router, 'explicit', {                                                         // 132
    path: paths.explicit                                                                              // 133
  });                                                                                                 // 134
                                                                                                      // 135
  test.isNull(route.params());                                                                        // 136
  test.isTrue(route.params('/posts') instanceof Array);                                               // 137
                                                                                                      // 138
  route = new Route(Router, 'required', {                                                             // 139
    path: paths.required                                                                              // 140
  });                                                                                                 // 141
                                                                                                      // 142
  var params = route.params('/posts/1');                                                              // 143
  test.equal(params.param, "1");                                                                      // 144
                                                                                                      // 145
  route = new Route(Router, 'multi', {                                                                // 146
    path: paths.multi                                                                                 // 147
  });                                                                                                 // 148
  params = route.params('/posts/1/2');                                                                // 149
  test.equal(params.paramOne, '1');                                                                   // 150
  test.equal(params.paramTwo, '2');                                                                   // 151
                                                                                                      // 152
  route = new Route(Router, 'optional', {                                                             // 153
    path: paths.optional                                                                              // 154
  });                                                                                                 // 155
  params = route.params('/posts/1');                                                                  // 156
  test.equal(params.paramOne, '1');                                                                   // 157
  test.isUndefined(params.paramTwo);                                                                  // 158
                                                                                                      // 159
  params = route.params('/posts/1/2');                                                                // 160
  test.equal(params.paramOne, '1');                                                                   // 161
  test.equal(params.paramTwo, '2');                                                                   // 162
                                                                                                      // 163
  route = new Route(Router, 'simpleOptional', {                                                       // 164
    path: paths.simpleOptional                                                                        // 165
  });                                                                                                 // 166
                                                                                                      // 167
  params = route.params('/');                                                                         // 168
  test.isUndefined(params.param);                                                                     // 169
                                                                                                      // 170
  params = route.params('/1');                                                                        // 171
  test.equal(params.param, '1');                                                                      // 172
                                                                                                      // 173
  route = new Route(Router, 'twoOptional', {                                                          // 174
    path: paths.twoOptional                                                                           // 175
  });                                                                                                 // 176
                                                                                                      // 177
  params = route.params('/');                                                                         // 178
  test.isUndefined(params.paramOne);                                                                  // 179
  test.isUndefined(params.paramTwo);                                                                  // 180
                                                                                                      // 181
  params = route.params('/1');                                                                        // 182
  test.equal(params.paramOne, '1');                                                                   // 183
  test.isUndefined(params.paramTwo);                                                                  // 184
                                                                                                      // 185
  params = route.params('/1/');                                                                       // 186
  test.equal(params.paramOne, '1');                                                                   // 187
  test.isUndefined(params.paramTwo);                                                                  // 188
                                                                                                      // 189
  params = route.params('/1/2');                                                                      // 190
  test.equal(params.paramOne, '1');                                                                   // 191
  test.equal(params.paramTwo, '2');                                                                   // 192
                                                                                                      // 193
  route = new Route(Router, 'mixedOptional', {                                                        // 194
    path: paths.mixedOptional                                                                         // 195
  });                                                                                                 // 196
                                                                                                      // 197
  params = route.params('/1');                                                                        // 198
  test.isUndefined(params.paramOne);                                                                  // 199
  test.equal(params.paramTwo, '1');                                                                   // 200
  test.isUndefined(params.paramThree);                                                                // 201
                                                                                                      // 202
  params = route.params('/1/');                                                                       // 203
  test.isUndefined(params.paramOne);                                                                  // 204
  test.equal(params.paramTwo, '1');                                                                   // 205
  test.isUndefined(params.paramThree);                                                                // 206
                                                                                                      // 207
  params = route.params('/1/2');                                                                      // 208
  test.equal(params.paramOne, '1');                                                                   // 209
  test.equal(params.paramTwo, '2');                                                                   // 210
  test.isUndefined(params.paramThree);                                                                // 211
                                                                                                      // 212
  params = route.params('/1/2/');                                                                     // 213
  test.equal(params.paramOne, '1');                                                                   // 214
  test.equal(params.paramTwo, '2');                                                                   // 215
  test.isUndefined(params.paramThree);                                                                // 216
                                                                                                      // 217
  params = route.params('/1/2/3');                                                                    // 218
  test.equal(params.paramOne, '1');                                                                   // 219
  test.equal(params.paramTwo, '2');                                                                   // 220
  test.equal(params.paramThree, '3');                                                                 // 221
                                                                                                      // 222
  route = new Route(Router, 'wildcard', {                                                             // 223
    path: paths.wildcard                                                                              // 224
  });                                                                                                 // 225
  params = route.params('/posts/some/wildcard/path');                                                 // 226
  test.equal(params[0], 'some/wildcard/path');                                                        // 227
                                                                                                      // 228
  route = new Route(Router, 'namedWildcard', {                                                        // 229
    path: paths.namedWildcard                                                                         // 230
  });                                                                                                 // 231
  params = route.params('/posts/some/file/path');                                                     // 232
  test.equal(params.file, 'some/file/path');                                                          // 233
                                                                                                      // 234
  route = new Route(Router, 'regex', {                                                                // 235
    path: paths.regex                                                                                 // 236
  });                                                                                                 // 237
  params = route.params('/commits/123..456');                                                         // 238
  test.equal(params[0], '123');                                                                       // 239
  test.equal(params[1], '456');                                                                       // 240
});                                                                                                   // 241
                                                                                                      // 242
Tinytest.add('Route - params with query and hash', function (test) {                                  // 243
  var route = new Route(Router, 'optional', {                                                         // 244
    path: paths.optional                                                                              // 245
  });                                                                                                 // 246
                                                                                                      // 247
  var params;                                                                                         // 248
                                                                                                      // 249
  params = route.params('/posts/1?q=s#anchorTag');                                                    // 250
  test.equal(params.paramOne, '1');                                                                   // 251
  test.isUndefined(params.paramTwo);                                                                  // 252
  test.equal(params.q, 's');                                                                          // 253
  test.equal(params.hash, 'anchorTag');                                                               // 254
                                                                                                      // 255
  params = route.params('/posts/1/2?q=s#anchorTag');                                                  // 256
  test.equal(params.paramTwo, '2');                                                                   // 257
});                                                                                                   // 258
                                                                                                      // 259
Tinytest.add('Route - resolve', function (test) {                                                     // 260
  var route = new Route(Router, 'required', {                                                         // 261
    path: paths.required                                                                              // 262
  });                                                                                                 // 263
                                                                                                      // 264
  var params;                                                                                         // 265
  var options;                                                                                        // 266
                                                                                                      // 267
  params = {                                                                                          // 268
    param: '1'                                                                                        // 269
  };                                                                                                  // 270
  test.equal(route.resolve(params), '/posts/1');                                                      // 271
                                                                                                      // 272
  params = {                                                                                          // 273
    param: 1                                                                                          // 274
  };                                                                                                  // 275
  test.equal(route.resolve(params), '/posts/1');                                                      // 276
                                                                                                      // 277
  params = {                                                                                          // 278
    param: '1'                                                                                        // 279
  };                                                                                                  // 280
  options = {                                                                                         // 281
    query: {                                                                                          // 282
      q: 's'                                                                                          // 283
    },                                                                                                // 284
    hash: 'anchorTag'                                                                                 // 285
  };                                                                                                  // 286
  test.equal(route.resolve(params, options), '/posts/1?q=s#anchorTag');                               // 287
                                                                                                      // 288
  params = {                                                                                          // 289
    param: 1                                                                                          // 290
  };                                                                                                  // 291
  options = {                                                                                         // 292
    query: {                                                                                          // 293
      q: 2                                                                                            // 294
    },                                                                                                // 295
    hash: 3                                                                                           // 296
  };                                                                                                  // 297
  test.equal(route.resolve(params, options), '/posts/1?q=2#3',                                        // 298
    'Must be able to resolve integer-formatted (non-string) params');                                 // 299
                                                                                                      // 300
  test.equal(route.resolve(), null);                                                                  // 301
                                                                                                      // 302
  route = new Route(Router, 'optional', {                                                             // 303
    path: paths.optional                                                                              // 304
  });                                                                                                 // 305
  params = {                                                                                          // 306
    paramOne: 'a',                                                                                    // 307
    paramTwo: 'b'                                                                                     // 308
  };                                                                                                  // 309
  test.equal(route.resolve(params), '/posts/a/b');                                                    // 310
  params = {                                                                                          // 311
    paramOne: 'a'                                                                                     // 312
  };                                                                                                  // 313
  test.equal(route.resolve(params), '/posts/a');                                                      // 314
                                                                                                      // 315
  route = new Route(Router, 'simpleOptional', {                                                       // 316
    path: paths.simpleOptional                                                                        // 317
  });                                                                                                 // 318
  params = {                                                                                          // 319
    param: 'a'                                                                                        // 320
  };                                                                                                  // 321
  test.equal(route.resolve(params), '/a');                                                            // 322
  params = {};                                                                                        // 323
  test.equal(route.resolve(params), '/');                                                             // 324
  test.equal(route.resolve(), '/');                                                                   // 325
                                                                                                      // 326
  route = new Route(Router, 'twoOptional', {                                                          // 327
    path: paths.twoOptional                                                                           // 328
  });                                                                                                 // 329
  test.equal(route.resolve({}), '/');                                                                 // 330
  test.equal(route.resolve(), '/');                                                                   // 331
  params = {                                                                                          // 332
    paramOne: 'a'                                                                                     // 333
  };                                                                                                  // 334
  test.equal(route.resolve(params), '/a');                                                            // 335
  params = {                                                                                          // 336
    paramOne: 'a',                                                                                    // 337
    paramTwo: 'b'                                                                                     // 338
  };                                                                                                  // 339
  test.equal(route.resolve(params), '/a/b');                                                          // 340
  params = {                                                                                          // 341
    paramTwo: 'b'                                                                                     // 342
  };                                                                                                  // 343
  test.equal(route.resolve(params), '/b');                                                            // 344
                                                                                                      // 345
  route = new Route(Router, 'mixedOptional', {                                                        // 346
    path: paths.mixedOptional                                                                         // 347
  });                                                                                                 // 348
  test.equal(route.resolve({}), null);                                                                // 349
  test.equal(route.resolve(), null);                                                                  // 350
  params = {                                                                                          // 351
    paramOne: 'a'                                                                                     // 352
  };                                                                                                  // 353
  test.equal(route.resolve(params), null);                                                            // 354
  params = {                                                                                          // 355
    paramOne: 'a',                                                                                    // 356
    paramTwo: 'b'                                                                                     // 357
  };                                                                                                  // 358
  test.equal(route.resolve(params), '/a/b');                                                          // 359
  params = {                                                                                          // 360
    paramTwo: 'b'                                                                                     // 361
  };                                                                                                  // 362
  test.equal(route.resolve(params), '/b');                                                            // 363
  params = {                                                                                          // 364
    paramTwo: 'b',                                                                                    // 365
    paramThree: 'c'                                                                                   // 366
  };                                                                                                  // 367
  test.equal(route.resolve(params), '/b/c');                                                          // 368
  params = {                                                                                          // 369
    paramOne: 'a',                                                                                    // 370
    paramThree: 'c'                                                                                   // 371
  };                                                                                                  // 372
  test.equal(route.resolve(params), null);                                                            // 373
  params = {                                                                                          // 374
    paramThree: 'c'                                                                                   // 375
  };                                                                                                  // 376
  test.equal(route.resolve(params), null);                                                            // 377
  params = {                                                                                          // 378
    paramOne: 'a',                                                                                    // 379
    paramTwo: 'b',                                                                                    // 380
    paramThree: 'c'                                                                                   // 381
  };                                                                                                  // 382
  test.equal(route.resolve(params), '/a/b/c');                                                        // 383
                                                                                                      // 384
  route = new Route(Router, 'wildcard', {                                                             // 385
    path: paths.wildcard                                                                              // 386
  });                                                                                                 // 387
  params = ['some/file/path'];                                                                        // 388
  test.equal(route.resolve(params), '/posts/some/file/path');                                         // 389
});                                                                                                   // 390
                                                                                                      // 391
Tinytest.add('Route - normalizePath', function (test) {                                               // 392
  var route = new Route(Router, 'explicit', {                                                         // 393
    path: paths.explicit                                                                              // 394
  });                                                                                                 // 395
                                                                                                      // 396
  test.equal(route.normalizePath('/posts'), '/posts');                                                // 397
  test.equal(route.normalizePath('posts'), '/posts');                                                 // 398
  test.equal(route.normalizePath(Meteor.absoluteUrl('posts')), '/posts');                             // 399
  test.equal(route.normalizePath('/posts?q=s'), '/posts');                                            // 400
  test.equal(route.normalizePath('/posts#anchorTag'), '/posts');                                      // 401
});                                                                                                   // 402
                                                                                                      // 403
Tinytest.add('Route - getController', function (test) {                                               // 404
  var route;                                                                                          // 405
  var root = Utils.global;                                                                            // 406
                                                                                                      // 407
  root.TestController = function (router, route, options)  {                                          // 408
    if (arguments.length < 2)                                                                         // 409
      throw new Error('Argument length check');                                                       // 410
                                                                                                      // 411
    this.options = options;                                                                           // 412
    this.router = router;                                                                             // 413
    this.route = route;                                                                               // 414
  };                                                                                                  // 415
                                                                                                      // 416
  var testGetController = function (route) {                                                          // 417
    var controller = route.getController('/test', {option: true});                                    // 418
    test.isTrue(controller instanceof TestController);                                                // 419
    test.equal(controller.route, route);                                                              // 420
    test.equal(controller.router, Router);                                                            // 421
    test.isTrue(controller.options.option);                                                           // 422
  };                                                                                                  // 423
                                                                                                      // 424
  // case 1: controller option                                                                        // 425
  var route = new Route(Router, 'test', {                                                             // 426
    controller: root.TestController,                                                                  // 427
    template: 'template'                                                                              // 428
  });                                                                                                 // 429
  testGetController(route);                                                                           // 430
                                                                                                      // 431
  // case 1a: controller option as string                                                             // 432
  var route = new Route(Router, 'test', {                                                             // 433
    controller: 'TestController',                                                                     // 434
    template: 'template'                                                                              // 435
  });                                                                                                 // 436
  testGetController(route);                                                                           // 437
                                                                                                      // 438
  root.App = {};                                                                                      // 439
  root.App.TestController = root.TestController;                                                      // 440
  // case 1b: controller option as namespaced string                                                  // 441
  var route = new Route(Router, 'test', {                                                             // 442
    controller: 'App.TestController',                                                                 // 443
    template: 'template'                                                                              // 444
  });                                                                                                 // 445
  testGetController(route);                                                                           // 446
                                                                                                      // 447
  // case 2: resolve controller intelligently                                                         // 448
  var route = new Route(Router, 'test', {                                                             // 449
    template: 'template'                                                                              // 450
  });                                                                                                 // 451
  testGetController(route);                                                                           // 452
                                                                                                      // 453
  // case 3: anonymous controller                                                                     // 454
  // case 2: resolve controller intelligently                                                         // 455
  var route = new Route(Router, 'anon', {                                                             // 456
    template: 'template'                                                                              // 457
  });                                                                                                 // 458
  var controller = route.getController('/anon', {option: true});                                      // 459
  test.isTrue(controller instanceof RouteController);                                                 // 460
  test.equal(controller.route, route);                                                                // 461
  test.isTrue(controller.options.option);                                                             // 462
});                                                                                                   // 463
                                                                                                      // 464
Tinytest.add('Route - rewriteLegacyHooks', function (test) {                                          // 465
  var options = {                                                                                     // 466
    load: function () {},                                                                             // 467
    before: function () {},                                                                           // 468
    after: function () {},                                                                            // 469
    unload: function () {}                                                                            // 470
  };                                                                                                  // 471
                                                                                                      // 472
  var route = new Route(Router, 'explicit', options);                                                 // 473
                                                                                                      // 474
  test.equal(route.options.onRun, options.load);                                                      // 475
  test.equal(route.options.onBeforeAction, options.before);                                           // 476
  test.equal(route.options.onAfterAction, options.after);                                             // 477
  test.equal(route.options.onStop, options.unload);                                                   // 478
});                                                                                                   // 479
                                                                                                      // 480
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages\iron-router\test\both\route_controller.js                                                 //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var createRouter = function () {                                                                      // 1
  return new IronRouter({                                                                             // 2
    autoRender: false,                                                                                // 3
    autoStart: false                                                                                  // 4
  });                                                                                                 // 5
};                                                                                                    // 6
                                                                                                      // 7
var initController = function (C, options) {                                                          // 8
  var router = createRouter();                                                                        // 9
  var route = new Route(router, 'test', {});                                                          // 10
  return new C(router, route, options);                                                               // 11
};                                                                                                    // 12
                                                                                                      // 13
var createController = function (proto, opts) {                                                       // 14
  var createRouter = function () {                                                                    // 15
    return new IronRouter({                                                                           // 16
      autoRender: false,                                                                              // 17
      autoStart: false                                                                                // 18
    });                                                                                               // 19
  };                                                                                                  // 20
  var route = new Route(Router, 'test', {});                                                          // 21
                                                                                                      // 22
  var R = RouteController.extend(proto || {});                                                        // 23
  return new R(Router, route, opts);                                                                  // 24
};                                                                                                    // 25
                                                                                                      // 26
Tinytest.add('RouteController - inheritance', function (test) {                                       // 27
  var Router = createRouter();                                                                        // 28
  var route = new Route(Router, 'test', {});                                                          // 29
                                                                                                      // 30
  var Parent = RouteController.extend({                                                               // 31
    parentMethod: function () {}                                                                      // 32
  });                                                                                                 // 33
                                                                                                      // 34
  var Child = Parent.extend({                                                                         // 35
    childMethod: function () {}                                                                       // 36
  });                                                                                                 // 37
                                                                                                      // 38
  var inst = new Child(Router, route);                                                                // 39
                                                                                                      // 40
  test.isTrue(_.isFunction(inst.childMethod), 'child method not defined');                            // 41
  test.isTrue(_.isFunction(inst.parentMethod), 'parent method not defined');                          // 42
});                                                                                                   // 43
                                                                                                      // 44
Tinytest.add('RouteController - lookupProperty', function (test) {                                    // 45
  var Router = createRouter();                                                                        // 46
  var route = new Route(Router, 'test', {});                                                          // 47
  var inst = new RouteController(Router, route, {});                                                  // 48
  var value;                                                                                          // 49
                                                                                                      // 50
  // undefined                                                                                        // 51
  value = inst.lookupProperty('myProperty');                                                          // 52
  test.isUndefined(value, 'property should be undefined');                                            // 53
                                                                                                      // 54
  // router options                                                                                   // 55
  Router.options.myProperty = 'myRouterValue';                                                        // 56
  value = inst.lookupProperty('myProperty');                                                          // 57
  test.equal(value, 'myRouterValue', 'property should be on router options');                         // 58
                                                                                                      // 59
  // route options                                                                                    // 60
  route.options.myProperty = 'myRouteValue';                                                          // 61
  value = inst.lookupProperty('myProperty');                                                          // 62
  test.equal(value, 'myRouteValue', 'property should be on route options');                           // 63
                                                                                                      // 64
  // route controller instance                                                                        // 65
  inst.myProperty = 'myInstanceValue';                                                                // 66
  value = inst.lookupProperty('myProperty');                                                          // 67
  test.equal(value, 'myInstanceValue', 'property should be on instance');                             // 68
                                                                                                      // 69
  // route controller options                                                                         // 70
  inst.options.myProperty = 'myOptionsValue';                                                         // 71
  value = inst.lookupProperty('myProperty');                                                          // 72
  test.equal(value, 'myOptionsValue', 'property should be on instance options');                      // 73
});                                                                                                   // 74
                                                                                                      // 75
Tinytest.add('RouteController - runHooks run order', function (test) {                                // 76
  var Router = createRouter();                                                                        // 77
  var route = new Route(Router, 'test', {});                                                          // 78
                                                                                                      // 79
  var calls = [];                                                                                     // 80
                                                                                                      // 81
  var Parent = RouteController.extend({                                                               // 82
    onRun: function () {                                                                              // 83
      calls.push('parent');                                                                           // 84
    }                                                                                                 // 85
  });                                                                                                 // 86
                                                                                                      // 87
  var Child = Parent.extend({                                                                         // 88
    onRun: function () {                                                                              // 89
      calls.push('child');                                                                            // 90
    }                                                                                                 // 91
  });                                                                                                 // 92
                                                                                                      // 93
  var inst = new Child(Router, route, {});                                                            // 94
                                                                                                      // 95
  Router.getHooks = function (name, type) {                                                           // 96
    if (name !== 'onRun')                                                                             // 97
      return [];                                                                                      // 98
                                                                                                      // 99
    return [                                                                                          // 100
      function () {                                                                                   // 101
        calls.push('router');                                                                         // 102
      }                                                                                               // 103
    ]                                                                                                 // 104
  };                                                                                                  // 105
                                                                                                      // 106
  route.options.onRun = function () {                                                                 // 107
    calls.push('route options');                                                                      // 108
  };                                                                                                  // 109
                                                                                                      // 110
  inst.options.onRun = function () {                                                                  // 111
    calls.push('options');                                                                            // 112
  };                                                                                                  // 113
                                                                                                      // 114
  inst.onRun = function () {                                                                          // 115
    calls.push('instance');                                                                           // 116
  };                                                                                                  // 117
                                                                                                      // 118
  var more = [function () {                                                                           // 119
    calls.push('more');                                                                               // 120
  }];                                                                                                 // 121
                                                                                                      // 122
  inst.runHooks('onRun', more);                                                                       // 123
                                                                                                      // 124
  test.equal(calls, ['options', 'parent', 'child', 'instance', 'route options', 'router', 'more'], 'runHooks order is wrong');
});                                                                                                   // 126
                                                                                                      // 127
Tinytest.add('RouteController - runHooks pause', function (test) {                                    // 128
  var Router = createRouter();                                                                        // 129
  var route = new Route(Router, 'test', {});                                                          // 130
  var inst = new RouteController(Router, route, {});                                                  // 131
                                                                                                      // 132
  var calls = [];                                                                                     // 133
                                                                                                      // 134
  inst.onRun = [                                                                                      // 135
    function (pause) {                                                                                // 136
      calls.push('1');                                                                                // 137
      pause();                                                                                        // 138
    },                                                                                                // 139
                                                                                                      // 140
    function (pause) {                                                                                // 141
      calls.push('2');                                                                                // 142
    }                                                                                                 // 143
  ];                                                                                                  // 144
                                                                                                      // 145
  var isPaused = inst.runHooks('onRun');                                                              // 146
  test.equal(calls, ['1'], 'looks like a downstream hook ran even though we were paused');            // 147
  test.isTrue(isPaused, "looks like runHooks didn't return the paused value");                        // 148
});                                                                                                   // 149
                                                                                                      // 150
Tinytest.add('RouteController - runHooks stop', function (test) {                                     // 151
  var Router = createRouter();                                                                        // 152
  var route = new Route(Router, 'test', {});                                                          // 153
  var inst = new RouteController(Router, route, {});                                                  // 154
                                                                                                      // 155
  var calls = [];                                                                                     // 156
                                                                                                      // 157
  inst.onRun = [                                                                                      // 158
    function (pause) {                                                                                // 159
      calls.push('1');                                                                                // 160
      inst._stopController();                                                                         // 161
    },                                                                                                // 162
                                                                                                      // 163
    function (pause) {                                                                                // 164
      calls.push('2');                                                                                // 165
    }                                                                                                 // 166
  ];                                                                                                  // 167
                                                                                                      // 168
  inst.runHooks('onRun');                                                                             // 169
  test.equal(calls, ['1'], 'looks like a downstream hook ran even though we were stopped');           // 170
});                                                                                                   // 171
                                                                                                      // 172
Tinytest.add('RouteController - runHooks', function (test) {                                          // 173
  var Router = createRouter();                                                                        // 174
  var route = new Route(Router, 'test', {});                                                          // 175
  var inst = new RouteController(Router, route, {});                                                  // 176
  var calls = [];                                                                                     // 177
                                                                                                      // 178
  inst.onRun = function () {                                                                          // 179
    calls.push('onRun');                                                                              // 180
  };                                                                                                  // 181
                                                                                                      // 182
  var more = [function () {                                                                           // 183
    calls.push('more');                                                                               // 184
  }];                                                                                                 // 185
                                                                                                      // 186
  var cb = function () {                                                                              // 187
    calls.push('cb');                                                                                 // 188
  };                                                                                                  // 189
                                                                                                      // 190
  inst.runHooks('onRun', more, cb);                                                                   // 191
  test.equal(calls, [                                                                                 // 192
    'onRun',                                                                                          // 193
    'more',                                                                                           // 194
    'cb'                                                                                              // 195
  ]);                                                                                                 // 196
});                                                                                                   // 197
                                                                                                      // 198
Tinytest.add('RouteController - stop', function (test) {                                              // 199
  var Router = createRouter();                                                                        // 200
  var route = new Route(Router, 'test', {});                                                          // 201
  var inst = new RouteController(Router, route, {});                                                  // 202
                                                                                                      // 203
  var calls = [];                                                                                     // 204
  inst.onStop = function () {                                                                         // 205
    calls.push('onStop');                                                                             // 206
  };                                                                                                  // 207
                                                                                                      // 208
  inst.stop();                                                                                        // 209
                                                                                                      // 210
  test.isFalse(inst.isRunning, 'isRunning should be false');                                          // 211
  test.isTrue(inst.isStopped, 'isStopped should be true');                                            // 212
  test.equal(calls, ['onStop'], 'stop hooks not called');                                             // 213
});                                                                                                   // 214
                                                                                                      // 215
Tinytest.add('RouteController - support legacy hooks', function (test) {                              // 216
  var calls = [];                                                                                     // 217
  var c = createController({                                                                          // 218
    load: function () {                                                                               // 219
      calls.push('load');                                                                             // 220
    },                                                                                                // 221
                                                                                                      // 222
    before: function () {                                                                             // 223
      calls.push('before');                                                                           // 224
    },                                                                                                // 225
                                                                                                      // 226
    after: function () {                                                                              // 227
      calls.push('after');                                                                            // 228
    },                                                                                                // 229
                                                                                                      // 230
    unload: function () {                                                                             // 231
      calls.push('unload');                                                                           // 232
    }                                                                                                 // 233
  });                                                                                                 // 234
                                                                                                      // 235
  c.runHooks('onRun')                                                                                 // 236
  test.equal(calls, ['load']);                                                                        // 237
                                                                                                      // 238
  c.runHooks('onBeforeAction')                                                                        // 239
  test.equal(calls, ['load', 'before']);                                                              // 240
                                                                                                      // 241
  c.runHooks('onAfterAction')                                                                         // 242
  test.equal(calls, ['load', 'before', 'after']);                                                     // 243
                                                                                                      // 244
  c.runHooks('onStop')                                                                                // 245
  test.equal(calls, ['load', 'before', 'after', 'unload']);                                           // 246
});                                                                                                   // 247
                                                                                                      // 248
Tinytest.add('RouteController - support legacy hook inheritance', function (test) {                   // 249
  var calls = [];                                                                                     // 250
  var Parent = RouteController.extend({                                                               // 251
    before: function () {                                                                             // 252
      calls.push('parent');                                                                           // 253
    }                                                                                                 // 254
  });                                                                                                 // 255
                                                                                                      // 256
  var Child = Parent.extend({                                                                         // 257
    before: function () {                                                                             // 258
      calls.push('child');                                                                            // 259
    }                                                                                                 // 260
  });                                                                                                 // 261
                                                                                                      // 262
  var c = initController(Child);                                                                      // 263
  c.runHooks('onBeforeAction')                                                                        // 264
  test.equal(calls, ['parent', 'child']);                                                             // 265
});                                                                                                   // 266
                                                                                                      // 267
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages\iron-router\test\both\router.js                                                           //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
/*****************************************************************************/                       // 1
/* Mocks and Stubs */                                                                                 // 2
/*****************************************************************************/                       // 3
var controllerMock = {                                                                                // 4
  run: function () {},                                                                                // 5
  runHooks: function () {}                                                                            // 6
};                                                                                                    // 7
                                                                                                      // 8
var routes = [{                                                                                       // 9
  where: 'client',                                                                                    // 10
  test: function (path) { return path == 'client'; },                                                 // 11
  getController: function (path, options) { return EJSON.clone(controllerMock); },                    // 12
  path: function (params, options) {                                                                  // 13
    return [params, options];                                                                         // 14
  },                                                                                                  // 15
  url: function (params, options) {                                                                   // 16
    return [params, options];                                                                         // 17
  }                                                                                                   // 18
}, {                                                                                                  // 19
  where: 'server',                                                                                    // 20
  test: function (path) { return path == 'server' },                                                  // 21
  getController: function () { return EJSON.clone(controllerMock); },                                 // 22
  path: function (params, options) {                                                                  // 23
    return [params, options];                                                                         // 24
  },                                                                                                  // 25
  url: function (params, options) {                                                                   // 26
    return [params, options];                                                                         // 27
  }                                                                                                   // 28
}];                                                                                                   // 29
                                                                                                      // 30
// simulate the named routes                                                                          // 31
routes.client = routes[0];                                                                            // 32
routes.server = routes[1];                                                                            // 33
                                                                                                      // 34
/*****************************************************************************/                       // 35
/* Client and Server */                                                                               // 36
/*****************************************************************************/                       // 37
Tinytest.add('Router - path', function (test) {                                                       // 38
  var router = Router;                                                                                // 39
  router.routes = routes;                                                                             // 40
                                                                                                      // 41
  var params = [];                                                                                    // 42
  var opts = {};                                                                                      // 43
  var res = router.path('client', params, opts);                                                      // 44
                                                                                                      // 45
  test.equal(res[0], params);                                                                         // 46
  test.equal(res[1], opts);                                                                           // 47
});                                                                                                   // 48
                                                                                                      // 49
Tinytest.add('Router - url', function (test) {                                                        // 50
  var router = Router;                                                                                // 51
  router.routes = routes;                                                                             // 52
                                                                                                      // 53
  var params = [];                                                                                    // 54
  var opts = {};                                                                                      // 55
                                                                                                      // 56
  var res = router.url('client', params, opts);                                                       // 57
                                                                                                      // 58
  test.equal(res[0], params);                                                                         // 59
  test.equal(res[1], opts);                                                                           // 60
});                                                                                                   // 61
                                                                                                      // 62
/*****************************************************************************/                       // 63
/* Client */                                                                                          // 64
/*****************************************************************************/                       // 65
if (Meteor.isClient) {                                                                                // 66
  Tinytest.add('Router - client dispatch', function (test) {                                          // 67
    var router = Router;                                                                              // 68
                                                                                                      // 69
    router.routes = routes;                                                                           // 70
                                                                                                      // 71
    var runController = null;                                                                         // 72
    var runCallback = null;                                                                           // 73
                                                                                                      // 74
    router.run = function (controller, cb) {                                                          // 75
      runController = controller;                                                                     // 76
      runCallback = cb;                                                                               // 77
    };                                                                                                // 78
                                                                                                      // 79
    // 1. onRouteNotFound                                                                             // 80
    var onRouteNotFoundCalled = false;                                                                // 81
    router.onRouteNotFound = function (path, options) {                                               // 82
      onRouteNotFoundCalled = true;                                                                   // 83
    };                                                                                                // 84
                                                                                                      // 85
    var onUnhandledCalled = false;                                                                    // 86
    router.onUnhandled = function (path, options) {                                                   // 87
      onUnhandledCalled = true;                                                                       // 88
    };                                                                                                // 89
                                                                                                      // 90
    router.dispatch('bogus');                                                                         // 91
    test.isTrue(onRouteNotFoundCalled, 'onRouteNotFound not called');                                 // 92
                                                                                                      // 93
    // 2. where !== where                                                                             // 94
    router.dispatch('server');                                                                        // 95
    test.isTrue(onUnhandledCalled, 'onUnhandled not called for server route');                        // 96
                                                                                                      // 97
    // 3. run method called                                                                           // 98
    router.dispatch('client', {}, function () {});                                                    // 99
    test.isTrue(runController, 'run not called with a controller');                                   // 100
    test.isTrue(runCallback, 'run not called with a callback');                                       // 101
  });                                                                                                 // 102
}                                                                                                     // 103
                                                                                                      // 104
/*****************************************************************************/                       // 105
/* Server */                                                                                          // 106
/*****************************************************************************/                       // 107
if (Meteor.isServer) {                                                                                // 108
  Tinytest.add('Router - server dispatch', function (test) {                                          // 109
    var router = Router;                                                                              // 110
                                                                                                      // 111
    router.routes = routes;                                                                           // 112
                                                                                                      // 113
    var runController = null;                                                                         // 114
    var runCallback = null;                                                                           // 115
                                                                                                      // 116
    router.run = function (controller, cb) {                                                          // 117
      runController = controller;                                                                     // 118
      runCallback = cb;                                                                               // 119
    };                                                                                                // 120
                                                                                                      // 121
    // 1. onRouteNotFound                                                                             // 122
    var onRouteNotFoundCalled = false;                                                                // 123
    router.onRouteNotFound = function (path, options) {                                               // 124
      onRouteNotFoundCalled = true;                                                                   // 125
    };                                                                                                // 126
                                                                                                      // 127
    var onUnhandledCalled = false;                                                                    // 128
    router.onUnhandled = function (path, options) {                                                   // 129
      onUnhandledCalled = true;                                                                       // 130
    };                                                                                                // 131
                                                                                                      // 132
    router.dispatch('bogus');                                                                         // 133
    test.isTrue(onRouteNotFoundCalled, 'onRouteNotFound not called');                                 // 134
                                                                                                      // 135
    // 2. where !== where                                                                             // 136
    router.dispatch('client');                                                                        // 137
    test.isTrue(onUnhandledCalled, 'onUnhandled not called for client route');                        // 138
                                                                                                      // 139
    // 3. run method called                                                                           // 140
    router.dispatch('server', {}, function () {});                                                    // 141
    test.isTrue(runController, 'run not called with a controller');                                   // 142
    test.isTrue(runCallback, 'run not called with a callback');                                       // 143
  });                                                                                                 // 144
}                                                                                                     // 145
                                                                                                      // 146
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages\iron-router\test\both\utils.js                                                            //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
Tinytest.add('Utils - resolveValue', function (test) {                                                // 1
  var global = (function () { return this; })();                                                      // 2
                                                                                                      // 3
  global.outer = {                                                                                    // 4
    inner: 'value'                                                                                    // 5
  };                                                                                                  // 6
                                                                                                      // 7
  var res = Utils.resolveValue('outer.inner');                                                        // 8
  test.equal(res, 'value', 'unable to resolveValue on global object');                                // 9
});                                                                                                   // 10
                                                                                                      // 11
Tinytest.add('Utils - capitalize', function (test) {                                                  // 12
  test.equal(Utils.capitalize('lower'), 'Lower');                                                     // 13
  test.equal(Utils.capitalize('Lower'), 'Lower');                                                     // 14
  test.equal(Utils.capitalize('lowerSomething'), 'LowerSomething');                                   // 15
  test.equal(Utils.capitalize('lower-something'), 'Lower-something');                                 // 16
});                                                                                                   // 17
                                                                                                      // 18
Tinytest.add('Utils - upperCamelCase', function (test) {                                              // 19
  test.equal(Utils.upperCamelCase('postsShow'), 'PostsShow');                                         // 20
  test.equal(Utils.upperCamelCase('posts-show'), 'PostsShow');                                        // 21
  test.equal(Utils.upperCamelCase('posts_show'), 'PostsShow');                                        // 22
});                                                                                                   // 23
                                                                                                      // 24
Tinytest.add('Utils - camelCase', function (test) {                                                   // 25
  test.equal(Utils.camelCase('PostsShow'), 'postsShow');                                              // 26
  test.equal(Utils.camelCase('posts-show'), 'postsShow');                                             // 27
  test.equal(Utils.camelCase('Posts-show'), 'postsShow');                                             // 28
  test.equal(Utils.camelCase('posts_show'), 'postsShow');                                             // 29
});                                                                                                   // 30
                                                                                                      // 31
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages\iron-router\test\client\mocks.js                                                          //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
LocationMock = function() {                                                                           // 1
  this._path = '/one';                                                                                // 2
}                                                                                                     // 3
                                                                                                      // 4
_.extend(LocationMock.prototype, {                                                                    // 5
  start: function() {},                                                                               // 6
  set: function(path, options) {                                                                      // 7
    this._path = path;                                                                                // 8
  },                                                                                                  // 9
  path: function() {                                                                                  // 10
    return this._path;                                                                                // 11
  }                                                                                                   // 12
});                                                                                                   // 13
                                                                                                      // 14
// XXX: probably record what this does                                                                // 15
UIMock = function() {}                                                                                // 16
_.each([                                                                                              // 17
  'setRegion',                                                                                        // 18
  'clearRegion',                                                                                      // 19
  'getRegionKeys',                                                                                    // 20
  'getData',                                                                                          // 21
  'setData',                                                                                          // 22
  'render',                                                                                           // 23
  'insert',                                                                                           // 24
  'layout'                                                                                            // 25
], function (method) {                                                                                // 26
  // nothing for now                                                                                  // 27
  UIMock.prototype[method] = function() {};                                                           // 28
});                                                                                                   // 29
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages\iron-router\test\client\router.js                                                         //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
// uiManager api tests                                                                                // 1
// hot code reload                                                                                    // 2
// run (deps changed and current changed)                                                             // 3
                                                                                                      // 4
var mockedRouter = function() {                                                                       // 5
  var router = new IronRouter({                                                                       // 6
    autoStart: false,                                                                                 // 7
    autoRender: false                                                                                 // 8
  });                                                                                                 // 9
                                                                                                      // 10
  router.configure({ location: new LocationMock, uiManager: new UIMock });                            // 11
  return router;                                                                                      // 12
}                                                                                                     // 13
                                                                                                      // 14
                                                                                                      // 15
Tinytest.add('ClientRouter - onRun hooks', function (test) {                                          // 16
  var router = mockedRouter();                                                                        // 17
                                                                                                      // 18
  router.map(function() {                                                                             // 19
    this.route('one', {                                                                               // 20
      onRun: function() { oneRunHookCalled += 1; },                                                   // 21
      onBeforeAction: function() { oneBeforeHookCalled += 1; }                                        // 22
    });                                                                                               // 23
    this.route('two', {                                                                               // 24
      onRun: function() {                                                                             // 25
        twoRunHookCalled += 1;                                                                        // 26
        router.go('one');                                                                             // 27
      },                                                                                              // 28
      onBeforeAction: function() { twoBeforeHookCalled += 1; },                                       // 29
    });                                                                                               // 30
    this.route('three');                                                                              // 31
  });                                                                                                 // 32
                                                                                                      // 33
  router.onRun(function() {                                                                           // 34
    onRunHookCalledAt = router._location.path();                                                      // 35
  });                                                                                                 // 36
                                                                                                      // 37
  router.start();                                                                                     // 38
                                                                                                      // 39
  var oneRunHookCalled = 0;                                                                           // 40
  var oneBeforeHookCalled = 0;                                                                        // 41
  var twoRunHookCalled = 0;                                                                           // 42
  var twoBeforeHookCalled = 0;                                                                        // 43
  var onRunHookCalledAt;                                                                              // 44
                                                                                                      // 45
  router.go('one');                                                                                   // 46
  test.equal(oneRunHookCalled, 1);                                                                    // 47
  test.equal(oneBeforeHookCalled, 1);                                                                 // 48
  test.equal(onRunHookCalledAt, '/one');                                                              // 49
                                                                                                      // 50
  router.go('two');                                                                                   // 51
  test.equal(oneRunHookCalled, 2);                                                                    // 52
  test.equal(oneBeforeHookCalled, 2);                                                                 // 53
  test.equal(twoRunHookCalled, 1);                                                                    // 54
  // show have redirected before this happens                                                         // 55
  test.equal(twoBeforeHookCalled, 0);                                                                 // 56
                                                                                                      // 57
  // we are redirected to one, so this comes up                                                       // 58
  test.equal(onRunHookCalledAt, '/one');                                                              // 59
                                                                                                      // 60
  router.go('three');                                                                                 // 61
  test.equal(onRunHookCalledAt, '/three');                                                            // 62
                                                                                                      // 63
  router.go('one');                                                                                   // 64
  test.equal(onRunHookCalledAt, '/one');                                                              // 65
});                                                                                                   // 66
                                                                                                      // 67
Tinytest.add('ClientRouter - onStop hooks', function (test) {                                         // 68
  var router = mockedRouter();                                                                        // 69
                                                                                                      // 70
  var stopCalledAt = null;                                                                            // 71
  router.map(function() {                                                                             // 72
    this.route('one', {                                                                               // 73
      onStop: function() {                                                                            // 74
        stopCalledAt = router._location.path();                                                       // 75
      }                                                                                               // 76
    });                                                                                               // 77
    this.route('two');                                                                                // 78
  });                                                                                                 // 79
                                                                                                      // 80
  router.start();                                                                                     // 81
  test.isNull(stopCalledAt);                                                                          // 82
                                                                                                      // 83
  router.go('two');                                                                                   // 84
  test.equal(stopCalledAt, '/one');                                                                   // 85
});                                                                                                   // 86
                                                                                                      // 87
Tinytest.add('ClientRouter - calling same route twice does not write to history', function (test) {   // 88
  var router = mockedRouter();                                                                        // 89
                                                                                                      // 90
  router.map(function() {                                                                             // 91
    this.route('one');                                                                                // 92
    this.route('two');                                                                                // 93
  });                                                                                                 // 94
                                                                                                      // 95
  var location = new LocationMock;                                                                    // 96
  var setCalled = 0, oldSet = location.set                                                            // 97
  location.set = function() {                                                                         // 98
    setCalled += 1;                                                                                   // 99
    oldSet.apply(this, arguments);                                                                    // 100
  }                                                                                                   // 101
                                                                                                      // 102
  router.configure({ location: location });                                                           // 103
                                                                                                      // 104
  // starting the router doesn't set the url                                                          // 105
  router.start();                                                                                     // 106
  test.equal(setCalled, 0);                                                                           // 107
                                                                                                      // 108
  router.go(router.path('one'));                                                                      // 109
  test.equal(setCalled, 0);                                                                           // 110
  router.go(router.path('two'));                                                                      // 111
  test.equal(setCalled, 1);                                                                           // 112
  router.go(router.path('one'));                                                                      // 113
  test.equal(setCalled, 2);                                                                           // 114
  router.go(router.path('one'));                                                                      // 115
  test.equal(setCalled, 2);                                                                           // 116
});                                                                                                   // 117
                                                                                                      // 118
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages\iron-router\test\client\route_controller.js                                               //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
// lookupTemplate                                                                                     // 1
// lookupLayoutTemplate                                                                               // 2
// lookupRegionTemplates                                                                              // 3
// lookupWaitOn                                                                                       // 4
// render                                                                                             // 5
// renderRegions                                                                                      // 6
// wait                                                                                               // 7
                                                                                                      // 8
var createController = function (proto, opts) {                                                       // 9
  var createRouter = function () {                                                                    // 10
    return new IronRouter({                                                                           // 11
      autoRender: false,                                                                              // 12
      autoStart: false                                                                                // 13
    });                                                                                               // 14
  };                                                                                                  // 15
  var route = new Route(Router, 'test', {});                                                          // 16
                                                                                                      // 17
  var R = RouteController.extend(proto || {});                                                        // 18
  return new R(Router, route, opts);                                                                  // 19
};                                                                                                    // 20
                                                                                                      // 21
Tinytest.add('Client RouteController - Router UI API', function (test) {                              // 22
  var c = createController();                                                                         // 23
  var router = c.router;                                                                              // 24
                                                                                                      // 25
  var calls = [];                                                                                     // 26
  router.layout = function () {                                                                       // 27
    calls.push('layout');                                                                             // 28
  };                                                                                                  // 29
                                                                                                      // 30
  router.setRegion = function () {                                                                    // 31
    calls.push('setRegion');                                                                          // 32
  };                                                                                                  // 33
                                                                                                      // 34
  router.clearRegion = function () {                                                                  // 35
    calls.push('clearRegion');                                                                        // 36
  };                                                                                                  // 37
                                                                                                      // 38
  c.layout();                                                                                         // 39
  test.equal(calls[0], 'layout', 'layout not proxied to router');                                     // 40
                                                                                                      // 41
  c.setRegion();                                                                                      // 42
  test.equal(calls[1], 'setRegion', 'setRegion not proxied to router');                               // 43
                                                                                                      // 44
  c.clearRegion();                                                                                    // 45
  test.equal(calls[2], 'clearRegion', 'clearRegion not proxied to router');                           // 46
});                                                                                                   // 47
                                                                                                      // 48
Tinytest.add('Client RouteController - data', function (test) {                                       // 49
  var cWithDataFunc = createController({                                                              // 50
    data: function () {                                                                               // 51
      return 'value';                                                                                 // 52
    }                                                                                                 // 53
  });                                                                                                 // 54
                                                                                                      // 55
  var cWithDataValue = createController({                                                             // 56
    data: 'value'                                                                                     // 57
  });                                                                                                 // 58
                                                                                                      // 59
  var cWithNoData = createController();                                                               // 60
                                                                                                      // 61
  var value;                                                                                          // 62
                                                                                                      // 63
  value = cWithDataFunc.data();                                                                       // 64
  test.equal(value, 'value', "couldn't get value from data function");                                // 65
                                                                                                      // 66
  value = cWithDataValue.data();                                                                      // 67
  test.equal(value, 'value', "couldn't get value from data value");                                   // 68
                                                                                                      // 69
  value = cWithNoData.data();                                                                         // 70
  test.isNull(value, "controller with no data should give null value");                               // 71
});                                                                                                   // 72
                                                                                                      // 73
Tinytest.add('Client RouteController - _run order', function (test) {                                 // 74
  var calls = [];                                                                                     // 75
                                                                                                      // 76
  var c = createController({                                                                          // 77
    onRun: function () {                                                                              // 78
      calls.push('onRun');                                                                            // 79
    },                                                                                                // 80
                                                                                                      // 81
    onStop: function () {                                                                             // 82
      calls.push('onStop');                                                                           // 83
    },                                                                                                // 84
                                                                                                      // 85
    waitOn: function () {                                                                             // 86
      calls.push('waitOn');                                                                           // 87
    },                                                                                                // 88
                                                                                                      // 89
    data: function () {                                                                               // 90
      calls.push('data');                                                                             // 91
    },                                                                                                // 92
                                                                                                      // 93
    onData: function () {                                                                             // 94
      calls.push('onData');                                                                           // 95
    },                                                                                                // 96
                                                                                                      // 97
    onBeforeAction: function () {                                                                     // 98
      calls.push('onBeforeAction');                                                                   // 99
    },                                                                                                // 100
                                                                                                      // 101
    action: function () {                                                                             // 102
      calls.push('action');                                                                           // 103
    },                                                                                                // 104
                                                                                                      // 105
    onAfterAction: function () {                                                                      // 106
      calls.push('onAfterAction');                                                                    // 107
    }                                                                                                 // 108
  });                                                                                                 // 109
                                                                                                      // 110
  c.router.layout = function () {                                                                     // 111
    calls.push('layout');                                                                             // 112
  };                                                                                                  // 113
                                                                                                      // 114
  c.router.setRegion = function () {                                                                  // 115
  };                                                                                                  // 116
                                                                                                      // 117
  c.router.setData = function () {                                                                    // 118
  };                                                                                                  // 119
                                                                                                      // 120
  c.router.clearUnusedRegions = function () {                                                         // 121
  };                                                                                                  // 122
                                                                                                      // 123
  // make sure onRun hook gets called again                                                           // 124
  c.router._hasJustReloaded = false;                                                                  // 125
  c._run();                                                                                           // 126
                                                                                                      // 127
  test.equal(calls, [                                                                                 // 128
    'layout',                                                                                         // 129
    'onRun',                                                                                          // 130
    'waitOn',                                                                                         // 131
    'data',                                                                                           // 132
    'onData',                                                                                         // 133
    'onBeforeAction',                                                                                 // 134
    'action',                                                                                         // 135
    'onAfterAction'                                                                                   // 136
  ], 'run order seems wrong');                                                                        // 137
});                                                                                                   // 138
                                                                                                      // 139
Tinytest.add('Client RouteController - _run then stop', function (test) {                             // 140
  var c = createController();                                                                         // 141
  c._run();                                                                                           // 142
  test.isFalse(c._computation.stopped, "doesn't look like the controller's computation si running."); // 143
  c.stop();                                                                                           // 144
  test.isTrue(c._computation.stopped, "stop() didn't stop the controller's computation.");            // 145
});                                                                                                   // 146
                                                                                                      // 147
Tinytest.add('Client RouteController - _run computation isolation', function (test) {                 // 148
  var calls = {};                                                                                     // 149
  var totalCalls = 0;                                                                                 // 150
  var logCall = function (name) {                                                                     // 151
    totalCalls++;                                                                                     // 152
    calls[name] = calls[name] || 0;                                                                   // 153
    calls[name]++;                                                                                    // 154
  };                                                                                                  // 155
                                                                                                      // 156
  var deps = {};                                                                                      // 157
  _.each(['onRun', 'waitOn', 'data', 'action', 'onStop'], function (name) {                           // 158
    deps[name] = new Deps.Dependency;                                                                 // 159
  });                                                                                                 // 160
                                                                                                      // 161
  var c = createController({                                                                          // 162
    onRun: function () {                                                                              // 163
      deps.onRun.depend();                                                                            // 164
      logCall('onRun');                                                                               // 165
    },                                                                                                // 166
                                                                                                      // 167
    waitOn: function () {                                                                             // 168
      deps.waitOn.depend();                                                                           // 169
      logCall('waitOn');                                                                              // 170
    },                                                                                                // 171
                                                                                                      // 172
    data: function () {                                                                               // 173
      deps.data.depend();                                                                             // 174
      logCall('data');                                                                                // 175
    },                                                                                                // 176
                                                                                                      // 177
    onBeforeAction: function () {                                                                     // 178
      logCall('onBeforeAction');                                                                      // 179
    },                                                                                                // 180
                                                                                                      // 181
    action: function () {                                                                             // 182
      logCall('action');                                                                              // 183
      deps.action.depend();                                                                           // 184
    },                                                                                                // 185
                                                                                                      // 186
    onAfterAction: function () {                                                                      // 187
      logCall('onAfterAction');                                                                       // 188
    }                                                                                                 // 189
  });                                                                                                 // 190
                                                                                                      // 191
  c._run();                                                                                           // 192
                                                                                                      // 193
  // everything but onStop                                                                            // 194
  test.equal(totalCalls, 6, 'first run');                                                             // 195
                                                                                                      // 196
  // now invalidate the onRun dep                                                                     // 197
  deps.onRun.changed();                                                                               // 198
  Deps.flush();                                                                                       // 199
  test.equal(totalCalls, 7, 'only onRun should have rerun');                                          // 200
  test.equal(calls.onRun, 2, 'onRun should rerun');                                                   // 201
                                                                                                      // 202
  // okay now the waitOn function!                                                                    // 203
  deps.waitOn.changed();                                                                              // 204
  Deps.flush();                                                                                       // 205
  test.equal(totalCalls, 8, 'only waitOn should have rerun');                                         // 206
  test.equal(calls.waitOn, 2, 'waitOn should rerun');                                                 // 207
                                                                                                      // 208
  // whoop whoop, now the data function!                                                              // 209
  deps.data.changed();                                                                                // 210
  Deps.flush();                                                                                       // 211
  test.equal(totalCalls, 9, 'only data should have rerun');                                           // 212
  test.equal(calls.data, 2, 'data should rerun');                                                     // 213
                                                                                                      // 214
  // almost! now the action functions!                                                                // 215
  deps.action.changed();                                                                              // 216
  Deps.flush();                                                                                       // 217
  // 9 to 12 is because action invalidtes                                                             // 218
  // onBeforeAction, action, onAfterAction                                                            // 219
  test.equal(totalCalls, 12, 'only action should have rerun');                                        // 220
  test.equal(calls.action, 2, 'action should rerun');                                                 // 221
  test.equal(calls.onBeforeAction, 2, 'onBeforeAction should rerun');                                 // 222
  test.equal(calls.onAfterAction, 2, 'onAfterAction should rerun');                                   // 223
});                                                                                                   // 224
                                                                                                      // 225
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages\iron-router\test\client\wait_list.js                                                      //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
// TODO -- add basic tests                                                                            // 1
                                                                                                      // 2
Tinytest.add('Waitlist - removes subs when computation invalidates', function(test) {                 // 3
  var waitlist = new WaitList;                                                                        // 4
                                                                                                      // 5
  Session.set('skip', false);                                                                         // 6
  Deps.autorun(function() {                                                                           // 7
    if (! Session.get('skip'))                                                                        // 8
      waitlist.push(Meteor.subscribe('neverReady'));                                                  // 9
  });                                                                                                 // 10
  test.isFalse(waitlist.ready());                                                                     // 11
  test.equal(waitlist._list.length, 1);                                                               // 12
                                                                                                      // 13
  Session.set('skip', true);                                                                          // 14
  Deps.flush();                                                                                       // 15
  test.isTrue(waitlist.ready());                                                                      // 16
  test.equal(waitlist._list.length, 0);                                                               // 17
});                                                                                                   // 18
                                                                                                      // 19
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
