/*!
 * clipboard.js v2.0.8
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["ClipboardJS"] = factory();
  else root["ClipboardJS"] = factory();
})(this, function () {
  return /******/ (function () {
    // webpackBootstrap
    /******/ var __webpack_modules__ = {
      /***/ 134: /***/ function (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) {
        "use strict";

        // EXPORTS
        __webpack_require__.d(__webpack_exports__, {
          default: function () {
            return /* binding */ clipboard;
          },
        });

        // EXTERNAL MODULE: ./node_modules/tiny-emitter/index.js
        var tiny_emitter = __webpack_require__(279);
        var tiny_emitter_default =
          /*#__PURE__*/ __webpack_require__.n(tiny_emitter);
        // EXTERNAL MODULE: ./node_modules/good-listener/src/listen.js
        var listen = __webpack_require__(370);
        var listen_default = /*#__PURE__*/ __webpack_require__.n(listen);
        // EXTERNAL MODULE: ./node_modules/select/src/select.js
        var src_select = __webpack_require__(817);
        var select_default = /*#__PURE__*/ __webpack_require__.n(src_select); // CONCATENATED MODULE: ./src/clipboard-action.js
        function _typeof(obj) {
          "@babel/helpers - typeof";
          if (
            typeof Symbol === "function" &&
            typeof Symbol.iterator === "symbol"
          ) {
            _typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            _typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
            };
          }
          return _typeof(obj);
        }

        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function _defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function _createClass(Constructor, protoProps, staticProps) {
          if (protoProps) _defineProperties(Constructor.prototype, protoProps);
          if (staticProps) _defineProperties(Constructor, staticProps);
          return Constructor;
        }

        /**
         * Inner class which performs selection from either `text` or `target`
         * properties and then executes copy or cut operations.
         */

        var ClipboardAction = /*#__PURE__*/ (function () {
          /**
           * @param {Object} options
           */
          function ClipboardAction(options) {
            _classCallCheck(this, ClipboardAction);

            this.resolveOptions(options);
            this.initSelection();
          }
          /**
           * Defines base properties passed from constructor.
           * @param {Object} options
           */

          _createClass(ClipboardAction, [
            {
              key: "resolveOptions",
              value: function resolveOptions() {
                var options =
                  arguments.length > 0 && arguments[0] !== undefined
                    ? arguments[0]
                    : {};
                this.action = options.action;
                this.container = options.container;
                this.emitter = options.emitter;
                this.target = options.target;
                this.text = options.text;
                this.trigger = options.trigger;
                this.selectedText = "";
              },
              /**
               * Decides which selection strategy is going to be applied based
               * on the existence of `text` and `target` properties.
               */
            },
            {
              key: "initSelection",
              value: function initSelection() {
                if (this.text) {
                  this.selectFake();
                } else if (this.target) {
                  this.selectTarget();
                }
              },
              /**
               * Creates a fake textarea element, sets its value from `text` property,
               */
            },
            {
              key: "createFakeElement",
              value: function createFakeElement() {
                var isRTL =
                  document.documentElement.getAttribute("dir") === "rtl";
                this.fakeElem = document.createElement("textarea"); // Prevent zooming on iOS

                this.fakeElem.style.fontSize = "12pt"; // Reset box model

                this.fakeElem.style.border = "0";
                this.fakeElem.style.padding = "0";
                this.fakeElem.style.margin = "0"; // Move element out of screen horizontally

                this.fakeElem.style.position = "absolute";
                this.fakeElem.style[isRTL ? "right" : "left"] = "-9999px"; // Move element to the same position vertically

                var yPosition =
                  window.pageYOffset || document.documentElement.scrollTop;
                this.fakeElem.style.top = "".concat(yPosition, "px");
                this.fakeElem.setAttribute("readonly", "");
                this.fakeElem.value = this.text;
                return this.fakeElem;
              },
              /**
               * Get's the value of fakeElem,
               * and makes a selection on it.
               */
            },
            {
              key: "selectFake",
              value: function selectFake() {
                var _this = this;

                var fakeElem = this.createFakeElement();

                this.fakeHandlerCallback = function () {
                  return _this.removeFake();
                };

                this.fakeHandler =
                  this.container.addEventListener(
                    "click",
                    this.fakeHandlerCallback
                  ) || true;
                this.container.appendChild(fakeElem);
                this.selectedText = select_default()(fakeElem);
                this.copyText();
                this.removeFake();
              },
              /**
               * Only removes the fake element after another click event, that way
               * a user can hit `Ctrl+C` to copy because selection still exists.
               */
            },
            {
              key: "removeFake",
              value: function removeFake() {
                if (this.fakeHandler) {
                  this.container.removeEventListener(
                    "click",
                    this.fakeHandlerCallback
                  );
                  this.fakeHandler = null;
                  this.fakeHandlerCallback = null;
                }

                if (this.fakeElem) {
                  this.container.removeChild(this.fakeElem);
                  this.fakeElem = null;
                }
              },
              /**
               * Selects the content from element passed on `target` property.
               */
            },
            {
              key: "selectTarget",
              value: function selectTarget() {
                this.selectedText = select_default()(this.target);
                this.copyText();
              },
              /**
               * Executes the copy operation based on the current selection.
               */
            },
            {
              key: "copyText",
              value: function copyText() {
                var succeeded;

                try {
                  succeeded = document.execCommand(this.action);
                } catch (err) {
                  succeeded = false;
                }

                this.handleResult(succeeded);
              },
              /**
               * Fires an event based on the copy operation result.
               * @param {Boolean} succeeded
               */
            },
            {
              key: "handleResult",
              value: function handleResult(succeeded) {
                this.emitter.emit(succeeded ? "success" : "error", {
                  action: this.action,
                  text: this.selectedText,
                  trigger: this.trigger,
                  clearSelection: this.clearSelection.bind(this),
                });
              },
              /**
               * Moves focus away from `target` and back to the trigger, removes current selection.
               */
            },
            {
              key: "clearSelection",
              value: function clearSelection() {
                if (this.trigger) {
                  this.trigger.focus();
                }

                document.activeElement.blur();
                window.getSelection().removeAllRanges();
              },
              /**
               * Sets the `action` to be performed which can be either 'copy' or 'cut'.
               * @param {String} action
               */
            },
            {
              key: "destroy",

              /**
               * Destroy lifecycle.
               */
              value: function destroy() {
                this.removeFake();
              },
            },
            {
              key: "action",
              set: function set() {
                var action =
                  arguments.length > 0 && arguments[0] !== undefined
                    ? arguments[0]
                    : "copy";
                this._action = action;

                if (this._action !== "copy" && this._action !== "cut") {
                  throw new Error(
                    'Invalid "action" value, use either "copy" or "cut"'
                  );
                }
              },
              /**
               * Gets the `action` property.
               * @return {String}
               */
              get: function get() {
                return this._action;
              },
              /**
               * Sets the `target` property using an element
               * that will be have its content copied.
               * @param {Element} target
               */
            },
            {
              key: "target",
              set: function set(target) {
                if (target !== undefined) {
                  if (
                    target &&
                    _typeof(target) === "object" &&
                    target.nodeType === 1
                  ) {
                    if (
                      this.action === "copy" &&
                      target.hasAttribute("disabled")
                    ) {
                      throw new Error(
                        'Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute'
                      );
                    }

                    if (
                      this.action === "cut" &&
                      (target.hasAttribute("readonly") ||
                        target.hasAttribute("disabled"))
                    ) {
                      throw new Error(
                        'Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes'
                      );
                    }

                    this._target = target;
                  } else {
                    throw new Error(
                      'Invalid "target" value, use a valid Element'
                    );
                  }
                }
              },
              /**
               * Gets the `target` property.
               * @return {String|HTMLElement}
               */
              get: function get() {
                return this._target;
              },
            },
          ]);

          return ClipboardAction;
        })();

        /* harmony default export */ var clipboard_action = ClipboardAction; // CONCATENATED MODULE: ./src/clipboard.js
        function clipboard_typeof(obj) {
          "@babel/helpers - typeof";
          if (
            typeof Symbol === "function" &&
            typeof Symbol.iterator === "symbol"
          ) {
            clipboard_typeof = function _typeof(obj) {
              return typeof obj;
            };
          } else {
            clipboard_typeof = function _typeof(obj) {
              return obj &&
                typeof Symbol === "function" &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
            };
          }
          return clipboard_typeof(obj);
        }

        function clipboard_classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }

        function clipboard_defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        function clipboard_createClass(Constructor, protoProps, staticProps) {
          if (protoProps)
            clipboard_defineProperties(Constructor.prototype, protoProps);
          if (staticProps) clipboard_defineProperties(Constructor, staticProps);
          return Constructor;
        }

        function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function"
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                writable: true,
                configurable: true,
              },
            }
          );
          if (superClass) _setPrototypeOf(subClass, superClass);
        }

        function _setPrototypeOf(o, p) {
          _setPrototypeOf =
            Object.setPrototypeOf ||
            function _setPrototypeOf(o, p) {
              o.__proto__ = p;
              return o;
            };
          return _setPrototypeOf(o, p);
        }

        function _createSuper(Derived) {
          var hasNativeReflectConstruct = _isNativeReflectConstruct();
          return function _createSuperInternal() {
            var Super = _getPrototypeOf(Derived),
              result;
            if (hasNativeReflectConstruct) {
              var NewTarget = _getPrototypeOf(this).constructor;
              result = Reflect.construct(Super, arguments, NewTarget);
            } else {
              result = Super.apply(this, arguments);
            }
            return _possibleConstructorReturn(this, result);
          };
        }

        function _possibleConstructorReturn(self, call) {
          if (
            call &&
            (clipboard_typeof(call) === "object" || typeof call === "function")
          ) {
            return call;
          }
          return _assertThisInitialized(self);
        }

        function _assertThisInitialized(self) {
          if (self === void 0) {
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          }
          return self;
        }

        function _isNativeReflectConstruct() {
          if (typeof Reflect === "undefined" || !Reflect.construct)
            return false;
          if (Reflect.construct.sham) return false;
          if (typeof Proxy === "function") return true;
          try {
            Date.prototype.toString.call(
              Reflect.construct(Date, [], function () {})
            );
            return true;
          } catch (e) {
            return false;
          }
        }

        function _getPrototypeOf(o) {
          _getPrototypeOf = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
              };
          return _getPrototypeOf(o);
        }

        /**
         * Helper function to retrieve attribute value.
         * @param {String} suffix
         * @param {Element} element
         */

        function getAttributeValue(suffix, element) {
          var attribute = "data-clipboard-".concat(suffix);

          if (!element.hasAttribute(attribute)) {
            return;
          }

          return element.getAttribute(attribute);
        }
        /**
         * Base class which takes one or more elements, adds event listeners to them,
         * and instantiates a new `ClipboardAction` on each click.
         */

        var Clipboard = /*#__PURE__*/ (function (_Emitter) {
          _inherits(Clipboard, _Emitter);

          var _super = _createSuper(Clipboard);

          /**
           * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
           * @param {Object} options
           */
          function Clipboard(trigger, options) {
            var _this;

            clipboard_classCallCheck(this, Clipboard);

            _this = _super.call(this);

            _this.resolveOptions(options);

            _this.listenClick(trigger);

            return _this;
          }
          /**
           * Defines if attributes would be resolved using internal setter functions
           * or custom functions that were passed in the constructor.
           * @param {Object} options
           */

          clipboard_createClass(
            Clipboard,
            [
              {
                key: "resolveOptions",
                value: function resolveOptions() {
                  var options =
                    arguments.length > 0 && arguments[0] !== undefined
                      ? arguments[0]
                      : {};
                  this.action =
                    typeof options.action === "function"
                      ? options.action
                      : this.defaultAction;
                  this.target =
                    typeof options.target === "function"
                      ? options.target
                      : this.defaultTarget;
                  this.text =
                    typeof options.text === "function"
                      ? options.text
                      : this.defaultText;
                  this.container =
                    clipboard_typeof(options.container) === "object"
                      ? options.container
                      : document.body;
                },
                /**
                 * Adds a click event listener to the passed trigger.
                 * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
                 */
              },
              {
                key: "listenClick",
                value: function listenClick(trigger) {
                  var _this2 = this;

                  this.listener = listen_default()(
                    trigger,
                    "click",
                    function (e) {
                      return _this2.onClick(e);
                    }
                  );
                },
                /**
                 * Defines a new `ClipboardAction` on each click event.
                 * @param {Event} e
                 */
              },
              {
                key: "onClick",
                value: function onClick(e) {
                  var trigger = e.delegateTarget || e.currentTarget;

                  if (this.clipboardAction) {
                    this.clipboardAction = null;
                  }

                  this.clipboardAction = new clipboard_action({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    container: this.container,
                    trigger: trigger,
                    emitter: this,
                  });
                },
                /**
                 * Default `action` lookup function.
                 * @param {Element} trigger
                 */
              },
              {
                key: "defaultAction",
                value: function defaultAction(trigger) {
                  return getAttributeValue("action", trigger);
                },
                /**
                 * Default `target` lookup function.
                 * @param {Element} trigger
                 */
              },
              {
                key: "defaultTarget",
                value: function defaultTarget(trigger) {
                  var selector = getAttributeValue("target", trigger);

                  if (selector) {
                    return document.querySelector(selector);
                  }
                },
                /**
                 * Returns the support of the given action, or all actions if no action is
                 * given.
                 * @param {String} [action]
                 */
              },
              {
                key: "defaultText",

                /**
                 * Default `text` lookup function.
                 * @param {Element} trigger
                 */
                value: function defaultText(trigger) {
                  return getAttributeValue("text", trigger);
                },
                /**
                 * Destroy lifecycle.
                 */
              },
              {
                key: "destroy",
                value: function destroy() {
                  this.listener.destroy();

                  if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                  }
                },
              },
            ],
            [
              {
                key: "isSupported",
                value: function isSupported() {
                  var action =
                    arguments.length > 0 && arguments[0] !== undefined
                      ? arguments[0]
                      : ["copy", "cut"];
                  var actions = typeof action === "string" ? [action] : action;
                  var support = !!document.queryCommandSupported;
                  actions.forEach(function (action) {
                    support =
                      support && !!document.queryCommandSupported(action);
                  });
                  return support;
                },
              },
            ]
          );

          return Clipboard;
        })(tiny_emitter_default());

        /* harmony default export */ var clipboard = Clipboard;

        /***/
      },

      /***/ 828: /***/ function (module) {
        var DOCUMENT_NODE_TYPE = 9;

        /**
         * A polyfill for Element.matches()
         */
        if (typeof Element !== "undefined" && !Element.prototype.matches) {
          var proto = Element.prototype;

          proto.matches =
            proto.matchesSelector ||
            proto.mozMatchesSelector ||
            proto.msMatchesSelector ||
            proto.oMatchesSelector ||
            proto.webkitMatchesSelector;
        }

        /**
         * Finds the closest parent that matches a selector.
         *
         * @param {Element} element
         * @param {String} selector
         * @return {Function}
         */
        function closest(element, selector) {
          while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
            if (
              typeof element.matches === "function" &&
              element.matches(selector)
            ) {
              return element;
            }
            element = element.parentNode;
          }
        }

        module.exports = closest;

        /***/
      },

      /***/ 438: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var closest = __webpack_require__(828);

        /**
         * Delegates event to a selector.
         *
         * @param {Element} element
         * @param {String} selector
         * @param {String} type
         * @param {Function} callback
         * @param {Boolean} useCapture
         * @return {Object}
         */
        function _delegate(element, selector, type, callback, useCapture) {
          var listenerFn = listener.apply(this, arguments);

          element.addEventListener(type, listenerFn, useCapture);

          return {
            destroy: function () {
              element.removeEventListener(type, listenerFn, useCapture);
            },
          };
        }

        /**
         * Delegates event to a selector.
         *
         * @param {Element|String|Array} [elements]
         * @param {String} selector
         * @param {String} type
         * @param {Function} callback
         * @param {Boolean} useCapture
         * @return {Object}
         */
        function delegate(elements, selector, type, callback, useCapture) {
          // Handle the regular Element usage
          if (typeof elements.addEventListener === "function") {
            return _delegate.apply(null, arguments);
          }

          // Handle Element-less usage, it defaults to global delegation
          if (typeof type === "function") {
            // Use `document` as the first parameter, then apply arguments
            // This is a short way to .unshift `arguments` without running into deoptimizations
            return _delegate.bind(null, document).apply(null, arguments);
          }

          // Handle Selector-based usage
          if (typeof elements === "string") {
            elements = document.querySelectorAll(elements);
          }

          // Handle Array-like based usage
          return Array.prototype.map.call(elements, function (element) {
            return _delegate(element, selector, type, callback, useCapture);
          });
        }

        /**
         * Finds closest match and invokes callback.
         *
         * @param {Element} element
         * @param {String} selector
         * @param {String} type
         * @param {Function} callback
         * @return {Function}
         */
        function listener(element, selector, type, callback) {
          return function (e) {
            e.delegateTarget = closest(e.target, selector);

            if (e.delegateTarget) {
              callback.call(element, e);
            }
          };
        }

        module.exports = delegate;

        /***/
      },

      /***/ 879: /***/ function (__unused_webpack_module, exports) {
        /**
         * Check if argument is a HTML element.
         *
         * @param {Object} value
         * @return {Boolean}
         */
        exports.node = function (value) {
          return (
            value !== undefined &&
            value instanceof HTMLElement &&
            value.nodeType === 1
          );
        };

        /**
         * Check if argument is a list of HTML elements.
         *
         * @param {Object} value
         * @return {Boolean}
         */
        exports.nodeList = function (value) {
          var type = Object.prototype.toString.call(value);

          return (
            value !== undefined &&
            (type === "[object NodeList]" ||
              type === "[object HTMLCollection]") &&
            "length" in value &&
            (value.length === 0 || exports.node(value[0]))
          );
        };

        /**
         * Check if argument is a string.
         *
         * @param {Object} value
         * @return {Boolean}
         */
        exports.string = function (value) {
          return typeof value === "string" || value instanceof String;
        };

        /**
         * Check if argument is a function.
         *
         * @param {Object} value
         * @return {Boolean}
         */
        exports.fn = function (value) {
          var type = Object.prototype.toString.call(value);

          return type === "[object Function]";
        };

        /***/
      },

      /***/ 370: /***/ function (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) {
        var is = __webpack_require__(879);
        var delegate = __webpack_require__(438);

        /**
         * Validates all params and calls the right
         * listener function based on its target type.
         *
         * @param {String|HTMLElement|HTMLCollection|NodeList} target
         * @param {String} type
         * @param {Function} callback
         * @return {Object}
         */
        function listen(target, type, callback) {
          if (!target && !type && !callback) {
            throw new Error("Missing required arguments");
          }

          if (!is.string(type)) {
            throw new TypeError("Second argument must be a String");
          }

          if (!is.fn(callback)) {
            throw new TypeError("Third argument must be a Function");
          }

          if (is.node(target)) {
            return listenNode(target, type, callback);
          } else if (is.nodeList(target)) {
            return listenNodeList(target, type, callback);
          } else if (is.string(target)) {
            return listenSelector(target, type, callback);
          } else {
            throw new TypeError(
              "First argument must be a String, HTMLElement, HTMLCollection, or NodeList"
            );
          }
        }

        /**
         * Adds an event listener to a HTML element
         * and returns a remove listener function.
         *
         * @param {HTMLElement} node
         * @param {String} type
         * @param {Function} callback
         * @return {Object}
         */
        function listenNode(node, type, callback) {
          node.addEventListener(type, callback);

          return {
            destroy: function () {
              node.removeEventListener(type, callback);
            },
          };
        }

        /**
         * Add an event listener to a list of HTML elements
         * and returns a remove listener function.
         *
         * @param {NodeList|HTMLCollection} nodeList
         * @param {String} type
         * @param {Function} callback
         * @return {Object}
         */
        function listenNodeList(nodeList, type, callback) {
          Array.prototype.forEach.call(nodeList, function (node) {
            node.addEventListener(type, callback);
          });

          return {
            destroy: function () {
              Array.prototype.forEach.call(nodeList, function (node) {
                node.removeEventListener(type, callback);
              });
            },
          };
        }

        /**
         * Add an event listener to a selector
         * and returns a remove listener function.
         *
         * @param {String} selector
         * @param {String} type
         * @param {Function} callback
         * @return {Object}
         */
        function listenSelector(selector, type, callback) {
          return delegate(document.body, selector, type, callback);
        }

        module.exports = listen;

        /***/
      },

      /***/ 817: /***/ function (module) {
        function select(element) {
          var selectedText;

          if (element.nodeName === "SELECT") {
            element.focus();

            selectedText = element.value;
          } else if (
            element.nodeName === "INPUT" ||
            element.nodeName === "TEXTAREA"
          ) {
            var isReadOnly = element.hasAttribute("readonly");

            if (!isReadOnly) {
              element.setAttribute("readonly", "");
            }

            element.select();
            element.setSelectionRange(0, element.value.length);

            if (!isReadOnly) {
              element.removeAttribute("readonly");
            }

            selectedText = element.value;
          } else {
            if (element.hasAttribute("contenteditable")) {
              element.focus();
            }

            var selection = window.getSelection();
            var range = document.createRange();

            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);

            selectedText = selection.toString();
          }

          return selectedText;
        }

        module.exports = select;

        /***/
      },

      /***/ 279: /***/ function (module) {
        function E() {
          // Keep this empty so it's easier to inherit from
          // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
        }

        E.prototype = {
          on: function (name, callback, ctx) {
            var e = this.e || (this.e = {});

            (e[name] || (e[name] = [])).push({
              fn: callback,
              ctx: ctx,
            });

            return this;
          },

          once: function (name, callback, ctx) {
            var self = this;
            function listener() {
              self.off(name, listener);
              callback.apply(ctx, arguments);
            }

            listener._ = callback;
            return this.on(name, listener, ctx);
          },

          emit: function (name) {
            var data = [].slice.call(arguments, 1);
            var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
            var i = 0;
            var len = evtArr.length;

            for (i; i < len; i++) {
              evtArr[i].fn.apply(evtArr[i].ctx, data);
            }

            return this;
          },

          off: function (name, callback) {
            var e = this.e || (this.e = {});
            var evts = e[name];
            var liveEvents = [];

            if (evts && callback) {
              for (var i = 0, len = evts.length; i < len; i++) {
                if (evts[i].fn !== callback && evts[i].fn._ !== callback)
                  liveEvents.push(evts[i]);
              }
            }

            // Remove event from queue to prevent memory leak
            // Suggested by https://github.com/lazd
            // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

            liveEvents.length ? (e[name] = liveEvents) : delete e[name];

            return this;
          },
        };

        module.exports = E;
        module.exports.TinyEmitter = E;

        /***/
      },

      /******/
    };
    /************************************************************************/
    /******/ // The module cache
    /******/ var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
      /******/ // Check if module is in cache
      /******/ if (__webpack_module_cache__[moduleId]) {
        /******/ return __webpack_module_cache__[moduleId].exports;
        /******/
      }
      /******/ // Create a new module (and put it into the cache)
      /******/ var module = (__webpack_module_cache__[moduleId] = {
        /******/ // no module.id needed
        /******/ // no module.loaded needed
        /******/ exports: {},
        /******/
      });
      /******/
      /******/ // Execute the module function
      /******/ __webpack_modules__[moduleId](
        module,
        module.exports,
        __webpack_require__
      );
      /******/
      /******/ // Return the exports of the module
      /******/ return module.exports;
      /******/
    }
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/compat get default export */ /******/ !(function () {
      /******/ // getDefaultExport function for compatibility with non-harmony modules
      /******/ __webpack_require__.n = function (module) {
        /******/ var getter =
          module && module.__esModule
            ? /******/ function () {
                return module["default"];
              }
            : /******/ function () {
                return module;
              };
        /******/ __webpack_require__.d(getter, { a: getter });
        /******/ return getter;
        /******/
      };
      /******/
    })();
    /******/
    /******/ /* webpack/runtime/define property getters */ /******/ !(function () {
      /******/ // define getter functions for harmony exports
      /******/ __webpack_require__.d = function (exports, definition) {
        /******/ for (var key in definition) {
          /******/ if (
            __webpack_require__.o(definition, key) &&
            !__webpack_require__.o(exports, key)
          ) {
            /******/ Object.defineProperty(exports, key, {
              enumerable: true,
              get: definition[key],
            });
            /******/
          }
          /******/
        }
        /******/
      };
      /******/
    })();
    /******/
    /******/ /* webpack/runtime/hasOwnProperty shorthand */ /******/ !(function () {
      /******/ __webpack_require__.o = function (obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      };
      /******/
    })();
    /******/
    /************************************************************************/
    /******/ // module exports must be returned from runtime so entry inlining is disabled
    /******/ // startup
    /******/ // Load entry module and return exports
    /******/ return __webpack_require__(134);
    /******/
  })().default;
});
/*!
 * typeahead.js 1.3.1
 * https://github.com/corejavascript/typeahead.js
 * Copyright 2013-2020 Twitter, Inc. and other contributors; Licensed MIT
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], function (a0) {
      return (root["Bloodhound"] = factory(a0));
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(require("jquery"));
  } else {
    root["Bloodhound"] = factory(root["jQuery"]);
  }
})(this, function ($) {
  var _ = (function () {
    "use strict";
    return {
      isMsie: function () {
        return /(msie|trident)/i.test(navigator.userAgent)
          ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]
          : false;
      },
      isBlankString: function (str) {
        return !str || /^\s*$/.test(str);
      },
      escapeRegExChars: function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      },
      isString: function (obj) {
        return typeof obj === "string";
      },
      isNumber: function (obj) {
        return typeof obj === "number";
      },
      isArray: $.isArray,
      isFunction: $.isFunction,
      isObject: $.isPlainObject,
      isUndefined: function (obj) {
        return typeof obj === "undefined";
      },
      isElement: function (obj) {
        return !!(obj && obj.nodeType === 1);
      },
      isJQuery: function (obj) {
        return obj instanceof $;
      },
      toStr: function toStr(s) {
        return _.isUndefined(s) || s === null ? "" : s + "";
      },
      bind: $.proxy,
      each: function (collection, cb) {
        $.each(collection, reverseArgs);
        function reverseArgs(index, value) {
          return cb(value, index);
        }
      },
      map: $.map,
      filter: $.grep,
      every: function (obj, test) {
        var result = true;
        if (!obj) {
          return result;
        }
        $.each(obj, function (key, val) {
          if (!(result = test.call(null, val, key, obj))) {
            return false;
          }
        });
        return !!result;
      },
      some: function (obj, test) {
        var result = false;
        if (!obj) {
          return result;
        }
        $.each(obj, function (key, val) {
          if ((result = test.call(null, val, key, obj))) {
            return false;
          }
        });
        return !!result;
      },
      mixin: $.extend,
      identity: function (x) {
        return x;
      },
      clone: function (obj) {
        return $.extend(true, {}, obj);
      },
      getIdGenerator: function () {
        var counter = 0;
        return function () {
          return counter++;
        };
      },
      templatify: function templatify(obj) {
        return $.isFunction(obj) ? obj : template;
        function template() {
          return String(obj);
        }
      },
      defer: function (fn) {
        setTimeout(fn, 0);
      },
      debounce: function (func, wait, immediate) {
        var timeout, result;
        return function () {
          var context = this,
            args = arguments,
            later,
            callNow;
          later = function () {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
            }
          };
          callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) {
            result = func.apply(context, args);
          }
          return result;
        };
      },
      throttle: function (func, wait) {
        var context, args, timeout, result, previous, later;
        previous = 0;
        later = function () {
          previous = new Date();
          timeout = null;
          result = func.apply(context, args);
        };
        return function () {
          var now = new Date(),
            remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
          } else if (!timeout) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
      },
      stringify: function (val) {
        return _.isString(val) ? val : JSON.stringify(val);
      },
      guid: function () {
        function _p8(s) {
          var p = (Math.random().toString(16) + "000000000").substr(2, 8);
          return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return "tt-" + _p8() + _p8(true) + _p8(true) + _p8();
      },
      noop: function () {},
    };
  })();
  var VERSION = "1.3.1";
  var tokenizers = (function () {
    "use strict";
    return {
      nonword: nonword,
      whitespace: whitespace,
      ngram: ngram,
      obj: {
        nonword: getObjTokenizer(nonword),
        whitespace: getObjTokenizer(whitespace),
        ngram: getObjTokenizer(ngram),
      },
    };
    function whitespace(str) {
      str = _.toStr(str);
      return str ? str.split(/\s+/) : [];
    }
    function nonword(str) {
      str = _.toStr(str);
      return str ? str.split(/\W+/) : [];
    }
    function ngram(str) {
      str = _.toStr(str);
      var tokens = [],
        word = "";
      _.each(str.split(""), function (char) {
        if (char.match(/\s+/)) {
          word = "";
        } else {
          tokens.push(word + char);
          word += char;
        }
      });
      return tokens;
    }
    function getObjTokenizer(tokenizer) {
      return function setKey(keys) {
        keys = _.isArray(keys) ? keys : [].slice.call(arguments, 0);
        return function tokenize(o) {
          var tokens = [];
          _.each(keys, function (k) {
            tokens = tokens.concat(tokenizer(_.toStr(o[k])));
          });
          return tokens;
        };
      };
    }
  })();
  var LruCache = (function () {
    "use strict";
    function LruCache(maxSize) {
      this.maxSize = _.isNumber(maxSize) ? maxSize : 100;
      this.reset();
      if (this.maxSize <= 0) {
        this.set = this.get = $.noop;
      }
    }
    _.mixin(LruCache.prototype, {
      set: function set(key, val) {
        var tailItem = this.list.tail,
          node;
        if (this.size >= this.maxSize) {
          this.list.remove(tailItem);
          delete this.hash[tailItem.key];
          this.size--;
        }
        if ((node = this.hash[key])) {
          node.val = val;
          this.list.moveToFront(node);
        } else {
          node = new Node(key, val);
          this.list.add(node);
          this.hash[key] = node;
          this.size++;
        }
      },
      get: function get(key) {
        var node = this.hash[key];
        if (node) {
          this.list.moveToFront(node);
          return node.val;
        }
      },
      reset: function reset() {
        this.size = 0;
        this.hash = {};
        this.list = new List();
      },
    });
    function List() {
      this.head = this.tail = null;
    }
    _.mixin(List.prototype, {
      add: function add(node) {
        if (this.head) {
          node.next = this.head;
          this.head.prev = node;
        }
        this.head = node;
        this.tail = this.tail || node;
      },
      remove: function remove(node) {
        node.prev ? (node.prev.next = node.next) : (this.head = node.next);
        node.next ? (node.next.prev = node.prev) : (this.tail = node.prev);
      },
      moveToFront: function (node) {
        this.remove(node);
        this.add(node);
      },
    });
    function Node(key, val) {
      this.key = key;
      this.val = val;
      this.prev = this.next = null;
    }
    return LruCache;
  })();
  var PersistentStorage = (function () {
    "use strict";
    var LOCAL_STORAGE;
    try {
      LOCAL_STORAGE = window.localStorage;
      LOCAL_STORAGE.setItem("~~~", "!");
      LOCAL_STORAGE.removeItem("~~~");
    } catch (err) {
      LOCAL_STORAGE = null;
    }
    function PersistentStorage(namespace, override) {
      this.prefix = ["__", namespace, "__"].join("");
      this.ttlKey = "__ttl__";
      this.keyMatcher = new RegExp("^" + _.escapeRegExChars(this.prefix));
      this.ls = override || LOCAL_STORAGE;
      !this.ls && this._noop();
    }
    _.mixin(PersistentStorage.prototype, {
      _prefix: function (key) {
        return this.prefix + key;
      },
      _ttlKey: function (key) {
        return this._prefix(key) + this.ttlKey;
      },
      _noop: function () {
        this.get =
          this.set =
          this.remove =
          this.clear =
          this.isExpired =
            _.noop;
      },
      _safeSet: function (key, val) {
        try {
          this.ls.setItem(key, val);
        } catch (err) {
          if (err.name === "QuotaExceededError") {
            this.clear();
            this._noop();
          }
        }
      },
      get: function (key) {
        if (this.isExpired(key)) {
          this.remove(key);
        }
        return decode(this.ls.getItem(this._prefix(key)));
      },
      set: function (key, val, ttl) {
        if (_.isNumber(ttl)) {
          this._safeSet(this._ttlKey(key), encode(now() + ttl));
        } else {
          this.ls.removeItem(this._ttlKey(key));
        }
        return this._safeSet(this._prefix(key), encode(val));
      },
      remove: function (key) {
        this.ls.removeItem(this._ttlKey(key));
        this.ls.removeItem(this._prefix(key));
        return this;
      },
      clear: function () {
        var i,
          keys = gatherMatchingKeys(this.keyMatcher);
        for (i = keys.length; i--; ) {
          this.remove(keys[i]);
        }
        return this;
      },
      isExpired: function (key) {
        var ttl = decode(this.ls.getItem(this._ttlKey(key)));
        return _.isNumber(ttl) && now() > ttl ? true : false;
      },
    });
    return PersistentStorage;
    function now() {
      return new Date().getTime();
    }
    function encode(val) {
      return JSON.stringify(_.isUndefined(val) ? null : val);
    }
    function decode(val) {
      return $.parseJSON(val);
    }
    function gatherMatchingKeys(keyMatcher) {
      var i,
        key,
        keys = [],
        len = LOCAL_STORAGE.length;
      for (i = 0; i < len; i++) {
        if ((key = LOCAL_STORAGE.key(i)).match(keyMatcher)) {
          keys.push(key.replace(keyMatcher, ""));
        }
      }
      return keys;
    }
  })();
  var Transport = (function () {
    "use strict";
    var pendingRequestsCount = 0,
      pendingRequests = {},
      sharedCache = new LruCache(10);
    function Transport(o) {
      o = o || {};
      this.maxPendingRequests = o.maxPendingRequests || 6;
      this.cancelled = false;
      this.lastReq = null;
      this._send = o.transport;
      this._get = o.limiter ? o.limiter(this._get) : this._get;
      this._cache = o.cache === false ? new LruCache(0) : sharedCache;
    }
    Transport.setMaxPendingRequests = function setMaxPendingRequests(num) {
      this.maxPendingRequests = num;
    };
    Transport.resetCache = function resetCache() {
      sharedCache.reset();
    };
    _.mixin(Transport.prototype, {
      _fingerprint: function fingerprint(o) {
        o = o || {};
        return o.url + o.type + $.param(o.data || {});
      },
      _get: function (o, cb) {
        var that = this,
          fingerprint,
          jqXhr;
        fingerprint = this._fingerprint(o);
        if (this.cancelled || fingerprint !== this.lastReq) {
          return;
        }
        if ((jqXhr = pendingRequests[fingerprint])) {
          jqXhr.done(done).fail(fail);
        } else if (pendingRequestsCount < this.maxPendingRequests) {
          pendingRequestsCount++;
          pendingRequests[fingerprint] = this._send(o)
            .done(done)
            .fail(fail)
            .always(always);
        } else {
          this.onDeckRequestArgs = [].slice.call(arguments, 0);
        }
        function done(resp) {
          cb(null, resp);
          that._cache.set(fingerprint, resp);
        }
        function fail() {
          cb(true);
        }
        function always() {
          pendingRequestsCount--;
          delete pendingRequests[fingerprint];
          if (that.onDeckRequestArgs) {
            that._get.apply(that, that.onDeckRequestArgs);
            that.onDeckRequestArgs = null;
          }
        }
      },
      get: function (o, cb) {
        var resp, fingerprint;
        cb = cb || $.noop;
        o = _.isString(o)
          ? {
              url: o,
            }
          : o || {};
        fingerprint = this._fingerprint(o);
        this.cancelled = false;
        this.lastReq = fingerprint;
        if ((resp = this._cache.get(fingerprint))) {
          cb(null, resp);
        } else {
          this._get(o, cb);
        }
      },
      cancel: function () {
        this.cancelled = true;
      },
    });
    return Transport;
  })();
  var SearchIndex = (window.SearchIndex = (function () {
    "use strict";
    var CHILDREN = "c",
      IDS = "i";
    function SearchIndex(o) {
      o = o || {};
      if (!o.datumTokenizer || !o.queryTokenizer) {
        $.error("datumTokenizer and queryTokenizer are both required");
      }
      this.identify = o.identify || _.stringify;
      this.datumTokenizer = o.datumTokenizer;
      this.queryTokenizer = o.queryTokenizer;
      this.matchAnyQueryToken = o.matchAnyQueryToken;
      this.reset();
    }
    _.mixin(SearchIndex.prototype, {
      bootstrap: function bootstrap(o) {
        this.datums = o.datums;
        this.trie = o.trie;
      },
      add: function (data) {
        var that = this;
        data = _.isArray(data) ? data : [data];
        _.each(data, function (datum) {
          var id, tokens;
          that.datums[(id = that.identify(datum))] = datum;
          tokens = normalizeTokens(that.datumTokenizer(datum));
          _.each(tokens, function (token) {
            var node, chars, ch;
            node = that.trie;
            chars = token.split("");
            while ((ch = chars.shift())) {
              node = node[CHILDREN][ch] || (node[CHILDREN][ch] = newNode());
              node[IDS].push(id);
            }
          });
        });
      },
      get: function get(ids) {
        var that = this;
        return _.map(ids, function (id) {
          return that.datums[id];
        });
      },
      search: function search(query) {
        var that = this,
          tokens,
          matches;
        tokens = normalizeTokens(this.queryTokenizer(query));
        _.each(tokens, function (token) {
          var node, chars, ch, ids;
          if (matches && matches.length === 0 && !that.matchAnyQueryToken) {
            return false;
          }
          node = that.trie;
          chars = token.split("");
          while (node && (ch = chars.shift())) {
            node = node[CHILDREN][ch];
          }
          if (node && chars.length === 0) {
            ids = node[IDS].slice(0);
            matches = matches ? getIntersection(matches, ids) : ids;
          } else {
            if (!that.matchAnyQueryToken) {
              matches = [];
              return false;
            }
          }
        });
        return matches
          ? _.map(unique(matches), function (id) {
              return that.datums[id];
            })
          : [];
      },
      all: function all() {
        var values = [];
        for (var key in this.datums) {
          values.push(this.datums[key]);
        }
        return values;
      },
      reset: function reset() {
        this.datums = {};
        this.trie = newNode();
      },
      serialize: function serialize() {
        return {
          datums: this.datums,
          trie: this.trie,
        };
      },
    });
    return SearchIndex;
    function normalizeTokens(tokens) {
      tokens = _.filter(tokens, function (token) {
        return !!token;
      });
      tokens = _.map(tokens, function (token) {
        return token.toLowerCase();
      });
      return tokens;
    }
    function newNode() {
      var node = {};
      node[IDS] = [];
      node[CHILDREN] = {};
      return node;
    }
    function unique(array) {
      var seen = {},
        uniques = [];
      for (var i = 0, len = array.length; i < len; i++) {
        if (!seen[array[i]]) {
          seen[array[i]] = true;
          uniques.push(array[i]);
        }
      }
      return uniques;
    }
    function getIntersection(arrayA, arrayB) {
      var ai = 0,
        bi = 0,
        intersection = [];
      arrayA = arrayA.sort();
      arrayB = arrayB.sort();
      var lenArrayA = arrayA.length,
        lenArrayB = arrayB.length;
      while (ai < lenArrayA && bi < lenArrayB) {
        if (arrayA[ai] < arrayB[bi]) {
          ai++;
        } else if (arrayA[ai] > arrayB[bi]) {
          bi++;
        } else {
          intersection.push(arrayA[ai]);
          ai++;
          bi++;
        }
      }
      return intersection;
    }
  })());
  var Prefetch = (function () {
    "use strict";
    var keys;
    keys = {
      data: "data",
      protocol: "protocol",
      thumbprint: "thumbprint",
    };
    function Prefetch(o) {
      this.url = o.url;
      this.ttl = o.ttl;
      this.cache = o.cache;
      this.prepare = o.prepare;
      this.transform = o.transform;
      this.transport = o.transport;
      this.thumbprint = o.thumbprint;
      this.storage = new PersistentStorage(o.cacheKey);
    }
    _.mixin(Prefetch.prototype, {
      _settings: function settings() {
        return {
          url: this.url,
          type: "GET",
          dataType: "json",
        };
      },
      store: function store(data) {
        if (!this.cache) {
          return;
        }
        this.storage.set(keys.data, data, this.ttl);
        this.storage.set(keys.protocol, location.protocol, this.ttl);
        this.storage.set(keys.thumbprint, this.thumbprint, this.ttl);
      },
      fromCache: function fromCache() {
        var stored = {},
          isExpired;
        if (!this.cache) {
          return null;
        }
        stored.data = this.storage.get(keys.data);
        stored.protocol = this.storage.get(keys.protocol);
        stored.thumbprint = this.storage.get(keys.thumbprint);
        isExpired =
          stored.thumbprint !== this.thumbprint ||
          stored.protocol !== location.protocol;
        return stored.data && !isExpired ? stored.data : null;
      },
      fromNetwork: function (cb) {
        var that = this,
          settings;
        if (!cb) {
          return;
        }
        settings = this.prepare(this._settings());
        this.transport(settings).fail(onError).done(onResponse);
        function onError() {
          cb(true);
        }
        function onResponse(resp) {
          cb(null, that.transform(resp));
        }
      },
      clear: function clear() {
        this.storage.clear();
        return this;
      },
    });
    return Prefetch;
  })();
  var Remote = (function () {
    "use strict";
    function Remote(o) {
      this.url = o.url;
      this.prepare = o.prepare;
      this.transform = o.transform;
      this.indexResponse = o.indexResponse;
      this.transport = new Transport({
        cache: o.cache,
        limiter: o.limiter,
        transport: o.transport,
        maxPendingRequests: o.maxPendingRequests,
      });
    }
    _.mixin(Remote.prototype, {
      _settings: function settings() {
        return {
          url: this.url,
          type: "GET",
          dataType: "json",
        };
      },
      get: function get(query, cb) {
        var that = this,
          settings;
        if (!cb) {
          return;
        }
        query = query || "";
        settings = this.prepare(query, this._settings());
        return this.transport.get(settings, onResponse);
        function onResponse(err, resp) {
          err ? cb([]) : cb(that.transform(resp));
        }
      },
      cancelLastRequest: function cancelLastRequest() {
        this.transport.cancel();
      },
    });
    return Remote;
  })();
  var oParser = (function () {
    "use strict";
    return function parse(o) {
      var defaults, sorter;
      defaults = {
        initialize: true,
        identify: _.stringify,
        datumTokenizer: null,
        queryTokenizer: null,
        matchAnyQueryToken: false,
        sufficient: 5,
        indexRemote: false,
        sorter: null,
        local: [],
        prefetch: null,
        remote: null,
      };
      o = _.mixin(defaults, o || {});
      !o.datumTokenizer && $.error("datumTokenizer is required");
      !o.queryTokenizer && $.error("queryTokenizer is required");
      sorter = o.sorter;
      o.sorter = sorter
        ? function (x) {
            return x.sort(sorter);
          }
        : _.identity;
      o.local = _.isFunction(o.local) ? o.local() : o.local;
      o.prefetch = parsePrefetch(o.prefetch);
      o.remote = parseRemote(o.remote);
      return o;
    };
    function parsePrefetch(o) {
      var defaults;
      if (!o) {
        return null;
      }
      defaults = {
        url: null,
        ttl: 24 * 60 * 60 * 1e3,
        cache: true,
        cacheKey: null,
        thumbprint: "",
        prepare: _.identity,
        transform: _.identity,
        transport: null,
      };
      o = _.isString(o)
        ? {
            url: o,
          }
        : o;
      o = _.mixin(defaults, o);
      !o.url && $.error("prefetch requires url to be set");
      o.transform = o.filter || o.transform;
      o.cacheKey = o.cacheKey || o.url;
      o.thumbprint = VERSION + o.thumbprint;
      o.transport = o.transport ? callbackToDeferred(o.transport) : $.ajax;
      return o;
    }
    function parseRemote(o) {
      var defaults;
      if (!o) {
        return;
      }
      defaults = {
        url: null,
        cache: true,
        prepare: null,
        replace: null,
        wildcard: null,
        limiter: null,
        rateLimitBy: "debounce",
        rateLimitWait: 300,
        transform: _.identity,
        transport: null,
      };
      o = _.isString(o)
        ? {
            url: o,
          }
        : o;
      o = _.mixin(defaults, o);
      !o.url && $.error("remote requires url to be set");
      o.transform = o.filter || o.transform;
      o.prepare = toRemotePrepare(o);
      o.limiter = toLimiter(o);
      o.transport = o.transport ? callbackToDeferred(o.transport) : $.ajax;
      delete o.replace;
      delete o.wildcard;
      delete o.rateLimitBy;
      delete o.rateLimitWait;
      return o;
    }
    function toRemotePrepare(o) {
      var prepare, replace, wildcard;
      prepare = o.prepare;
      replace = o.replace;
      wildcard = o.wildcard;
      if (prepare) {
        return prepare;
      }
      if (replace) {
        prepare = prepareByReplace;
      } else if (o.wildcard) {
        prepare = prepareByWildcard;
      } else {
        prepare = identityPrepare;
      }
      return prepare;
      function prepareByReplace(query, settings) {
        settings.url = replace(settings.url, query);
        return settings;
      }
      function prepareByWildcard(query, settings) {
        settings.url = settings.url.replace(
          wildcard,
          encodeURIComponent(query)
        );
        return settings;
      }
      function identityPrepare(query, settings) {
        return settings;
      }
    }
    function toLimiter(o) {
      var limiter, method, wait;
      limiter = o.limiter;
      method = o.rateLimitBy;
      wait = o.rateLimitWait;
      if (!limiter) {
        limiter = /^throttle$/i.test(method) ? throttle(wait) : debounce(wait);
      }
      return limiter;
      function debounce(wait) {
        return function debounce(fn) {
          return _.debounce(fn, wait);
        };
      }
      function throttle(wait) {
        return function throttle(fn) {
          return _.throttle(fn, wait);
        };
      }
    }
    function callbackToDeferred(fn) {
      return function wrapper(o) {
        var deferred = $.Deferred();
        fn(o, onSuccess, onError);
        return deferred;
        function onSuccess(resp) {
          _.defer(function () {
            deferred.resolve(resp);
          });
        }
        function onError(err) {
          _.defer(function () {
            deferred.reject(err);
          });
        }
      };
    }
  })();
  var Bloodhound = (function () {
    "use strict";
    var old;
    old = window && window.Bloodhound;
    function Bloodhound(o) {
      o = oParser(o);
      this.sorter = o.sorter;
      this.identify = o.identify;
      this.sufficient = o.sufficient;
      this.indexRemote = o.indexRemote;
      this.local = o.local;
      this.remote = o.remote ? new Remote(o.remote) : null;
      this.prefetch = o.prefetch ? new Prefetch(o.prefetch) : null;
      this.index = new SearchIndex({
        identify: this.identify,
        datumTokenizer: o.datumTokenizer,
        queryTokenizer: o.queryTokenizer,
      });
      o.initialize !== false && this.initialize();
    }
    Bloodhound.noConflict = function noConflict() {
      window && (window.Bloodhound = old);
      return Bloodhound;
    };
    Bloodhound.tokenizers = tokenizers;
    _.mixin(Bloodhound.prototype, {
      __ttAdapter: function ttAdapter() {
        var that = this;
        return this.remote ? withAsync : withoutAsync;
        function withAsync(query, sync, async) {
          return that.search(query, sync, async);
        }
        function withoutAsync(query, sync) {
          return that.search(query, sync);
        }
      },
      _loadPrefetch: function loadPrefetch() {
        var that = this,
          deferred,
          serialized;
        deferred = $.Deferred();
        if (!this.prefetch) {
          deferred.resolve();
        } else if ((serialized = this.prefetch.fromCache())) {
          this.index.bootstrap(serialized);
          deferred.resolve();
        } else {
          this.prefetch.fromNetwork(done);
        }
        return deferred.promise();
        function done(err, data) {
          if (err) {
            return deferred.reject();
          }
          that.add(data);
          that.prefetch.store(that.index.serialize());
          deferred.resolve();
        }
      },
      _initialize: function initialize() {
        var that = this,
          deferred;
        this.clear();
        (this.initPromise = this._loadPrefetch()).done(addLocalToIndex);
        return this.initPromise;
        function addLocalToIndex() {
          that.add(that.local);
        }
      },
      initialize: function initialize(force) {
        return !this.initPromise || force
          ? this._initialize()
          : this.initPromise;
      },
      add: function add(data) {
        this.index.add(data);
        return this;
      },
      get: function get(ids) {
        ids = _.isArray(ids) ? ids : [].slice.call(arguments);
        return this.index.get(ids);
      },
      search: function search(query, sync, async) {
        var that = this,
          local;
        sync = sync || _.noop;
        async = async || _.noop;
        local = this.sorter(this.index.search(query));
        sync(this.remote ? local.slice() : local);
        if (this.remote && local.length < this.sufficient) {
          this.remote.get(query, processRemote);
        } else if (this.remote) {
          this.remote.cancelLastRequest();
        }
        return this;
        function processRemote(remote) {
          var nonDuplicates = [];
          _.each(remote, function (r) {
            !_.some(local, function (l) {
              return that.identify(r) === that.identify(l);
            }) && nonDuplicates.push(r);
          });
          that.indexRemote && that.add(nonDuplicates);
          async(nonDuplicates);
        }
      },
      all: function all() {
        return this.index.all();
      },
      clear: function clear() {
        this.index.reset();
        return this;
      },
      clearPrefetchCache: function clearPrefetchCache() {
        this.prefetch && this.prefetch.clear();
        return this;
      },
      clearRemoteCache: function clearRemoteCache() {
        Transport.resetCache();
        return this;
      },
      ttAdapter: function ttAdapter() {
        return this.__ttAdapter();
      },
    });
    return Bloodhound;
  })();
  return Bloodhound;
});

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], function (a0) {
      return factory(a0);
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(require("jquery"));
  } else {
    factory(root["jQuery"]);
  }
})(this, function ($) {
  var _ = (function () {
    "use strict";
    return {
      isMsie: function () {
        return /(msie|trident)/i.test(navigator.userAgent)
          ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2]
          : false;
      },
      isBlankString: function (str) {
        return !str || /^\s*$/.test(str);
      },
      escapeRegExChars: function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      },
      isString: function (obj) {
        return typeof obj === "string";
      },
      isNumber: function (obj) {
        return typeof obj === "number";
      },
      isArray: $.isArray,
      isFunction: $.isFunction,
      isObject: $.isPlainObject,
      isUndefined: function (obj) {
        return typeof obj === "undefined";
      },
      isElement: function (obj) {
        return !!(obj && obj.nodeType === 1);
      },
      isJQuery: function (obj) {
        return obj instanceof $;
      },
      toStr: function toStr(s) {
        return _.isUndefined(s) || s === null ? "" : s + "";
      },
      bind: $.proxy,
      each: function (collection, cb) {
        $.each(collection, reverseArgs);
        function reverseArgs(index, value) {
          return cb(value, index);
        }
      },
      map: $.map,
      filter: $.grep,
      every: function (obj, test) {
        var result = true;
        if (!obj) {
          return result;
        }
        $.each(obj, function (key, val) {
          if (!(result = test.call(null, val, key, obj))) {
            return false;
          }
        });
        return !!result;
      },
      some: function (obj, test) {
        var result = false;
        if (!obj) {
          return result;
        }
        $.each(obj, function (key, val) {
          if ((result = test.call(null, val, key, obj))) {
            return false;
          }
        });
        return !!result;
      },
      mixin: $.extend,
      identity: function (x) {
        return x;
      },
      clone: function (obj) {
        return $.extend(true, {}, obj);
      },
      getIdGenerator: function () {
        var counter = 0;
        return function () {
          return counter++;
        };
      },
      templatify: function templatify(obj) {
        return $.isFunction(obj) ? obj : template;
        function template() {
          return String(obj);
        }
      },
      defer: function (fn) {
        setTimeout(fn, 0);
      },
      debounce: function (func, wait, immediate) {
        var timeout, result;
        return function () {
          var context = this,
            args = arguments,
            later,
            callNow;
          later = function () {
            timeout = null;
            if (!immediate) {
              result = func.apply(context, args);
            }
          };
          callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) {
            result = func.apply(context, args);
          }
          return result;
        };
      },
      throttle: function (func, wait) {
        var context, args, timeout, result, previous, later;
        previous = 0;
        later = function () {
          previous = new Date();
          timeout = null;
          result = func.apply(context, args);
        };
        return function () {
          var now = new Date(),
            remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
          } else if (!timeout) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
      },
      stringify: function (val) {
        return _.isString(val) ? val : JSON.stringify(val);
      },
      guid: function () {
        function _p8(s) {
          var p = (Math.random().toString(16) + "000000000").substr(2, 8);
          return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return "tt-" + _p8() + _p8(true) + _p8(true) + _p8();
      },
      noop: function () {},
    };
  })();
  var WWW = (function () {
    "use strict";
    var defaultClassNames = {
      wrapper: "twitter-typeahead",
      input: "tt-input",
      hint: "tt-hint",
      menu: "tt-menu",
      dataset: "tt-dataset",
      suggestion: "tt-suggestion",
      selectable: "tt-selectable",
      empty: "tt-empty",
      open: "tt-open",
      cursor: "tt-cursor",
      highlight: "tt-highlight",
    };
    return build;
    function build(o) {
      var www, classes;
      classes = _.mixin({}, defaultClassNames, o);
      www = {
        css: buildCss(),
        classes: classes,
        html: buildHtml(classes),
        selectors: buildSelectors(classes),
      };
      return {
        css: www.css,
        html: www.html,
        classes: www.classes,
        selectors: www.selectors,
        mixin: function (o) {
          _.mixin(o, www);
        },
      };
    }
    function buildHtml(c) {
      return {
        wrapper: '<span class="' + c.wrapper + '"></span>',
        menu: '<div role="listbox" class="' + c.menu + '"></div>',
      };
    }
    function buildSelectors(classes) {
      var selectors = {};
      _.each(classes, function (v, k) {
        selectors[k] = "." + v;
      });
      return selectors;
    }
    function buildCss() {
      var css = {
        wrapper: {
          position: "relative",
          display: "inline-block",
        },
        hint: {
          position: "absolute",
          top: "0",
          left: "0",
          borderColor: "transparent",
          boxShadow: "none",
          opacity: "1",
        },
        input: {
          position: "relative",
          verticalAlign: "top",
          backgroundColor: "transparent",
        },
        inputWithNoHint: {
          position: "relative",
          verticalAlign: "top",
        },
        menu: {
          position: "absolute",
          top: "100%",
          left: "0",
          zIndex: "100",
          display: "none",
        },
        ltr: {
          left: "0",
          right: "auto",
        },
        rtl: {
          left: "auto",
          right: " 0",
        },
      };
      if (_.isMsie()) {
        _.mixin(css.input, {
          backgroundImage:
            "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)",
        });
      }
      return css;
    }
  })();
  var EventBus = (function () {
    "use strict";
    var namespace, deprecationMap;
    namespace = "typeahead:";
    deprecationMap = {
      render: "rendered",
      cursorchange: "cursorchanged",
      select: "selected",
      autocomplete: "autocompleted",
    };
    function EventBus(o) {
      if (!o || !o.el) {
        $.error("EventBus initialized without el");
      }
      this.$el = $(o.el);
    }
    _.mixin(EventBus.prototype, {
      _trigger: function (type, args) {
        var $e = $.Event(namespace + type);
        this.$el.trigger.call(this.$el, $e, args || []);
        return $e;
      },
      before: function (type) {
        var args, $e;
        args = [].slice.call(arguments, 1);
        $e = this._trigger("before" + type, args);
        return $e.isDefaultPrevented();
      },
      trigger: function (type) {
        var deprecatedType;
        this._trigger(type, [].slice.call(arguments, 1));
        if ((deprecatedType = deprecationMap[type])) {
          this._trigger(deprecatedType, [].slice.call(arguments, 1));
        }
      },
    });
    return EventBus;
  })();
  var EventEmitter = (function () {
    "use strict";
    var splitter = /\s+/,
      nextTick = getNextTick();
    return {
      onSync: onSync,
      onAsync: onAsync,
      off: off,
      trigger: trigger,
    };
    function on(method, types, cb, context) {
      var type;
      if (!cb) {
        return this;
      }
      types = types.split(splitter);
      cb = context ? bindContext(cb, context) : cb;
      this._callbacks = this._callbacks || {};
      while ((type = types.shift())) {
        this._callbacks[type] = this._callbacks[type] || {
          sync: [],
          async: [],
        };
        this._callbacks[type][method].push(cb);
      }
      return this;
    }
    function onAsync(types, cb, context) {
      return on.call(this, "async", types, cb, context);
    }
    function onSync(types, cb, context) {
      return on.call(this, "sync", types, cb, context);
    }
    function off(types) {
      var type;
      if (!this._callbacks) {
        return this;
      }
      types = types.split(splitter);
      while ((type = types.shift())) {
        delete this._callbacks[type];
      }
      return this;
    }
    function trigger(types) {
      var type, callbacks, args, syncFlush, asyncFlush;
      if (!this._callbacks) {
        return this;
      }
      types = types.split(splitter);
      args = [].slice.call(arguments, 1);
      while ((type = types.shift()) && (callbacks = this._callbacks[type])) {
        syncFlush = getFlush(callbacks.sync, this, [type].concat(args));
        asyncFlush = getFlush(callbacks.async, this, [type].concat(args));
        syncFlush() && nextTick(asyncFlush);
      }
      return this;
    }
    function getFlush(callbacks, context, args) {
      return flush;
      function flush() {
        var cancelled;
        for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {
          cancelled = callbacks[i].apply(context, args) === false;
        }
        return !cancelled;
      }
    }
    function getNextTick() {
      var nextTickFn;
      if (window.setImmediate) {
        nextTickFn = function nextTickSetImmediate(fn) {
          setImmediate(function () {
            fn();
          });
        };
      } else {
        nextTickFn = function nextTickSetTimeout(fn) {
          setTimeout(function () {
            fn();
          }, 0);
        };
      }
      return nextTickFn;
    }
    function bindContext(fn, context) {
      return fn.bind
        ? fn.bind(context)
        : function () {
            fn.apply(context, [].slice.call(arguments, 0));
          };
    }
  })();
  var highlight = (function (doc) {
    "use strict";
    var defaults = {
      node: null,
      pattern: null,
      tagName: "strong",
      className: null,
      wordsOnly: false,
      caseSensitive: false,
      diacriticInsensitive: false,
    };
    var accented = {
      A: "[AaªÀ-Åà-åĀ-ąǍǎȀ-ȃȦȧᴬᵃḀḁẚẠ-ảₐ℀℁℻⒜Ⓐⓐ㍱-㍴㎀-㎄㎈㎉㎩-㎯㏂㏊㏟㏿Ａａ]",
      B: "[BbᴮᵇḂ-ḇℬ⒝Ⓑⓑ㍴㎅-㎇㏃㏈㏔㏝Ｂｂ]",
      C: "[CcÇçĆ-čᶜ℀ℂ℃℅℆ℭⅭⅽ⒞Ⓒⓒ㍶㎈㎉㎝㎠㎤㏄-㏇Ｃｃ]",
      D: "[DdĎďǄ-ǆǱ-ǳᴰᵈḊ-ḓⅅⅆⅮⅾ⒟Ⓓⓓ㋏㍲㍷-㍹㎗㎭-㎯㏅㏈Ｄｄ]",
      E: "[EeÈ-Ëè-ëĒ-ěȄ-ȇȨȩᴱᵉḘ-ḛẸ-ẽₑ℡ℯℰⅇ⒠Ⓔⓔ㉐㋍㋎Ｅｅ]",
      F: "[FfᶠḞḟ℉ℱ℻⒡Ⓕⓕ㎊-㎌㎙ﬀ-ﬄＦｆ]",
      G: "[GgĜ-ģǦǧǴǵᴳᵍḠḡℊ⒢Ⓖⓖ㋌㋍㎇㎍-㎏㎓㎬㏆㏉㏒㏿Ｇｇ]",
      H: "[HhĤĥȞȟʰᴴḢ-ḫẖℋ-ℎ⒣Ⓗⓗ㋌㍱㎐-㎔㏊㏋㏗Ｈｈ]",
      I: "[IiÌ-Ïì-ïĨ-İĲĳǏǐȈ-ȋᴵᵢḬḭỈ-ịⁱℐℑℹⅈⅠ-ⅣⅥ-ⅨⅪⅫⅰ-ⅳⅵ-ⅸⅺⅻ⒤Ⓘⓘ㍺㏌㏕ﬁﬃＩｉ]",
      J: "[JjĲ-ĵǇ-ǌǰʲᴶⅉ⒥ⒿⓙⱼＪｊ]",
      K: "[KkĶķǨǩᴷᵏḰ-ḵK⒦Ⓚⓚ㎄㎅㎉㎏㎑㎘㎞㎢㎦㎪㎸㎾㏀㏆㏍-㏏Ｋｋ]",
      L: "[LlĹ-ŀǇ-ǉˡᴸḶḷḺ-ḽℒℓ℡Ⅼⅼ⒧Ⓛⓛ㋏㎈㎉㏐-㏓㏕㏖㏿ﬂﬄＬｌ]",
      M: "[MmᴹᵐḾ-ṃ℠™ℳⅯⅿ⒨Ⓜⓜ㍷-㍹㎃㎆㎎㎒㎖㎙-㎨㎫㎳㎷㎹㎽㎿㏁㏂㏎㏐㏔-㏖㏘㏙㏞㏟Ｍｍ]",
      N: "[NnÑñŃ-ŉǊ-ǌǸǹᴺṄ-ṋⁿℕ№⒩Ⓝⓝ㎁㎋㎚㎱㎵㎻㏌㏑Ｎｎ]",
      O: "[OoºÒ-Öò-öŌ-őƠơǑǒǪǫȌ-ȏȮȯᴼᵒỌ-ỏₒ℅№ℴ⒪Ⓞⓞ㍵㏇㏒㏖Ｏｏ]",
      P: "[PpᴾᵖṔ-ṗℙ⒫Ⓟⓟ㉐㍱㍶㎀㎊㎩-㎬㎰㎴㎺㏋㏗-㏚Ｐｐ]",
      Q: "[Qqℚ⒬Ⓠⓠ㏃Ｑｑ]",
      R: "[RrŔ-řȐ-ȓʳᴿᵣṘ-ṛṞṟ₨ℛ-ℝ⒭Ⓡⓡ㋍㍴㎭-㎯㏚㏛Ｒｒ]",
      S: "[SsŚ-šſȘșˢṠ-ṣ₨℁℠⒮Ⓢⓢ㎧㎨㎮-㎳㏛㏜ﬆＳｓ]",
      T: "[TtŢ-ťȚțᵀᵗṪ-ṱẗ℡™⒯Ⓣⓣ㉐㋏㎔㏏ﬅﬆＴｔ]",
      U: "[UuÙ-Üù-üŨ-ųƯưǓǔȔ-ȗᵁᵘᵤṲ-ṷỤ-ủ℆⒰Ⓤⓤ㍳㍺Ｕｕ]",
      V: "[VvᵛᵥṼ-ṿⅣ-Ⅷⅳ-ⅷ⒱Ⓥⓥⱽ㋎㍵㎴-㎹㏜㏞Ｖｖ]",
      W: "[WwŴŵʷᵂẀ-ẉẘ⒲Ⓦⓦ㎺-㎿㏝Ｗｗ]",
      X: "[XxˣẊ-ẍₓ℻Ⅸ-Ⅻⅸ-ⅻ⒳Ⓧⓧ㏓Ｘｘ]",
      Y: "[YyÝýÿŶ-ŸȲȳʸẎẏẙỲ-ỹ⒴Ⓨⓨ㏉Ｙｙ]",
      Z: "[ZzŹ-žǱ-ǳᶻẐ-ẕℤℨ⒵Ⓩⓩ㎐-㎔Ｚｚ]",
    };
    return function hightlight(o) {
      var regex;
      o = _.mixin({}, defaults, o);
      if (!o.node || !o.pattern) {
        return;
      }
      o.pattern = _.isArray(o.pattern) ? o.pattern : [o.pattern];
      regex = getRegex(
        o.pattern,
        o.caseSensitive,
        o.wordsOnly,
        o.diacriticInsensitive
      );
      traverse(o.node, hightlightTextNode);
      function hightlightTextNode(textNode) {
        var match, patternNode, wrapperNode;
        if ((match = regex.exec(textNode.data))) {
          wrapperNode = doc.createElement(o.tagName);
          o.className && (wrapperNode.className = o.className);
          patternNode = textNode.splitText(match.index);
          patternNode.splitText(match[0].length);
          wrapperNode.appendChild(patternNode.cloneNode(true));
          textNode.parentNode.replaceChild(wrapperNode, patternNode);
        }
        return !!match;
      }
      function traverse(el, hightlightTextNode) {
        var childNode,
          TEXT_NODE_TYPE = 3;
        for (var i = 0; i < el.childNodes.length; i++) {
          childNode = el.childNodes[i];
          if (childNode.nodeType === TEXT_NODE_TYPE) {
            i += hightlightTextNode(childNode) ? 1 : 0;
          } else {
            traverse(childNode, hightlightTextNode);
          }
        }
      }
    };
    function accent_replacer(chr) {
      return accented[chr.toUpperCase()] || chr;
    }
    function getRegex(
      patterns,
      caseSensitive,
      wordsOnly,
      diacriticInsensitive
    ) {
      var escapedPatterns = [],
        regexStr;
      for (var i = 0, len = patterns.length; i < len; i++) {
        var escapedWord = _.escapeRegExChars(patterns[i]);
        if (diacriticInsensitive) {
          escapedWord = escapedWord.replace(/\S/g, accent_replacer);
        }
        escapedPatterns.push(escapedWord);
      }
      regexStr = wordsOnly
        ? "\\b(" + escapedPatterns.join("|") + ")\\b"
        : "(" + escapedPatterns.join("|") + ")";
      return caseSensitive ? new RegExp(regexStr) : new RegExp(regexStr, "i");
    }
  })(window.document);
  var Input = (function () {
    "use strict";
    var specialKeyCodeMap;
    specialKeyCodeMap = {
      9: "tab",
      27: "esc",
      37: "left",
      39: "right",
      13: "enter",
      38: "up",
      40: "down",
    };
    function Input(o, www) {
      var id;
      o = o || {};
      if (!o.input) {
        $.error("input is missing");
      }
      www.mixin(this);
      this.$hint = $(o.hint);
      this.$input = $(o.input);
      this.$menu = $(o.menu);
      id = this.$input.attr("id") || _.guid();
      this.$menu.attr("id", id + "_listbox");
      this.$hint.attr({
        "aria-hidden": true,
      });
      this.$input.attr({
        "aria-owns": id + "_listbox",
        role: "combobox",
        "aria-autocomplete": "list",
        "aria-expanded": false,
      });
      this.query = this.$input.val();
      this.queryWhenFocused = this.hasFocus() ? this.query : null;
      this.$overflowHelper = buildOverflowHelper(this.$input);
      this._checkLanguageDirection();
      if (this.$hint.length === 0) {
        this.setHint =
          this.getHint =
          this.clearHint =
          this.clearHintIfInvalid =
            _.noop;
      }
      this.onSync("cursorchange", this._updateDescendent);
    }
    Input.normalizeQuery = function (str) {
      return _.toStr(str)
        .replace(/^\s*/g, "")
        .replace(/\s{2,}/g, " ");
    };
    _.mixin(Input.prototype, EventEmitter, {
      _onBlur: function onBlur() {
        this.resetInputValue();
        this.trigger("blurred");
      },
      _onFocus: function onFocus() {
        this.queryWhenFocused = this.query;
        this.trigger("focused");
      },
      _onKeydown: function onKeydown($e) {
        var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
        this._managePreventDefault(keyName, $e);
        if (keyName && this._shouldTrigger(keyName, $e)) {
          this.trigger(keyName + "Keyed", $e);
        }
      },
      _onInput: function onInput() {
        this._setQuery(this.getInputValue());
        this.clearHintIfInvalid();
        this._checkLanguageDirection();
      },
      _managePreventDefault: function managePreventDefault(keyName, $e) {
        var preventDefault;
        switch (keyName) {
          case "up":
          case "down":
            preventDefault = !withModifier($e);
            break;

          default:
            preventDefault = false;
        }
        preventDefault && $e.preventDefault();
      },
      _shouldTrigger: function shouldTrigger(keyName, $e) {
        var trigger;
        switch (keyName) {
          case "tab":
            trigger = !withModifier($e);
            break;

          default:
            trigger = true;
        }
        return trigger;
      },
      _checkLanguageDirection: function checkLanguageDirection() {
        var dir = (this.$input.css("direction") || "ltr").toLowerCase();
        if (this.dir !== dir) {
          this.dir = dir;
          this.$hint.attr("dir", dir);
          this.trigger("langDirChanged", dir);
        }
      },
      _setQuery: function setQuery(val, silent) {
        var areEquivalent, hasDifferentWhitespace;
        areEquivalent = areQueriesEquivalent(val, this.query);
        hasDifferentWhitespace = areEquivalent
          ? this.query.length !== val.length
          : false;
        this.query = val;
        if (!silent && !areEquivalent) {
          this.trigger("queryChanged", this.query);
        } else if (!silent && hasDifferentWhitespace) {
          this.trigger("whitespaceChanged", this.query);
        }
      },
      _updateDescendent: function updateDescendent(event, id) {
        this.$input.attr("aria-activedescendant", id);
      },
      bind: function () {
        var that = this,
          onBlur,
          onFocus,
          onKeydown,
          onInput;
        onBlur = _.bind(this._onBlur, this);
        onFocus = _.bind(this._onFocus, this);
        onKeydown = _.bind(this._onKeydown, this);
        onInput = _.bind(this._onInput, this);
        this.$input
          .on("blur.tt", onBlur)
          .on("focus.tt", onFocus)
          .on("keydown.tt", onKeydown);
        if (!_.isMsie() || _.isMsie() > 9) {
          this.$input.on("input.tt", onInput);
        } else {
          this.$input.on(
            "keydown.tt keypress.tt cut.tt paste.tt",
            function ($e) {
              if (specialKeyCodeMap[$e.which || $e.keyCode]) {
                return;
              }
              _.defer(_.bind(that._onInput, that, $e));
            }
          );
        }
        return this;
      },
      focus: function focus() {
        this.$input.focus();
      },
      blur: function blur() {
        this.$input.blur();
      },
      getLangDir: function getLangDir() {
        return this.dir;
      },
      getQuery: function getQuery() {
        return this.query || "";
      },
      setQuery: function setQuery(val, silent) {
        this.setInputValue(val);
        this._setQuery(val, silent);
      },
      hasQueryChangedSinceLastFocus: function hasQueryChangedSinceLastFocus() {
        return this.query !== this.queryWhenFocused;
      },
      getInputValue: function getInputValue() {
        return this.$input.val();
      },
      setInputValue: function setInputValue(value) {
        this.$input.val(value);
        this.clearHintIfInvalid();
        this._checkLanguageDirection();
      },
      resetInputValue: function resetInputValue() {
        this.setInputValue(this.query);
      },
      getHint: function getHint() {
        return this.$hint.val();
      },
      setHint: function setHint(value) {
        this.$hint.val(value);
      },
      clearHint: function clearHint() {
        this.setHint("");
      },
      clearHintIfInvalid: function clearHintIfInvalid() {
        var val, hint, valIsPrefixOfHint, isValid;
        val = this.getInputValue();
        hint = this.getHint();
        valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
        isValid = val !== "" && valIsPrefixOfHint && !this.hasOverflow();
        !isValid && this.clearHint();
      },
      hasFocus: function hasFocus() {
        return this.$input.is(":focus");
      },
      hasOverflow: function hasOverflow() {
        var constraint = this.$input.width() - 2;
        this.$overflowHelper.text(this.getInputValue());
        return this.$overflowHelper.width() >= constraint;
      },
      isCursorAtEnd: function () {
        var valueLength, selectionStart, range;
        valueLength = this.$input.val().length;
        selectionStart = this.$input[0].selectionStart;
        if (_.isNumber(selectionStart)) {
          return selectionStart === valueLength;
        } else if (document.selection) {
          range = document.selection.createRange();
          range.moveStart("character", -valueLength);
          return valueLength === range.text.length;
        }
        return true;
      },
      destroy: function destroy() {
        this.$hint.off(".tt");
        this.$input.off(".tt");
        this.$overflowHelper.remove();
        this.$hint = this.$input = this.$overflowHelper = $("<div>");
      },
      setAriaExpanded: function setAriaExpanded(value) {
        this.$input.attr("aria-expanded", value);
      },
    });
    return Input;
    function buildOverflowHelper($input) {
      return $('<pre aria-hidden="true"></pre>')
        .css({
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre",
          fontFamily: $input.css("font-family"),
          fontSize: $input.css("font-size"),
          fontStyle: $input.css("font-style"),
          fontVariant: $input.css("font-variant"),
          fontWeight: $input.css("font-weight"),
          wordSpacing: $input.css("word-spacing"),
          letterSpacing: $input.css("letter-spacing"),
          textIndent: $input.css("text-indent"),
          textRendering: $input.css("text-rendering"),
          textTransform: $input.css("text-transform"),
        })
        .insertAfter($input);
    }
    function areQueriesEquivalent(a, b) {
      return Input.normalizeQuery(a) === Input.normalizeQuery(b);
    }
    function withModifier($e) {
      return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
    }
  })();
  var Dataset = (function () {
    "use strict";
    var keys, nameGenerator;
    keys = {
      dataset: "tt-selectable-dataset",
      val: "tt-selectable-display",
      obj: "tt-selectable-object",
    };
    nameGenerator = _.getIdGenerator();
    function Dataset(o, www) {
      o = o || {};
      o.templates = o.templates || {};
      o.templates.notFound = o.templates.notFound || o.templates.empty;
      if (!o.source) {
        $.error("missing source");
      }
      if (!o.node) {
        $.error("missing node");
      }
      if (o.name && !isValidName(o.name)) {
        $.error("invalid dataset name: " + o.name);
      }
      www.mixin(this);
      this.highlight = !!o.highlight;
      this.name = _.toStr(o.name || nameGenerator());
      this.limit = o.limit || 5;
      this.displayFn = getDisplayFn(o.display || o.displayKey);
      this.templates = getTemplates(o.templates, this.displayFn);
      this.source = o.source.__ttAdapter ? o.source.__ttAdapter() : o.source;
      this.async = _.isUndefined(o.async) ? this.source.length > 2 : !!o.async;
      this._resetLastSuggestion();
      this.$el = $(o.node)
        .attr("role", "presentation")
        .addClass(this.classes.dataset)
        .addClass(this.classes.dataset + "-" + this.name);
    }
    Dataset.extractData = function extractData(el) {
      var $el = $(el);
      if ($el.data(keys.obj)) {
        return {
          dataset: $el.data(keys.dataset) || "",
          val: $el.data(keys.val) || "",
          obj: $el.data(keys.obj) || null,
        };
      }
      return null;
    };
    _.mixin(Dataset.prototype, EventEmitter, {
      _overwrite: function overwrite(query, suggestions) {
        suggestions = suggestions || [];
        if (suggestions.length) {
          this._renderSuggestions(query, suggestions);
        } else if (this.async && this.templates.pending) {
          this._renderPending(query);
        } else if (!this.async && this.templates.notFound) {
          this._renderNotFound(query);
        } else {
          this._empty();
        }
        this.trigger("rendered", suggestions, false, this.name);
      },
      _append: function append(query, suggestions) {
        suggestions = suggestions || [];
        if (suggestions.length && this.$lastSuggestion.length) {
          this._appendSuggestions(query, suggestions);
        } else if (suggestions.length) {
          this._renderSuggestions(query, suggestions);
        } else if (!this.$lastSuggestion.length && this.templates.notFound) {
          this._renderNotFound(query);
        }
        this.trigger("rendered", suggestions, true, this.name);
      },
      _renderSuggestions: function renderSuggestions(query, suggestions) {
        var $fragment;
        $fragment = this._getSuggestionsFragment(query, suggestions);
        this.$lastSuggestion = $fragment.children().last();
        this.$el
          .html($fragment)
          .prepend(this._getHeader(query, suggestions))
          .append(this._getFooter(query, suggestions));
      },
      _appendSuggestions: function appendSuggestions(query, suggestions) {
        var $fragment, $lastSuggestion;
        $fragment = this._getSuggestionsFragment(query, suggestions);
        $lastSuggestion = $fragment.children().last();
        this.$lastSuggestion.after($fragment);
        this.$lastSuggestion = $lastSuggestion;
      },
      _renderPending: function renderPending(query) {
        var template = this.templates.pending;
        this._resetLastSuggestion();
        template &&
          this.$el.html(
            template({
              query: query,
              dataset: this.name,
            })
          );
      },
      _renderNotFound: function renderNotFound(query) {
        var template = this.templates.notFound;
        this._resetLastSuggestion();
        template &&
          this.$el.html(
            template({
              query: query,
              dataset: this.name,
            })
          );
      },
      _empty: function empty() {
        this.$el.empty();
        this._resetLastSuggestion();
      },
      _getSuggestionsFragment: function getSuggestionsFragment(
        query,
        suggestions
      ) {
        var that = this,
          fragment;
        fragment = document.createDocumentFragment();
        _.each(suggestions, function getSuggestionNode(suggestion) {
          var $el, context;
          context = that._injectQuery(query, suggestion);
          $el = $(that.templates.suggestion(context))
            .data(keys.dataset, that.name)
            .data(keys.obj, suggestion)
            .data(keys.val, that.displayFn(suggestion))
            .addClass(that.classes.suggestion + " " + that.classes.selectable);
          fragment.appendChild($el[0]);
        });
        this.highlight &&
          highlight({
            className: this.classes.highlight,
            node: fragment,
            pattern: query,
          });
        return $(fragment);
      },
      _getFooter: function getFooter(query, suggestions) {
        return this.templates.footer
          ? this.templates.footer({
              query: query,
              suggestions: suggestions,
              dataset: this.name,
            })
          : null;
      },
      _getHeader: function getHeader(query, suggestions) {
        return this.templates.header
          ? this.templates.header({
              query: query,
              suggestions: suggestions,
              dataset: this.name,
            })
          : null;
      },
      _resetLastSuggestion: function resetLastSuggestion() {
        this.$lastSuggestion = $();
      },
      _injectQuery: function injectQuery(query, obj) {
        return _.isObject(obj)
          ? _.mixin(
              {
                _query: query,
              },
              obj
            )
          : obj;
      },
      update: function update(query) {
        var that = this,
          canceled = false,
          syncCalled = false,
          rendered = 0;
        this.cancel();
        this.cancel = function cancel() {
          canceled = true;
          that.cancel = $.noop;
          that.async && that.trigger("asyncCanceled", query, that.name);
        };
        this.source(query, sync, async);
        !syncCalled && sync([]);
        function sync(suggestions) {
          if (syncCalled) {
            return;
          }
          syncCalled = true;
          suggestions = (suggestions || []).slice(0, that.limit);
          rendered = suggestions.length;
          that._overwrite(query, suggestions);
          if (rendered < that.limit && that.async) {
            that.trigger("asyncRequested", query, that.name);
          }
        }
        function async(suggestions) {
          suggestions = suggestions || [];
          if (!canceled && rendered < that.limit) {
            that.cancel = $.noop;
            var idx = Math.abs(rendered - that.limit);
            rendered += idx;
            that._append(query, suggestions.slice(0, idx));
            that.async && that.trigger("asyncReceived", query, that.name);
          }
        }
      },
      cancel: $.noop,
      clear: function clear() {
        this._empty();
        this.cancel();
        this.trigger("cleared");
      },
      isEmpty: function isEmpty() {
        return this.$el.is(":empty");
      },
      destroy: function destroy() {
        this.$el = $("<div>");
      },
    });
    return Dataset;
    function getDisplayFn(display) {
      display = display || _.stringify;
      return _.isFunction(display) ? display : displayFn;
      function displayFn(obj) {
        return obj[display];
      }
    }
    function getTemplates(templates, displayFn) {
      return {
        notFound: templates.notFound && _.templatify(templates.notFound),
        pending: templates.pending && _.templatify(templates.pending),
        header: templates.header && _.templatify(templates.header),
        footer: templates.footer && _.templatify(templates.footer),
        suggestion: templates.suggestion
          ? userSuggestionTemplate
          : suggestionTemplate,
      };
      function userSuggestionTemplate(context) {
        var template = templates.suggestion;
        return $(template(context)).attr("id", _.guid());
      }
      function suggestionTemplate(context) {
        return $('<div role="option">')
          .attr("id", _.guid())
          .text(displayFn(context));
      }
    }
    function isValidName(str) {
      return /^[_a-zA-Z0-9-]+$/.test(str);
    }
  })();
  var Menu = (function () {
    "use strict";
    function Menu(o, www) {
      var that = this;
      o = o || {};
      if (!o.node) {
        $.error("node is required");
      }
      www.mixin(this);
      this.$node = $(o.node);
      this.query = null;
      this.datasets = _.map(o.datasets, initializeDataset);
      function initializeDataset(oDataset) {
        var node = that.$node.find(oDataset.node).first();
        oDataset.node = node.length ? node : $("<div>").appendTo(that.$node);
        return new Dataset(oDataset, www);
      }
    }
    _.mixin(Menu.prototype, EventEmitter, {
      _onSelectableClick: function onSelectableClick($e) {
        this.trigger("selectableClicked", $($e.currentTarget));
      },
      _onRendered: function onRendered(type, dataset, suggestions, async) {
        this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty());
        this.trigger("datasetRendered", dataset, suggestions, async);
      },
      _onCleared: function onCleared() {
        this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty());
        this.trigger("datasetCleared");
      },
      _propagate: function propagate() {
        this.trigger.apply(this, arguments);
      },
      _allDatasetsEmpty: function allDatasetsEmpty() {
        return _.every(
          this.datasets,
          _.bind(function isDatasetEmpty(dataset) {
            var isEmpty = dataset.isEmpty();
            this.$node.attr("aria-expanded", !isEmpty);
            return isEmpty;
          }, this)
        );
      },
      _getSelectables: function getSelectables() {
        return this.$node.find(this.selectors.selectable);
      },
      _removeCursor: function _removeCursor() {
        var $selectable = this.getActiveSelectable();
        $selectable && $selectable.removeClass(this.classes.cursor);
      },
      _ensureVisible: function ensureVisible($el) {
        var elTop, elBottom, nodeScrollTop, nodeHeight;
        elTop = $el.position().top;
        elBottom = elTop + $el.outerHeight(true);
        nodeScrollTop = this.$node.scrollTop();
        nodeHeight =
          this.$node.height() +
          parseInt(this.$node.css("paddingTop"), 10) +
          parseInt(this.$node.css("paddingBottom"), 10);
        if (elTop < 0) {
          this.$node.scrollTop(nodeScrollTop + elTop);
        } else if (nodeHeight < elBottom) {
          this.$node.scrollTop(nodeScrollTop + (elBottom - nodeHeight));
        }
      },
      bind: function () {
        var that = this,
          onSelectableClick;
        onSelectableClick = _.bind(this._onSelectableClick, this);
        this.$node.on("click.tt", this.selectors.selectable, onSelectableClick);
        this.$node.on("mouseover", this.selectors.selectable, function () {
          that.setCursor($(this));
        });
        this.$node.on("mouseleave", function () {
          that._removeCursor();
        });
        _.each(this.datasets, function (dataset) {
          dataset
            .onSync("asyncRequested", that._propagate, that)
            .onSync("asyncCanceled", that._propagate, that)
            .onSync("asyncReceived", that._propagate, that)
            .onSync("rendered", that._onRendered, that)
            .onSync("cleared", that._onCleared, that);
        });
        return this;
      },
      isOpen: function isOpen() {
        return this.$node.hasClass(this.classes.open);
      },
      open: function open() {
        this.$node.scrollTop(0);
        this.$node.addClass(this.classes.open);
      },
      close: function close() {
        this.$node.attr("aria-expanded", false);
        this.$node.removeClass(this.classes.open);
        this._removeCursor();
      },
      setLanguageDirection: function setLanguageDirection(dir) {
        this.$node.attr("dir", dir);
      },
      selectableRelativeToCursor: function selectableRelativeToCursor(delta) {
        var $selectables, $oldCursor, oldIndex, newIndex;
        $oldCursor = this.getActiveSelectable();
        $selectables = this._getSelectables();
        oldIndex = $oldCursor ? $selectables.index($oldCursor) : -1;
        newIndex = oldIndex + delta;
        newIndex = ((newIndex + 1) % ($selectables.length + 1)) - 1;
        newIndex = newIndex < -1 ? $selectables.length - 1 : newIndex;
        return newIndex === -1 ? null : $selectables.eq(newIndex);
      },
      setCursor: function setCursor($selectable) {
        this._removeCursor();
        if (($selectable = $selectable && $selectable.first())) {
          $selectable.addClass(this.classes.cursor);
          this._ensureVisible($selectable);
        }
      },
      getSelectableData: function getSelectableData($el) {
        return $el && $el.length ? Dataset.extractData($el) : null;
      },
      getActiveSelectable: function getActiveSelectable() {
        var $selectable = this._getSelectables()
          .filter(this.selectors.cursor)
          .first();
        return $selectable.length ? $selectable : null;
      },
      getTopSelectable: function getTopSelectable() {
        var $selectable = this._getSelectables().first();
        return $selectable.length ? $selectable : null;
      },
      update: function update(query) {
        var isValidUpdate = query !== this.query;
        if (isValidUpdate) {
          this.query = query;
          _.each(this.datasets, updateDataset);
        }
        return isValidUpdate;
        function updateDataset(dataset) {
          dataset.update(query);
        }
      },
      empty: function empty() {
        _.each(this.datasets, clearDataset);
        this.query = null;
        this.$node.addClass(this.classes.empty);
        function clearDataset(dataset) {
          dataset.clear();
        }
      },
      destroy: function destroy() {
        this.$node.off(".tt");
        this.$node = $("<div>");
        _.each(this.datasets, destroyDataset);
        function destroyDataset(dataset) {
          dataset.destroy();
        }
      },
    });
    return Menu;
  })();
  var Status = (function () {
    "use strict";
    function Status(options) {
      this.$el = $("<span></span>", {
        role: "status",
        "aria-live": "polite",
      }).css({
        position: "absolute",
        padding: "0",
        border: "0",
        height: "1px",
        width: "1px",
        "margin-bottom": "-1px",
        "margin-right": "-1px",
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        "white-space": "nowrap",
      });
      options.$input.after(this.$el);
      _.each(
        options.menu.datasets,
        _.bind(function (dataset) {
          if (dataset.onSync) {
            dataset.onSync("rendered", _.bind(this.update, this));
            dataset.onSync("cleared", _.bind(this.cleared, this));
          }
        }, this)
      );
    }
    _.mixin(Status.prototype, {
      update: function update(event, suggestions) {
        var length = suggestions.length;
        var words;
        if (length === 1) {
          words = {
            result: "result",
            is: "is",
          };
        } else {
          words = {
            result: "results",
            is: "are",
          };
        }
        this.$el.text(
          length +
            " " +
            words.result +
            " " +
            words.is +
            " available, use up and down arrow keys to navigate."
        );
      },
      cleared: function () {
        this.$el.text("");
      },
    });
    return Status;
  })();
  var DefaultMenu = (function () {
    "use strict";
    var s = Menu.prototype;
    function DefaultMenu() {
      Menu.apply(this, [].slice.call(arguments, 0));
    }
    _.mixin(DefaultMenu.prototype, Menu.prototype, {
      open: function open() {
        !this._allDatasetsEmpty() && this._show();
        return s.open.apply(this, [].slice.call(arguments, 0));
      },
      close: function close() {
        this._hide();
        return s.close.apply(this, [].slice.call(arguments, 0));
      },
      _onRendered: function onRendered() {
        if (this._allDatasetsEmpty()) {
          this._hide();
        } else {
          this.isOpen() && this._show();
        }
        return s._onRendered.apply(this, [].slice.call(arguments, 0));
      },
      _onCleared: function onCleared() {
        if (this._allDatasetsEmpty()) {
          this._hide();
        } else {
          this.isOpen() && this._show();
        }
        return s._onCleared.apply(this, [].slice.call(arguments, 0));
      },
      setLanguageDirection: function setLanguageDirection(dir) {
        this.$node.css(dir === "ltr" ? this.css.ltr : this.css.rtl);
        return s.setLanguageDirection.apply(this, [].slice.call(arguments, 0));
      },
      _hide: function hide() {
        this.$node.hide();
      },
      _show: function show() {
        this.$node.css("display", "block");
      },
    });
    return DefaultMenu;
  })();
  var Typeahead = (function () {
    "use strict";
    function Typeahead(o, www) {
      var onFocused,
        onBlurred,
        onEnterKeyed,
        onTabKeyed,
        onEscKeyed,
        onUpKeyed,
        onDownKeyed,
        onLeftKeyed,
        onRightKeyed,
        onQueryChanged,
        onWhitespaceChanged;
      o = o || {};
      if (!o.input) {
        $.error("missing input");
      }
      if (!o.menu) {
        $.error("missing menu");
      }
      if (!o.eventBus) {
        $.error("missing event bus");
      }
      www.mixin(this);
      this.eventBus = o.eventBus;
      this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
      this.input = o.input;
      this.menu = o.menu;
      this.enabled = true;
      this.autoselect = !!o.autoselect;
      this.active = false;
      this.input.hasFocus() && this.activate();
      this.dir = this.input.getLangDir();
      this._hacks();
      this.menu
        .bind()
        .onSync("selectableClicked", this._onSelectableClicked, this)
        .onSync("asyncRequested", this._onAsyncRequested, this)
        .onSync("asyncCanceled", this._onAsyncCanceled, this)
        .onSync("asyncReceived", this._onAsyncReceived, this)
        .onSync("datasetRendered", this._onDatasetRendered, this)
        .onSync("datasetCleared", this._onDatasetCleared, this);
      onFocused = c(this, "activate", "open", "_onFocused");
      onBlurred = c(this, "deactivate", "_onBlurred");
      onEnterKeyed = c(this, "isActive", "isOpen", "_onEnterKeyed");
      onTabKeyed = c(this, "isActive", "isOpen", "_onTabKeyed");
      onEscKeyed = c(this, "isActive", "_onEscKeyed");
      onUpKeyed = c(this, "isActive", "open", "_onUpKeyed");
      onDownKeyed = c(this, "isActive", "open", "_onDownKeyed");
      onLeftKeyed = c(this, "isActive", "isOpen", "_onLeftKeyed");
      onRightKeyed = c(this, "isActive", "isOpen", "_onRightKeyed");
      onQueryChanged = c(this, "_openIfActive", "_onQueryChanged");
      onWhitespaceChanged = c(this, "_openIfActive", "_onWhitespaceChanged");
      this.input
        .bind()
        .onSync("focused", onFocused, this)
        .onSync("blurred", onBlurred, this)
        .onSync("enterKeyed", onEnterKeyed, this)
        .onSync("tabKeyed", onTabKeyed, this)
        .onSync("escKeyed", onEscKeyed, this)
        .onSync("upKeyed", onUpKeyed, this)
        .onSync("downKeyed", onDownKeyed, this)
        .onSync("leftKeyed", onLeftKeyed, this)
        .onSync("rightKeyed", onRightKeyed, this)
        .onSync("queryChanged", onQueryChanged, this)
        .onSync("whitespaceChanged", onWhitespaceChanged, this)
        .onSync("langDirChanged", this._onLangDirChanged, this);
    }
    _.mixin(Typeahead.prototype, {
      _hacks: function hacks() {
        var $input, $menu;
        $input = this.input.$input || $("<div>");
        $menu = this.menu.$node || $("<div>");
        $input.on("blur.tt", function ($e) {
          var active, isActive, hasActive;
          active = document.activeElement;
          isActive = $menu.is(active);
          hasActive = $menu.has(active).length > 0;
          if (_.isMsie() && (isActive || hasActive)) {
            $e.preventDefault();
            $e.stopImmediatePropagation();
            _.defer(function () {
              $input.focus();
            });
          }
        });
        $menu.on("mousedown.tt", function ($e) {
          $e.preventDefault();
        });
      },
      _onSelectableClicked: function onSelectableClicked(type, $el) {
        this.select($el);
      },
      _onDatasetCleared: function onDatasetCleared() {
        this._updateHint();
      },
      _onDatasetRendered: function onDatasetRendered(
        type,
        suggestions,
        async,
        dataset
      ) {
        this._updateHint();
        if (this.autoselect) {
          var cursorClass = this.selectors.cursor.substr(1);
          this.menu.$node
            .find(this.selectors.suggestion)
            .first()
            .addClass(cursorClass);
        }
        this.eventBus.trigger("render", suggestions, async, dataset);
      },
      _onAsyncRequested: function onAsyncRequested(type, dataset, query) {
        this.eventBus.trigger("asyncrequest", query, dataset);
      },
      _onAsyncCanceled: function onAsyncCanceled(type, dataset, query) {
        this.eventBus.trigger("asynccancel", query, dataset);
      },
      _onAsyncReceived: function onAsyncReceived(type, dataset, query) {
        this.eventBus.trigger("asyncreceive", query, dataset);
      },
      _onFocused: function onFocused() {
        this._minLengthMet() && this.menu.update(this.input.getQuery());
      },
      _onBlurred: function onBlurred() {
        if (this.input.hasQueryChangedSinceLastFocus()) {
          this.eventBus.trigger("change", this.input.getQuery());
        }
      },
      _onEnterKeyed: function onEnterKeyed(type, $e) {
        var $selectable;
        if (($selectable = this.menu.getActiveSelectable())) {
          if (this.select($selectable)) {
            $e.preventDefault();
            $e.stopPropagation();
          }
        } else if (this.autoselect) {
          if (this.select(this.menu.getTopSelectable())) {
            $e.preventDefault();
            $e.stopPropagation();
          }
        }
      },
      _onTabKeyed: function onTabKeyed(type, $e) {
        var $selectable;
        if (($selectable = this.menu.getActiveSelectable())) {
          this.select($selectable) && $e.preventDefault();
        } else if (this.autoselect) {
          if (($selectable = this.menu.getTopSelectable())) {
            this.autocomplete($selectable) && $e.preventDefault();
          }
        }
      },
      _onEscKeyed: function onEscKeyed() {
        this.close();
      },
      _onUpKeyed: function onUpKeyed() {
        this.moveCursor(-1);
      },
      _onDownKeyed: function onDownKeyed() {
        this.moveCursor(+1);
      },
      _onLeftKeyed: function onLeftKeyed() {
        if (this.dir === "rtl" && this.input.isCursorAtEnd()) {
          this.autocomplete(
            this.menu.getActiveSelectable() || this.menu.getTopSelectable()
          );
        }
      },
      _onRightKeyed: function onRightKeyed() {
        if (this.dir === "ltr" && this.input.isCursorAtEnd()) {
          this.autocomplete(
            this.menu.getActiveSelectable() || this.menu.getTopSelectable()
          );
        }
      },
      _onQueryChanged: function onQueryChanged(e, query) {
        this._minLengthMet(query) ? this.menu.update(query) : this.menu.empty();
      },
      _onWhitespaceChanged: function onWhitespaceChanged() {
        this._updateHint();
      },
      _onLangDirChanged: function onLangDirChanged(e, dir) {
        if (this.dir !== dir) {
          this.dir = dir;
          this.menu.setLanguageDirection(dir);
        }
      },
      _openIfActive: function openIfActive() {
        this.isActive() && this.open();
      },
      _minLengthMet: function minLengthMet(query) {
        query = _.isString(query) ? query : this.input.getQuery() || "";
        return query.length >= this.minLength;
      },
      _updateHint: function updateHint() {
        var $selectable, data, val, query, escapedQuery, frontMatchRegEx, match;
        $selectable = this.menu.getTopSelectable();
        data = this.menu.getSelectableData($selectable);
        val = this.input.getInputValue();
        if (data && !_.isBlankString(val) && !this.input.hasOverflow()) {
          query = Input.normalizeQuery(val);
          escapedQuery = _.escapeRegExChars(query);
          frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");
          match = frontMatchRegEx.exec(data.val);
          match && this.input.setHint(val + match[1]);
        } else {
          this.input.clearHint();
        }
      },
      isEnabled: function isEnabled() {
        return this.enabled;
      },
      enable: function enable() {
        this.enabled = true;
      },
      disable: function disable() {
        this.enabled = false;
      },
      isActive: function isActive() {
        return this.active;
      },
      activate: function activate() {
        if (this.isActive()) {
          return true;
        } else if (!this.isEnabled() || this.eventBus.before("active")) {
          return false;
        } else {
          this.active = true;
          this.eventBus.trigger("active");
          return true;
        }
      },
      deactivate: function deactivate() {
        if (!this.isActive()) {
          return true;
        } else if (this.eventBus.before("idle")) {
          return false;
        } else {
          this.active = false;
          this.close();
          this.eventBus.trigger("idle");
          return true;
        }
      },
      isOpen: function isOpen() {
        return this.menu.isOpen();
      },
      open: function open() {
        if (!this.isOpen() && !this.eventBus.before("open")) {
          this.input.setAriaExpanded(true);
          this.menu.open();
          this._updateHint();
          this.eventBus.trigger("open");
        }
        return this.isOpen();
      },
      close: function close() {
        if (this.isOpen() && !this.eventBus.before("close")) {
          this.input.setAriaExpanded(false);
          this.menu.close();
          this.input.clearHint();
          this.input.resetInputValue();
          this.eventBus.trigger("close");
        }
        return !this.isOpen();
      },
      setVal: function setVal(val) {
        this.input.setQuery(_.toStr(val));
      },
      getVal: function getVal() {
        return this.input.getQuery();
      },
      select: function select($selectable) {
        var data = this.menu.getSelectableData($selectable);
        if (data && !this.eventBus.before("select", data.obj, data.dataset)) {
          this.input.setQuery(data.val, true);
          this.eventBus.trigger("select", data.obj, data.dataset);
          this.close();
          return true;
        }
        return false;
      },
      autocomplete: function autocomplete($selectable) {
        var query, data, isValid;
        query = this.input.getQuery();
        data = this.menu.getSelectableData($selectable);
        isValid = data && query !== data.val;
        if (
          isValid &&
          !this.eventBus.before("autocomplete", data.obj, data.dataset)
        ) {
          this.input.setQuery(data.val);
          this.eventBus.trigger("autocomplete", data.obj, data.dataset);
          return true;
        }
        return false;
      },
      moveCursor: function moveCursor(delta) {
        var query, $candidate, data, suggestion, datasetName, cancelMove, id;
        query = this.input.getQuery();
        $candidate = this.menu.selectableRelativeToCursor(delta);
        data = this.menu.getSelectableData($candidate);
        suggestion = data ? data.obj : null;
        datasetName = data ? data.dataset : null;
        id = $candidate ? $candidate.attr("id") : null;
        this.input.trigger("cursorchange", id);
        cancelMove = this._minLengthMet() && this.menu.update(query);
        if (
          !cancelMove &&
          !this.eventBus.before("cursorchange", suggestion, datasetName)
        ) {
          this.menu.setCursor($candidate);
          if (data) {
            if (typeof data.val === "string") {
              this.input.setInputValue(data.val);
            }
          } else {
            this.input.resetInputValue();
            this._updateHint();
          }
          this.eventBus.trigger("cursorchange", suggestion, datasetName);
          return true;
        }
        return false;
      },
      destroy: function destroy() {
        this.input.destroy();
        this.menu.destroy();
      },
    });
    return Typeahead;
    function c(ctx) {
      var methods = [].slice.call(arguments, 1);
      return function () {
        var args = [].slice.call(arguments);
        _.each(methods, function (method) {
          return ctx[method].apply(ctx, args);
        });
      };
    }
  })();
  (function () {
    "use strict";
    var old, keys, methods;
    old = $.fn.typeahead;
    keys = {
      www: "tt-www",
      attrs: "tt-attrs",
      typeahead: "tt-typeahead",
    };
    methods = {
      initialize: function initialize(o, datasets) {
        var www;
        datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);
        o = o || {};
        www = WWW(o.classNames);
        return this.each(attach);
        function attach() {
          var $input,
            $wrapper,
            $hint,
            $menu,
            defaultHint,
            defaultMenu,
            eventBus,
            input,
            menu,
            status,
            typeahead,
            MenuConstructor;
          _.each(datasets, function (d) {
            d.highlight = !!o.highlight;
          });
          $input = $(this);
          $wrapper = $(www.html.wrapper);
          $hint = $elOrNull(o.hint);
          $menu = $elOrNull(o.menu);
          defaultHint = o.hint !== false && !$hint;
          defaultMenu = o.menu !== false && !$menu;
          defaultHint && ($hint = buildHintFromInput($input, www));
          defaultMenu && ($menu = $(www.html.menu).css(www.css.menu));
          $hint && $hint.val("");
          $input = prepInput($input, www);
          if (defaultHint || defaultMenu) {
            $wrapper.css(www.css.wrapper);
            $input.css(defaultHint ? www.css.input : www.css.inputWithNoHint);
            $input
              .wrap($wrapper)
              .parent()
              .prepend(defaultHint ? $hint : null)
              .append(defaultMenu ? $menu : null);
          }
          MenuConstructor = defaultMenu ? DefaultMenu : Menu;
          eventBus = new EventBus({
            el: $input,
          });
          input = new Input(
            {
              hint: $hint,
              input: $input,
              menu: $menu,
            },
            www
          );
          menu = new MenuConstructor(
            {
              node: $menu,
              datasets: datasets,
            },
            www
          );
          status = new Status({
            $input: $input,
            menu: menu,
          });
          typeahead = new Typeahead(
            {
              input: input,
              menu: menu,
              eventBus: eventBus,
              minLength: o.minLength,
              autoselect: o.autoselect,
            },
            www
          );
          $input.data(keys.www, www);
          $input.data(keys.typeahead, typeahead);
        }
      },
      isEnabled: function isEnabled() {
        var enabled;
        ttEach(this.first(), function (t) {
          enabled = t.isEnabled();
        });
        return enabled;
      },
      enable: function enable() {
        ttEach(this, function (t) {
          t.enable();
        });
        return this;
      },
      disable: function disable() {
        ttEach(this, function (t) {
          t.disable();
        });
        return this;
      },
      isActive: function isActive() {
        var active;
        ttEach(this.first(), function (t) {
          active = t.isActive();
        });
        return active;
      },
      activate: function activate() {
        ttEach(this, function (t) {
          t.activate();
        });
        return this;
      },
      deactivate: function deactivate() {
        ttEach(this, function (t) {
          t.deactivate();
        });
        return this;
      },
      isOpen: function isOpen() {
        var open;
        ttEach(this.first(), function (t) {
          open = t.isOpen();
        });
        return open;
      },
      open: function open() {
        ttEach(this, function (t) {
          t.open();
        });
        return this;
      },
      close: function close() {
        ttEach(this, function (t) {
          t.close();
        });
        return this;
      },
      select: function select(el) {
        var success = false,
          $el = $(el);
        ttEach(this.first(), function (t) {
          success = t.select($el);
        });
        return success;
      },
      autocomplete: function autocomplete(el) {
        var success = false,
          $el = $(el);
        ttEach(this.first(), function (t) {
          success = t.autocomplete($el);
        });
        return success;
      },
      moveCursor: function moveCursoe(delta) {
        var success = false;
        ttEach(this.first(), function (t) {
          success = t.moveCursor(delta);
        });
        return success;
      },
      val: function val(newVal) {
        var query;
        if (!arguments.length) {
          ttEach(this.first(), function (t) {
            query = t.getVal();
          });
          return query;
        } else {
          ttEach(this, function (t) {
            t.setVal(_.toStr(newVal));
          });
          return this;
        }
      },
      destroy: function destroy() {
        ttEach(this, function (typeahead, $input) {
          revert($input);
          typeahead.destroy();
        });
        return this;
      },
    };
    $.fn.typeahead = function (method) {
      if (methods[method]) {
        return methods[method].apply(this, [].slice.call(arguments, 1));
      } else {
        return methods.initialize.apply(this, arguments);
      }
    };
    $.fn.typeahead.noConflict = function noConflict() {
      $.fn.typeahead = old;
      return this;
    };
    function ttEach($els, fn) {
      $els.each(function () {
        var $input = $(this),
          typeahead;
        (typeahead = $input.data(keys.typeahead)) && fn(typeahead, $input);
      });
    }
    function buildHintFromInput($input, www) {
      return $input
        .clone()
        .addClass(www.classes.hint)
        .removeData()
        .css(www.css.hint)
        .css(getBackgroundStyles($input))
        .prop({
          readonly: true,
          required: false,
        })
        .removeAttr("id name placeholder")
        .removeClass("required")
        .attr({
          spellcheck: "false",
          tabindex: -1,
        });
    }
    function prepInput($input, www) {
      $input.data(keys.attrs, {
        dir: $input.attr("dir"),
        autocomplete: $input.attr("autocomplete"),
        spellcheck: $input.attr("spellcheck"),
        style: $input.attr("style"),
      });
      $input.addClass(www.classes.input).attr({
        spellcheck: false,
      });
      try {
        !$input.attr("dir") && $input.attr("dir", "auto");
      } catch (e) {}
      return $input;
    }
    function getBackgroundStyles($el) {
      return {
        backgroundAttachment: $el.css("background-attachment"),
        backgroundClip: $el.css("background-clip"),
        backgroundColor: $el.css("background-color"),
        backgroundImage: $el.css("background-image"),
        backgroundOrigin: $el.css("background-origin"),
        backgroundPosition: $el.css("background-position"),
        backgroundRepeat: $el.css("background-repeat"),
        backgroundSize: $el.css("background-size"),
      };
    }
    function revert($input) {
      var www, $wrapper;
      www = $input.data(keys.www);
      $wrapper = $input.parent().filter(www.selectors.wrapper);
      _.each($input.data(keys.attrs), function (val, key) {
        _.isUndefined(val) ? $input.removeAttr(key) : $input.attr(key, val);
      });
      $input
        .removeData(keys.typeahead)
        .removeData(keys.www)
        .removeData(keys.attr)
        .removeClass(www.classes.input);
      if ($wrapper.length) {
        $input.detach().insertAfter($wrapper);
        $wrapper.remove();
      }
    }
    function $elOrNull(obj) {
      var isValid, $el;
      isValid = _.isJQuery(obj) || _.isElement(obj);
      $el = isValid ? $(obj).first() : [];
      return $el.length ? $el : null;
    }
  })();
});
/**
 * This module adds a copy button to all code examples in the docs.
 */

