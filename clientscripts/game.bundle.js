/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/js/index.js":
/*!****************************!*\
  !*** ./client/js/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shared_collide__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/collide */ \"./shared/collide.js\");\n/* harmony import */ var _shared_collide__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_shared_collide__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconsole.log((0,_shared_collide__WEBPACK_IMPORTED_MODULE_0__.dist)(0, 0, 3, 4))\n\nconsole.log(\"workd\")\n\n// console.log(\"hello world\")\n\n//# sourceURL=webpack://iogame/./client/js/index.js?");

/***/ }),

/***/ "./shared/collide.js":
/*!***************************!*\
  !*** ./shared/collide.js ***!
  \***************************/
/***/ ((module) => {

eval("\n\n\nconst pointCornerRectCollide = (x, y, rx, ry, rw, rh) => {\n  return x > rx && x < rx + rw && y > ry && y < ry + rh\n}\n\nconst pointCenterRectCollide = (x, y, rx, ry, rw, rh) => {\n  return Math.abs(rx - x) < rw * 0.5 && Math.abs(ry - y) < rh * 0.5\n}\n\nconst rectRectCollide = (ax, ay, aw, ah, bx, by, bw, bh) => {\n  return Math.abs(bx - ax) * 2 < aw + bw && Math.abs(by - ay) * 2 < ah + bh\n}\n\nconst dist = (x1, y1, x2, y2) => {\n  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)\n}\n\nmodule.exports = {\n  pointCornerRectCollide,\n  pointCenterRectCollide,\n  rectRectCollide,\n  dist\n}\n\n//# sourceURL=webpack://iogame/./shared/collide.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client/js/index.js");
/******/ 	
/******/ })()
;