module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:3001/assets/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./rendering-service/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/images/account-background-picture.jpg":
/*!******************************************************!*\
  !*** ./assets/images/account-background-picture.jpg ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "f0278f97af5a04f7249c183904235692.jpg";

/***/ }),

/***/ "./assets/images/account-picture.svg":
/*!*******************************************!*\
  !*** ./assets/images/account-picture.svg ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "cc66c1de8784b131572f05db38e1e847.svg";

/***/ }),

/***/ "./assets/images/home.svg":
/*!********************************!*\
  !*** ./assets/images/home.svg ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(/*! react */ "react");

function Home (props) {
    return React.createElement("svg",props,React.createElement("g",{"id":"Expanded"},React.createElement("g",null,[React.createElement("g",{"key":0},React.createElement("path",{"d":"M42,48H28V35h-8v13H6V27c0-0.552,0.447-1,1-1s1,0.448,1,1v19h10V33h12v13h10V28c0-0.552,0.447-1,1-1s1,0.448,1,1V48z"})),React.createElement("g",{"key":1},React.createElement("path",{"d":"M47,27c-0.249,0-0.497-0.092-0.691-0.277L24,5.384L1.691,26.723c-0.399,0.381-1.032,0.368-1.414-0.031     c-0.382-0.399-0.367-1.032,0.031-1.414L24,2.616l23.691,22.661c0.398,0.382,0.413,1.015,0.031,1.414     C47.526,26.896,47.264,27,47,27z"})),React.createElement("g",{"key":2},React.createElement("path",{"d":"M39,15c-0.553,0-1-0.448-1-1V8h-6c-0.553,0-1-0.448-1-1s0.447-1,1-1h8v8C40,14.552,39.553,15,39,15z"}))])));
}

Home.displayName = "Home";

Home.defaultProps = {"enableBackground":"new 0 0 48 48","height":"48px","version":"1.1","viewBox":"0 0 48 48","width":"48px","xmlSpace":"preserve"};

module.exports = Home;

Home.default = Home;


/***/ }),

/***/ "./assets/images/husky.jpg":
/*!*********************************!*\
  !*** ./assets/images/husky.jpg ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "9059f094ddb49c2b0fa6a254a6ebf2ad.jpg";

/***/ }),

/***/ "./assets/images/icon.png":
/*!********************************!*\
  !*** ./assets/images/icon.png ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAHVklEQVR42u2aB6wUZRDH596jiFhQRFEjTQnyFFRiSTQqYAmKnaixYAMRS4wRJUaJGo099oYFUBQSE5UgWGIXSzQqiAoWLChGsUHUKEp5OL98M7l9y93t3mOPPcsk/7x7e7e78/9mvpn55vsK8h+TQt4K/E84J8IbKK5RDFAcpfg+b0VrTfgxI4r0VCzMW9FaEj5OMVWxQvGiYkjeStaSMK48X7G1okGClaflrWQtCZ+ruFWxWvGRYifFyryVrBXhNoo5iiYJ1h2ueDhvBWtJeHfFm/b5K0VfxZ95K1hLwhcorrdrYxQ35a1crQlPUpysWKbop/gib+VawaW7YhMJUzOR8BOKQyXk3CYjXs/SVvGU4hzFAkWz4nEJGWaPNISnKw6zm3dULM+bUYKcqbhLgqEOV+ypeFVCWu2XhvBExSmKpRIC1g95M6oguxo5sgmWxkC3KwZL8NDtFX8lEb5QcZ1dO0KCxetN0K2T4m1FL8UqRaPiPUUfRQcJU7G34tskwnspXpNQdDyvODBvdiUEiz6qOFJC6dvW9HUeFEnUE3srXrfvyhJup/hQsZ1dHyohKNSLoNO+ipeMbJvI9Wb7u9IGYYJiZLmHROUiCctCXAWX2EXxc95MI3KthKm3yoghbuFmI8xnPOFoKbEOiBNmfnyq2FTC3MC1D8ibpQk1wkQj2BDTP+rWEiFP9Ti3EmFkhOJ+xe+KjoopihNzJIqOOyhmG1G3YJQc1xYqbpGwvN1NgsFmSEi1FQkjnpOppdcz0sOlRBBYR0KgGialAxX1AvHnYgnT8SAJsQe3x8rEpG+SCFOevSUhvBPmCfdP2+j9sg6JtjGF35dgMdc37r5u4dsUx0qotBiI9orzFTcnEUZI3rMUXaRo6Q8UZyg2V+ys6CrB7RttNJkGBLnFiq8ViwxrE/ioDcZK0bqlJD6HowPxuaK/WKmc1LWkonlG0VmKrlOtLJGw3KRknW9YYAOypMTvG2wgKSQIOmSOjey7Qgmdo1G62e73Oe55mek5Iw1hBEs+qdjKRrnRHpxmPjdKywATHwg84UcJ04RndrL3sADoWIJUGnG9+D2eiVufJ8HdUz+EucxKpKnCSJd6qYsPkKeUxhTvdIv53E0iHSXKfZ6rcWVaVQuqIYycIKHl427SGlkd+7w6cs0JxdNOJT2jz/MBKkT0Y/6OktB9rfiguPA7ipDBa0l4XclnivGK+xS/xomkEVx6nhTdq162aNzCuC8V1QsGFkF/lLohreKnSSjIWxupayW+iKAyHJXmhrSEr5aQHtyd68XCboArFZdmSfgqCaVbpeSfh7iFx0kwSmaEfUeiXl2a/tY9WRKmUpku9WVhApbnabqtM7MkTMuEurqeUpJHaEjTxPs4S8IU33OlWKvmLW5ddFkooe5eUQvC3iWsByGeML3uVpyd9qa0hGl00x/yJlkWEq19y32udJ+XkRhjXpaEcRvKykHS+jlcqub190eXc170e64vt2Dw4DlZQq8rtaQhjLvcsZZkXfloAy4qy41ohzL3FWLXATsL61erTBJhFPhEwvrUla2myooq7e97R0LEZyVDE+A7CR0RBpROCk32sZHBjQ+QDzzF0LisCQ+U0Pj2YBUngPhcapDyrRYEK9IempxCL/L+NCndknXC1PeTsiZMQT5e1nTngg1CdO1azgV9vmG1G6rQjaXdSFmz2PEBphPZLWvCoyVsSUZf6mQ9Pb0hodG3razp9q4c7ZzNqtSth4SDNe1iehYi+lR9UiGJ8P6K56SlhT3hE7kvM8IHS+h7ea3tVvb73pXQEKxWZtqzo+nQ20XoQEe0e5aEObfF1ktXKVY3EKC/NSz2W/rWQ2Kk3RMIUgNbQfgkxYMSLNpgz2snLXtWpyoeyIowQh/reBtlD0x0MuPJfgsJ1u4VIe2Ecc2mFO+KCx1Mmm+kH5px7FvfKaE575UWe8MDsiQcd2t6zD3K/BayRNf+UtzJExskdgNmt4L0y4p97Fl9bBA5XtU5MqAURa9kRbhgL2CDClfiSESXhHtouYywzxQI7e3a6a0g7Fu4DBrrcoogVm/PSvHIA3tJh2RFGDlG8YgU95nYTZyScA+eQdMAV15pxDls8mWVhJk+FCvx3UBO73CuA9fG8zBIogelJcx8ZLXU2/4nOvZMcR9zkKMH20iwBoFtaJWEIcNmGntd7F1tGPnOW8dYn8A4KCvCCFUSRYi76L12LUkGGOkGGzga+lOrJI0bn2X6kgqvsOt4z1wjjGvT5hmdFWEiJSPdQ4p58RIJxxCSJHoGGythlTkp7nPhFAJzliBFDGFqLLbvOC7JMQj2pzY2nco29Kptt3qBEZc0de3lEqzDYP0mIRhRPqbZlMMzSG3dTGci8n72HTGFwqav/e/7wpkQRsZI8WDJUgNdhzRu+pC0PD5BrTwh5XspMCZG/r9RwoFYhGqLQyx4EJ4zK0vCiO/XLpOUvaSIoNiWip8knKZbVMW9pB6CJdugFDmpOx1rS/gfK/8T/rfL37srxkxlfcxZAAAAAElFTkSuQmCC"

/***/ }),

/***/ "./assets/images/icons/clock.svg":
/*!***************************************!*\
  !*** ./assets/images/icons/clock.svg ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(/*! react */ "react");

function Clock (props) {
    return React.createElement("svg",props,React.createElement("path",{"d":"M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"}));
}

Clock.displayName = "Clock";

Clock.defaultProps = {"version":"1.1","viewBox":"0 0 24 24"};

module.exports = Clock;

Clock.default = Clock;


/***/ }),

/***/ "./assets/images/icons/message.svg":
/*!*****************************************!*\
  !*** ./assets/images/icons/message.svg ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(/*! react */ "react");

function Message (props) {
    return React.createElement("svg",props,React.createElement("path",{"d":"M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20"}));
}

Message.displayName = "Message";

Message.defaultProps = {"version":"1.1","width":"24","height":"24","viewBox":"0 0 24 24"};

module.exports = Message;

Message.default = Message;


/***/ }),

/***/ "./assets/images/icons/person-add.svg":
/*!********************************************!*\
  !*** ./assets/images/icons/person-add.svg ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(/*! react */ "react");

function PersonAdd (props) {
    return React.createElement("svg",props,React.createElement("path",{"d":"M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z"}));
}

PersonAdd.displayName = "PersonAdd";

PersonAdd.defaultProps = {"version":"1.1","width":"24","height":"24","viewBox":"0 0 24 24"};

module.exports = PersonAdd;

PersonAdd.default = PersonAdd;


/***/ }),

/***/ "./assets/images/users.svg":
/*!*********************************!*\
  !*** ./assets/images/users.svg ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(/*! react */ "react");

function Users (props) {
    return React.createElement("svg",props,[React.createElement("circle",{"cx":"25","cy":"25","fill":"none","r":"24","strokeLinecap":"round","strokeMiterlimit":"10","strokeWidth":"2.5","key":0}),React.createElement("path",{"d":"M29.933,35.528  c-0.146-1.612-0.09-2.737-0.09-4.21c0.73-0.383,2.038-2.825,2.259-4.888c0.574-0.047,1.479-0.607,1.744-2.818  c0.143-1.187-0.425-1.855-0.771-2.065c0.934-2.809,2.874-11.499-3.588-12.397c-0.665-1.168-2.368-1.759-4.581-1.759  c-8.854,0.163-9.922,6.686-7.981,14.156c-0.345,0.21-0.913,0.878-0.771,2.065c0.266,2.211,1.17,2.771,1.744,2.818  c0.22,2.062,1.58,4.505,2.312,4.888c0,1.473,0.055,2.598-0.091,4.21c-1.261,3.39-7.737,3.655-11.473,6.924  c3.906,3.933,10.236,6.746,16.916,6.746s14.532-5.274,15.839-6.713C37.688,39.186,31.197,38.93,29.933,35.528z","fill":"none","strokeLinecap":"round","strokeMiterlimit":"10","strokeWidth":"2.5","key":1})]);
}

