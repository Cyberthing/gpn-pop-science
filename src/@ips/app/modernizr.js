    

/*!
 * modernizr v3.3.1
 * Build http://modernizr.com/download?-setclasses-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

(function(window, document){
  var tests = [];
  

  /**
   *
   * ModernizrProto is the constructor for Modernizr
   *
   * @class
   * @access public
   */

  var ModernizrProto = {
    // The current version, dummy
    _version: '3.3.1',

    // Any settings that don't work as separate modules
    // can go in here as configuration.
    _config: {
      'classPrefix': '',
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },

    // Queue of tests
    _q: [],

    // Stub these for people who are listening
    on: function(test, cb) {
      // I don't really think people should do this, but we can
      // safe guard it a bit.
      // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
      // This is in case people listen to synchronous tests. I would leave it out,
      // but the code to *disallow* sync tests in the real version of this
      // function is actually larger than this.
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },

    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },

    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };

  

  // Fake some of Object.create so we can force non test results to be non "own" properties.
  var Modernizr= function() {};
  Modernizr.prototype = ModernizrProto;

  // Leak modernizr globally when you `require` it rather than force it here.
  // Overwrite name so constructor name is nicer :D
  Modernizr = new Modernizr();

  

  var classes = [];
  

  /**
   * is returns a boolean if the typeof an obj is exactly type.
   *
   * @access private
   * @function is
   * @param {*} obj - A thing we want to check the type of
   * @param {string} type - A string to compare the typeof against
   * @returns {boolean}
   */

  function is(obj, type) {
    return typeof obj === type;
  }


  /**
   * Run through all tests and detect their support in the current UA.
   *
   * @access private
   */

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        // run the test, throw the return value into the Modernizr,
        // then based on that boolean, define an appropriate className
        // and push it into an array of classes we'll join later.
        //
        // If there is no name, it's an 'async' test that is run,
        // but not directly added to the object. That should
        // be done with a post-run addTest call.
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            // Add all the aliases into the names list
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }

        // Run the test, or use the raw value if it's not a function
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


        // Set each of the names on the Modernizr object
        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureName = featureNames[nameIdx];
          // Support dot properties as sub tests. We don't do checking to make sure
          // that the implied parent tests have been added. You must call them in
          // order (either in the test, or make the parent test a dependency).
          //
          // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
          // hashtag famous last words
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            // cast to a Boolean, if not one already
            /* jshint -W053 */
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }
  

  /**
   * docElement is a convenience wrapper to grab the root element of the document
   *
   * @access private
   * @returns {HTMLElement|SVGElement} The root element of the document
   */

  var docElement = document.documentElement;
  

  /**
   * A convenience helper to check if the document we are running in is an SVG document
   *
   * @access private
   * @returns {boolean}
   */

  var isSVG = docElement.nodeName.toLowerCase() === 'svg';
  

  /**
   * setClasses takes an array of class names and adds them to the root element
   *
   * @access private
   * @function setClasses
   * @param {string[]} classes - Array of class names
   */

  // Pass in an and array of class names, e.g.:
  //  ['no-webp', 'borderradius', ...]
  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';

    if (isSVG) {
      className = className.baseVal;
    }

    // Change `no-js` to `js` (independently of the `enableClasses` option)
    // Handle classPrefix on this too
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      // Add the new classes
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      isSVG ? docElement.className.baseVal = className : docElement.className = className;
    }

  }

  addMyModernizrTests(ModernizrProto, Modernizr)

  // Run each test
  testRunner();

  // Remove the "no-js" class if it exists
  setClasses(classes);

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;

  // Run the things that are supposed to run after the tests
  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }

  // Leak Modernizr namespace
  window.Modernizr = Modernizr;



})(window, document);

function detectIOS(){
  if (/iPad|iPhone/.test(navigator.platform)) {
    return true;
  }
  return navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 0 &&
      /MacIntel/.test(navigator.platform);  
}