!(function () {
  // Look for code samples and set up a copy button on each
  $("[data-docs-code]").each(function (index, value) {
    var copyBtnId = "copy-btn-" + index.toString();
    var $button = $(
      '<button class="docs-code-copy" id="' + copyBtnId + '">Copy</button>'
    );

    var text = $(this)
      .find("code")
      .text()
      .replace("&lt;", "<")
      .replace("&gt;", ">");

    $(this).prepend($button);

    $(document).on("click", "#" + copyBtnId, function () {
      navigator.clipboard.writeText(text).then(
        function () {
          // Change the text of the copy button when it's clicked on
          $button.text("Copied!");
          window.setTimeout(function () {
            $button.text("Copy");
          }, 3000);
        },
        function () {
          // Log errors on copy failure
          console.error("Action:", event.action);
          console.error("Trigger:", event.trigger);
        }
      );
    });
  });
})();

/**
 * This module activates on a Kitchen Sink page, and changes how code examples are rendered.
 * The code example is hidden, and can be revealed with a toggle.
 */

!(function () {
  var $ks = $("#docs-kitchen-sink");
  if (!$ks.length) return;

  $ks.find("[data-ks-codepen]").each(function () {
    var $codepen = $(this);
    var $code = $codepen.next("[data-docs-code]");

    $link = $('<a class="docs-code-toggle">Toggle Code</a>');
    $link.on("click.docs", function () {
      $codepen.slideToggle(250);
      $code.slideToggle(250);
    });
    $link.insertBefore(this);
    $code.addClass("kitchen-sink").hide(0);
    $codepen.addClass("kitchen-sink").hide(0);
  });
})();