Users.displayName = "Users";

Users.defaultProps = {"enableBackground":"new 0 0 50 50","height":"50px","version":"1.1","viewBox":"0 0 50 50","width":"50px","xmlSpace":"preserve"};

module.exports = Users;

Users.default = Users;


/***/ }),

/***/ "./configuration/configuration.defaults.json":
/*!***************************************************!*\
  !*** ./configuration/configuration.defaults.json ***!
  \***************************************************/
/*! exports provided: webserver, services, webpack, default */
/***/ (function(module) {

module.exports = {"webserver":{"port":3000},"services":{"rendering":{"port":3002},"api":{"port":3003}},"webpack":{"devserver":{"host":"localhost","port":3001}}};

/***/ }),

/***/ "./configuration/configuration.development.json":
/*!******************************************************!*\
  !*** ./configuration/configuration.development.json ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module) {

module.exports = {};

/***/ }),

/***/ "./configuration/configuration.production.json":
/*!*****************************************************!*\
  !*** ./configuration/configuration.production.json ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module) {

module.exports = {};

/***/ }),

/***/ "./configuration/index.js":
/*!********************************!*\
  !*** ./configuration/index.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_merge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/merge */ "lodash/merge");
/* harmony import */ var lodash_merge__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_merge__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _configuration_defaults__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./configuration.defaults */ "./configuration/configuration.defaults.json");
var _configuration_defaults__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./configuration.defaults */ "./configuration/configuration.defaults.json", 1);
/* harmony import */ var _configuration_development__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./configuration.development */ "./configuration/configuration.development.json");
var _configuration_development__WEBPACK_IMPORTED_MODULE_2___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./configuration.development */ "./configuration/configuration.development.json", 1);
/* harmony import */ var _configuration_production__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./configuration.production */ "./configuration/configuration.production.json");
var _configuration_production__WEBPACK_IMPORTED_MODULE_3___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./configuration.production */ "./configuration/configuration.production.json", 1);




var configuration = lodash_merge__WEBPACK_IMPORTED_MODULE_0___default()({}, _configuration_defaults__WEBPACK_IMPORTED_MODULE_1__); // https://github.com/webpack-contrib/webpack-serve/issues/81#issuecomment-378469110

/* harmony default export */ __webpack_exports__["default"] = (configuration);

if (false) {} else {
  lodash_merge__WEBPACK_IMPORTED_MODULE_0___default()(configuration, _configuration_development__WEBPACK_IMPORTED_MODULE_2__);
} // For services like Amazon Elastic Compute Cloud and Heroku


if (process.env.PORT) {
  configuration.webserver.port = process.env.PORT;
} // For passing custom configuration via an environment variable.
// For frameworks like Docker.
// E.g. `CONFIGURATION="{ \"key\": \"value\" }" npm start`.


if (process.env.CONFIGURATION) {
  try {
    lodash_merge__WEBPACK_IMPORTED_MODULE_0___default()(configuration, JSON.parse(process.env.CONFIGURATION));
  } catch (error) {
    console.error(error);
  }
}

/***/ }),

/***/ "./node_modules/react-website/components/Loading.css":
/*!***********************************************************!*\
  !*** ./node_modules/react-website/components/Loading.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./rendering-service/main.js":
/*!***********************************!*\
  !*** ./rendering-service/main.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_website_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-website/server */ "react-website/server");
/* harmony import */ var react_website_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_website_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _src_react_website__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/react-website */ "./src/react-website.js");
/* harmony import */ var _configuration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../configuration */ "./configuration/index.js");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





/* harmony default export */ __webpack_exports__["default"] = (function (parameters) {
  // Create webpage rendering server
  var server = react_website_server__WEBPACK_IMPORTED_MODULE_0___default()(_src_react_website__WEBPACK_IMPORTED_MODULE_2__["default"], {
    // Proxy all HTTP requests for data
    // through a proxy server to the API server.
    // Wouldn't do such a thing in a real-world app
    // and would just query the API server directly
    // but Chrome won't allow that for `localhost`.
    proxy: {
      host: 'localhost',
      port: _configuration__WEBPACK_IMPORTED_MODULE_3__["default"].webserver.port // For HTTPS
      // secure: true

    },
    // HTTP URLs for javascripts and (optionally) CSS styles
    // which will be insterted into the `<head/>` element
    // of the resulting HTML webpage as `<script src="..."/>`
    // and `<link rel="style" href="..."/>`.
    //
    // And also the URL for website "favicon".
    //
    assets: function assets(path) {
      return _objectSpread({}, parameters.chunks(), {
        // Website "favicon"
        icon: _src_react_website__WEBPACK_IMPORTED_MODULE_2__["icon"]
      });
    } // One can set `renderContent` flag to `false`
    // to turn off Server-Side React Rendering.
    // It only disables page rendering,
    // i.e. the inside of the `<div id="react"/>` DOM element
    // while everything around it is still
    // rendered on server side (e.g. `<head/>`).
    // Server-Side React Rendering takes some CPU time
    // (about 30 milliseconds for a complex React page as of 2017).
    // Modern search engines know how to run javascript
    // so there shouldn't be any issues with indexing.
    // Turning off Server-Side Rendering delays the
    // "time-to-first-byte" though
    // (until the javascript bundle is fully downloaded).
    // Read `react-website` docs for more info.
    // renderContent: false

  }); // Start webpage rendering server

  server.listen(_configuration__WEBPACK_IMPORTED_MODULE_3__["default"].services.rendering.port, function (error) {
    if (error) {
      console.error('Webpage rendering service was shut down due to an error');
      throw error;
    }

    console.log("Webpage rendering service is listening on port ".concat(_configuration__WEBPACK_IMPORTED_MODULE_3__["default"].services.rendering.port));
  });
});

/***/ }),

/***/ "./src/Container.js":
/*!**************************!*\
  !*** ./src/Container.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_hot_loader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-hot-loader */ "react-hot-loader");
/* harmony import */ var react_hot_loader__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_hot_loader__WEBPACK_IMPORTED_MODULE_3__);
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();






function Container(_ref) {
  var store = _ref.store,
      children = _ref.children;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__["Provider"], {
    store: store
  }, children);
}

Container.propTypes = {
  store: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired
};

var _default = Object(react_hot_loader__WEBPACK_IMPORTED_MODULE_3__["hot"])(module)(Container);

/* harmony default export */ __webpack_exports__["default"] = (_default);
;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Container, "Container", "c:\\dev\\webapp-frontend\\src\\Container.js");
  reactHotLoader.register(_default, "default", "c:\\dev\\webapp-frontend\\src\\Container.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/PropTypes.js":
/*!**************************!*\
  !*** ./src/PropTypes.js ***!
  \**************************/
/*! exports provided: userShape, accountShape */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userShape", function() { return userShape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "accountShape", function() { return accountShape; });
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_0__);
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();


var id = Object(prop_types__WEBPACK_IMPORTED_MODULE_0__["oneOfType"])([prop_types__WEBPACK_IMPORTED_MODULE_0__["number"], prop_types__WEBPACK_IMPORTED_MODULE_0__["string"]]).isRequired;
var userShape = Object(prop_types__WEBPACK_IMPORTED_MODULE_0__["shape"])({
  id: id,
  firstName: prop_types__WEBPACK_IMPORTED_MODULE_0__["string"],
  lastName: prop_types__WEBPACK_IMPORTED_MODULE_0__["string"]
});
var accountShape = Object(prop_types__WEBPACK_IMPORTED_MODULE_0__["shape"])({
  id: id,
  name: prop_types__WEBPACK_IMPORTED_MODULE_0__["string"].isRequired,
  user: userShape,
  banner: prop_types__WEBPACK_IMPORTED_MODULE_0__["string"],
  data: Object(prop_types__WEBPACK_IMPORTED_MODULE_0__["shape"])({
    palette: Object(prop_types__WEBPACK_IMPORTED_MODULE_0__["shape"])({
      background: prop_types__WEBPACK_IMPORTED_MODULE_0__["string"]
    })
  }).isRequired
});
;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(id, "id", "c:\\dev\\webapp-frontend\\src\\PropTypes.js");
  reactHotLoader.register(userShape, "userShape", "c:\\dev\\webapp-frontend\\src\\PropTypes.js");
  reactHotLoader.register(accountShape, "accountShape", "c:\\dev\\webapp-frontend\\src\\PropTypes.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/components/AccountPicture.js":
/*!******************************************!*\
  !*** ./src/components/AccountPicture.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AccountPicture; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "classnames");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Picture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Picture */ "./src/components/Picture.js");
/* harmony import */ var _assets_images_account_picture_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../assets/images/account-picture.svg */ "./assets/images/account-picture.svg");
/* harmony import */ var _assets_images_account_picture_svg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_images_account_picture_svg__WEBPACK_IMPORTED_MODULE_4__);
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var DEFAULT_ACCOUNT_PICTURE = {
  sizes: [{
    url: _assets_images_account_picture_svg__WEBPACK_IMPORTED_MODULE_4___default.a
  }]
};

var AccountPicture =
/*#__PURE__*/
function (_React$Component) {
  _inherits(AccountPicture, _React$Component);

  function AccountPicture() {
    _classCallCheck(this, AccountPicture);

    return _possibleConstructorReturn(this, _getPrototypeOf(AccountPicture).apply(this, arguments));
  }

  _createClass(AccountPicture, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          account = _this$props.account,
          className = _this$props.className,
          rest = _objectWithoutProperties(_this$props, ["account", "className"]);

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Picture__WEBPACK_IMPORTED_MODULE_3__["default"], _extends({}, rest, {
        sizes: account.data.picture ? account.data.picture.sizes : DEFAULT_ACCOUNT_PICTURE.sizes,
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('account-picture', className)
      }));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return AccountPicture;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);