function addMyModernizrTests(Tester, Modernizr){
    
    Tester.addTest('platform-ipad', function () {
      return detectIOS() && !navigator.userAgent.match(/iPhone/i);
    });
    
    Tester.addTest('platform-iphone', function () {
      return !!navigator.userAgent.match(/iPhone/i);
    });
    
    Tester.addTest('platform-ios', function () {
      return detectIOS()
      // return (Modernizr['platform-ipad'] || Modernizr['platform-ipod'] || Modernizr['platform-iphone']);
    });
    
    Tester.addTest('platform-macos', function () {
      return navigator.platform.match(/Mac/i);
    });
    
    Tester.addTest('platform-windows', function () {
      return navigator.userAgent.match(/Win/i);
    });

    Tester.addTest('browser-chrome', function () {
      return navigator.userAgent.match(/Chrome/i);
    });

    Tester.addTest('browser-firefox', function () {
      return navigator.userAgent.match(/Firefox/i);
    });

    Tester.addTest('browser-duckduckgo', function () {
      return navigator.userAgent.match(/DuckDuckGo/i);
    });
    
    Tester.addTest('browser-ie', function () {
      return 'undefined' != typeof document.documentMode;//!!navigator.userAgent.match(/MSIE/i);
    });
    
    Tester.addTest('browser-safari', function () {
      return navigator.userAgent.match(/Safari/i) && !navigator.userAgent.match(/Chrome/i);
    });

    Tester.addTest('browser-ie9', function () {
      return 'undefined' != typeof document.documentMode && document.documentMode == 9; //!!navigator.userAgent.match(/MSIE 9.0/i);
    });
    
    Tester.addTest('browser-ie10', function () {
      return 'undefined' != typeof document.documentMode && document.documentMode == 10; //!!navigator.userAgent.match(/MSIE 10.0/i);
    });
    
    Tester.addTest('browser-ie11', function () {
      return 'undefined' != typeof document.documentMode && document.documentMode == 11; //!!navigator.userAgent.match(/MSIE 11.0/i);
    });
    
    Tester.addTest('platform-mobile', function(){
        const mm = (function(a){ return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||('undefined' != typeof window.opera ? window.opera : ''))
        const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        const ipadv = Modernizr['platform-ios'] && ( w < 1024 )
        return mm || ipadv;
    })

    Tester.addTest('embed-ria', function () {
      return ('undefined' != typeof __ips_embed_ria__) && __ips_embed_ria__;
    });

    Tester.addTest('topline-ria', function () {
      return ('undefined' != typeof __ips_topline_ria__) && __ips_topline_ria__;
    });

    Tester.addTest('inline-ria', function () {
      return document.body.classList.contains('m-ria')
    });

    Tester.addTest('inline-sputnik', function () {
      const spoo = [
        'sputniknews.com', 
        'sputnikglobe.com',
        'sputnikarabic.ae',
        'sputniknews.com.tr',
        'spnfa.ir',
        'sputnik.af',
        'sputniknews.lat',
        'sputniknewsbr.com.br',
        'hindi.sputniknews.in',
        'sputniknews.in',
        'sputniknews.vn',
        'sputniknews.jp',
        'sputniknews.cn',
        'sputnik.kz',
        'sputnik.kg',
        'oz.sputniknews.uz',
        'sputnik.tj',
        'fr.sputniknews.africa',
        'en.sputniknews.africa',
        'armeniasputnik.am',
        'sputnik-abkhazia.info',
        'sputnik-ossetia.com',
        'sputnik-georgia.com',
        'sputnik.az',
        'sputnikportal.rs',
        'snanews.de',
        'it.sputniknews.com',
        'cz.sputniknews.com',
        'pl.sputniknews.com',
        'lv.sputniknews.ru',
        'lt.sputniknews.ru',
        'md.sputniknews.com',
        'bel.sputnik.by',
        ]
      return spoo.some(s=>location.host.endsWith(s))
    });
}
// 
// 
// https://sputnikglobe.com/
// https://sputnikarabic.ae/
// https://sputniknews.com.tr/
// https://spnfa.ir/
// https://sputnik.af/
// https://sputniknews.lat/
// https://sputniknewsbr.com.br/
// https://hindi.sputniknews.in/
// https://sputniknews.in/
// https://sputniknews.vn/
// https://sputniknews.jp/
// https://sputniknews.cn/
// 
// https://sputnik.kz/
// https://sputnik.kg/
// https://oz.sputniknews.uz/
// https://sputnik.tj/
// 
// https://fr.sputniknews.africa/
// https://en.sputniknews.africa/
// 
// https://armeniasputnik.am/
// https://sputnik-abkhazia.info/
// https://sputnik-ossetia.com/
// https://sputnik-georgia.com/
// https://sputnik.az/
// 
// 
// https://sputnikportal.rs/
// https://snanews.de/
// https://it.sputniknews.com/
// https://cz.sputniknews.com/
// https://pl.sputniknews.com/
// https://lv.sputniknews.ru/
// https://lt.sputniknews.ru/
// https://md.sputniknews.com/
// https://bel.sputnik.by/