/**
 * This module sets up the search bar.
 */

!(function () {
  var source = {
    // Only show 10 results at once
    limit: 10,

    // Function to fetch result list and then find a result;
    source: function (query, sync, async) {
      query = query.toLowerCase();

      // TODO a zub developból átvenni a keresőmenü CSS-ét
      // megbeszélni a helyét Szilvivel.

      $.getJSON("./assets/json/search.json", function (data, status) {
        async(
          data.filter(function (elem, i, arr) {
            var name = elem.name.toLowerCase();
            var terms = [name, name.replace("-", "")].concat(elem.tags || []);
            for (var i in terms) if (terms[i].indexOf(query) > -1) return true;
            return false;
          })
        );
      });
    },

    // Name to use for the search result itself
    display: function (item) {
      return item.name;
    },

    templates: {
      // HTML that renders if there are no results
      notFound: function (query) {
        return (
          '<div class="tt-empty">No results for "' + query.query + '".</div>'
        );
      },
      // HTML that renders for each result in the list
      suggestion: function (item) {
        return (
          '<div><span class="name">' +
          item.name +
          '<span class="meta">' +
          item.type +
          '</span></span> <span class="desc">' +
          item.description +
          "</span></div>"
        );
      },
    },
  };

  // Search
  $("[data-docs-search]")
    .typeahead({ highlight: false }, source)
    .on("typeahead:select", function (e, sel) {
      window.location.href = sel.link;
    });

  // Auto-highlight unless it's a phone
  if (!navigator.userAgent.match(/(iP(hone|ad|od)|Android)/)) {
    $("[data-docs-search]").focus();
  }
})();