AccountPicture.propTypes = {
  account: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
  style: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  className: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,
  // These two are for `upload picture` to work
  picture: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object
};

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(DEFAULT_ACCOUNT_PICTURE, "DEFAULT_ACCOUNT_PICTURE", "c:\\dev\\webapp-frontend\\src\\components\\AccountPicture.js");
  reactHotLoader.register(AccountPicture, "AccountPicture", "c:\\dev\\webapp-frontend\\src\\components\\AccountPicture.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/components/Menu.css":
/*!*********************************!*\
  !*** ./src/components/Menu.css ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/components/Menu.js":
/*!********************************!*\
  !*** ./src/components/Menu.js ***!
  \********************************/
/*! exports provided: default, MenuLink */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Menu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MenuLink", function() { return MenuLink; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "classnames");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Menu_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Menu.css */ "./src/components/Menu.css");
/* harmony import */ var _Menu_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Menu_css__WEBPACK_IMPORTED_MODULE_3__);
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();





function Menu(_ref) {
  var className = _ref.className,
      children = _ref.children;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
    className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('menu', className)
  }, children);
}
function MenuLink(_ref2) {
  var to = _ref2.to,
      exact = _ref2.exact,
      children = _ref2.children;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
    className: "menu-list-item"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_1__["Link"], {
    to: to,
    exact: exact,
    activeClassName: "menu-item--selected",
    className: "menu-item"
  }, children));
}
;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Menu, "Menu", "c:\\dev\\webapp-frontend\\src\\components\\Menu.js");
  reactHotLoader.register(MenuLink, "MenuLink", "c:\\dev\\webapp-frontend\\src\\components\\Menu.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/components/Picture.css":
/*!************************************!*\
  !*** ./src/components/Picture.css ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/components/Picture.js":
/*!***********************************!*\
  !*** ./src/components/Picture.js ***!
  \***********************************/
/*! exports provided: default, getPreferredSize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Picture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPreferredSize", function() { return _getPreferredSize; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "classnames");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Picture_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Picture.css */ "./src/components/Picture.css");
/* harmony import */ var _Picture_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Picture_css__WEBPACK_IMPORTED_MODULE_3__);
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




 // When no picture is available for display.

var TRANSPARENT_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
/**
 * A `<Picture/>` is passed `sizes` and is "responsive"
 * showing the size that suits most based on
 * its actual display size (which could be set in "rem"s, for example)
 * with device pixel ratio being taken into account.
 * Refreshes itself on window resize.
 * On server it renders an empty picture.
 * (because there's no way of getting the device pixel ratio on server).
 */

var Picture =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Picture, _PureComponent);

  function Picture() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Picture);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Picture)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {};
    _this.container = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
    _this.picture = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();

    _this.refreshSize = function (force) {
      var sizes = _this.props.sizes;
      var size = _this.state.size;

      if (!sizes) {
        return;
      }

      var preferredSize = _this.getPreferredSize(sizes);

      if (force || !size || preferredSize && preferredSize.width > size.width) {
        _this.setState({
          size: preferredSize
        });
      }
    };

    _this.getContainerHeight = function () {
      return _this.container.current.offsetHeight;
    };

    _this.width = function () {
      return _this.picture.current ? _this.picture.current.offsetWidth : _this.container.current.offsetWidth;
    };

    return _this;
  }

  _createClass(Picture, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var sizes = this.props.sizes; // When the DOM node has been mounted
      // its width in pixels is known
      // so an appropriate size can now be picked.

      this.refreshSize();

      if (!window.interactiveResize) {
        window.interactiveResize = new InteractiveResize();
      }

      window.interactiveResize.add(this.refreshSize);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.interactiveResize.remove(this.refreshSize);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var sizes = this.props.sizes;

      if (prevProps.sizes !== sizes) {
        this.refreshSize(true);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          fit = _this$props.fit,
          border = _this$props.border,
          className = _this$props.className,
          children = _this$props.children;
      var style = this.props.style;

      if (fit !== 'width') {
        style = _objectSpread({}, style, {
          backgroundImage: "url(".concat(this.url() || TRANSPARENT_PIXEL, ")")
        });
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        ref: this.container,
        style: style,
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('picture', {
          'picture--repeat-x': fit === 'repeat-x',
          'picture--cover': fit === 'cover',
          'picture--border': border
        }, className)
      }, fit === 'width' && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        ref: this.picture,
        src: typeof window === 'undefined' ? TRANSPARENT_PIXEL : this.url() || TRANSPARENT_PIXEL,
        style: IMAGE_STYLE,
        className: "picture__image"
      }), children);
    }
  }, {
    key: "getPreferredSize",
    value: function getPreferredSize(sizes) {
      var maxWidth = this.props.maxWidth;

      if (sizes) {
        return _getPreferredSize(sizes, this.getPreferredWidth(), maxWidth);
      }
    }
  }, {
    key: "getPreferredWidth",
    value: function getPreferredWidth() {
      var fit = this.props.fit;

      switch (fit) {
        case 'width':
          return this.width();

        case 'repeat-x':
          return this.getContainerHeight() * this.getAspectRatio();

        case 'cover':
          return Math.max(this.width(), this.getContainerHeight() * this.getAspectRatio());

        default:
          throw new Error("Unknown picture fit: ".concat(fit, "."));
      }
    }
  }, {
    key: "getAspectRatio",
    value: function getAspectRatio() {
      var sizes = this.props.sizes;

      if (sizes) {
        return sizes[sizes.length - 1].width / sizes[sizes.length - 1].height;
      }
    }
  }, {
    key: "url",
    value: function url() {
      var size = this.state.size;

      if (size) {
        return size.url;
      }
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return Picture;
}(react__WEBPACK_IMPORTED_MODULE_0__["PureComponent"]);

Picture.propTypes = {
  // Can be set up to load images no wider than `maxWidth`.
  // E.g. for saving bandwidth, but I guess it won't be used.
  maxWidth: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
  // By default a border will be added around the picture.
  // Set to `false` to not add border for picture.
  border: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool.isRequired,
  // Any "child" content will be displayed if no picture is present.
  children: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.node,
  // The image sizing algorythm.
  fit: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.oneOf(['cover', 'repeat-x', 'width']).isRequired,
  // Available image sizes.
  sizes: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
    // Image size width.
    // `width` can be omitted for vector graphics.
    width: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number,
    // Image size file name.
    // A full URL will be constructed based on this file name.
    url: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string.isRequired
  }))
};
Picture.defaultProps = {
  fit: 'width',
  border: false
};


function _getPreferredSize(sizes, width, maxWidth) {
  if (!width) {
    return sizes[0];
  }

  var pixelRatio = 1;

  if (typeof window !== 'undefined' && window.devicePixelRatio) {
    pixelRatio = window.devicePixelRatio;
  }

  width *= pixelRatio;
  var previousSize;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sizes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var size = _step.value;

      if (size.width > maxWidth) {
        return previousSize || sizes[0];
      }

      if (size.width >= width) {
        return size;
      }

      previousSize = size;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return sizes[sizes.length - 1];
}


var IMAGE_STYLE = {
  // boxSizing : 'content-box',
  maxWidth: '100%',
  maxHeight: '100%',
  borderRadius: 'inherit'
};

var InteractiveResize =
/*#__PURE__*/
function () {
  function InteractiveResize() {
    var _this2 = this;

    _classCallCheck(this, InteractiveResize);

    this.subscribers = new Set();

    this.onResize = function () {
      clearTimeout(_this2.debounceTimer);
      _this2.debounceTimer = setTimeout(_this2.resize, 500);
    };

    this.resize = function () {
      _this2.debounceTimer = undefined;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _this2.subscribers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var subscriber = _step2.value;
          subscriber();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    };

    window.addEventListener('resize', this.onResize);
  }

  _createClass(InteractiveResize, [{
    key: "add",
    value: function add(subscriber) {
      this.subscribers.add(subscriber);
    }
  }, {
    key: "remove",
    value: function remove(subscriber) {
      this.subscribers.delete(subscriber);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.subscribers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var subscriber = _step3.value;
          this.unregister(subscriber);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      window.removeEventListener('resize', this.onResize);
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return InteractiveResize;
}();

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(TRANSPARENT_PIXEL, "TRANSPARENT_PIXEL", "c:\\dev\\webapp-frontend\\src\\components\\Picture.js");
  reactHotLoader.register(Picture, "Picture", "c:\\dev\\webapp-frontend\\src\\components\\Picture.js");
  reactHotLoader.register(_getPreferredSize, "getPreferredSize", "c:\\dev\\webapp-frontend\\src\\components\\Picture.js");
  reactHotLoader.register(IMAGE_STYLE, "IMAGE_STYLE", "c:\\dev\\webapp-frontend\\src\\components\\Picture.js");
  reactHotLoader.register(InteractiveResize, "InteractiveResize", "c:\\dev\\webapp-frontend\\src\\components\\Picture.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/components/Snackbar.js":
/*!************************************!*\
  !*** ./src/components/Snackbar.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SnackBar; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_responsive_ui_commonjs_Snackbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-responsive-ui/commonjs/Snackbar */ "react-responsive-ui/commonjs/Snackbar");
/* harmony import */ var react_responsive_ui_commonjs_Snackbar__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_responsive_ui_commonjs_Snackbar__WEBPACK_IMPORTED_MODULE_2__);
var _dec, _class;

(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }


 // Webpack still can't learn how to tree-shake.
// import { Snackbar } from 'react-responsive-ui'


var SnackBar = (_dec = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(function (_ref) {
  var notifications = _ref.notifications;
  return {
    notification: notifications.notification
  };
}), _dec(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SnackBar, _React$Component);

  function SnackBar() {
    _classCallCheck(this, SnackBar);

    return _possibleConstructorReturn(this, _getPrototypeOf(SnackBar).apply(this, arguments));
  }

  _createClass(SnackBar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          notification = _this$props.notification,
          notified = _this$props.notified;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_responsive_ui_commonjs_Snackbar__WEBPACK_IMPORTED_MODULE_2___default.a, {
        value: notification
      });
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return SnackBar;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component)) || _class);

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(SnackBar, "SnackBar", "c:\\dev\\webapp-frontend\\src\\components\\Snackbar.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/components/UploadablePicture.css":
/*!**********************************************!*\
  !*** ./src/components/UploadablePicture.css ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/components/UploadablePicture.js":
/*!*********************************************!*\
  !*** ./src/components/UploadablePicture.js ***!
  \*********************************************/
/*! exports provided: default, Picture */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UploadablePicture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Picture", function() { return Picture; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_responsive_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-responsive-ui */ "react-responsive-ui");
/* harmony import */ var react_responsive_ui__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_responsive_ui__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ "classnames");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _UploadablePicture_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./UploadablePicture.css */ "./src/components/UploadablePicture.css");
/* harmony import */ var _UploadablePicture_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_UploadablePicture_css__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _Picture__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Picture */ "./src/components/Picture.js");
/* harmony import */ var _redux_uploadablePicture__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../redux/uploadablePicture */ "./src/redux/uploadablePicture.js");
/* harmony import */ var _redux_notifications__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../redux/notifications */ "./src/redux/notifications.js");
var _dec, _class, _class2, _temp;

