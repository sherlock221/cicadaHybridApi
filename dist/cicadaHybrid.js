/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/src/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _nativeSocket = __webpack_require__(1);

	var _nativeSocket2 = _interopRequireDefault(_nativeSocket);

	var _ui = __webpack_require__(4);

	var _ui2 = _interopRequireDefault(_ui);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * js与原生通讯方案
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * sherlock221b
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 核心部分参考 https://github.com/chemdemo/hybrid-js/blob/master/lib/core.js
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(2);

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HybridJS = {};
	var REQUEST_FUN_BACK = 'req_fun';
	var RESPONSE_FUN_BACK = 'res_fun';
	var WEB_CB_SN_PREFIX = '__ca_';
	var SLICE = Array.prototype.slice;

	var CALLBACKS = {};

	var NativeSocket = function () {
	    function NativeSocket() {
	        _classCallCheck(this, NativeSocket);

	        HybridJS = _util2.default.getRoot();
	        var m = _config.UA.match(new RegExp(_config.OS_NAME + '\\/([^\\/]+)\\/(\\d+)'));
	        console.log(m);
	    }

	    /**
	     * js调用原生api
	     * @param api
	     * @param params
	     * @param callBack
	     * @returns {boolean}
	     */


	    _createClass(NativeSocket, [{
	        key: "invokeNative",
	        value: function invokeNative(api, params, callBack) {
	            if (!api) throw Error("api 未填写...");

	            //api名称
	            var names = api.split(/\.|\//);
	            var method = names.pop();
	            var ns = undefined;
	            var fn = undefined;

	            if (!names.length || !method) throw Error('api ' + api + ' has not assigned');
	            ns = names.join('/');

	            //检测回调函数
	            if (callBack && _util2.default.isFn(callBack)) {
	                //注册一个回调函数
	                fn = this._callbackSign(api, callBack, params.context || HybridJS, params.nextTick !== undefined ? params.nextTick : true);

	                delete params.callback;
	                delete params.context;
	                delete params.nextTick;
	            }

	            //组装url
	            var url = _config.SCHEMA + "://" + ns + "/" + method;

	            //回调函数
	            if (fn) params[REQUEST_FUN_BACK] = fn;

	            //参数进行封装
	            if (params) {
	                url += this._encodeParam(params);
	            }

	            if (fn) delete params[REQUEST_FUN_BACK];

	            _util2.default.log("编译前的: ", decodeURIComponent(url));
	            _util2.default.log("编译后的: ", url);

	            //执行
	            this._invokeByUrlSchema(url);

	            //如果有回调函数则返回标识
	            return fn;
	        }
	    }, {
	        key: "invokeWeb",


	        /**
	         * 1.native回调web
	         * 2.调用web方法
	         * @param api
	         * @param str
	         */
	        value: function invokeWeb(api, str) {
	            if (typeof api !== 'string' || str && typeof str !== 'string') throw Error('参数不合法，必须是字符串');

	            var params = undefined;

	            //解码
	            str = decodeURIComponent(str);

	            try {
	                params = JSON.parse(str);
	            } catch (e) {
	                if (/{/.test(str)) throw e;
	                params = null;
	            }

	            _util2.default.log("app发送的参数: ", JSON.stringify(params));

	            var responseFun = params ? params[RESPONSE_FUN_BACK] : null;
	            //调用回调函数
	            if (responseFun) {
	                var callback = this._findCallback(api, responseFun);
	                delete params[RESPONSE_FUN_BACK];

	                if (_util2.default.isFn(callback)) {
	                    callback(params.data);
	                }

	                return;
	            }
	            //发送事件
	            else {
	                    _util2.default.log("发送事件");
	                }
	        }
	    }, {
	        key: "_encodeParam",
	        value: function _encodeParam(params) {
	            var i = 0;
	            var baseUrl = "";
	            for (var p in params) {
	                baseUrl += "" + (i == 0 ? '?' : "&") + p + "=" + params[p];
	                i++;
	            }
	            return encodeURIComponent(baseUrl);
	        }
	    }, {
	        key: "_callbackSign",


	        //注册一个回调函数
	        value: function _callbackSign(api, callback, context, nextTick) {
	            if (_util2.default.isFn(callback)) {
	                var _ret = function () {
	                    api = api.replace(/\./g, '/');

	                    var sn = WEB_CB_SN_PREFIX + Date.now();
	                    var map = CALLBACKS[api] || (CALLBACKS[api] = {});
	                    // let map = createNamespace(CALLBACKS, api.split(/\./));
	                    // 注意，箭头函数没有arguments！！
	                    map[sn] = function (value) {
	                        var args = SLICE.call(arguments);

	                        if (!nextTick) {
	                            callback.apply(context, args);
	                        } else {
	                            setTimeout(function () {
	                                callback.apply(context, args);
	                            }, 0);
	                        }

	                        delete map[sn];
	                    };

	                    return {
	                        v: sn
	                    };
	                }();

	                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
	            }

	            return '';
	        }
	    }, {
	        key: "_invokeByUrlSchema",
	        value: function _invokeByUrlSchema(url) {
	            window.location.href = url;
	        }
	    }, {
	        key: "_findCallback",
	        value: function _findCallback(api, sn) {
	            api = api.replace(/\./g, '/');
	            return (CALLBACKS[api] || {})[sn];
	        }
	    }]);

	    return NativeSocket;
	}();

	var ns = new NativeSocket();

	HybridJS.core = ns;

	module.exports = ns;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	//私有协议
	var SCHEMA = "cicada";
	//暴露出来的API标识
	var API_ROOT = "HybridJS";
	//浏览器ua
	var UA = window.navigator.userAgent;
	//系统名称
	var OS_NAME = "cicada";
	var DE_BUG = true;

	module.exports = {
	    SCHEMA: SCHEMA,
	    API_ROOT: API_ROOT,
	    UA: UA,
	    OS_NAME: OS_NAME,
	    DE_BUG: DE_BUG
		};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by jiaaobo on 16/4/10.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Util = function () {
	    function Util() {
	        _classCallCheck(this, Util);
	    }

	    _createClass(Util, null, [{
	        key: 'log',


	        /**
	         * 调试
	          * @param message
	         */
	        value: function log() {
	            var message = '';
	            if (_config.DE_BUG) {
	                for (var i = 0; i < arguments.length; i++) {
	                    message += arguments[i];
	                }
	                console.log(message);
	            }
	        }
	    }, {
	        key: 'getRoot',
	        value: function getRoot() {
	            if (!window[_config.API_ROOT]) window[_config.API_ROOT] = {};

	            return window[_config.API_ROOT];
	        }
	    }, {
	        key: 'isFn',
	        value: function isFn(fn) {
	            return typeof fn === 'function';
	        }
	    }]);

	    return Util;
	}();

	exports.default = Util;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	var _toast = __webpack_require__(5);

	var _toast2 = _interopRequireDefault(_toast);

	var _alert = __webpack_require__(6);

	var _alert2 = _interopRequireDefault(_alert);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_util2.default.getRoot().ui = {
	  toast: _toast2.default,
	  alert: _alert2.default
	}; /**
	    * Created by jiaaobo on 16/4/10.
	    */

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by jiaaobo on 16/4/10.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HybridJS = _util2.default.getRoot();

	var Toast = function () {
	    function Toast() {
	        _classCallCheck(this, Toast);
	    }

	    _createClass(Toast, null, [{
	        key: "show",
	        value: function show(message, duration) {
	            duration = duration || 2000;
	            HybridJS.core.invokeNative("ui.toast", { message: message, display: true, duration: duration });
	        }
	    }, {
	        key: "hide",
	        value: function hide() {
	            HybridJS.core.invokeNative("ui.toast", { display: false });
	        }
	    }]);

	    return Toast;
	}();

	exports.default = Toast;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by jiaaobo on 16/4/10.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HybridJS = _util2.default.getRoot();

	var Alert = function () {
	    function Alert() {
	        _classCallCheck(this, Alert);
	    }

	    _createClass(Alert, null, [{
	        key: "show",
	        value: function show(message) {
	            HybridJS.core.invokeNative("ui.alert", { message: message, display: true });
	        }
	    }, {
	        key: "hide",
	        value: function hide() {
	            HybridJS.core.invokeNative("ui.alert", { display: false });
	        }
	    }]);

	    return Alert;
	}();

	exports.default = Alert;

/***/ }
/******/ ]);
//# sourceMappingURL=cicadaHybrid.js.map