/**
 * This module generates a table of contents from the <h2>s on a page.
 */

!(function () {
  var $h2s = $(".docs-component h2");
  var $toc = $("[data-docs-toc]");

  $h2s.each(function () {
    var $title = $(this);
    // Ignore <h2>s inside of a rendered code sample
    if ($title.parents(".docs-code-live").length) return;

    // Get the text in the title without the nested HTML
    // https://stackoverflow.com/a/33592275
    var $topLevelTitle = $title.clone().children().remove().end();
    var text = $topLevelTitle.text();

    var anchor = $title.children("a").attr("href");

    $toc.append('<li><a href="' + anchor + '">' + text + "</a></li>");
  });
})();

//var $window = $(window);
//var $container = $('.docs-component');
//var $TOC = $('#docsToc');
//var $TOCparent = $TOC.parent();
//
//if($TOC.is('*')) {
//  var fixedTop = $container.offset().top;
//  var innerHeight = 0;
//  $container.children().each(function() {innerHeight += $(this).height()});
//  var containerHeight = $container.height();
//  var handler = function() {
//    var tocHeight = $TOC.height();
//    var parentOffset = $TOCparent.offset().top;
//    var windowScroll = $window.scrollTop();
//    var containerScroll = $container.scrollTop();
//    var visibleNav = (containerHeight + fixedTop) - windowScroll;
//
//    if (visibleNav < tocHeight || containerScroll + tocHeight >= innerHeight) {
//      $TOC.removeClass('is-fixed');
//      $TOC.addClass('is-docked').css({top: 'auto'});
//    } else if ((windowScroll > fixedTop && parentOffset < windowScroll)|| (parentOffset < fixedTop - windowScroll)) {
//      var offset = Math.max(fixedTop - windowScroll, 0)
//      $TOC.removeClass('is-docked');
//      $TOC.addClass('is-fixed').css({top: offset});
//    } else {
//      $TOC.removeClass('is-fixed');
//      $TOC.removeClass('is-docked');
//    }
//  };
//  $(document).on('load scroll', handler);
//  $container.on('scroll', handler);
//}