(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }










var UploadablePicture = (_dec = Object(react_redux__WEBPACK_IMPORTED_MODULE_3__["connect"])(function () {
  return {};
}, {
  uploadPicture: _redux_uploadablePicture__WEBPACK_IMPORTED_MODULE_7__["uploadPicture"],
  notify: _redux_notifications__WEBPACK_IMPORTED_MODULE_8__["notify"]
}), _dec(_class = (_temp = _class2 =
/*#__PURE__*/
function (_Component2) {
  _inherits(UploadablePicture, _Component2);

  function UploadablePicture() {
    var _this;

    _classCallCheck(this, UploadablePicture);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UploadablePicture).call(this));
    _this.state = {};
    _this.container = react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();

    _this.width = function () {
      return _this.container.current.offsetWidth;
    };

    _this.upload = _this.upload.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(UploadablePicture, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // Reset the uploaded picture on "cancel".
      if (prevProps.editMode && !this.props.editMode) {
        // const { onFinished } = this.props
        // onFinished()
        this.setState({
          uploadedPicture: undefined
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          editMode = _this$props2.editMode,
          changeLabel = _this$props2.changeLabel,
          onChange = _this$props2.onChange,
          disabled = _this$props2.disabled,
          children = _this$props2.children,
          style = _this$props2.style,
          className = _this$props2.className;
      var _this$state = this.state,
          uploading = _this$state.uploading,
          uploadedPicture = _this$state.uploadedPicture;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        ref: this.container,
        style: style,
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()(className, 'uploadable-picture', {
          'uploadable-picture--accepts-drop': editMode // 'uploadable-picture--can-drop'     : editMode && draggedOver

        })
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.Children.map(children, function (child) {
        if (child.type && typeof child.type !== 'string' && child.type.propTypes.picture && child.type.propTypes.uploaded) {
          if (uploadedPicture) {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.cloneElement(child, {
              picture: uploadedPicture,
              className: classnames__WEBPACK_IMPORTED_MODULE_4___default()(child.props.className, {// 'uploadable-picture__picture--change' : uploading
              })
            });
          }
        }

        return child;
      }), editMode && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_responsive_ui__WEBPACK_IMPORTED_MODULE_2__["DropFileUpload"], {
        disabled: disabled,
        onChange: this.upload,
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('uploadable-picture__change-overlay', {
          'uploadable-picture__change-overlay--uploading': uploading,
          'uploadable-picture__change-overlay--uploaded': uploadedPicture
        })
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('uploadable-picture__droppable-overlay', {// 'uploadable-picture__droppable-overlay--can-drop',
          // 'uploadable-picture__droppable-overlay--cannot-drop' : draggedOver && !canDrop
        })
      }), !uploadedPicture && !uploading && changeLabel, uploading && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_responsive_ui__WEBPACK_IMPORTED_MODULE_2__["ActivityIndicator"], {
        className: "uploadable-picture__progress-indicator"
      })));
    }
  }, {
    key: "onError",
    value: function onError(error) {
      var _this$props3 = this.props,
          onError = _this$props3.onError,
          notify = _this$props3.notify;
      console.error(error);

      if (onError) {
        return onError(error);
      }

      notify(error.message, {
        type: 'error'
      });
    }
  }, {
    key: "upload",
    value: function () {
      var _upload = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(file) {
        var _this$props4, editMode, acceptedFileTypes, uploadPicture, onUpload, onUploaded, uploading, uploadedPicture;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$props4 = this.props, editMode = _this$props4.editMode, acceptedFileTypes = _this$props4.acceptedFileTypes, uploadPicture = _this$props4.uploadPicture, onUpload = _this$props4.onUpload, onUploaded = _this$props4.onUploaded;
                uploading = this.state.uploading; // If the picture is not in upload mode
                // then don't react to a file drop.

                if (editMode) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return");

              case 4:
                if (!uploading) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return");

              case 6:
                if (!(acceptedFileTypes && acceptedFileTypes.indexOf(file.type) < 0)) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", this.onError('UNSUPPORTED_FILE_TYPE'));

              case 8:
                if (!(maxFixSize && file.size > maxFileSize)) {
                  _context.next = 10;
                  break;
                }

                return _context.abrupt("return", this.onError('MAX_FILE_SIZE_EXCEEDED'));

              case 10:
                // Set "uploading" flag.
                this.setState({
                  uploading: true
                });

                if (onUpload) {
                  onUpload();
                }

                _context.prev = 12;
                _context.next = 15;
                return uploadPicture(file);

              case 15:
                uploadedPicture = _context.sent;
                _context.next = 18;
                return prefetchImage(Object(_Picture__WEBPACK_IMPORTED_MODULE_6__["getPreferredSize"])(uploadedPicture.sizes, component.width()).url);

              case 18:
                // Show the uploaded picture.
                onUploaded(uploadedPicture);
                _context.next = 27;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](12);
                console.error(_context.t0);
                _context.t0 = _context.t0.message; // Who returns such an error? Sharp?

                if (_context.t0.indexOf('unsupported image format') >= 0) {
                  _context.t0 = 'UNSUPPORTED_FILE_TYPE';
                }

                return _context.abrupt("return", this.onError(_context.t0));

              case 27:
                _context.prev = 27;
                // Reset "uploading" flag.
                this.setState({
                  uploading: false
                }); // If the picture was uploaded then render it.

                if (uploadedPicture) {
                  this.setState({
                    uploadedPicture: uploadedPicture
                  });
                }

                return _context.finish(27);

              case 31:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[12, 21, 27, 31]]);
      }));

      return function upload(_x) {
        return _upload.apply(this, arguments);
      };
    }()
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return UploadablePicture;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]), _class2.propTypes = {
  editMode: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool.isRequired,
  changeLabel: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.node,
  disabled: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool.isRequired,
  onUpload: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onError: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,
  onUploaded: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired,
  maxFileSize: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.number.isRequired,
  acceptedFileTypes: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string).isRequired,
  // children        : PropTypes.element.isRequired,
  style: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,
  className: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string
}, _class2.defaultProps = {
  editMode: false,
  acceptedFileTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
  maxFileSize: 5.9 * 1024 * 1024,
  disabled: false,
  changeLabel: 'Change picture'
}, _temp)) || _class);

var pictureShape = prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.shape({
  sizes: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object).isRequired
});
var Picture =
/*#__PURE__*/
function (_Component) {
  _inherits(Picture, _Component);

  function Picture() {
    _classCallCheck(this, Picture);

    return _possibleConstructorReturn(this, _getPrototypeOf(Picture).apply(this, arguments));
  }

  _createClass(Picture, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          defaultPicture = _this$props.defaultPicture,
          picture = _this$props.picture,
          rest = _objectWithoutProperties(_this$props, ["defaultPicture", "picture"]);

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Picture__WEBPACK_IMPORTED_MODULE_6__["default"], _extends({}, rest, {
        sizes: picture && picture.sizes || defaultPicture && defaultPicture.sizes
      }));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return Picture;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]); // Preloads an image before displaying it

Picture.propTypes = {
  defaultPicture: pictureShape,
  picture: pictureShape
};

function prefetchImage(url) {
  return new Promise(function (resolve, reject) {
    var image = new Image();

    image.onload = function () {
      return resolve();
    };

    image.onerror = reject;
    image.src = url;
  });
}

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(UploadablePicture, "UploadablePicture", "c:\\dev\\webapp-frontend\\src\\components\\UploadablePicture.js");
  reactHotLoader.register(pictureShape, "pictureShape", "c:\\dev\\webapp-frontend\\src\\components\\UploadablePicture.js");
  reactHotLoader.register(Picture, "Picture", "c:\\dev\\webapp-frontend\\src\\components\\UploadablePicture.js");
  reactHotLoader.register(prefetchImage, "prefetchImage", "c:\\dev\\webapp-frontend\\src\\components\\UploadablePicture.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/pages/Application.css":
/*!***********************************!*\
  !*** ./src/pages/Application.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/pages/Application.js":
/*!**********************************!*\
  !*** ./src/pages/Application.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return App; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_responsive_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-responsive-ui */ "react-responsive-ui");
/* harmony import */ var react_responsive_ui__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_responsive_ui__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_website_components_Loading_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-website/components/Loading.css */ "./node_modules/react-website/components/Loading.css");
/* harmony import */ var react_website_components_Loading_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_website_components_Loading_css__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var javascript_time_ago__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! javascript-time-ago */ "javascript-time-ago");
/* harmony import */ var javascript_time_ago__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(javascript_time_ago__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var javascript_time_ago_locale_en__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! javascript-time-ago/locale/en */ "javascript-time-ago/locale/en");
/* harmony import */ var javascript_time_ago_locale_en__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(javascript_time_ago_locale_en__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_Menu__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/Menu */ "./src/components/Menu.js");
/* harmony import */ var _components_Snackbar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/Snackbar */ "./src/components/Snackbar.js");
/* harmony import */ var _assets_images_home_svg__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../assets/images/home.svg */ "./assets/images/home.svg");
/* harmony import */ var _assets_images_home_svg__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_assets_images_home_svg__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _assets_images_users_svg__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../assets/images/users.svg */ "./assets/images/users.svg");
/* harmony import */ var _assets_images_users_svg__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_assets_images_users_svg__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _Application_css__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Application.css */ "./src/pages/Application.css");
/* harmony import */ var _Application_css__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_Application_css__WEBPACK_IMPORTED_MODULE_12__);
var _dec, _dec2, _class, _class2, _temp;

