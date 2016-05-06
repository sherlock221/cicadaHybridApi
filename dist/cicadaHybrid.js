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

	var _ui = __webpack_require__(5);

	var _ui2 = _interopRequireDefault(_ui);

	var _api = __webpack_require__(11);

	var _api2 = _interopRequireDefault(_api);

	var _storage = __webpack_require__(16);

	var _storage2 = _interopRequireDefault(_storage);

	var _local = __webpack_require__(18);

	var _local2 = _interopRequireDefault(_local);

	var _navigation = __webpack_require__(20);

	var _navigation2 = _interopRequireDefault(_navigation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * js与原生通讯方案
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * sherlock221b
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _config = __webpack_require__(2);

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	var _eventModel = __webpack_require__(4);

	var _eventModel2 = _interopRequireDefault(_eventModel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HybridJS = {};
	var REQUEST_FUN_BACK = 'req_fun';
	var RESPONSE_FUN_BACK = 'res_fun';
	var WEB_CB_SN_PREFIX = '__ca_';
	var SLICE = Array.prototype.slice;

	var CALLBACKS = {};

	/**
	 * js与原生核心通信
	 * 1.js调用原生 url拦截
	 * 2.原生调用js 通过JS注入
	 */

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
	        value: function invokeNative(api, params, callBack, callBackType) {
	            if (!api) throw Error("api 未填写...");

	            //api名称
	            var names = api.split(/\.|\//);
	            var method = names.pop();
	            var ns = void 0;
	            var fns = new Map();

	            if (!names.length || !method) throw Error('api ' + api + ' has not assigned');
	            ns = names.join('/');

	            //检测回调函数
	            if (callBack) {
	                //单个回调函数
	                if (_util2.default.isFn(callBack)) {
	                    var fn = this._callbackSign(api, callBack, callBackType, params.context || HybridJS, params.nextTick !== undefined ? params.nextTick : true);
	                    fns.set(REQUEST_FUN_BACK, fn);
	                }
	                //多个回调函数
	                else {

	                        for (var cb in callBack) {
	                            var empCallBack = callBack[cb];
	                            if (_util2.default.isFn(empCallBack)) {
	                                var _fn = this._callbackSign(api, empCallBack, callBackType, params.context || HybridJS, params.nextTick !== undefined ? params.nextTick : true);
	                                fns.set(cb, _fn);
	                            }
	                        }
	                    }

	                delete params.callback;
	                delete params.context;
	                delete params.nextTick;
	            }

	            //组装url
	            var url = _config.SCHEMA + "://" + _config.SOURCE + "/" + ns + "/" + method;

	            //回调函数
	            var keyTemp = [];
	            if (fns.size > 0) {
	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;

	                try {
	                    for (var _iterator = fns.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var _step$value = _slicedToArray(_step.value, 2);

	                        var key = _step$value[0];
	                        var value = _step$value[1];

	                        params[key] = value;
	                        keyTemp.push(key);
	                    }
	                } catch (err) {
	                    _didIteratorError = true;
	                    _iteratorError = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion && _iterator.return) {
	                            _iterator.return();
	                        }
	                    } finally {
	                        if (_didIteratorError) {
	                            throw _iteratorError;
	                        }
	                    }
	                }
	            };

	            //参数进行封装
	            if (params) {
	                url += this._encodeParam(params);
	            }

	            //删除
	            if (keyTemp.length > 0) {
	                keyTemp.forEach(function (key) {
	                    delete params[key];
	                });
	            }

	            console.log(CALLBACKS);
	            _util2.default.log("当前回调函数栈: ", fns);

	            _util2.default.log("编译前的: ", decodeURIComponent(url));
	            _util2.default.log("编译后的: ", url);

	            //执行
	            this._invokeByUrlSchema(url);

	            //如果有回调函数则返回标识
	            return fns;
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

	            var params = void 0;

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
	                    callback(params.result.data);
	                }
	                return;
	            }
	            //主动通知web
	            else {
	                    _util2.default.log("发送事件");
	                    if (/^sdk(?:\.|\/)notify/.test(api) && params) {
	                        var data = params.result.data || {};
	                        _eventModel2.default.emit(params.result.event, data);
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
	        key: "registerCallBack",


	        /**
	         * 开放注册回调函数
	         * @returns {*}
	         */
	        value: function registerCallBack(api, callBack, callBackType, params) {
	            params = params || {};
	            var fn = this._callbackSign(api, callBack, callBackType, params.context || HybridJS, params.nextTick !== undefined ? params.nextTick : true);
	            console.log(CALLBACKS);

	            return fn;
	        }
	    }, {
	        key: "cancelCallBack",


	        /**
	         * 注销回调函数
	         * @param api
	         * @param sn
	         */
	        value: function cancelCallBack(api, sn) {
	            var map = CALLBACKS[api] || (CALLBACKS[api] = {});
	            delete map[sn];
	        }
	    }, {
	        key: "getCallBacks",


	        /**
	         * 获得所有回调函数
	         */
	        value: function getCallBacks() {
	            return CALLBACKS;
	        }
	    }, {
	        key: "_callbackSign",


	        //注册一个回调函数
	        value: function _callbackSign(api, callback, callbackType, context, nextTick) {
	            if (_util2.default.isFn(callback)) {
	                var _ret = function () {
	                    api = api.replace(/\./g, '/');

	                    var sn = WEB_CB_SN_PREFIX;

	                    //事件绑定
	                    if (callbackType) {
	                        sn += "$event$" + callbackType;
	                    } else {
	                        sn += Date.now();
	                    }

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

	                        //一次性函数
	                        if (!callbackType) delete map[sn];
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	var _toast = __webpack_require__(6);

	var _toast2 = _interopRequireDefault(_toast);

	var _dialog = __webpack_require__(7);

	var _dialog2 = _interopRequireDefault(_dialog);

	var _loading = __webpack_require__(8);

	var _loading2 = _interopRequireDefault(_loading);

	var _webview = __webpack_require__(9);

	var _webview2 = _interopRequireDefault(_webview);

	var _header = __webpack_require__(10);

	var _header2 = _interopRequireDefault(_header);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Created by jiaaobo on 16/4/10.
	 */

	_util2.default.getRoot().ui = {
	    toast: _toast2.default,
	    dialog: _dialog2.default,
	    loading: _loading2.default,
	    webview: _webview2.default,
	    header: _header2.default
		};

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

	var Toast = function () {
	  function Toast() {
	    _classCallCheck(this, Toast);
	  }

	  _createClass(Toast, null, [{
	    key: "show",


	    /**
	     * 显示toast
	     * @param message
	     * @param duration 毫秒 duration 为空 默认客户端设置
	     * @param duration 毫秒 duration 为-1 则需要点击才能消失(未实现)
	     */
	    value: function show(message, duration) {
	      duration = duration || "";
	      HybridJS.core.invokeNative("ui.toast.toggle", { message: message, show: true, duration: duration });
	    }
	  }, {
	    key: "hide",


	    /**
	     * 隐藏toast
	     */
	    value: function hide() {
	      HybridJS.core.invokeNative("ui.toast.toggle", { show: false });
	    }
	  }]);

	  return Toast;
	}();

		exports.default = Toast;

/***/ },
/* 7 */
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
/* 8 */
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

	var Loading = function () {
	  function Loading() {
	    _classCallCheck(this, Loading);
	  }

	  _createClass(Loading, null, [{
	    key: "show",


	    /**
	     * 显示Loading
	     * @param duration
	     */
	    value: function show() {
	      HybridJS.core.invokeNative("ui.loading.toggle", { show: true });
	    }
	  }, {
	    key: "hide",


	    /**
	     * 隐藏loading
	     */
	    value: function hide() {
	      HybridJS.core.invokeNative("ui.loading.toggle", { show: false });
	    }
	  }]);

	  return Loading;
	}();

		exports.default = Loading;

/***/ },
/* 9 */
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

	var WebView = function () {
	  function WebView() {
	    _classCallCheck(this, WebView);
	  }

	  _createClass(WebView, null, [{
	    key: "exit",


	    /**
	     * 退出关闭webview
	     * @param
	     */
	    value: function exit() {
	      HybridJS.core.invokeNative("ui.webview.exit", {});
	    }
	  }, {
	    key: "open",


	    /**
	     * 打开一个webview
	     */
	    value: function open(url) {
	      HybridJS.core.invokeNative("ui.webview.open", { url: url, targetType: "single" });
	    }
	  }]);

	  return WebView;
	}();

		exports.default = WebView;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * header组件 自定义
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by jiaaobo on 16/4/10.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HybridJS = _util2.default.getRoot();

	var Header = function () {
	    function Header() {
	        _classCallCheck(this, Header);
	    }

	    _createClass(Header, null, [{
	        key: "update",


	        /**
	         * 更新整个header
	         *
	         * iconType : 1 | 2  1:为图标  2:文字
	         */
	        value: function update(opts) {

	            //容错处理
	            if (!opts) return;
	            if (!opts.left) opts.left = [];
	            if (!opts.right) opts.right = [];
	            if (!opts.title) opts.title = "";

	            //api名称
	            var api = "ui.header.update";

	            //返回按钮
	            var backBtn = {
	                tagName: 'back',
	                value: "icon-back",
	                iconType: 1
	            };

	            var settings = {
	                left: [],
	                right: [],
	                title: ""
	            };

	            var _billBack = function _billBack(btn) {
	                if (btn.callBack && _util2.default.isFn(btn.callBack)) {
	                    var seed = HybridJS.core.registerCallBack(api, btn.callBack, btn.tagName);
	                    btn.req_fun = seed;
	                    delete btn.callBack;
	                }
	            };

	            settings.left = settings.left.concat([backBtn], opts.left);
	            settings.right = opts.right;
	            settings.title = opts.title;

	            //生成事件回调函
	            settings.left.forEach(_billBack);
	            settings.right.forEach(_billBack);

	            console.log(settings);
	            //let seedFun  = settings.right[0].req_fun;
	            //let seedFun2  = settings.right[1].req_fun;

	            HybridJS.core.invokeNative(api, { config: JSON.stringify(settings) });

	            //测试模拟
	            //setTimeout(function(){
	            //    console.log(HybridJS.core.getCallBacks());
	            //    HybridJS.core.invokeWeb(api,JSON.stringify({
	            //        rtnCode : "200",
	            //        msg : "成功",
	            //        res_fun : seedFun,
	            //        result  : {
	            //            data  : {userId : 10}
	            //        }
	            //    }));
	            //
	            //
	            //},2000);
	        }
	    }, {
	        key: "setTitle",


	        /**
	         * 设置标题
	         * @param title
	         */
	        value: function setTitle(title) {
	            HybridJS.core.invokeNative("ui.header.setTitle", {
	                title: title
	            });
	        }
	    }, {
	        key: "show",


	        /**
	         * 显示header
	         */
	        value: function show() {
	            HybridJS.core.invokeNative("ui.header.toggle", {
	                show: true
	            });
	        }
	    }, {
	        key: "hide",


	        /**
	         * 隐藏header
	         */
	        value: function hide() {
	            HybridJS.core.invokeNative("ui.header.toggle", {
	                show: false
	            });
	        }
	    }]);

	    return Header;
	}();

	exports.default = Header;


		module.exports = Header;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	var _pay = __webpack_require__(12);

	var _pay2 = _interopRequireDefault(_pay);

	var _sharePlatform = __webpack_require__(13);

	var _sharePlatform2 = _interopRequireDefault(_sharePlatform);

	var _media = __webpack_require__(14);

	var _media2 = _interopRequireDefault(_media);

	var _network = __webpack_require__(15);

	var _network2 = _interopRequireDefault(_network);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_util2.default.getRoot().api = {
	    pay: _pay2.default,
	    sharePlatform: _sharePlatform2.default,
	    media: _media2.default,
	    network: _network2.default
	}; /**
	    * 服务相关api
	    * Created by jiaaobo on 16/4/10.
	    */

/***/ },
/* 12 */
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

	/**
	 * 支付模块
	 */

	var Pay = function () {
	    function Pay() {
	        _classCallCheck(this, Pay);
	    }

	    _createClass(Pay, null, [{
	        key: "payment",


	        /**
	         * 付款支付
	         * @param message
	         * @param itemId
	         */
	        value: function payment(itemId) {
	            if (!itemId) throw new Error("ItemId为空!");
	            return new Promise(function (resolve, reject) {
	                HybridJS.core.invokeNative("ui.pay.payment", { itemId: itemId }, function (res) {
	                    resolve(res);
	                });
	            });
	        }
	    }]);

	    return Pay;
	}();

		exports.default = Pay;

/***/ },
/* 13 */
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

	/**
	 * 第三方分享模块
	 */

	var SharePlatform = function () {
	    function SharePlatform() {
	        _classCallCheck(this, SharePlatform);
	    }

	    _createClass(SharePlatform, null, [{
	        key: "sharePage",


	        /**
	         * 分享页面
	         * @param itemId
	         */
	        value: function sharePage(setting) {

	            var api = "api.sharePlatform.sharePage";

	            var successSeed = HybridJS.core.registerCallBack(api, setting.success, "share_success");

	            var errorSeed = HybridJS.core.registerCallBack(api, setting.error, "share_error");

	            var cancelSeed = HybridJS.core.registerCallBack(api, setting.cancel, "share_cancel");

	            HybridJS.core.invokeNative(api, {
	                url: setting.url,
	                title: setting.title,
	                content: setting.content,
	                img: setting.img || "",
	                platform: setting.platform || "all",
	                success: successSeed,
	                cancel: cancelSeed,
	                error: errorSeed
	            });
	        }
	    }]);

	    return SharePlatform;
	}();

		exports.default = SharePlatform;

/***/ },
/* 14 */
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

	/**
	 * 支付模块
	 */

	var Media = function () {
	  function Media() {
	    _classCallCheck(this, Media);
	  }

	  _createClass(Media, null, [{
	    key: "playVideoByRemoteUrl",


	    /**
	     * 播放远程视频文件
	     * @param url
	     */
	    value: function playVideoByRemoteUrl(url, setting) {
	      if (!url) throw new Error("url为空!");

	      var obj = Object.assign({ url: url }, setting);
	      HybridJS.core.invokeNative("ui.media.playVideoByRemoteUrl", obj);
	    }
	  }, {
	    key: "playAudioByRemoteUrl",


	    /**
	     * 播放远程音频文件
	     * @param url
	     */
	    value: function playAudioByRemoteUrl(url, setting) {
	      if (!url) throw new Error("url为空!");
	      var obj = Object.assign({ url: url }, setting);
	      HybridJS.core.invokeNative("ui.media.playAudioByRemoteUrl", obj);
	    }
	  }]);

	  return Media;
	}();

		exports.default = Media;