(function () {
  var prev = 0;
  var $window = $(window);
  var nav = $(".docs-sticky-top-bar");

  $window.on("scroll", function () {
    var scrollTop = $window.scrollTop();
    nav.toggleClass("mobile-hidden", scrollTop > prev && scrollTop > 100);
    prev = scrollTop;
  });

  $("#inline-search").on("on.zf.toggler", function () {
    $(this).find("input").focus();
    $(".search-button").addClass("search-open");
  });
  $("#inline-search").on("off.zf.toggler", function () {
    $(this).find("input").blur();
    $(".search-button").removeClass("search-open");
  });
})();

// From http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters

var QueryString = (function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
})();

// 2. This code loads the IFrame Player API code asynchronously.
if ($("#main-video").is("*")) {
  var $videoOuter = $("#subpage-intro-video");
  var $videoInner = $videoOuter.find(".docs-video-inner");
  var $videoOverlay = $videoOuter.find(".video-overlay");
  var videoId = $("#main-video").data().video;
  var tag = document.createElement("script");

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube mainPlayer)
  //    after the API code downloads.
  var mainPlayer,
    embeddedPlayers = [];

  function onYouTubeIframeAPIReady() {
    mainPlayer = new YT.Player("main-video", {
      height: "385",
      width: "690",
      videoId: videoId,
      playerVars: { showinfo: "0" },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });

    $("[data-linkable-video]").each(function () {
      var $vid = $(this);
      var id = this.id;
      var videoId = $vid.data().linkableVideo;
      embeddedPlayers.push({
        id: id,
        video: videoId,
        player: new YT.Player(id, {
          events: {
            onReady: onPlayerReady,
          },
        }),
      });
    });
  }

  // 4. The API will call this function when the video mainPlayer is ready.
  function onPlayerReady(event) {
    if (QueryString.video == videoId) {
      mainPlayer.playVideo();
    } else if (QueryString.video) {
      for (var i = 0; i < embeddedPlayers.length; i++) {
        if (QueryString.video == embeddedPlayers[i].video) {
          $(window).scrollTop(
            $("#" + embeddedPlayers[i].id).offset().top - 200
          );

          // Don't show the main vid if we're autoplaying a different one.
          $videoInner.removeClass("autostick").removeClass("expanded");
          $videoOverlay.removeClass("expanded");
          embeddedPlayers[i].player.playVideo();
        }
      }
    }
  }

  // 5. The API calls this function when the mainPlayer's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the mainPlayer should play for six seconds and then stop.
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      $videoInner.addClass("playing").addClass("autostick");
    } else {
      $videoInner.removeClass("playing");
    }
  }

  var $window = $(window);

  $(window).on("scroll", function () {
    var videoOffset = $videoOuter.offset().top;
    var videoHeight = $videoOuter.height();
    var myScrollPosition = $(this).scrollTop();

    if (myScrollPosition > videoOffset + videoHeight - 300) {
      $videoInner.addClass("is-stuck");
      $videoOverlay.addClass("is-stuck");
    } else {
      $videoInner.removeClass("is-stuck");
      $videoOverlay.removeClass("is-stuck");
    }
  });

  $("[data-close-video]").on("click", function () {
    mainPlayer.stopVideo();
    $videoInner.removeClass("autostick").removeClass("expanded");
    $videoOverlay.removeClass("expanded");
  });

  $("[data-expand-contract-video]").on("click", function () {
    $videoInner.toggleClass("expanded");
    $videoOverlay.toggleClass("expanded");
  });

  var getSeconds = function (link) {
    var time = $(link).data().openVideo;
    var sections = String(time).split(":");
    var seconds;
    if (sections.length > 1) {
      seconds = 60 * Number(sections[0]) + Number(sections[1]);
    } else {
      seconds = Number(sections[0]);
    }
    return seconds;
  };
  var href = $("#docs-mobile-video-link").attr("href");
  $("[data-open-video]").each(function () {
    var seconds = getSeconds(this);
    this.href = href + "&t=" + seconds;
    this.target = "_blank";
  });

  $("[data-open-video]").on("click", function (e) {
    if (Foundation.MediaQuery.is("small only")) {
      return;
    }
    e.preventDefault();
    var seconds = getSeconds(this);
    mainPlayer.seekTo(seconds, true);
    mainPlayer.playVideo();
    $videoOverlay.addClass("expanded");
    $videoInner.addClass("expanded").addClass("autostick");
  });
}