(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





 // Not importing `Tooltip.css` because
// it's already loaded as part of `react-responsive-ui`.
// import 'react-time-ago/Tooltip.css'

 // Not importing `LoadingIndicator.css` because
// it's already loaded as part of `react-responsive-ui`.
// import 'react-website/components/LoadingIndicator.css'
// `react-time-ago` English language.



javascript_time_ago__WEBPACK_IMPORTED_MODULE_6___default.a.locale(javascript_time_ago_locale_en__WEBPACK_IMPORTED_MODULE_7___default.a);





var App = (_dec = Object(react_website__WEBPACK_IMPORTED_MODULE_3__["meta"])(function (state) {
  return {
    site_name: 'WebApp',
    title: 'WebApp',
    description: 'A generic web application boilerplate',
    image: 'https://www.google.ru/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    locale: 'ru_RU',
    locales: ['ru_RU', 'en_US']
  };
}), _dec2 = Object(react_responsive_ui__WEBPACK_IMPORTED_MODULE_4__["DragAndDrop"])(), _dec(_class = _dec2(_class = (_temp = _class2 =
/*#__PURE__*/
function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _getPrototypeOf(App).apply(this, arguments));
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      var children = this.props.children;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_3__["Loading"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Snackbar__WEBPACK_IMPORTED_MODULE_9__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "webpage"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("nav", {
        className: "webpage__header"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "container"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Menu__WEBPACK_IMPORTED_MODULE_8__["default"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Menu__WEBPACK_IMPORTED_MODULE_8__["MenuLink"], {
        to: "/",
        exact: true
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_assets_images_home_svg__WEBPACK_IMPORTED_MODULE_10___default.a, {
        className: "menu-item__icon menu-item__icon--home"
      }), "Home"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Menu__WEBPACK_IMPORTED_MODULE_8__["MenuLink"], {
        to: "/users"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_assets_images_users_svg__WEBPACK_IMPORTED_MODULE_11___default.a, {
        className: "menu-item__icon menu-item__icon--users"
      }), "Users")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "webpage__content"
      }, children), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("footer", {
        className: "webpage__footer"
      })));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return App;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]), _class2.propTypes = {
  children: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.node.isRequired
}, _temp)) || _class) || _class);

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(App, "App", "c:\\dev\\webapp-frontend\\src\\pages\\Application.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/pages/Error.css":
/*!*****************************!*\
  !*** ./src/pages/Error.css ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/pages/Error.js":
/*!****************************!*\
  !*** ./src/pages/Error.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Page; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Error_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Error.css */ "./src/pages/Error.css");
/* harmony import */ var _Error_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Error_css__WEBPACK_IMPORTED_MODULE_2__);
var _dec, _class;

(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Page = (_dec = Object(react_website__WEBPACK_IMPORTED_MODULE_1__["meta"])(function (state) {
  return {
    title: 'Error'
  };
}), _dec(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(Page, _Component);

  function Page() {
    _classCallCheck(this, Page);

    return _possibleConstructorReturn(this, _getPrototypeOf(Page).apply(this, arguments));
  }

  _createClass(Page, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("section", {
        className: "page-content"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
        className: "page-header"
      }, "Some kind of an error happened"));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return Page;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"])) || _class);

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Page, "Page", "c:\\dev\\webapp-frontend\\src\\pages\\Error.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/pages/Home.css":
/*!****************************!*\
  !*** ./src/pages/Home.css ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/pages/Home.js":
/*!***************************!*\
  !*** ./src/pages/Home.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Page; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _assets_images_husky_jpg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../assets/images/husky.jpg */ "./assets/images/husky.jpg");
/* harmony import */ var _assets_images_husky_jpg__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_assets_images_husky_jpg__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Home_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Home.css */ "./src/pages/Home.css");
/* harmony import */ var _Home_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Home_css__WEBPACK_IMPORTED_MODULE_3__);
var _dec, _class;

(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var Page = (_dec = Object(react_website__WEBPACK_IMPORTED_MODULE_1__["meta"])(function (state) {
  return {
    title: 'Home'
  };
}), _dec(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(Page, _Component);

  function Page() {
    _classCallCheck(this, Page);

    return _possibleConstructorReturn(this, _getPrototypeOf(Page).apply(this, arguments));
  }

  _createClass(Page, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("section", {
        className: "page-content container"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
        className: "page-header"
      }, "Husky"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
        src: _assets_images_husky_jpg__WEBPACK_IMPORTED_MODULE_2___default.a,
        className: "home-page-image"
      }));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return Page;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"])) || _class);

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Page, "Page", "c:\\dev\\webapp-frontend\\src\\pages\\Home.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/pages/NotFound.js":
/*!*******************************!*\
  !*** ./src/pages/NotFound.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NotFound; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Error_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Error.css */ "./src/pages/Error.css");
/* harmony import */ var _Error_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Error_css__WEBPACK_IMPORTED_MODULE_2__);
var _dec, _class;

(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var NotFound = (_dec = Object(react_website__WEBPACK_IMPORTED_MODULE_1__["meta"])(function (state) {
  return {
    title: 'Not found'
  };
}), _dec(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(NotFound, _Component);

  function NotFound() {
    _classCallCheck(this, NotFound);

    return _possibleConstructorReturn(this, _getPrototypeOf(NotFound).apply(this, arguments));
  }

  _createClass(NotFound, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "page-content"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
        className: "page-header"
      }, "Page not found"));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return NotFound;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"])) || _class);

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(NotFound, "NotFound", "c:\\dev\\webapp-frontend\\src\\pages\\NotFound.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/pages/Profile.css":
/*!*******************************!*\
  !*** ./src/pages/Profile.css ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/pages/Profile.js":
/*!******************************!*\
  !*** ./src/pages/Profile.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Profile; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "prop-types");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_responsive_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-responsive-ui */ "react-responsive-ui");
/* harmony import */ var react_responsive_ui__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_responsive_ui__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var easy_react_form__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! easy-react-form */ "easy-react-form");
/* harmony import */ var easy_react_form__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(easy_react_form__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! classnames */ "classnames");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _utility_timer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utility/timer */ "./src/utility/timer.js");
/* harmony import */ var _PropTypes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../PropTypes */ "./src/PropTypes.js");
/* harmony import */ var _redux_account__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../redux/account */ "./src/redux/account.js");
/* harmony import */ var _assets_images_account_background_picture_jpg__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../assets/images/account-background-picture.jpg */ "./assets/images/account-background-picture.jpg");
/* harmony import */ var _assets_images_account_background_picture_jpg__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_assets_images_account_background_picture_jpg__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _assets_images_icons_clock_svg__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../assets/images/icons/clock.svg */ "./assets/images/icons/clock.svg");
/* harmony import */ var _assets_images_icons_clock_svg__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_clock_svg__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _assets_images_icons_message_svg__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../assets/images/icons/message.svg */ "./assets/images/icons/message.svg");
/* harmony import */ var _assets_images_icons_message_svg__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_message_svg__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _assets_images_icons_person_add_svg__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../assets/images/icons/person-add.svg */ "./assets/images/icons/person-add.svg");
/* harmony import */ var _assets_images_icons_person_add_svg__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icons_person_add_svg__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _components_UploadablePicture__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../components/UploadablePicture */ "./src/components/UploadablePicture.js");
/* harmony import */ var _components_Picture__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../components/Picture */ "./src/components/Picture.js");
/* harmony import */ var _components_AccountPicture__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../components/AccountPicture */ "./src/components/AccountPicture.js");
/* harmony import */ var _Profile_css__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./Profile.css */ "./src/pages/Profile.css");
/* harmony import */ var _Profile_css__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_Profile_css__WEBPACK_IMPORTED_MODULE_17__);
var _dec, _dec2, _dec3, _class, _class2, _temp;

(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }










 // import DefaultBackground from '../../assets/images/account-background-pattern.svg'









var LATEST_ACTIVITY_TIME_REFRESH_INTERVAL = 60 * 1000; // once in a minute

var ONLINE_STATUS_TIME_SPAN = 5 * 60 * 1000; // 5 minutes

var DEFAULT_BACKGROUND_COLOR = '#ffffff'; // const DEFAULT_BACKGROUND_PATTERN =
// {
// 	sizes:
// 	[{
// 		width  : 188,
// 		height : 178,
// 		url    : DefaultBackground
// 	}]
// }

var DEFAULT_BACKGROUND_PICTURE = {
  sizes: [{
    width: 2429,
    height: 782,
    url: _assets_images_account_background_picture_jpg__WEBPACK_IMPORTED_MODULE_10___default.a
  }]
};
var messages = {
  ru: {
    cancel: 'Отмена',
    save: 'Сохранить',
    edit: 'Изменить'
  },
  en: {
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit'
  }
};

function translate(key) {
  return messages.en[key];
}

