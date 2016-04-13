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

	var _eventModel = __webpack_require__(7);

	var _eventModel2 = _interopRequireDefault(_eventModel);

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

	        //事件模型暴露
	        HybridJS.event = _eventModel2.default;
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

	            _util2.default.log("当前回调函数栈: ", CALLBACKS);

	            //组装url
	            var url = _config.SCHEMA + "://" + _config.SOURCE + "/" + ns + "/" + method;

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
	            //主动通知web
	            else {
	                    _util2.default.log("发送事件");
	                    if (/^sdk(?:\.|\/)notify/.test(api) && params) {
	                        var data = params.data || {};
	                        _eventModel2.default.emit(params.event, data);
	                        return;
	                    }
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
	//通信来源
	var SOURCE = "hybrid";
	var DE_BUG = true;

	module.exports = {
	    SCHEMA: SCHEMA,
	    API_ROOT: API_ROOT,
	    UA: UA,
	    OS_NAME: OS_NAME,
	    DE_BUG: DE_BUG,
	    SOURCE: SOURCE
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
	                    if (arguments[i] instanceof Object) message += JSON.stringify(arguments[i]);else message += arguments[i];
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

	var _dialog = __webpack_require__(6);

	var _dialog2 = _interopRequireDefault(_dialog);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_util2.default.getRoot().ui = {
	  toast: _toast2.default,
	  dialog: _dialog2.default
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


	    /**
	     * 显示toast
	     * @param message
	     * @param duration 毫秒 如果duration = 0; 则一直显示
	     */
	    value: function show(message, duration) {

	      duration = duration || 2000;
	      HybridJS.core.invokeNative("ui.toast", { message: message, show: true, duration: duration });
	    }
	  }, {
	    key: "hide",


	    /**
	     * 隐藏toast
	     */
	    value: function hide() {
	      HybridJS.core.invokeNative("ui.toast", { show: false });
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

	var Dialog = function () {
	    function Dialog() {
	        _classCallCheck(this, Dialog);
	    }

	    _createClass(Dialog, null, [{
	        key: "getDialogTypes",
	        value: function getDialogTypes() {
	            return {
	                //提示型弹窗
	                TIP_ALERT: "1",
	                //confirm型
	                CONFIRM: "2",
	                //Prompt型
	                PROMPT: "3"
	            };
	        }

	        /**
	         * 消息提示窗
	         * @param message
	         * @param title
	         */

	    }, {
	        key: "alert",
	        value: function alert(message, title, options) {
	            var data = {
	                message: message
	            };

	            //第二个参数
	            if (title instanceof Object) {
	                Dialog.show(Dialog.getDialogTypes().TIP_ALERT, message, null, title);
	            } else {
	                Dialog.show(Dialog.getDialogTypes().TIP_ALERT, message, title, options);
	            }
	        }
	    }, {
	        key: "confirm",


	        /**
	         * 询问提示框
	         * @param message
	         * @param title
	         */
	        value: function confirm(message, title, options) {
	            Dialog.show(Dialog.getDialogTypes().CONFIRM, message, title, options);
	        }
	    }, {
	        key: "show",
	        value: function show(dialogType, message, title) {
	            var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	            var DialogData = {
	                title: title || "",
	                message: message,
	                positiveButtonText: options.positiveButtonText || "确定",
	                cancelButtonText: options.cancelButtonText || "取消",
	                positiveCallBack: options.positiveCallBack || "",
	                cancelCallBack: options.cancelCallBack || ""
	            };

	            var TYPE = Dialog.getDialogTypes();
	            switch (dialogType) {
	                case TYPE.TIP_ALERT:
	                    HybridJS.core.invokeNative("ui.alert", DialogData);
	                    break;
	                case TYPE.CONFIRM:
	                    HybridJS.core.invokeNative("ui.confirm", DialogData);
	                    break;
	                case TYPE.PROMPT:
	                    HybridJS.core.invokeNative("ui.prompt", DialogData);
	                    break;
	            }
	        }
	    }]);

	    return Dialog;
	}();

	exports.default = Dialog;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 事件模型
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * sherlock221b
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(2);

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HANDLERS = {};

	var EventModel = function () {
	    function EventModel() {
	        _classCallCheck(this, EventModel);
	    }

	    _createClass(EventModel, null, [{
	        key: "on",


	        //绑定事件
	        value: function on(event, handler) {
	            var fns = HANDLERS[event];

	            if (!_util2.default.isFn(handler)) return false;

	            if (!handler.name) console.warn("绑定事件 " + event + " 请尽量不用匿名函数！");

	            if (fns) {
	                if (!Array.isArray(fns)) fns = [fns];
	                if (Array.isArray(fns) && ~fns.indexOf(handler)) return false;
	                fns.push(handler);
	            } else {
	                fns = handler;
	            }

	            HANDLERS[event] = fns;
	            return true;
	        }
	    }, {
	        key: "off",


	        //取消绑定
	        value: function off(event, handler) {
	            if (!(event in HANDLERS)) return false;
	            if (_util2.default.isFn(handler)) {
	                var fns = HANDLERS[event];

	                if (Array.isArray(fns)) {
	                    HANDLERS[event] = fns.filter(function (fn) {
	                        return fn != handler;
	                    });

	                    return HANDLERS[event].length !== fns.length;
	                } else {
	                    return fns == handler ? delete HANDLERS[event] : false;
	                }
	            } else {
	                return delete HANDLERS[event];
	            }
	        }
	    }, {
	        key: "emit",
	        value: function emit(event, data) {

	            if (!event) {
	                console.warn('Receive empty event');
	                return;
	            }

	            var fns = HANDLERS[event];

	            if (!(event in HANDLERS)) {
	                console.warn('event %s has not emited', event);
	                return;
	            }

	            if (Array.isArray(fns)) fns.forEach(function (fn) {
	                fn(data);
	            });else if (_util2.default.isFn(fns)) fns(data);

	            console.log("emit 绑定事件栈 : ", HANDLERS);
	        }
	    }]);

	    return EventModel;
	}();

	exports.default = EventModel;


		module.exports = EventModel;

/***/ }
/******/ ]);
//# sourceMappingURL=cicadaHybrid.js.map