$(function () {
  // TODO: Add alternate between advanced and intro
  var topic = $("h1.docs-page-title").text();
  if (topic.length < 1) {
    topic = "Foundation";
  }
  var header = "Master " + topic;
  var body =
    "Get up to speed FAST, learn straight from the experts who built Foundation.";
  var link =
    "https://zurb.com/university/foundation-intro?utm_source=Foundation%20Docs&utm_medium=Docs&utm_content=Struggling&utm_campaign=Docs%20To%20Intro";
  var cta = "Learn More";

  var html =
    '<div class="ad-unit"><h3 class="ad-unit-title">' +
    header +
    "</h3>" +
    '<p class="ad-unit-text">' +
    body +
    "</p>" +
    '<a class="button ad-unit-button" href="' +
    link +
    '">' +
    cta +
    "</a></div>";
  $("#TOCAdUnit").html(html);
});

// Code for specific docs examples.

!(function () {
  $("[data-docs-example-ofc]").click(function () {
    $("#offCanvasLeft").toggleClass("reveal-for-large");
    $(".sticky").foundation("_calc", true);
  });

  $("[data-docs-example-series]").click(function () {
    $("#series-example").addClass("is-animating");
  });

  var $transitionDemo = $(".docs-transition-demo");
  $(".docs-transitions").change(function () {
    var value = $(this).val();
    var method = value.match("-in") ? "animateIn" : "animateOut";

    Foundation.Motion[method]($transitionDemo, value, function () {
      $transitionDemo.show();
    });
  });
  var stickyMag = $("#sticky-magellan");
  stickyMag
    .on("sticky.zf.stuckto:top", function () {
      stickyMag.find("nav").addClass("stuck-mag");
    })
    .on("sticky.zf.unstuckfrom:top", function (e) {
      stickyMag.find("nav").removeClass("stuck-mag");
    });
})();