var Profile = (_dec = Object(react_website__WEBPACK_IMPORTED_MODULE_3__["meta"])(function (_ref) {
  var account = _ref.account.account;
  return {
    title: account ? account.name : ''
  };
}), _dec2 = Object(react_website__WEBPACK_IMPORTED_MODULE_3__["preload"])(function (_ref2) {
  var dispatch = _ref2.dispatch,
      params = _ref2.params;
  return dispatch(Object(_redux_account__WEBPACK_IMPORTED_MODULE_9__["getAccount"])(params.id));
}, {
  client: true
}), _dec3 = Object(react_redux__WEBPACK_IMPORTED_MODULE_2__["connect"])(function (_ref3) {
  var account = _ref3.account;
  return {
    account: account.account
  };
}, {
  getLatestActivityTime: _redux_account__WEBPACK_IMPORTED_MODULE_9__["getLatestActivityTime"],
  setNewBackgroundPicture: _redux_account__WEBPACK_IMPORTED_MODULE_9__["setNewBackgroundPicture"],
  uploadPicture: _redux_account__WEBPACK_IMPORTED_MODULE_9__["uploadPicture"]
}), _dec(_class = _dec2(_class = _dec3(_class = (_temp = _class2 =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Profile, _React$Component);

  function Profile() {
    var _this;

    _classCallCheck(this, Profile);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Profile).call(this));
    _this.state = {};

    _this.toggleEditModeHeader = function () {
      _this.setState(function (_ref4) {
        var editingHeader = _ref4.editingHeader;
        return {
          editingHeader: !editingHeader
        };
      });
    };

    _this.saveChangesHeader = _this.saveChangesHeader.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Profile, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // Stop refreshing this user's latest activity time.
      if (this.stopLatestActivityTimeRefresh) {
        this.stopLatestActivityTimeRefresh();
      }
    }
  }, {
    key: "canEdit",
    value: function canEdit() {
      var _this$props = this.props,
          account = _this$props.account,
          user = _this$props.user;
      return true;
      return account; // && account.user.id === user.id
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var account = this.props.account;
      var _this$state = this.state,
          editing = _this$state.editing,
          editingHeader = _this$state.editingHeader,
          previewingNewBanner = _this$state.previewingNewBanner;

      if (!account) {
        return null;
      }

      var wide_content = true;
      var background_color_enabled = false;
      var background_color = undefined;

      var upload_picture =
      /*#__PURE__*/
      function () {
        var _ref5 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        return function upload_picture() {
          return _ref5.apply(this, arguments);
        };
      }();

      var set_upload_picture_error = function set_upload_picture_error() {};

      var set_uploaded_account_background_pattern = function set_uploaded_account_background_pattern() {};

      var show_banner_while_editing = false;
      var submitting = false;
      var showBannerWhileEditing = previewingNewBanner || account.banner;
      account.data.backgroundPicture = DEFAULT_BACKGROUND_PICTURE;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("section", {
        className: classnames__WEBPACK_IMPORTED_MODULE_6___default()('account-profile', {
          'account-profile--editing': editing
        })
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(editingHeader ? easy_react_form__WEBPACK_IMPORTED_MODULE_5__["Form"] : 'div', _objectSpread({
        className: 'account-profile__background-picture-container'
      }, editingHeader ? {
        onSubmit: this.saveChangesHeader,
        autoFocus: true
      } : null), this.renderTopSection()), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "account-profile__body content-sections"
      }, !wide_content && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        style: styles.personal_info_column,
        className: "account-profile__info"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("section", {
        className: classnames__WEBPACK_IMPORTED_MODULE_6___default()({
          'background-section': !editing,
          'content-section': editing
        })
      }, account.blocked_at && this.render_account_blocked_notice(), !editing && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PersonalInfo, {
        account: account
      }), editing && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(PersonalInfoForm, {
        account: account,
        busy: account_form_busy,
        onSubmit: this.save_profile_edits,
        storeSubmitButton: function storeSubmitButton(ref) {
          return _this2.account_form_submit_button = ref;
        }
      }, this.render_account_edit_errors()), !this.can_edit_profile() && this.render_moderator_actions(), !this.can_edit_profile() && this.render_other_account_actions(), account.user && this.render_online_status())), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "account-profile__content"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "account-profile__tabs-container"
      })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "account-profile__right-aside"
      })));
    }
  }, {
    key: "renderTopSection",
    value: function renderTopSection() {
      var _this$props2 = this.props,
          account = _this$props2.account,
          setNewBackgroundPicture = _this$props2.setNewBackgroundPicture,
          uploadingNewBackgroundPicture = _this$props2.uploadingNewBackgroundPicture,
          newBackgroundPicture = _this$props2.newBackgroundPicture;
      var _this$state2 = this.state,
          editingHeader = _this$state2.editingHeader,
          savingChangesHeader = _this$state2.savingChangesHeader,
          previewingNewBanner = _this$state2.previewingNewBanner;
      var submitting = false;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, !editingHeader && account.data.backgroundPicture && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Picture__WEBPACK_IMPORTED_MODULE_15__["default"], {
        fit: "cover",
        sizes: account.data.backgroundPicture.sizes,
        className: "account-profile__background-picture"
      }), editingHeader && newBackgroundPicture && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Picture__WEBPACK_IMPORTED_MODULE_15__["default"], {
        picture: newBackgroundPicture,
        className: "account-profile__background-picture"
      }), editingHeader && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_UploadablePicture__WEBPACK_IMPORTED_MODULE_14__["default"], {
        disabled: savingChangesHeader,
        onUploaded: setNewBackgroundPicture,
        className: classnames__WEBPACK_IMPORTED_MODULE_6___default()('account-profile__uploadable-picture', 'account-profile__picture-container', 'card')
      }, this.renderAccountPicture({
        uploadable: true
      })), !editingHeader && this.renderAccountPicture(), !editingHeader && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_3__["Link"], {
        to: "/".concat(account.id),
        className: "account-profile__name"
      }, account.name), editingHeader && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(easy_react_form__WEBPACK_IMPORTED_MODULE_5__["Field"], {
        name: "name",
        value: account.name,
        component: react_responsive_ui__WEBPACK_IMPORTED_MODULE_4__["TextInput"],
        className: "account-profile__name-input"
      }), this.canEdit() && this.renderEditActionsHeader());
    }
  }, {
    key: "renderAccountPicture",
    value: function renderAccountPicture() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var account = this.props.account;
      var uploadable = props.uploadable;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_3__["Link"], {
        to: "/".concat(account.id),
        className: classnames__WEBPACK_IMPORTED_MODULE_6___default()('account-profile__picture', {
          'account-profile__picture-container': !uploadable
        })
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_AccountPicture__WEBPACK_IMPORTED_MODULE_16__["default"], {
        account: account,
        className: "account-profile__picture-image"
      }));
    }
  }, {
    key: "renderEditActionsHeader",
    value: function renderEditActionsHeader() {
      // const { translate } = this.props
      var _this$state3 = this.state,
          editingHeader = _this$state3.editingHeader,
          savingChangesHeader = _this$state3.savingChangesHeader;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "account-profile__edit-actions card__actions"
      }, !editingHeader && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_responsive_ui__WEBPACK_IMPORTED_MODULE_4__["Button"], {
        onClick: this.toggleEditModeHeader,
        className: "card__action"
      }, translate('edit')), editingHeader && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_responsive_ui__WEBPACK_IMPORTED_MODULE_4__["Button"], {
        onClick: this.toggleEditModeHeader,
        className: "card__action",
        disabled: savingChangesHeader
      }, translate('cancel')), editingHeader && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(easy_react_form__WEBPACK_IMPORTED_MODULE_5__["Submit"], {
        component: react_responsive_ui__WEBPACK_IMPORTED_MODULE_4__["Button"],
        className: "card__action card__action--primary"
      }, translate('save')));
    }
  }, {
    key: "saveChangesHeader",
    value: function () {
      var _saveChangesHeader = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(values) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.setState({
                  savingChangesHeader: true
                });
                console.log(values);
                this.setState({
                  editingHeader: false,
                  savingChangesHeader: false
                });

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function saveChangesHeader(_x) {
        return _saveChangesHeader.apply(this, arguments);
      };
    }()
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return Profile;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component), _class2.propTypes = {
  account: _PropTypes__WEBPACK_IMPORTED_MODULE_8__["accountShape"]
}, _temp)) || _class) || _class) || _class);

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(LATEST_ACTIVITY_TIME_REFRESH_INTERVAL, "LATEST_ACTIVITY_TIME_REFRESH_INTERVAL", "c:\\dev\\webapp-frontend\\src\\pages\\Profile.js");
  reactHotLoader.register(ONLINE_STATUS_TIME_SPAN, "ONLINE_STATUS_TIME_SPAN", "c:\\dev\\webapp-frontend\\src\\pages\\Profile.js");
  reactHotLoader.register(DEFAULT_BACKGROUND_COLOR, "DEFAULT_BACKGROUND_COLOR", "c:\\dev\\webapp-frontend\\src\\pages\\Profile.js");
  reactHotLoader.register(DEFAULT_BACKGROUND_PICTURE, "DEFAULT_BACKGROUND_PICTURE", "c:\\dev\\webapp-frontend\\src\\pages\\Profile.js");
  reactHotLoader.register(messages, "messages", "c:\\dev\\webapp-frontend\\src\\pages\\Profile.js");
  reactHotLoader.register(translate, "translate", "c:\\dev\\webapp-frontend\\src\\pages\\Profile.js");
  reactHotLoader.register(Profile, "Profile", "c:\\dev\\webapp-frontend\\src\\pages\\Profile.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/pages/Unauthenticated.js":
/*!**************************************!*\
  !*** ./src/pages/Unauthenticated.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Unauthenticated; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Error_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Error.css */ "./src/pages/Error.css");
/* harmony import */ var _Error_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Error_css__WEBPACK_IMPORTED_MODULE_2__);
var _dec, _class;

(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Unauthenticated = (_dec = Object(react_website__WEBPACK_IMPORTED_MODULE_1__["meta"])(function (state) {
  return {
    title: 'Unauthenticated'
  };
}), _dec(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(Unauthenticated, _Component);

  function Unauthenticated() {
    _classCallCheck(this, Unauthenticated);

    return _possibleConstructorReturn(this, _getPrototypeOf(Unauthenticated).apply(this, arguments));
  }

  _createClass(Unauthenticated, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("section", {
        className: "page-content"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
        className: "page-header"
      }, "You need to sign in to access this page"));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return Unauthenticated;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"])) || _class);

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Unauthenticated, "Unauthenticated", "c:\\dev\\webapp-frontend\\src\\pages\\Unauthenticated.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/pages/Unauthorized.js":
/*!***********************************!*\
  !*** ./src/pages/Unauthorized.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Unauthorized; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Error_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Error.css */ "./src/pages/Error.css");
/* harmony import */ var _Error_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Error_css__WEBPACK_IMPORTED_MODULE_2__);
var _dec, _class;

(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var Unauthorized = (_dec = Object(react_website__WEBPACK_IMPORTED_MODULE_1__["meta"])(function (state) {
  return {
    title: 'Unauthorized'
  };
}), _dec(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(Unauthorized, _Component);

  function Unauthorized() {
    _classCallCheck(this, Unauthorized);

    return _possibleConstructorReturn(this, _getPrototypeOf(Unauthorized).apply(this, arguments));
  }

  _createClass(Unauthorized, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("section", {
        className: "page-content"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", {
        className: "page-header"
      }, "You're not authorized to perform this action"));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return Unauthorized;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"])) || _class);

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Unauthorized, "Unauthorized", "c:\\dev\\webapp-frontend\\src\\pages\\Unauthorized.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/pages/Users.css":
/*!*****************************!*\
  !*** ./src/pages/Users.css ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/pages/Users.js":
/*!****************************!*\
  !*** ./src/pages/Users.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UsersPage; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "react-redux");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_responsive_ui_commonjs_Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-responsive-ui/commonjs/Modal */ "react-responsive-ui/commonjs/Modal");
/* harmony import */ var react_responsive_ui_commonjs_Modal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_responsive_ui_commonjs_Modal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_responsive_ui_commonjs_TextInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-responsive-ui/commonjs/TextInput */ "react-responsive-ui/commonjs/TextInput");
/* harmony import */ var react_responsive_ui_commonjs_TextInput__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_responsive_ui_commonjs_TextInput__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_responsive_ui_commonjs_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-responsive-ui/commonjs/Button */ "react-responsive-ui/commonjs/Button");
/* harmony import */ var react_responsive_ui_commonjs_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_responsive_ui_commonjs_Button__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_time_ago__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-time-ago */ "react-time-ago");
/* harmony import */ var react_time_ago__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_time_ago__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var easy_react_form__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! easy-react-form */ "easy-react-form");
/* harmony import */ var easy_react_form__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(easy_react_form__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _redux_users__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../redux/users */ "./src/redux/users.js");
/* harmony import */ var _redux_notifications__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../redux/notifications */ "./src/redux/notifications.js");
/* harmony import */ var _Users_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Users.css */ "./src/pages/Users.css");
/* harmony import */ var _Users_css__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_Users_css__WEBPACK_IMPORTED_MODULE_10__);
var _dec, _class, _dec2, _dec3, _dec4, _class2;

(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }


 // Webpack still can't learn how to tree-shake.
// import { Modal, TextInput, Button } from 'react-responsive-ui'