/***/ },
/* 15 */
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

	/**
	 * 网络模块
	 */

	var Network = function () {
	    function Network() {
	        _classCallCheck(this, Network);
	    }

	    _createClass(Network, null, [{
	        key: "getConnectionType",


	        /**
	         * 获取当前网络类型
	         * @param itemId
	         */
	        value: function getConnectionType() {
	            return new Promise(function (resolve, reject) {
	                HybridJS.core.invokeNative('api.network.getConnectionType', {}, function (res) {
	                    resolve(res);
	                });
	            });
	        }
	    }]);

	    return Network;
	}();

		exports.default = Network;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	var _mapStorage = __webpack_require__(17);

	var _mapStorage2 = _interopRequireDefault(_mapStorage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 服务相关api
	 * Created by jiaaobo on 16/4/10.
	 */

	_util2.default.getRoot().storage = {
	  mapStorage: _mapStorage2.default
		};

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * 简单格式存储
	 */

	var MapStorage = function () {
	    function MapStorage() {
	        _classCallCheck(this, MapStorage);
	    }

	    _createClass(MapStorage, null, [{
	        key: "getItem",


	        /**
	         * 读
	         * @param title
	         */
	        value: function getItem(key) {

	            return new Promise(function (resolve, reject) {

	                if (!key) {
	                    throw new Error("key 不能为空");
	                }

	                HybridJS.core.invokeNative("storage.mapStorage.getItem", {
	                    key: key
	                }, function (res) {
	                    resolve(res);
	                });
	            });
	        }
	    }, {
	        key: "setItem",


	        /**
	         * 写
	         * @param key
	         * @returns {Promise}
	         */
	        value: function setItem(key, value) {

	            return new Promise(function (resolve, reject) {

	                if (!key || !value) {
	                    throw new Error("key,value 不能为空");
	                }

	                HybridJS.core.invokeNative("storage.mapStorage.setItem", {
	                    key: key,
	                    value: JSON.stringify(value)
	                }, function (res) {
	                    resolve(res);
	                });
	            });
	        }
	    }, {
	        key: "removeItem",


	        /**
	         * 删除
	         * @param key
	         * @returns {Promise}
	         */
	        value: function removeItem(key) {
	            return new Promise(function (resolve, reject) {
	                if (!key) {
	                    throw new Error("key 不能为空");
	                }

	                HybridJS.core.invokeNative("storage.mapStorage.removeItem", {
	                    key: key
	                }, function (res) {
	                    resolve(res);
	                });
	            });
	        }
	    }, {
	        key: "clear",


	        /**
	         * 清空
	         * @returns {Promise}
	         */
	        value: function clear() {
	            return new Promise(function (resolve, reject) {
	                HybridJS.core.invokeNative("storage.mapStorage.clear", {}, function (res) {
	                    resolve(res);
	                });
	            });
	        }
	    }]);

	    return MapStorage;
	}();

	exports.default = MapStorage;


		module.exports = MapStorage;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	var _user = __webpack_require__(19);

	var _user2 = _interopRequireDefault(_user);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 本地数据相关
	 * Created by jiaaobo on 16/4/10.
	 */

	_util2.default.getRoot().localData = {
	  user: _user2.default
		};

/***/ },
/* 19 */
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

	/**
	 * 用户模块
	 */

	var User = function () {
	    function User() {
	        _classCallCheck(this, User);
	    }

	    _createClass(User, null, [{
	        key: "getUserInfo",


	        /**
	         * 获得用户信息
	         * @param url
	         */
	        value: function getUserInfo() {
	            return new Promise(function (resolve, reject) {
	                HybridJS.core.invokeNative("localData.user.getUserInfo", {}, function (res) {
	                    resolve(res);
	                });
	            });
	        }
	    }]);

	    return User;
	}();

		exports.default = User;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by jiaaobo on 16/4/10.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _util = __webpack_require__(3);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var HybridJS = _util2.default.getRoot();

	var NavigationType = {
	    WEBVIEW: "webview",
	    NATIVE: "native",
	    PAGE: "page"
	};

	var Navigation = function () {
	    function Navigation() {
	        _classCallCheck(this, Navigation);
	    }

	    _createClass(Navigation, [{
	        key: "forwardNative",


	        /**
	         * 跳转至原生界面
	         * @param topage
	         * @param params
	         */
	        value: function forwardNative(topage, params, callBack) {
	            this.forward(NavigationType.NATIVE, topage, params, callBack);
	        }
	    }, {
	        key: "forwardView",


	        /**
	         * 跳转到新开webview页面
	         * @param topage
	         * @param params
	         */
	        value: function forwardView(topage, params) {
	            this.forward(NavigationType.WEBVIEW, topage, params);
	        }
	    }, {
	        key: "forwardPage",


	        /**
	         * 当前容器内跳转
	         * @param urlPage
	         * @param params
	         */
	        value: function forwardPage(urlPage, params) {
	            window.location.href = urlPage;
	        }
	    }, {
	        key: "forward",
	        value: function forward(type, topage, params, callBack) {

	            var api = "ui.nav.forward";

	            var data = {
	                type: type,
	                topage: topage
	            };

	            if (params) data = Object.assign(data, params);

	            if (callBack) {
	                data.req_fn = HybridJS.core.registerCallBack(api, callBack);
	            }
	            HybridJS.core.invokeNative(api, data);
	        }
	    }]);

	    return Navigation;
	}();

	var nav = new Navigation();
	HybridJS.navigation = nav;
	module.exports = nav;

/***/ }
/******/ ]);
//# sourceMappingURL=cicadaHybrid.js.map