!(function () {
  var loaded = false;
  $("#docs-example-interchange").on("replaced.zf.interchange", function () {
    if (Foundation.MediaQuery.atLeast("large")) {
      if (!loaded) {
        $.getScript(
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyBOVwxUM9akvFrSWmmb2iKc7Fe0vjRBY7c&sensor=false&callback=initializeMaps"
        ).done(function () {
          loaded = true;
        });
      } else {
        window.initializeMaps();
      }
    }
  });

  window.initializeMaps = function () {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
      // How zoomed in you want the map to start at (always required)
      zoom: 11,

      // The latitude and longitude to center the map (always required)
      center: new google.maps.LatLng(37.2845934, -121.951675), // ZURB HQ

      // How you would like to style the map.
      // This is where you would paste any style found on Snazzy Maps.
      styles: [
        {
          featureType: "water",
          stylers: [{ visibility: "on" }, { color: "#acbcc9" }],
        },
        { featureType: "landscape", stylers: [{ color: "#f2e5d4" }] },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#c5c6c6" }],
        },
        {
          featureType: "road.arterial",
          elementType: "geometry",
          stylers: [{ color: "#e4d7c6" }],
        },
        {
          featureType: "road.local",
          elementType: "geometry",
          stylers: [{ color: "#fbfaf7" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#c5dac6" }],
        },
        {
          featureType: "administrative",
          stylers: [{ visibility: "on" }, { lightness: 33 }],
        },
        { featureType: "road" },
        {
          featureType: "poi.park",
          elementType: "labels",
          stylers: [{ visibility: "on" }, { lightness: 20 }],
        },
        {},
        { featureType: "road", stylers: [{ lightness: 20 }] },
      ],
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById("map");

    // Create the Google Map using out element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);
    var markerOptions = {
      map: map,
      position: { lat: 37.2845934, lng: -121.951675 },
      title: "ZURB HQ",
    };
    var marker = new google.maps.Marker(markerOptions);
  };
})();

$(document).foundation();

// [TODO] Remove this when possible
$(function () {
  // Equalizer test
  var counter = 0;
  $("#test-eq").on("postEqualized.zf.Equalizer", function () {
    counter++;
    console.log(counter);
  });
  $("#pokemonRed").on("invalid.fndtn.abide", function (e, data) {
    console.log(data);
  });
});

$(function () {
  $("[data-docs-version]").text("v" + Foundation.version);
});

var ACCORDION_KEY = "docs-accordion-expandall";
var expandAccordion = function ($a) {
  $a.parent(".accordion")
    .find(".accordion-item, .accordion-content")
    .addClass("is-active");
  $a.text("Collapse");
  $a.data("expandAll", false);
  if (localStorage) {
    localStorage.setItem(ACCORDION_KEY, "true");
  }
};

var contractAccordion = function ($a) {
  $a.parent(".accordion")
    .find(".accordion-item, .accordion-content")
    .removeClass("is-active");
  $a.text("Expand");
  $a.data("expandAll", true);
  if (localStorage) {
    localStorage.setItem(ACCORDION_KEY, "false");
  }
};

$("[data-expand-all]").on("click", function () {
  var $a = $(this);
  if ($a.data().expandAll === true) {
    expandAccordion($a);
  } else {
    contractAccordion($a);
  }
});

if (localStorage.getItem(ACCORDION_KEY) === "true") {
  expandAccordion($("[data-expand-all]"));
} else {
  $("[data-expand-all]").text("Expand");
}