var UsersPage = (_dec2 = Object(react_website__WEBPACK_IMPORTED_MODULE_7__["preload"])(
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref) {
    var dispatch;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dispatch = _ref.dispatch;
            _context2.next = 3;
            return dispatch(Object(_redux_users__WEBPACK_IMPORTED_MODULE_8__["getUsers"])());

          case 3:
            return _context2.abrupt("return", _context2.sent);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}()), _dec3 = Object(react_website__WEBPACK_IMPORTED_MODULE_7__["meta"])(function (state) {
  return {
    title: 'Simple REST API example',
    description: 'A list of users',
    image: 'https://www.famouslogos.us/images/facebook-logo.jpg'
  };
}), _dec4 = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(function (_ref3) {
  var users = _ref3.users;
  return {
    users: users.users,
    getUsersPending: users.getUsersPending,
    addUserPending: users.addUserPending
  };
}, {
  getUsers: _redux_users__WEBPACK_IMPORTED_MODULE_8__["getUsers"],
  addUser: _redux_users__WEBPACK_IMPORTED_MODULE_8__["addUser"],
  deleteUser: _redux_users__WEBPACK_IMPORTED_MODULE_8__["deleteUser"],
  notify: _redux_notifications__WEBPACK_IMPORTED_MODULE_9__["notify"]
}), _dec2(_class2 = _dec3(_class2 = _dec4(_class2 =
/*#__PURE__*/
function (_Component2) {
  _inherits(UsersPage, _Component2);

  function UsersPage() {
    var _this2;

    _classCallCheck(this, UsersPage);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(UsersPage).call(this));
    _this2.state = {};

    _this2.showAddUserForm = function () {
      return _this2.setState({
        showAddUserForm: true
      });
    };

    _this2.hideAddUserForm = function () {
      return _this2.setState({
        showAddUserForm: false
      });
    };

    _this2.userAdded = function () {
      var _this2$props = _this2.props,
          notify = _this2$props.notify,
          getUsers = _this2$props.getUsers;
      notify("User added");

      _this2.hideAddUserForm();

      getUsers();
    };

    _this2.deleteUser = _this2.deleteUser.bind(_assertThisInitialized(_assertThisInitialized(_this2)));
    return _this2;
  }

  _createClass(UsersPage, [{
    key: "deleteUser",
    value: function () {
      var _deleteUser = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(id) {
        var _this$props, deleteUser, getUsers, notify;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this$props = this.props, deleteUser = _this$props.deleteUser, getUsers = _this$props.getUsers, notify = _this$props.notify;
                _context3.next = 3;
                return deleteUser(id);

              case 3:
                notify("User deleted");
                getUsers();

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function deleteUser(_x3) {
        return _deleteUser.apply(this, arguments);
      };
    }()
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          users = _this$props2.users,
          getUsers = _this$props2.getUsers,
          addUserPending = _this$props2.addUserPending;
      var showAddUserForm = this.state.showAddUserForm;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("section", {
        className: "page-content container"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
        className: "users__description"
      }, "This is an example of REST API data querying (try disabling javascript and reloading the page)."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
        className: "users__description"
      }, "An artificial delay of 1 second is added to all Redux actions to illustrate the \"loading\" spinners."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_responsive_ui_commonjs_Button__WEBPACK_IMPORTED_MODULE_4___default.a, {
        onClick: this.showAddUserForm
      }, "Add user"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_responsive_ui_commonjs_Button__WEBPACK_IMPORTED_MODULE_4___default.a, {
        onClick: getUsers,
        className: "users__refresh"
      }, "Refresh"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: "users__content"
      }, this.renderUsers()), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_responsive_ui_commonjs_Modal__WEBPACK_IMPORTED_MODULE_2___default.a, {
        isOpen: showAddUserForm,
        close: this.hideAddUserForm,
        wait: addUserPending
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(AddUserForm, {
        onAfterSubmit: this.userAdded
      })))));
    }
  }, {
    key: "renderUsers",
    value: function renderUsers() {
      var _this3 = this;

      var _this$props3 = this.props,
          users = _this$props3.users,
          getUsersPending = _this$props3.getUsersPending;

      if (getUsersPending) {
        return 'Loading users...';
      }

      if (users.length === 0) {
        return 'No users';
      }

      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
        className: "users__list"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, users.map(function (user) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
          key: user.id
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
          className: "user__name"
        }, user.name), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_time_ago__WEBPACK_IMPORTED_MODULE_5___default.a, null, user.dateAdded)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_responsive_ui_commonjs_Button__WEBPACK_IMPORTED_MODULE_4___default.a, {
          onClick: function onClick() {
            return _this3.deleteUser(user.id);
          },
          className: "user__delete"
        }, "delete")));
      })));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return UsersPage;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"])) || _class2) || _class2) || _class2);

var AddUserForm = (_dec = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["connect"])(function (state) {
  return {};
}, {
  addUser: _redux_users__WEBPACK_IMPORTED_MODULE_8__["addUser"]
}), _dec(_class =
/*#__PURE__*/
function (_Component) {
  _inherits(AddUserForm, _Component);

  function AddUserForm() {
    var _this;

    _classCallCheck(this, AddUserForm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AddUserForm).call(this));
    _this.submit = _this.submit.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(AddUserForm, [{
    key: "submit",
    value: function () {
      var _submit = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(values) {
        var addUser;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                addUser = this.props.addUser;
                _context.next = 3;
                return addUser(values);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function submit(_x) {
        return _submit.apply(this, arguments);
      };
    }()
  }, {
    key: "render",
    value: function render() {
      var onAfterSubmit = this.props.onAfterSubmit;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(easy_react_form__WEBPACK_IMPORTED_MODULE_6__["Form"], {
        autoFocus: true,
        onSubmit: this.submit,
        onAfterSubmit: onAfterSubmit,
        className: "add-user"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(easy_react_form__WEBPACK_IMPORTED_MODULE_6__["Field"], {
        required: true,
        name: "name",
        label: "Name",
        component: react_responsive_ui_commonjs_TextInput__WEBPACK_IMPORTED_MODULE_3___default.a,
        className: "add-user__name"
      }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(easy_react_form__WEBPACK_IMPORTED_MODULE_6__["Submit"], {
        submit: true,
        component: react_responsive_ui_commonjs_Button__WEBPACK_IMPORTED_MODULE_4___default.a,
        className: "rrui__button--border add-user__submit"
      }, "Add"));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return AddUserForm;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"])) || _class);
;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(UsersPage, "UsersPage", "c:\\dev\\webapp-frontend\\src\\pages\\Users.js");
  reactHotLoader.register(AddUserForm, "AddUserForm", "c:\\dev\\webapp-frontend\\src\\pages\\Users.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/react-website.js":
/*!******************************!*\
  !*** ./src/react-website.js ***!
  \******************************/
/*! exports provided: icon, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./routes */ "./src/routes.js");
/* harmony import */ var _redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./redux */ "./src/redux/index.js");
/* harmony import */ var _Container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Container */ "./src/Container.js");
/* harmony import */ var _assets_images_icon_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/images/icon.png */ "./assets/images/icon.png");
/* harmony import */ var _assets_images_icon_png__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_assets_images_icon_png__WEBPACK_IMPORTED_MODULE_3__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "icon", function() { return _assets_images_icon_png__WEBPACK_IMPORTED_MODULE_3___default.a; });
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();



 // "Favicon" must be imported on the client side too
// since no assets are emitted on the server side


var _default = {
  reducers: _redux__WEBPACK_IMPORTED_MODULE_1__,
  routes: _routes__WEBPACK_IMPORTED_MODULE_0__["default"],
  container: _Container__WEBPACK_IMPORTED_MODULE_2__["default"],
  // When the website is open in a web browser
  // hide website content under a "preloading" screen
  // until the application has finished loading.
  // It still "blinks" a bit in development mode
  // because CSS styles in development mode are included
  // not as `*.css` files but dynamically via javascript
  // by adding a `<style/>` DOM element, and that's why
  // in development mode styles are not applied immediately
  // in a web browser. In production mode CSS styles are
  // included as `*.css` files so they are applied immediately.
  showPreloadInitially: true,
  onError: function onError(error, _ref) {
    var path = _ref.path,
        url = _ref.url,
        redirect = _ref.redirect,
        dispatch = _ref.dispatch,
        getState = _ref.getState,
        server = _ref.server;
    console.error("Error while preloading \"".concat(url, "\""));
    console.error(error); // Not authenticated

    if (error.status === 401) {
      // Prevent double redirection to `/unauthenticated`.
      // (e.g. when two parallel `Promise`s load inside `@preload()`
      //  and both get Status 401 HTTP Response)
      if (typeof window !== 'undefined' && window.location.pathname === '/unauthenticated') {
        return;
      }

      return redirect('/unauthenticated');
    } // Not authorized


    if (error.status === 403) {
      return redirect('/unauthorized');
    } // Redirect to a generic error page in production


    if (false) {}
  }
};
/* harmony default export */ __webpack_exports__["default"] = (_default);
;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, "default", "c:\\dev\\webapp-frontend\\src\\react-website.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/redux/account.js":
/*!******************************!*\
  !*** ./src/redux/account.js ***!
  \******************************/
/*! exports provided: getAccount, uploadPicture, setNewBackgroundPicture, getLatestActivityTime, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAccount", function() { return getAccount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uploadPicture", function() { return uploadPicture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setNewBackgroundPicture", function() { return setNewBackgroundPicture; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLatestActivityTime", function() { return getLatestActivityTime; });
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_0__);
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


var redux = new react_website__WEBPACK_IMPORTED_MODULE_0__["ReduxModule"]();
var getAccount = redux.action(function (id) {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(http) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", {
                  id: 1,
                  name: 'Alice Green',
                  user: {
                    id: 123,
                    firstName: 'Alex',
                    lastName: 'Murphy'
                  },
                  data: {}
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()
  );
}, 'account');
var uploadPicture = redux.action(function (file) {
  return function (http) {
    return http.post("/images/upload", {
      file: file
    });
  };
}); // `setNewBackgroundPicture` is called after the uploaded image is prefetched.
// Prefetching is done to avoid a flash of a not yet loaded image.

var setNewBackgroundPicture = redux.action(function (picture) {
  return picture;
}, function (state, picture) {
  return _objectSpread({}, state, {
    uploadingNewBackgroundPicture: false,
    newBackgroundPicture: picture
  });
});
var getLatestActivityTime = redux.action(function (id) {
  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(http) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", new Date());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
}, 'latestActivityTime');

var _default = redux.reducer();

/* harmony default export */ __webpack_exports__["default"] = (_default);
;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(redux, "redux", "c:\\dev\\webapp-frontend\\src\\redux\\account.js");
  reactHotLoader.register(getAccount, "getAccount", "c:\\dev\\webapp-frontend\\src\\redux\\account.js");
  reactHotLoader.register(uploadPicture, "uploadPicture", "c:\\dev\\webapp-frontend\\src\\redux\\account.js");
  reactHotLoader.register(setNewBackgroundPicture, "setNewBackgroundPicture", "c:\\dev\\webapp-frontend\\src\\redux\\account.js");
  reactHotLoader.register(getLatestActivityTime, "getLatestActivityTime", "c:\\dev\\webapp-frontend\\src\\redux\\account.js");
  reactHotLoader.register(_default, "default", "c:\\dev\\webapp-frontend\\src\\redux\\account.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/redux/index.js":
/*!****************************!*\
  !*** ./src/redux/index.js ***!
  \****************************/
/*! exports provided: users, notifications, account, uploadablePicture */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _users__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./users */ "./src/redux/users.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "users", function() { return _users__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./notifications */ "./src/redux/notifications.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "notifications", function() { return _notifications__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _account__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./account */ "./src/redux/account.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "account", function() { return _account__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _uploadablePicture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./uploadablePicture */ "./src/redux/uploadablePicture.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "uploadablePicture", function() { return _uploadablePicture__WEBPACK_IMPORTED_MODULE_3__["default"]; });






/***/ }),

/***/ "./src/redux/notifications.js":
/*!************************************!*\
  !*** ./src/redux/notifications.js ***!
  \************************************/
/*! exports provided: notify, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "notify", function() { return notify; });
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_0__);
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();


var redux = new react_website__WEBPACK_IMPORTED_MODULE_0__["ReduxModule"]();
var notify = redux.simpleAction(function (content, options) {
  return {
    content: content,
    options: options
  };
}, 'notification');

var _default = redux.reducer();

/* harmony default export */ __webpack_exports__["default"] = (_default);
;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(redux, "redux", "c:\\dev\\webapp-frontend\\src\\redux\\notifications.js");
  reactHotLoader.register(notify, "notify", "c:\\dev\\webapp-frontend\\src\\redux\\notifications.js");
  reactHotLoader.register(_default, "default", "c:\\dev\\webapp-frontend\\src\\redux\\notifications.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/redux/uploadablePicture.js":
/*!****************************************!*\
  !*** ./src/redux/uploadablePicture.js ***!
  \****************************************/
/*! exports provided: uploadPicture, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uploadPicture", function() { return uploadPicture; });
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_0__);
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();


var redux = new react_website__WEBPACK_IMPORTED_MODULE_0__["ReduxModule"]();
var uploadPicture = redux.action(function (file) {
  return function (http) {
    return http.post("/images/upload", {
      file: file
    });
  };
});

var _default = redux.reducer();

/* harmony default export */ __webpack_exports__["default"] = (_default);
;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(redux, "redux", "c:\\dev\\webapp-frontend\\src\\redux\\uploadablePicture.js");
  reactHotLoader.register(uploadPicture, "uploadPicture", "c:\\dev\\webapp-frontend\\src\\redux\\uploadablePicture.js");
  reactHotLoader.register(_default, "default", "c:\\dev\\webapp-frontend\\src\\redux\\uploadablePicture.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/redux/users.js":
/*!****************************!*\
  !*** ./src/redux/users.js ***!
  \****************************/
/*! exports provided: getUsers, addUser, deleteUser, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUsers", function() { return getUsers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addUser", function() { return addUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteUser", function() { return deleteUser; });
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_0__);
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


var redux = new react_website__WEBPACK_IMPORTED_MODULE_0__["ReduxModule"]();
var getUsers = redux.action('GET_USERS', function () {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(http) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return delay(1000);

              case 2:
                _context.next = 4;
                return http.get('/api/example/users');

              case 4:
                return _context.abrupt("return", _context.sent);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }()
  );
}, 'users');
var addUser = redux.action('ADD_USER', function (user) {
  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(http) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return delay(1500);

              case 2:
                _context2.next = 4;
                return http.post("/api/example/users", user);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
});
var deleteUser = redux.action( // Action name is optional.
// Will be autogenerated if not passed.
// 'DELETE_USER',
function (id) {
  return (
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(http) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return delay(1000);

              case 2:
                _context3.next = 4;
                return http.delete("/api/example/users/".concat(id));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }()
  );
});
var initialState = {
  users: [] // This is the Redux reducer which now
  // handles the asynchronous actions defined above.

};

var _default = redux.reducer(initialState);

/* harmony default export */ __webpack_exports__["default"] = (_default); // "Sleep" using `Promise`

var delay = function delay(_delay) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, _delay);
  });
};

;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(redux, "redux", "c:\\dev\\webapp-frontend\\src\\redux\\users.js");
  reactHotLoader.register(getUsers, "getUsers", "c:\\dev\\webapp-frontend\\src\\redux\\users.js");
  reactHotLoader.register(addUser, "addUser", "c:\\dev\\webapp-frontend\\src\\redux\\users.js");
  reactHotLoader.register(deleteUser, "deleteUser", "c:\\dev\\webapp-frontend\\src\\redux\\users.js");
  reactHotLoader.register(initialState, "initialState", "c:\\dev\\webapp-frontend\\src\\redux\\users.js");
  reactHotLoader.register(delay, "delay", "c:\\dev\\webapp-frontend\\src\\redux\\users.js");
  reactHotLoader.register(_default, "default", "c:\\dev\\webapp-frontend\\src\\redux\\users.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/routes.js":
/*!***********************!*\
  !*** ./src/routes.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-website */ "react-website");
/* harmony import */ var react_website__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_website__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _pages_Application__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pages/Application */ "./src/pages/Application.js");
/* harmony import */ var _pages_Users__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pages/Users */ "./src/pages/Users.js");
/* harmony import */ var _pages_Profile__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pages/Profile */ "./src/pages/Profile.js");
/* harmony import */ var _pages_Home__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pages/Home */ "./src/pages/Home.js");
/* harmony import */ var _pages_Error__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./pages/Error */ "./src/pages/Error.js");
/* harmony import */ var _pages_Unauthenticated__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pages/Unauthenticated */ "./src/pages/Unauthenticated.js");
/* harmony import */ var _pages_Unauthorized__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./pages/Unauthorized */ "./src/pages/Unauthorized.js");
/* harmony import */ var _pages_NotFound__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./pages/NotFound */ "./src/pages/NotFound.js");
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();












var _default = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "/",
  Component: _pages_Application__WEBPACK_IMPORTED_MODULE_2__["default"]
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  Component: _pages_Home__WEBPACK_IMPORTED_MODULE_5__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "users",
  Component: _pages_Users__WEBPACK_IMPORTED_MODULE_3__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "unauthenticated",
  Component: _pages_Unauthenticated__WEBPACK_IMPORTED_MODULE_7__["default"],
  status: 401
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "unauthorized",
  Component: _pages_Unauthorized__WEBPACK_IMPORTED_MODULE_8__["default"],
  status: 403
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "not-found",
  Component: _pages_NotFound__WEBPACK_IMPORTED_MODULE_9__["default"],
  status: 404
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "error",
  Component: _pages_Error__WEBPACK_IMPORTED_MODULE_6__["default"],
  status: 500
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_website__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: ":id",
  Component: _pages_Profile__WEBPACK_IMPORTED_MODULE_4__["default"]
}));

/* harmony default export */ __webpack_exports__["default"] = (_default);
;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, "default", "c:\\dev\\webapp-frontend\\src\\routes.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./src/utility/timer.js":
/*!******************************!*\
  !*** ./src/utility/timer.js ***!
  \******************************/
/*! exports provided: periodical */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "periodical", function() { return periodical; });
(function () {
  var enterModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").enterModule;

  enterModule && enterModule(module);
})();

function periodical(action, interval) {
  var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var cancelled = false;

  var iterate = function iterate() {
    if (cancelled) {
      return;
    }

    var result = action();

    if (result && typeof result.then === 'function') {
      result.then(function () {
        return setTimeout(iterate, interval);
      });
    } else {
      setTimeout(iterate, interval);
    }
  };

  setTimeout(iterate, delay);
  return function () {
    return cancelled = true;
  };
}
;

(function () {
  var reactHotLoader = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").default;

  var leaveModule = __webpack_require__(/*! react-hot-loader */ "react-hot-loader").leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(periodical, "periodical", "c:\\dev\\webapp-frontend\\src\\utility\\timer.js");
  leaveModule(module);
})();

;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "classnames":
/*!*****************************!*\
  !*** external "classnames" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("classnames");

/***/ }),

/***/ "easy-react-form":
/*!**********************************!*\
  !*** external "easy-react-form" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("easy-react-form");

/***/ }),

/***/ "javascript-time-ago":
/*!**************************************!*\
  !*** external "javascript-time-ago" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("javascript-time-ago");

/***/ }),

/***/ "javascript-time-ago/locale/en":
/*!************************************************!*\
  !*** external "javascript-time-ago/locale/en" ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("javascript-time-ago/locale/en");

/***/ }),

/***/ "lodash/merge":
/*!*******************************!*\
  !*** external "lodash/merge" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash/merge");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "prop-types":
/*!*****************************!*\
  !*** external "prop-types" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-hot-loader":
/*!***********************************!*\
  !*** external "react-hot-loader" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-hot-loader");

/***/ }),

/***/ "react-redux":
/*!******************************!*\
  !*** external "react-redux" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),

/***/ "react-responsive-ui":
/*!**************************************!*\
  !*** external "react-responsive-ui" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-responsive-ui");

/***/ }),

/***/ "react-responsive-ui/commonjs/Button":
/*!******************************************************!*\
  !*** external "react-responsive-ui/commonjs/Button" ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-responsive-ui/commonjs/Button");

/***/ }),

/***/ "react-responsive-ui/commonjs/Modal":
/*!*****************************************************!*\
  !*** external "react-responsive-ui/commonjs/Modal" ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-responsive-ui/commonjs/Modal");

/***/ }),

/***/ "react-responsive-ui/commonjs/Snackbar":
/*!********************************************************!*\
  !*** external "react-responsive-ui/commonjs/Snackbar" ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-responsive-ui/commonjs/Snackbar");

/***/ }),

/***/ "react-responsive-ui/commonjs/TextInput":
/*!*********************************************************!*\
  !*** external "react-responsive-ui/commonjs/TextInput" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-responsive-ui/commonjs/TextInput");

/***/ }),

/***/ "react-time-ago":
/*!*********************************!*\
  !*** external "react-time-ago" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-time-ago");

/***/ }),

/***/ "react-website":
/*!********************************!*\
  !*** external "react-website" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-website");

/***/ }),

/***/ "react-website/server":
/*!***************************************!*\
  !*** external "react-website/server" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-website/server");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map