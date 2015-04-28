/*jslint devel: true, vars : true */
/*global $, jQuery, ol*/
/*
 * OpenGDS Mobile JavaScript Library
 * Released under the MIT license
 */
var OGDSM = OGDSM || {};
/**
* OGDSM<br>
* --
* Classes
*  - eGovFrameUI
*  - externalConnection
*  - olMap
*  - visulaization
*
* @class OGDSM
*/
OGDSM = (function (window, $) {
    'use strict';
    /**
    * OGDS Mobile Layout / Map Setting Super Class
    * @class OGDSM
    * @constructor
    */
    OGDSM.prototype = {
        constructor : OGDSM,
        version : '1.1'
    };
    return OGDSM;
}(window, jQuery));

/**
* OGDSM 'namespace' module(Create New Object)
*
* - Use
*       OGDSM.namesace('example');
* - Developer
*       OGDSM.example=(function(){
*         //Source Code
*       }());
*
* @module OGDSM.namespace
*/
OGDSM.namesapce = function (ns_string) {
    "use strict";
    var parts = ns_string.split('.'),
        parent = OGDSM,
        i;
    var test;

    if (parent[0] === 'OGDSM') {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }
    return parent;
};
/**
 * OGDSM json to Array module
 * - Use
 *       OGDSM.jsonToArray(jsonData, array[0], array[1]);
 *
 * @module OGDSM.jsontoArray
 */

OGDSM.jsonToArray = function (obj, x, y) {
    'use strict';
    var xyAxis = [],
        row = obj.row;
    xyAxis[0] = [];
	xyAxis[1] = [];
    $.each(row, function (idx) {
        xyAxis[0].push(row[idx][x]);
        xyAxis[1].push(row[idx][y]);
    });
    return xyAxis;
};


/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */
(function (factory) {
	"use strict";

	if (typeof define === "function" && define.amd) {
		define(factory);
	}
	else if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = factory();
	}
	else if (typeof Package !== "undefined") {
		Sortable = factory();  // export for Meteor.js
	}
	else {
		/* jshint sub:true */
		window["Sortable"] = factory();
	}
})(function () {
	"use strict";

	var dragEl,
		ghostEl,
		cloneEl,
		rootEl,
		nextEl,

		scrollEl,
		scrollParentEl,

		lastEl,
		lastCSS,

		oldIndex,
		newIndex,

		activeGroup,
		autoScroll = {},

		tapEvt,
		touchEvt,

		expando = 'Sortable' + (new Date).getTime(),

		win = window,
		document = win.document,
		parseInt = win.parseInt,

		supportDraggable = !!('draggable' in document.createElement('div')),


		_silent = false,

		_dispatchEvent = function (rootEl, name, targetEl, fromEl, startIndex, newIndex) {
			var evt = document.createEvent('Event');

			evt.initEvent(name, true, true);

			evt.item = targetEl || rootEl;
			evt.from = fromEl || rootEl;
			evt.clone = cloneEl;

			evt.oldIndex = startIndex;
			evt.newIndex = newIndex;

			rootEl.dispatchEvent(evt);
		},

		_customEvents = 'onAdd onUpdate onRemove onStart onEnd onFilter onSort'.split(' '),

		noop = function () {},

		abs = Math.abs,
		slice = [].slice,

		touchDragOverListeners = [],

		_autoScroll = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {
			// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
			if (rootEl && options.scroll) {
				var el,
					rect,
					sens = options.scrollSensitivity,
					speed = options.scrollSpeed,

					x = evt.clientX,
					y = evt.clientY,

					winWidth = window.innerWidth,
					winHeight = window.innerHeight,

					vx,
					vy
				;

				// Delect scrollEl
				if (scrollParentEl !== rootEl) {
					scrollEl = options.scroll;
					scrollParentEl = rootEl;

					if (scrollEl === true) {
						scrollEl = rootEl;

						do {
							if ((scrollEl.offsetWidth < scrollEl.scrollWidth) ||
								(scrollEl.offsetHeight < scrollEl.scrollHeight)
							) {
								break;
							}
							/* jshint boss:true */
						} while (scrollEl = scrollEl.parentNode);
					}
				}

				if (scrollEl) {
					el = scrollEl;
					rect = scrollEl.getBoundingClientRect();
					vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
					vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
				}


				if (!(vx || vy)) {
					vx = (winWidth - x <= sens) - (x <= sens);
					vy = (winHeight - y <= sens) - (y <= sens);

					/* jshint expr:true */
					(vx || vy) && (el = win);
				}


				if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
					autoScroll.el = el;
					autoScroll.vx = vx;
					autoScroll.vy = vy;

					clearInterval(autoScroll.pid);

					if (el) {
						autoScroll.pid = setInterval(function () {
							if (el === win) {
								win.scrollTo(win.scrollX + vx * speed, win.scrollY + vy * speed);
							} else {
								vy && (el.scrollTop += vy * speed);
								vx && (el.scrollLeft += vx * speed);
							}
						}, 24);
					}
				}
			}
		}, 30)
	;



	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}       [options]
	 */
	function Sortable(el, options) {
		this.el = el; // root element
		this.options = options = (options || {});

		// Default options
		var defaults = {
			group: Math.random(),
			sort: true,
			disabled: false,
			store: null,
			handle: null,
			scroll: true,
			scrollSensitivity: 30,
			scrollSpeed: 10,
			draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
			ghostClass: 'sortable-ghost',
			ignore: 'a, img',
			filter: null,
			animation: 0,
			setData: function (dataTransfer, dragEl) {
				dataTransfer.setData('Text', dragEl.textContent);
			},
			dropBubble: false,
			dragoverBubble: false
		};


		// Set default options
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}


		var group = options.group;

		if (!group || typeof group != 'object') {
			group = options.group = { name: group };
		}


		['pull', 'put'].forEach(function (key) {
			if (!(key in group)) {
				group[key] = true;
			}
		});


		// Define events
		_customEvents.forEach(function (name) {
			options[name] = _bind(this, options[name] || noop);
			_on(el, name.substr(2).toLowerCase(), options[name]);
		}, this);


		// Export options
		options.groups = ' ' + group.name + (group.put.join ? ' ' + group.put.join(' ') : '') + ' ';
		el[expando] = options;


		// Bind all private methods
		for (var fn in this) {
			if (fn.charAt(0) === '_') {
				this[fn] = _bind(this, this[fn]);
			}
		}


		// Bind events
		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);

		_on(el, 'dragover', this);
		_on(el, 'dragenter', this);

		touchDragOverListeners.push(this._onDragOver);

		// Restore sorting
		options.store && this.sort(options.store.get(this));
	}


	Sortable.prototype = /** @lends Sortable.prototype */ {
		constructor: Sortable,


		_dragStarted: function () {
			if (rootEl && dragEl) {
				// Apply effect
				_toggleClass(dragEl, this.options.ghostClass, true);

				Sortable.active = this;

				// Drag start event
				_dispatchEvent(rootEl, 'start', dragEl, rootEl, oldIndex);
			}
		},


		_onTapStart: function (/**Event|TouchEvent*/evt) {
			var type = evt.type,
				touch = evt.touches && evt.touches[0],
				target = (touch || evt).target,
				originalTarget = target,
				options =  this.options,
				el = this.el,
				filter = options.filter;

			if (type === 'mousedown' && evt.button !== 0 || options.disabled) {
				return; // only left button or enabled
			}

			target = _closest(target, options.draggable, el);

			if (!target) {
				return;
			}

			// get the index of the dragged element within its parent
			oldIndex = _index(target);

			// Check filter
			if (typeof filter === 'function') {
				if (filter.call(this, evt, target, this)) {
					_dispatchEvent(originalTarget, 'filter', target, el, oldIndex);
					evt.preventDefault();
					return; // cancel dnd
				}
			}
			else if (filter) {
				filter = filter.split(',').some(function (criteria) {
					criteria = _closest(originalTarget, criteria.trim(), el);

					if (criteria) {
						_dispatchEvent(criteria, 'filter', target, el, oldIndex);
						return true;
					}
				});

				if (filter) {
					evt.preventDefault();
					return; // cancel dnd
				}
			}


			if (options.handle && !_closest(originalTarget, options.handle, el)) {
				return;
			}


			// Prepare `dragstart`
			if (target && !dragEl && (target.parentNode === el)) {
				tapEvt = evt;

				rootEl = this.el;
				dragEl = target;
				nextEl = dragEl.nextSibling;
				activeGroup = this.options.group;

				dragEl.draggable = true;

				// Disable "draggable"
				options.ignore.split(',').forEach(function (criteria) {
					_find(target, criteria.trim(), _disableDraggable);
				});

				if (touch) {
					// Touch device support
					tapEvt = {
						target: target,
						clientX: touch.clientX,
						clientY: touch.clientY
					};

					this._onDragStart(tapEvt, 'touch');
					evt.preventDefault();
				}

				_on(document, 'mouseup', this._onDrop);
				_on(document, 'touchend', this._onDrop);
				_on(document, 'touchcancel', this._onDrop);

				_on(dragEl, 'dragend', this);
				_on(rootEl, 'dragstart', this._onDragStart);

				if (!supportDraggable) {
					this._onDragStart(tapEvt, true);
				}

				try {
					if (document.selection) {
						document.selection.empty();
					} else {
						window.getSelection().removeAllRanges();
					}
				} catch (err) {
				}
			}
		},

		_emulateDragOver: function () {
			if (touchEvt) {
				_css(ghostEl, 'display', 'none');

				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
					parent = target,
					groupName = ' ' + this.options.group.name + '',
					i = touchDragOverListeners.length;

				if (parent) {
					do {
						if (parent[expando] && parent[expando].groups.indexOf(groupName) > -1) {
							while (i--) {
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}

							break;
						}

						target = parent; // store last element
					}
					/* jshint boss:true */
					while (parent = parent.parentNode);
				}

				_css(ghostEl, 'display', '');
			}
		},


		_onTouchMove: function (/**TouchEvent*/evt) {
			if (tapEvt) {
				var touch = evt.touches ? evt.touches[0] : evt,
					dx = touch.clientX - tapEvt.clientX,
					dy = touch.clientY - tapEvt.clientY,
					translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

				touchEvt = touch;

				_css(ghostEl, 'webkitTransform', translate3d);
				_css(ghostEl, 'mozTransform', translate3d);
				_css(ghostEl, 'msTransform', translate3d);
				_css(ghostEl, 'transform', translate3d);

				evt.preventDefault();
			}
		},


		_onDragStart: function (/**Event*/evt, /**boolean*/useFallback) {
			var dataTransfer = evt.dataTransfer,
				options = this.options;

			this._offUpEvents();

			if (activeGroup.pull == 'clone') {
				cloneEl = dragEl.cloneNode(true);
				_css(cloneEl, 'display', 'none');
				rootEl.insertBefore(cloneEl, dragEl);
			}

			if (useFallback) {
				var rect = dragEl.getBoundingClientRect(),
					css = _css(dragEl),
					ghostRect;

				ghostEl = dragEl.cloneNode(true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');

				rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height * 2 - ghostRect.height);

				if (useFallback === 'touch') {
					// Bind touch events
					_on(document, 'touchmove', this._onTouchMove);
					_on(document, 'touchend', this._onDrop);
					_on(document, 'touchcancel', this._onDrop);
				} else {
					// Old brwoser
					_on(document, 'mousemove', this._onTouchMove);
					_on(document, 'mouseup', this._onDrop);
				}

				this._loopId = setInterval(this._emulateDragOver, 150);
			}
			else {
				if (dataTransfer) {
					dataTransfer.effectAllowed = 'move';
					options.setData && options.setData.call(this, dataTransfer, dragEl);
				}

				_on(document, 'drop', this);
			}

			setTimeout(this._dragStarted, 0);
		},

		_onDragOver: function (/**Event*/evt) {
			var el = this.el,
				target,
				dragRect,
				revert,
				options = this.options,
				group = options.group,
				groupPut = group.put,
				isOwner = (activeGroup === group),
				canSort = options.sort;

			if (!dragEl) {
				return;
			}

			if (evt.preventDefault !== void 0) {
				evt.preventDefault();
				!options.dragoverBubble && evt.stopPropagation();
			}

			if (activeGroup && !options.disabled &&
				(isOwner
					? canSort || (revert = !rootEl.contains(dragEl))
					: activeGroup.pull && groupPut && (
						(activeGroup.name === group.name) || // by Name
						(groupPut.indexOf && ~groupPut.indexOf(activeGroup.name)) // by Array
					)
				) &&
				(evt.rootEl === void 0 || evt.rootEl === this.el)
			) {
				// Smart auto-scrolling
				_autoScroll(evt, options, this.el);

				if (_silent) {
					return;
				}

				target = _closest(evt.target, options.draggable, el);
				dragRect = dragEl.getBoundingClientRect();


				if (revert) {
					_cloneHide(true);

					if (cloneEl || nextEl) {
						rootEl.insertBefore(dragEl, cloneEl || nextEl);
					}
					else if (!canSort) {
						rootEl.appendChild(dragEl);
					}

					return;
				}


				if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
					(el === evt.target) && (target = _ghostInBottom(el, evt))
				) {
					if (target) {
						if (target.animated) {
							return;
						}
						targetRect = target.getBoundingClientRect();
					}

					_cloneHide(isOwner);

					el.appendChild(dragEl);
					this._animate(dragRect, dragEl);
					target && this._animate(targetRect, target);
				}
				else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0)) {
					if (lastEl !== target) {
						lastEl = target;
						lastCSS = _css(target);
					}


					var targetRect = target.getBoundingClientRect(),
						width = targetRect.right - targetRect.left,
						height = targetRect.bottom - targetRect.top,
						floating = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display),
						isWide = (target.offsetWidth > dragEl.offsetWidth),
						isLong = (target.offsetHeight > dragEl.offsetHeight),
						halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
						nextSibling = target.nextElementSibling,
						after
					;

					_silent = true;
					setTimeout(_unsilent, 30);

					_cloneHide(isOwner);

					if (floating) {
						after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
					} else {
						after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
					}

					if (after && !nextSibling) {
						el.appendChild(dragEl);
					} else {
						target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
					}

					this._animate(dragRect, dragEl);
					this._animate(targetRect, target);
				}
			}
		},

		_animate: function (prevRect, target) {
			var ms = this.options.animation;

			if (ms) {
				var currentRect = target.getBoundingClientRect();

				_css(target, 'transition', 'none');
				_css(target, 'transform', 'translate3d('
					+ (prevRect.left - currentRect.left) + 'px,'
					+ (prevRect.top - currentRect.top) + 'px,0)'
				);

				target.offsetWidth; // repaint

				_css(target, 'transition', 'all ' + ms + 'ms');
				_css(target, 'transform', 'translate3d(0,0,0)');

				clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},

		_offUpEvents: function () {
			_off(document, 'mouseup', this._onDrop);
			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'touchend', this._onDrop);
			_off(document, 'touchcancel', this._onDrop);
		},

		_onDrop: function (/**Event*/evt) {
			var el = this.el,
				options = this.options;

			clearInterval(this._loopId);
			clearInterval(autoScroll.pid);

			// Unbind events
			_off(document, 'drop', this);
			_off(document, 'mousemove', this._onTouchMove);
			_off(el, 'dragstart', this._onDragStart);

			this._offUpEvents();

			if (evt) {
				evt.preventDefault();
				!options.dropBubble && evt.stopPropagation();

				ghostEl && ghostEl.parentNode.removeChild(ghostEl);

				if (dragEl) {
					_off(dragEl, 'dragend', this);

					_disableDraggable(dragEl);
					_toggleClass(dragEl, this.options.ghostClass, false);

					if (rootEl !== dragEl.parentNode) {
						newIndex = _index(dragEl);

						// drag from one list and drop into another
						_dispatchEvent(dragEl.parentNode, 'sort', dragEl, rootEl, oldIndex, newIndex);
						_dispatchEvent(rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);

						// Add event
						_dispatchEvent(dragEl, 'add', dragEl, rootEl, oldIndex, newIndex);

						// Remove event
						_dispatchEvent(rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);
					}
					else {
						// Remove clone
						cloneEl && cloneEl.parentNode.removeChild(cloneEl);

						if (dragEl.nextSibling !== nextEl) {
							// Get the index of the dragged element within its parent
							newIndex = _index(dragEl);

							// drag & drop within the same list
							_dispatchEvent(rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
							_dispatchEvent(rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
						}
					}

					// Drag end event
					Sortable.active && _dispatchEvent(rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);
				}

				// Nulling
				rootEl =
				dragEl =
				ghostEl =
				nextEl =
				cloneEl =

				scrollEl =
				scrollParentEl =

				tapEvt =
				touchEvt =

				lastEl =
				lastCSS =

				activeGroup =
				Sortable.active = null;

				// Save sorting
				this.save();
			}
		},


		handleEvent: function (/**Event*/evt) {
			var type = evt.type;

			if (type === 'dragover' || type === 'dragenter') {
				this._onDragOver(evt);
				_globalDragOver(evt);
			}
			else if (type === 'drop' || type === 'dragend') {
				this._onDrop(evt);
			}
		},


		/**
		 * Serializes the item into an array of string.
		 * @returns {String[]}
		 */
		toArray: function () {
			var order = [],
				el,
				children = this.el.children,
				i = 0,
				n = children.length;

			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, this.options.draggable, this.el)) {
					order.push(el.getAttribute('data-id') || _generateId(el));
				}
			}

			return order;
		},


		/**
		 * Sorts the elements according to the array.
		 * @param  {String[]}  order  order of the items
		 */
		sort: function (order) {
			var items = {}, rootEl = this.el;

			this.toArray().forEach(function (id, i) {
				var el = rootEl.children[i];

				if (_closest(el, this.options.draggable, rootEl)) {
					items[id] = el;
				}
			}, this);

			order.forEach(function (id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},


		/**
		 * Save the current sorting
		 */
		save: function () {
			var store = this.options.store;
			store && store.set(this);
		},


		/**
		 * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
		 * @param   {HTMLElement}  el
		 * @param   {String}       [selector]  default: `options.draggable`
		 * @returns {HTMLElement|null}
		 */
		closest: function (el, selector) {
			return _closest(el, selector || this.options.draggable, this.el);
		},


		/**
		 * Set/get option
		 * @param   {string} name
		 * @param   {*}      [value]
		 * @returns {*}
		 */
		option: function (name, value) {
			var options = this.options;

			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;
			}
		},


		/**
		 * Destroy
		 */
		destroy: function () {
			var el = this.el, options = this.options;

			_customEvents.forEach(function (name) {
				_off(el, name.substr(2).toLowerCase(), options[name]);
			});

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);

			_off(el, 'dragover', this);
			_off(el, 'dragenter', this);

			//remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = null;
		}
	};


	function _cloneHide(state) {
		if (cloneEl && (cloneEl.state !== state)) {
			_css(cloneEl, 'display', state ? 'none' : '');
			!state && cloneEl.state && rootEl.insertBefore(cloneEl, dragEl);
			cloneEl.state = state;
		}
	}


	function _bind(ctx, fn) {
		var args = slice.call(arguments, 2);
		return	fn.bind ? fn.bind.apply(fn, [ctx].concat(args)) : function () {
			return fn.apply(ctx, args.concat(slice.call(arguments)));
		};
	}


	function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {
		if (el) {
			ctx = ctx || document;
			selector = selector.split('.');

			var tag = selector.shift().toUpperCase(),
				re = new RegExp('\\s(' + selector.join('|') + ')\\s', 'g');

			do {
				if (
					(tag === '>*' && el.parentNode === ctx) || (
						(tag === '' || el.nodeName.toUpperCase() == tag) &&
						(!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length)
					)
				) {
					return el;
				}
			}
			while (el !== ctx && (el = el.parentNode));
		}

		return null;
	}


	function _globalDragOver(/**Event*/evt) {
		evt.dataTransfer.dropEffect = 'move';
		evt.preventDefault();
	}


	function _on(el, event, fn) {
		el.addEventListener(event, fn, false);
	}


	function _off(el, event, fn) {
		el.removeEventListener(event, fn, false);
	}


	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' ' + el.className + ' ').replace(/\s+/g, ' ').replace(' ' + name + ' ', '');
				el.className = className + (state ? ' ' + name : '');
			}
		}
	}


	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			}
			else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}

				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}


	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;

			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}

			return list;
		}

		return [];
	}


	function _disableDraggable(el) {
		el.draggable = false;
	}


	function _unsilent() {
		_silent = false;
	}


	/** @returns {HTMLElement|false} */
	function _ghostInBottom(el, evt) {
		var lastEl = el.lastElementChild, rect = lastEl.getBoundingClientRect();
		return (evt.clientY - (rect.top + rect.height) > 5) && lastEl; // min delta
	}


	/**
	 * Generate id
	 * @param   {HTMLElement} el
	 * @returns {String}
	 * @private
	 */
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent,
			i = str.length,
			sum = 0;

		while (i--) {
			sum += str.charCodeAt(i);
		}

		return sum.toString(36);
	}

	/**
	 * Returns the index of an element within its parent
	 * @param el
	 * @returns {number}
	 * @private
	 */
	function _index(/**HTMLElement*/el) {
		var index = 0;
		while (el && (el = el.previousElementSibling)) {
			if (el.nodeName.toUpperCase() !== 'TEMPLATE') {
				index++;
			}
		}
		return index;
	}

	function _throttle(callback, ms) {
		var args, _this;

		return function () {
			if (args === void 0) {
				args = arguments;
				_this = this;

				setTimeout(function () {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}

					args = void 0;
				}, ms);
			}
		};
	}


	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		bind: _bind,
		is: function (el, selector) {
			return !!_closest(el, selector, el);
		},
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		dispatchEvent: _dispatchEvent,
		index: _index
	};


	Sortable.version = '1.1.1';


	/**
	 * Create sortable instance
	 * @param {HTMLElement}  el
	 * @param {Object}      [options]
	 */
	Sortable.create = function (el, options) {
		return new Sortable(el, options);
	};

	// Export
	return Sortable;
});

/*jslint devel: true, vars : true, plusplus : true */
/*global $, jQuery, ol, OGDSM, d3*/
OGDSM.namesapce('visualization');
(function (OGDSM) {
    "use strict";
    var mapObj;
    /**
    * 오픈레이어3 지도 시각화 객체
    * OpenLayers3 Map Visualization Class
    * @class OGDSM.visualization
    * @constructor
    * @param {String} mapDiv - Map div id
    * @param {String} options (option) - layerListDiv, attrTableDiv, attrAddr
                                [values : div string(default : null), div string(default: null), address string(default: '')]
     layerlistDiv, attrtableDiv
    */
    OGDSM.visualization = function (mapDiv, options) {
        //layerlistDiv = (typeof (layerlistDiv) !== 'undefined') ? layerlistDiv : null;
        //attrtableDiv = (typeof (attrtableDiv) !== 'undefined') ? attrtableDiv : null;
        options = (typeof (options) !== 'undefined') ? options : {};
        var name;
        this.updateLayoutSetting(mapDiv);
        this.mapDiv = mapDiv;
        this.geoLocation = null;
        OGDSM.visualization = this;
        var defaults = {
            layerListDiv : null,
            attrTableDiv : null,
            attrAddr : ''
        };

        for (name in defaults) {
            if (defaults.hasOwnProperty(name)) {
                if (options.hasOwnProperty(name)) {
                    defaults[name] = options[name];
                }
            }
        }

        $(window).on('resize', function () {
            OGDSM.visualization.updateLayoutSetting();
        });
        if (defaults.layerListDiv !== null) {
            console.log(defaults.layerlistDiv);
            this.layerListObj = new OGDSM.mapLayerList(this, defaults.layerListDiv);
        }
        if (defaults.attrTableDiv !== null) {
            this.attrTableObj = new OGDSM.attributeTable(defaults.attrTableDiv, defaults.attrAddr);
        }
        // Orientation...
    };
    OGDSM.visualization.prototype = {
        constructor : OGDSM.visualization,
        /**
         * 지도 객체 받기
         * Get map object about OpenLayers3
         * @method getMap
         * @return {ol.Map} Retrun is OpenLayers object
         */
        getMap : function () {
            return this.mapObj;
        },
        /**
         * 지도 레이어 존재 여부 확인
         * Current layers check about OpenLayers3
         * @method layerCheck
         * @param {String} layerName - Search layer title
         * @return {OpenLayer3 Layer Object} Retrun is OpenLayers object
         */
        layerCheck : function (layerName) {
            var i,
                maps = this.getMap().getLayers().getArray();
            for (i = 0; i < maps.length; i += 1) {
                if (maps[i].get('title') === layerName) {
                    return maps[i];
                }
            }
            return false;
        },
        /**
         * 지도 레이어 인덱스 값
         * Current layers index value about OpenLayers3
         * @method indexOf
         * @param {ol3 layers object} layers - Layer objects
         * @return {Number} Retrun is index number
         */
        indexOf : function (layers, layer) {
            var length = layers.getLength(), i;
            for (i = 0; i < length; i++) {
                if (layer === layers.item(i)) {
                    return i;
                }
            }
            return -1;
        }
    };
    return OGDSM.visualization;
}(OGDSM));

/**
 * OpenGDS 모바일 맵 초기화
 * OGDSM Mobile map view
 * @method olMapView
 * @param {Array}  latlng   - Map init center latitude, longitude (option) [default : [37.582200, 127.010031] ]
 * @param {String} mapType - Background map (option) [default : 'OSM']
 * @param {String} baseProj  - Map base projection (option) [default : 'EPSG:3857']
 * @return {ol.Map} Return is openlayers3 ol.Map object
 */
OGDSM.visualization.prototype.olMapView = function (latlng, mapType, baseProj) {
    'use strict';
    latlng = (typeof (latlng) !== 'undefined') ? latlng : [37.582200, 127.010031];
    mapType = (typeof (mapType) !== 'undefined') ? mapType : 'OSM';
    baseProj = (typeof (baseProj) !== 'undefined') ? baseProj : 'EPSG:3857';
    var map = null, baseMapLayer = null, geolocation;
    var epsg5181 = new ol.proj.Projection({
        code : 'EPSG:5181',
        extent : [-219825.99, -535028.96, 819486.07, 777525.22],
        units : 'm'
    });
    var epsg5179 = new ol.proj.Projection({
        code : 'EPSG:5179',
        extent : [531371.84, 967246.47, 1576674.68, 2274021.31],
        units : 'm'
    });
    ol.proj.addProjection(epsg5181);
    ol.proj.addProjection(epsg5179);
    var baseView = new ol.View({
        projection : ol.proj.get(baseProj),
        center : ol.proj.transform(latlng, 'EPSG:4326', baseProj),
        zoom : 12,
        maxZoom : 18,
        minZoom : 6
    });
    map = new ol.Map({
        target : this.mapDiv,
        layers : [
            new ol.layer.Tile({
                title : 'basemap',
                source : baseMapLayer
            })
        ],
        view : baseView,
        controls: []
    });
    this.mapObj = map;
    this.baseProj = baseProj;
    this.changeBaseMap(mapType);
    return this.mapObj;
};


/**
 * 배경지도 변경
 * Base map change
 * @method changeBaseMap
 * @param {String} mapStyle - Map style ("OSM" | "VWorld" | "VWorld_m" | "VWorld_h")
 */
OGDSM.visualization.prototype.changeBaseMap = function (mapStyle) {
    "use strict";
    var TMS = null, view = null, baseLayer = null, map = this.mapObj, maplayers = map.getLayers(),
        mapCenter = map.getView().getCenter(), mapZoom = map.getView().getZoom(), mapProj = map.getView().getProjection();

    maplayers.forEach(function (obj, i) {
        var layerTitle = obj.get('title');
        if (layerTitle === 'basemap') {
            baseLayer = obj;
        }
    });
    if (mapStyle === 'OSM') {
        TMS = new ol.source.OSM();
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom
        });
    } else if (mapStyle === 'VWorld') {
        TMS = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/Base/201310/{z}/{x}/{y}.png"
        }));
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom,
            maxZoom : 18,
            minZoom : 6
        });
    } else if (mapStyle === 'VWorld_s') {
        TMS = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/Satellite/201301/{z}/{x}/{y}.jpeg"
        }));
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom,
            maxZoom : 18,
            minZoom : 6
        });
    } else if (mapStyle === 'VWorld_g') {
        TMS = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/gray/201411/{z}/{x}/{y}.png"
        }));
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom,
            maxZoom : 18,
            minZoom : 6
        });
    } else if (mapStyle === 'VWorld_m') {
        TMS = new ol.source.XYZ(({
            url : "http://xdworld.vworld.kr:8080/2d/midnight/201411/{z}/{x}/{y}.png"
        }));
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom,
            maxZoom : 18,
            minZoom : 6
        });
    } else if (mapStyle === '') {
        TMS = null;
        view = new ol.View({
            projection : mapProj,
            center : mapCenter,
            zoom : mapZoom,
            maxZoom : 18,
            minZoom : 6
        });
    } else {
        console.error('Not Map Style "OSM" | "VWorld" | "VWorld_m" | "VWorld_h"');
        return null;
    }
    if (baseLayer !== null) {
        map.setView(view);
        baseLayer.setSource(TMS);
    }
};

/**
 * 지도 GPS 트래킹 스위치
 * Map geolocation tracking
 * @method trackingGeoLocation
 * @param {boolean} sw - Geolocation switch (true | false
 **/
OGDSM.visualization.prototype.trackingGeoLocation = function (sw) {
    'use strict';
    var geolocation = this.geoLocation, mapObj = this.mapObj;
    if (typeof (this.mapObj) === 'undefined') {
        console.error('Not Create Map!!');
        return null;
    }
    if (geolocation === null) {
        geolocation = new ol.Geolocation({
            projection:	mapObj.getView().getProjection(),
            tracking : true
        });
    }

    if (sw === true) {
        geolocation.once('change:position', function () {
            mapObj.getView().setCenter(geolocation.getPosition());
        });
    }
};
/**
 * 모바일 해상도에 맞는 지도 레이아웃 업데이트
 * OGDSM Mobile screen update layout
 * @method updateLayoutSetting
 * @param {String} mapDiv - Map div name
 **/
OGDSM.visualization.prototype.updateLayoutSetting = function (mapDiv) {
    'use strict';
    mapDiv = (typeof (mapDiv) !== 'undefined') ? mapDiv : this.mapDiv;
    $('#' + mapDiv).width(window.innerWidth);
    $('#' + mapDiv).height(window.innerHeight);
    if (typeof (this.mapObj) !== 'undefined') {
        this.mapObj.updateSize();
    }

    /*******************/
/*    $("#d3View").attr('width', $(window).width() - 100);
	$('#d3viewonMap').hide();
	$("#d3viewonMap").attr('width', $(window).width() - 50);
	$('#d3viewonMap').css('top', $(window).height() - 300);

	$('#interpolationMap').hide();
	$("#interpolationMap").attr('width', $(window).width() - 50);
	$('#interpolationMap').css('top', $(window).height() - 600);

	$('#layersList').css('height', $(window).height() - 400);
	$('#layersList').css("overflow-y", "auto");*/
    /********************/
};
/**
 * WMS 및 WFS 맵 레이어 추가
 * WMS/WFS map layer add
 * @method addMap
 * @param {ol Map Object} data - Openlayers map object (OpenLayers WMS/WFS/ Object)
 */
OGDSM.visualization.prototype.addMap = function (data, type) {
    'use strict';
    var chkData = this.layerCheck(data.get('title'));
    if (chkData === false) {
        this.getMap().addLayer(data);
        if (typeof (this.layerListObj) !== 'undefined') {
            var color;
            if (typeof data.getStyle !== 'undefined') {
                if (type === 'polygon') {
                    color = data.getStyle()[0].getFill().getColor();
                } else if (type === 'point') {
                    color = data.getStyle()[0].getImage().getFill().getColor();
                }

            } else {
                color =  'rgb(0, 0, 0)';
            }
            this.layerListObj.listManager(data, data.get('title'), color, type);
        }
        if (typeof (this.attrTableObj) !== 'undefined') {
            this.attrTableObj.addAttribute(data.get('title'));
        }
    } else {
        console.log("Layer is existence");
    }
};
/**
 * 이미지 레이어 시각화
 * Image Layer Visualization
 * @method imageLayer
 * @param {String} imgURL (Image URL)
 * @param {String} imgTitle (Image title)
 * @param {Array} imgSize (Image size [width, height] )
 * @param {Array} imgExtent (Image extent [lower left lon, lower left lat, upper right lon, upper right lat] or [left, bottom, right, top])
 */
OGDSM.visualization.prototype.imageLayer = function (imgURL, imgTitle, imgSize, imgExtent) {
    'use strict';
    var imgLayer = null,
        title = imgTitle;

    imgLayer = new ol.layer.Image({
        opacity : 1.0,
        title : title,
        source : new ol.source.ImageStatic({
            url : imgURL + '?' + Math.random(),
            imageSize : imgSize,
            projection : new ol.proj.Projection({code : 'EPSG:3857'}),
            imageExtent : imgExtent

        })
    });
    this.getMap().addLayer(imgLayer);
};
/**
 * 맵 레이어 삭제
 * WMS/WFS/ImageLayer map layer remove
 * @method removeMap
 * @param {String} layerName - Layer title
 */
OGDSM.visualization.prototype.removeMap = function (layerName) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        this.getMap().removeLayer(obj);
    }
};
/**
 * 맵 레이어 시각화 여부
 * Map layer visualization flag
 * @method setVisible
 * @param {String} layerName - Layer title
 * @param {Boolean} flag - visualization switch true or false
 */
OGDSM.visualization.prototype.setVisible = function (layerName, flag) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        obj.setVisible(flag);
    }
};
/**
 * WFS 스타일 변경  (수정중....)
 * WFS style change
 * @method changeWFSStyle
 * @param {String} layerName (OpenLayers layer name)
 * @param {Hex Color, String or Array} colors ( Hex color )
 * @param {String} type (Vector type)
 * @param {Number} opt (Opacity number) - option, Default value : 0.5
 * @param {String} attr (Map attribute name) - option, Default value : null
 * @param {String} range (Colors range) - option, Default value : null
 * @param {String} xyData (attr value data) - option, Default value : null
 */
OGDSM.visualization.prototype.changeWFSStyle = function (layerName, colors, type, opt, attr, range, xyData) {
    'use strict';
    opt = (typeof (opt) !== 'undefined') ? opt : 0.5;
    attr = (typeof (attr) !== 'undefined') ? attr : null;
    range = (typeof (attr) !== 'undefined') ? range : null;
    xyData = (typeof (attr) !== 'undefined') ? xyData : null;
    var i = null,
        map = this.layerCheck(layerName),
        styleCache = {},
        style = null;

    if (map === false) {
        console.error('Not Map Layer');
        return -1;
    }
    map.setStyle(function (f, r) {
        var i,
            j,
            color = '#FFFFFF',
            text = r < 5000 ? f.get(attr) : '';
        if (!styleCache[text]) {
            if (Array.isArray(colors)) {
                for (i = 0; i < xyData[1].length; i += 1) {
                    if (text === xyData[1][i]) {
                        for (j = 0; j < range.length; j += 1) {
                            if (xyData[0][i] <= range[j]) {
                                color = colors[j];
                                break;
                            }
                        }
                    }
                }
            } else {
                color = colors;
            }
            if (type === 'polygon') {
                styleCache[text] = [new ol.style.Style({
                    fill : new ol.style.Fill({
                        color : color
                    }),
                    stroke : new ol.style.Stroke({
                        color : '#00000',
                        width : 1
                    }),
                    text : new ol.style.Text({
                        font : '9px Calibri,sans-serif',
                        text : text,
                        fill : new ol.style.Fill({
                            color : '#000000'
                        })
                    })
                })];
            } else if (type === 'point') {
                styleCache[text] = [new ol.style.Style({
                    image : new ol.style.Circle({
                        radius : 5,
                        fill : new ol.style.Fill({
                            color : color
                        }),
                        stroke : new ol.style.Stroke({
                            color : '#000000',
                            width : 1
                        })
                    })
                })];
            }


        }
        return styleCache[text];
    });
    map.setOpacity(opt);
};
/**
 * Bar Chart Visualization based on D3.js
 * range length = color length
 * @method barChart
 * @param {String} divId (Div name to visualize)
 * @param {Array} data (2 dim array about x, y - data is null 0 or -)
 * @param {Array} range (1 dim array about bar range) - option based )
 * @param {Array} color (1 dun array about bar fill color of range  - option ['#00000'])
 */
OGDSM.visualization.prototype.barChart = function (divId, data, range, color) {
    'use strict';
    range = (typeof (range) !== 'undefined') ? range : [];
    color = (typeof (color) !== 'undefined') ? color : ['#000000'];
    var barHeight = 18,
        minusWidth = 0,
        rootDiv = $('#' + divId),
        maxData = d3.max(data[0]),
        barChartDiv = null,
        x = null,
        y = null,
        z = null;
    rootDiv.empty();
    barChartDiv = d3.select("#" + divId).append('svg')
        .attr('id', 'barchart')
        .attr('width', rootDiv.width())
        .attr('height', barHeight * data[0].length);
    x = d3.scale.linear().domain([0, maxData]).range([0, rootDiv.width() - 50]);
    barChartDiv.selectAll("rect").data(data[0]).enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function (d, i) {
            return i * barHeight;
        })
        .attr('width', function (d) {
            if (d === '-' || d === '0') {
                return x(20);
            }
			return x(d) - minusWidth;
        })
        .attr('height', barHeight - 2)
		.attr('fill', function (d, i) {
            if (d === '-' || d === '0') {
                return '#AAAAAA';
            }
            if (range.length !== 0) {
                for (z = 0; z < range.length; z += 1) {
                    if (data[0][i] <= range[z]) {
                        return color[z];
                    }
                }
            }
            return color[color.length];
        });

    barChartDiv.selectAll('g').data(data[1])
        .enter()
        .append('text')
        .attr('x', 0)
        .attr('y', function (d, i) {
            return i * barHeight + barHeight - 5;
        })
        .attr('font-weight', 'bold')
        .attr('font-size', '0.8em')
        .text(function (d) {
            return d;
        });

	barChartDiv.selectAll('g').data(data[0])
        .enter()
        .append('text')
        .attr('x', function (d) {
            if (d === '-' || d === '0') {
                return x(10);
            }
			return x(d) - minusWidth;
        })
        .attr('y', function (d, i) {
            return i * barHeight + barHeight - 5;
        })
        .attr('dy', '.15em')
        .attr('fill', 'black')
        .attr('font-size', '0.8em')
        .attr('font-weight', 'bold')
        .text(function (d) {
            if (d === '-' || d === '0') {
                return '점검중';
            }
            return d;
        });
};

/*
OGDSM.visualization.prototype.changeWFSzIndex = function (layerName, color, type, zIndex) {
    'use strict';
    var map = this.layerCheck(layerName);
    if (map === false) {
        return -1;
    }

    console.log(layerName + ' ' + zIndex);
    map.setStyle(function (f, r) {
        var style = null;
        if (type === 'polygon') {
            style = [new ol.style.Style({
                fill : new ol.style.Fill({
                    color : color
                }),
                stroke : new ol.style.Stroke({
                    color : '#00000',
                    width : 1
                }),
                zIndex : zIndex
            })];

        } else if (type === 'point') {
            style = [new ol.style.Style({
                image : new ol.style.Circle({
                    radius : 5,
                    fill : new ol.style.Fill({
                        color : color
                    }),
                    stroke : new ol.style.Stroke({
                        color : '#000000',
                        width : 1
                    })
                }),
                zIndex : zIndex
            })];

        }
        return style;
    });
};
*/

/** GeoServer, Public data, VWorld Connect Class **/
/*jslint devel: true, vars : true */
/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('externalConnection');
(function (OGDSM) {
    'use strict';
    var values = [], responseData = null, serviceFunc = null;
    /**
     * externalConnection Class
     * vworldWMS address http://map.vworld.kr/js/wms.do
     * @class OGDSM.externalConnection
     * @constructor
     * @param {String} serverName - External Server Name (vworldWMS/geoServer/publicData/airKorea)
     * @param {String} addr option(default: null) - External Server Address
     */
    OGDSM.externalConnection = function (name, addr) {
        addr = (typeof (addr) !== 'undefined') ? addr : 'null';
        this.serverName = name;
        this.asyncValue = false;
        if (name === 'vworldWMS') {
            this.baseAddr = "http://map.vworld.kr/js/wms.do";
        } else {
            this.baseAddr = addr;
        }

    };
    OGDSM.externalConnection.prototype = {
        constructor : OGDSM.externalConnection,
        /**
         * Get external server parameter
         * @method getValues
         * @return {Array} values
         */
        getValues : function () {
            return values;
        },
        /**
         * Set external server parameter
         * @method setValues
         * @param {Array} data values
         */
        setValues : function (arr) {
            values = arr;
        },
        /**
         * Remove external server parameter
         * @method removeValues
         */
        removeValues : function () {
            values = [];
        },
        /**
         * Get external server ajax result value
         * @method getResponseData
         * @return {JSON or Array} responseData
         */
        getResponseData : function () {
            return responseData;
        },
        /**
         * Set external server ajax result value
         * @method setResponseData
         * @param {JSON or Array} obj
         */
        setResponseData : function (obj) {
            responseData = null;
            responseData = obj;
        },
        /**
         * Set external server sub name
         * @method setSubName
         * @param {String} name
         */
        setSubName : function (name) {
            this.subName = name;
        }
    };
    return OGDSM.externalConnection;
}(OGDSM));
/**
 * Change external server name and address
 * @method changeServer
 * @param {String} serverName - External Server Name (vworldWMS/geoServer/publicData/airKorea)
 * @param {String} addr option(default: null) - External Server Address
 */
OGDSM.externalConnection.prototype.changeServer = function (name, addr) {
    'use strict';
    addr = (typeof (addr) !== 'undefined') ? addr : 'undefined';
    this.serverName = name;
    if (name === 'vworldWMS') {
        this.baseAddr = "http://map.vworld.kr/js/wms.do";
    } else {
        this.baseAddr = addr;
    }
};
/**
 * Setting data for connection
 * @method setData
 * @param {Array} arguments
 */
OGDSM.externalConnection.prototype.setData = function () {
    'use strict';
    var parm, i, values;
    parm = arguments;
    this.removeValues();
    values = this.getValues();
    for (i = 0; i < parm.length; i += 1) {
        values.push(parm[i]);
    }
    this.setValues(values);
};



/**
 * vworldWMS, geoServer(getLayers, WFS), publicData(environment) data loading
 * @method dataLoad
 * @return {JSON or Array} save values(responseData) through setResponseData()
 */
OGDSM.externalConnection.prototype.dataLoad = function () {
    'use strict';
    var resultData = null,
        jsonData = null,
        values = this.getValues(),
        setResponseData = this.setResponseData;
    if (this.serverName === 'vworldWMS') {
        if (values.length === 3) {
            resultData = new ol.layer.Tile({
                title : this.serverName,
                source : new ol.source.TileWMS(({
                    url : this.baseAddr,
                    params : {
                        apiKey : values[0],
                        domain : values[1],
                        LAYERS : values[2],
                        STYLES : values[2],
                        FORMAT : 'image/png',
                        //CRS : 'EPSG:900913',
                        CRS : 'EPSG:3857',
                        EXCEPTIONS : 'text/xml',
                        TRANSPARENT : true
                    }
                }))
            });
            setResponseData(resultData);
        } else {
            console.log("Not check out data values");
        }
    } else if (this.serverName === 'geoServer') {
        if (this.subName === 'undefined') {
            console.log('Please setting subName');
            return false;
        } else if (this.subName === 'getLayers') {
            jsonData = {WorkspaceName : values[0] };
            $.ajax({
                type : 'POST',
                url : this.baseAddr,
                crossDomain: true,
    //            async : this.asyncValue,
                data : JSON.stringify(jsonData),
                contentType : "application/json;charset=UTF-8",
                dataType : 'json',
                success : function (msg) {
                    resultData = msg;
                    setResponseData(resultData.data);
                },
                error : function (e) {
                    console.log(e);
                }
            });

        } else if (this.subName === 'WFS') {//workspace, layerName
            console.log(values[0] + ', ' + values[1] + ',' + values[2]);
            resultData = this.geoServerWFS(this.baseAddr, values[0], values[1], values[2]);
            setResponseData(resultData);
        }
    } else if (this.serverName === 'publicData') {
        if (this.subName === 'TimeAverageAirQuality' ||
                this.subName === 'RealtimeRoadsideStation' ||
                this.subName === 'ArpltnInforInqireSvc') {
            this.publicDataEnv(values[0], values[1], values[2], values[3]);
        }
    }

    if (this.getResponseData() === null) {
        return false;
    } else {
        return true;
    }
};
/**
 * GeoServer WFS data load (OpenLayers3 ol.source.ServerVector)
 * @method geoServerWFS
 * @param {String} addr - GeoServer Address
 * @param {String} ws - GeoServer Workspace
 * @param {String} name - GeoServer Layer Name
 * @param {String} type - GeoServer Layer Type (Default : polygon)
 * @return {ol.source.ServerVector} vectorSource - OpenLayers3 Vector Object
 */
OGDSM.externalConnection.prototype.geoServerWFS = function (addr, ws, name, type) {
    type = (typeof (type) !== 'undefined') ? type : 'polygon';
    var vectorSource, styles, resultData;
    vectorSource = new ol.source.ServerVector({
        format: new ol.format.GeoJSON(),
        loader: function (extent, resolution, projection) {
            var fullAddr = addr + '/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature' +
                '&typeNames=' + ws + ':' + name +
                '&outputFormat=text/javascript&format_options=callback:loadFeatures' +
                '&srsname=' + 'EPSG:3857' + '&bbox=' + extent.join(',') + ',' + 'EPSG:3857';
            $.ajax({
                url : fullAddr,
                dataType: 'jsonp'
            });
        },
        strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
            maxZoom: 19
        })),
        projection: 'EPSG:3857'
    });
    if (type === 'polygon') {
        styles = [
            new ol.style.Style({
                fill: new ol.style.Fill({
                    color: '#ff0000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 1
                })
            })
        ];
    } else if (type === 'point') {
        styles = [
            new ol.style.Style({
                image : new ol.style.Circle({
                    radius : 5,
                    fill : new ol.style.Fill({color : '#ff0000'}),
                    stroke : new ol.style.Stroke({color : '#ff0000', width : 1})
                })
            })
        ];
    }
    loadFeatures = function (response) {
        vectorSource.addFeatures(vectorSource.readFeatures(response));
    };
    resultData = new ol.layer.Vector({
        title : name,
        source : vectorSource,
        style: styles
    });
    return resultData;
};
/**
 * Get Environment Data (Seoul Open Data and Public Data Portal)
 * @method publicDataEnv
 * @param {String} apikey - Key Value
 * @param {String} envType - Environment Value (Seoul : PM10, PM25, CO, NO2, O3, SO2   Public : pm10value, covalue, no2value, o3value, so2value
 * @param {String} dateOrArea (option) - environment date or area
 * @param {String} time (option) - environment time
 * @return {JSON} save values(responseData) through setResponseData()
 */
OGDSM.externalConnection.prototype.publicDataEnv = function (apikey, envType, dateOrArea, time) {
    'use strict';
    dateOrArea = (typeof (dateOrArea) !== 'undefined') ? dateOrArea : 'null';
    time = (typeof (time) !== 'undefined') ? time : 'null';

    var colorRange =
        ["#0090ff", "#008080", "#4cff4c", "#99ff99", "#FFFF00", "#FFFF99", "#FF9900", "#FF0000"],
        range = [],
        jsonData = "",
        setResponseData = this.setResponseData;
    $("#setting").popup("close");
    if (this.subName === 'TimeAverageAirQuality') { //envType add... server change...
        jsonData = '{"serviceName":"' + this.subName + '",' +
            ' "keyValue":"' + apikey + '",' +
            '"dateValue":' + '"' + dateOrArea + '",' +
            '"envType":' + '"' + envType + '",' +
            '"timeValue":' + '"' + time + '"}';

    } else if (this.subName === 'ArpltnInforInqireSvc') {
        jsonData = '{"serviceName":"' + this.subName + '",' +
            ' "keyValue":"' + apikey + '",' +
            '"areaType":' + '"' + encodeURIComponent(dateOrArea) + '",' +
            '"envType":' + '"' + envType + '"}';
    }
    console.log(this.baseAddr);
    jsonData = JSON.parse(jsonData);
    $.ajax({
        type : 'POST',
        url : this.baseAddr,
        data : JSON.stringify(jsonData),
        async : this.asyncValue,
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            var resultData = msg;
            setResponseData(JSON.parse(resultData.data));


        },
        error : function (e) {
            console.log(e);
        }
    });
};
/*
 *
 *
 *
 */
OGDSM.externalConnection.prototype.seoulEnvironmentLoad = function (addr, apiKey, envType, date, time) {
    'use strict';
    var parm = '{"serviceName":"TimeAverageAirQuality",' +
        '"keyValue":"' + apiKey + '",' +
        '"dateValue":"' + date + '", ' +
        '"envType":' + '"' + envType + '",' +
        '"timeValue":"' + time + '"} ';
    var resultData;
    parm = JSON.parse(parm);
    console.log(parm);
    $.mobile.loading('show', {
        text : 'Loading',
        textVisible : 'true',
        theme : 'c',
        textonlt : 'false'
    });
    $.ajax({
        type : 'POST',
        url : addr,
        data : JSON.stringify(parm),
        async : false,
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            resultData = JSON.parse(msg.data);
            $.mobile.loading('hide');
        },
        error : function (e) {
            console.log(e);
        }
    });
    return resultData;
};


/**
 * vworldWMS data loading
 * @method vworldWMSLoad
 * @param
 * @param
 * @param
 * @return {JSON or Array} save values(responseData) through setResponseData()
 */
OGDSM.externalConnection.prototype.vworldWMSLoad = function (apiKey, domain, data) {
    'use strict';
    data = data.join(',');
    var resultData = new ol.layer.Tile({
        title : this.serverName,
        source : new ol.source.TileWMS(({
            url : this.baseAddr,
            params : {
                apiKey : apiKey,
                domain : domain,
                LAYERS : data,
                STYLES : data,
                FORMAT : 'image/png',
                CRS : 'EPSG:900913',
                EXCEPTIONS : 'text/xml',
                TRANSPARENT : true
            }
        }))
    });
    return resultData;
}; //SLD_BODY


/**
 * GeoServer WFS data load (OpenLayers3 ol.source.GeoJSON)
 * @method geoServerWFSLoad
 * @param {OGDSM Obj} obj - OpenGDS Mobile visualization object
 * @param {String} addr - GeoServer address
 * @param {String} workspace - GeoServer workspace name
 * @param {String} name - GeoServer WFS object name
 * @param {String} type - Object type (polygon | point)
 * @param {String} color - color ( rgba(0,0,0,0) )
 */
OGDSM.externalConnection.prototype.geoServerWFSLoad = function (obj, addr, workspace, name, type, color) {
    'use strict';
    color = (typeof (color) !== 'undefined') ? color : 'rgba(0, 0, 0, 0.0)';
    var fullAddr = addr + '/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeNames=' + workspace + ':' + name +
        '&outputFormat=json&srsname=' + obj.baseProj;
    var objStyles;

    if (type === 'polygon') {
        objStyles = [
            new ol.style.Style({
                fill : new ol.style.Fill({
                    color : color
                }),
                stroke : new ol.style.Stroke({
                    color : 'rgba(0, 0, 0, 1.0)',
                    width : 1
                })
            })];
    } else if (type === 'point') {
        objStyles = [
            new ol.style.Style({
                image : new ol.style.Circle({
                    radius : 5,
                    fill : new ol.style.Fill({
                        color : color
                    }),
                    stroke : new ol.style.Stroke({
                        color : 'rgba(0, 0, 0, 1.0)',
                        width : 1
                    })
                })
            })
        ];
    }
    $.mobile.loading('show', {
        text : 'Loading',
        textVisible : 'true',
        theme : 'c',
        textonlt : 'false'
    });
    $.ajax({
        type : 'POST',
        url : fullAddr,
        crossDomain: true,
        dataType : 'json',
        success : function (msg) {
            var wfsLayer = new ol.layer.Vector({
                title : name,
                source : new ol.source.GeoJSON({
                    object: msg
                }),
                style : objStyles
            });
            obj.addMap(wfsLayer, type);
            $.mobile.loading('hide');
        },
        error : function (e) {
            console.log(e);
        }
    });
};

/*jslint devel: true, vars : true */
/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('eGovFrameUI');
(function (OGDSM) {
    'use strict';
    /**
     * 전자정부표준프레임워크 UX 컴포넌트 자동 생성 객체
     * e-Goverement Framework UX Component Automatic Create Class
     * @class OGDSM.eGovFramUI
     * @constructor
     * @param {String} theme - eGovframework theme a~g (default c)
     */
    OGDSM.eGovFrameUI = function (theme) {
        theme = (typeof (theme) !== 'undefined') ? theme : null;
        if (theme !== null) {
            this.dataTheme = theme;
        } else {
            this.dataTheme = "c";
        }
    };
    OGDSM.eGovFrameUI.prototype = {
        constructor : OGDSM.eGovFrameUI
    };
    return OGDSM.eGovFrameUI;
}(OGDSM));


/**
 * 버튼 자동 생성
 * Auto Create about Button.
 * @method autoButton
 * @param {String} divId - root div id about HTML tag attribute [상위 DIV 아이디]
 * @param {String} linkId - link a id about HTML tag attribute  [생성될 버튼 아이디]
 * @param {String} buttonTitle - button title [버튼 이름]
 * @param {String} url - link url
 * @param {Array} options (option) - theme, corners, inline, mini
                                     [values : 'a'~'g'(default:this.dataTheme), true(default) | false, true | false(default), true | false(default)]
 * @return {jQuery Object} user interface id object [제이쿼리 아이디 객체]
 */
OGDSM.eGovFrameUI.prototype.autoButton = function (rootDivId, linkId, buttonTitle, url, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId),
        html = '<a data-role="button" id="' + linkId + '" href="' + url + '" ',
        i = 0,
        name = null;

    var defaults = {
        theme : this.dataTheme,
        corners : true,
        inline : false,
        mini : false
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    html += 'data-theme="' + defaults.theme + '" data-corners="' + defaults.corners + '" data-inline="' + defaults.inline + '" data-mini="' + defaults.mini + '"';
    html += '>' + buttonTitle + '</a>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $("#" + linkId);
};

/**
 * 체크박스 자동 생성
 * Auto Create about Check Box.
 * @method autoCheckBox
 * @param {String} divId - root div id about HTML tag attribute [상위 DIV 아이디]
 * @param {String} chkId - checkbox ids about HTML tag attribute  [생성될 체크박스 아이디]
 * @param {String} chkName - checkbox name [체크박스 이름]
 * @param {Array} labels - checkbox label names [체크박스 라벨 이름]
 * @param {Array) values - checkbox values [체크박스 값]
 * @param {Array} options (option) - theme, horizontal
                                     [values : 'a'~'g'(default:this.dataTheme), true(default) | false(default)]
                                     [ 배열인자 옵션: 수직,수평(0), 테마(1) ]
 * @return {jQuery Object} user interface name object [제이쿼리 이름 객체]
 */
OGDSM.eGovFrameUI.prototype.autoCheckBox = function (rootDivId, chkId, labels, values, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : null;
    var rootDiv = $('#' + rootDivId),
        html = '',
        i = 0,
        name = null,
        defaults = {
            checkName : chkId + 'Name',
            theme : this.dataTheme,
            horizontal : false
        };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    html = '';
    if (Array.isArray(labels)) {
        html += '<fieldset data-role="controlgroup" ';
        if (defaults.horizontal) {
            html += 'data-type="horizontal">';
        } else {
            html += '>';
        }
        for (i = 0; i < labels.length; i += 1) {
            html += '<input type="checkbox" name="' + defaults.checkName + '" id="' + chkId + i + '" value="' + values[i] + '" ';
            html += 'data-theme="' + defaults.theme + '" class="custom"/>';
            html += '<label for="' + chkId + i + '">' + labels[i] + '</label>';
        }
        html += '</fieldset>';
    } else {
        html += '<input type="checkbox" name="' + defaults.checkName + '" id="' + chkId + '" value="' + values[i] + '" ';
        html += 'data-theme="' + defaults.theme + '" class="custom"/>';
        html += '<label for="' + chkId + '">' + labels + '</label>';
    }
    rootDiv.append(html);
    rootDiv.trigger('create');
    return $('input[name=' + defaults.checkName + ']:checkbox');
};

/**
 * 라디오 박스 자동 생성 (수정)
 * Auto Create about Radio Box.
 * @method autoRadioBox
 * @param {String} divId - root div id about HTML tag attribute [상위 DIV 아이디]
 * @param {String} radioId - radiobox ids about HTML tag attribute  [생성될 라디오박스 아이디]
 * @param {String} radioName - radiobox name [라디오박스 이름]
 * @param {Array} labels - radiobox label names [라디오박스 라벨 이름]
 * @param {Array) values - radiobox values [라디오박스 값]
 * @param {Array} options (option) - radioName, horizontal, theme
                                     [values : radioId + 'Name' (default), true| false(default), 'a'~'g'(default: this.dataTheme)]
 * @return {jQuery Object} user interface name object [제이쿼리 이름 객체]
 */
OGDSM.eGovFrameUI.prototype.autoRadioBox = function (rootDivId, radioId, labels, values, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : null;
    var rootDiv = $('#' + rootDivId),
        html = '<fieldset data-role="controlgroup" style="margin:0px; align:center;"',
        optionName = ['data-type', 'data-theme'],
        optionData = ['', this.dataTheme],
        i = 0,
        name = 0;

    var defaults = {
        radioName : radioId + 'Name',
        horizontal : false,
        theme : this.dataTheme
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}

    if (defaults.horizontal) {
        html += 'data-theme="' + defaults.theme + '" data-type="horizontal">';
    } else {
        html += 'data-theme="' + defaults.theme + '">';
    }

    for (i = 0; i < labels.length; i += 1) {
        html += '<input type="radio"name="' + defaults.radioName + '" id="' + radioId + i + '" value="' + values[i] + '" ';
        html += 'data-theme="' + defaults.theme + '" class="custom" ';
        if (i === 0) {
            html += 'checked="checked" />';
        } else {
            html += '/>';
        }
        html += '<label for="' + radioId + i + '">' + labels[i] + '</label>';
    }
    html += '</fieldset>';
    rootDiv.append(html);
    rootDiv.trigger('create');
    return $('input[name=' + defaults.radioName + ']:radio');

};

/**
 * 셀렉트 자동 생성
 * Auto Create about Select.
 * @method autoSelect
 * @param {String} divId - root div id about HTML tag attribute [상위 DIV 아이디]
 * @param {String} selectId - radiobox ids about HTML tag attribute  [생성될 버튼 아이디]
 * @param {String} selectName - radiobox name [셀렉트 이름]
 * @param {Array} text - radiobox label names [셀렉트 텍스트]
 * @param {Array) values - radiobox values [셀렉트 값]
 * @param {Array} options (option) - firstName, theme, corners, inline
                                     [values : ''(default), 'a'~'g'(default: this.dataTheme), true(default) | false, true | false(default)]
 * @return {jQuery Object} user interface id object [제이쿼리 아이디 객체]
 */
OGDSM.eGovFrameUI.prototype.autoSelect = function (rootDivId, selectId, selectName, text, values, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId), html = null, i = 0, name = null;
    var defaults = {
        firstName : '',
        theme : this.dataTheme,
        corners : true,
        inline : false,
        selected : 0
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    html = '<select name="' + selectName + '" id="' + selectId + '" ' +
           'data-theme="' + defaults.theme + '" data-corners="' + defaults.corners + '" data-inline="' + defaults.inline + '">';
    html += '<option value=""> ' + defaults.firstName + '</option>';

    for (i = 0; i < text.length; i += 1) {
        html += '<option value="' + values[i] + '">' + text[i] + '</option>';
    }
    html += '</select>';
    html += '</fieldset>';
    rootDiv.append(html);
    $('#' + selectId).val(defaults.selected);
    rootDiv.trigger('create');
    return $('#' + selectId);
};

/**
 * 스위치 자동 생성 (수정)
 * Auto Create about Switch based on Select.
 * @method autoSelect
 * @param {String} divId - root div id about HTML tag attribute [상위 DIV 아이디]
 * @param {String} switchId - radiobox ids about HTML tag attribute  [생성될 스위치 아이디]
 * @param {String} switchName - radiobox name [셀렉트 이름]
 * @param {Array} options (option) - theme (0), track theme (1)
                                     [values : 'a'~'g'(default: this.dataTheme), 'a'~'g'(default: this.dataTheme)]
                                     [ 배열인자 옵션: 테마(0), 트랙 테마(1)]
 * @return {jQuery Object} user interface id object [제이쿼리 아이디 객체]
 */
OGDSM.eGovFrameUI.prototype.autoSwitch = function (rootDivId, switchId, switchName, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : null;
    var rootDiv = $('#' + rootDivId),
        html = '<select name="' + switchName + '" id="' + switchId + '" data-role="slider" data-inline="true" ',
        optionName = ['data-theme', 'data-track-theme'],
        optionData = [this.dataTheme, this.dataTheme],
        i = 0;

    if (options !== null) {
        if (typeof (options[1]) !== 'undefined') {
            optionData[1] = options[1];
        }
        optionData[0] = options[0];
        for (i = 0; i < options.length; i += 1) {
            html += optionName[i] + '="' + optionData[i] + '" ';
        }
    }
    html += '>';
    html += '<option value="off">Off</option>';
    html += '<option value="on">On</option>';
    html += '</select>';
    rootDiv.append(html);
    rootDiv.trigger('create');
    return $('#' + switchId);



};

/**
 * User Interface Create about time input (Time Input).
 * @method timeInput
 * @param {String} divId - div id about HTML tag attribute
 * @return {jQuery Object} User Interface Time Input Object (Time)
 */
OGDSM.eGovFrameUI.prototype.timeInput = function (divId) {
    'use strict';
    var rootDiv, html;
    rootDiv = $('#' + divId);
    html = '<input type="time" id="timeValue">';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#timeValue');
};

/**
 * User Interface Create about visualization type (Date Input).
 * @method DateInput
 * @param {String} divId - div id about HTML tag attribute
 * @return {jQuery Object} User Interface Date Input Object (Date YYYY/MM/DD)
 */
OGDSM.eGovFrameUI.prototype.dateInput = function (divId) {
    'use strict';
    var rootDiv, html;
    rootDiv = $('#' + divId);
    html = '<input type="date" id="dateValue">';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return $('#dateValue');
};
/**************Custom UI Create *******************/

/**
 * 배경 맵 선택 사용자 인터페이스 자동 생성 (라디오 박스)
 * Auto Create about Map Type User Interface.
 * @method baseMapRadioBox
 * @param {OGDSM Object} OGDSMObj - OpenGDS Mobile Visualization Object [OpenGDS모바일 시각화 객체]
 * @param {String}       rootDiv - Root div id [상위 DIV 아이디]
 * @param {Array}        options - Map type to support [제공할 지도 타입]
 */
OGDSM.eGovFrameUI.prototype.baseMapRadioBox = function (OGDSMObj, rootDiv, options) {
//var mapRadioNameObj = uiTest.autoRadioBox('mapSelect','mapType', 'radioMap', ['OSM','VWorld'], ['OSM','VWorld'], ['h']);
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : null;
    var mapRadioNameObj,
        supportMap;

    if (options !== null) {
        supportMap = options.split(' ');
    }
    mapRadioNameObj = this.autoRadioBox(rootDiv, 'mapType', 'radioMapType', supportMap, supportMap, ['h']);

    mapRadioNameObj.change(function () {
        OGDSMObj.changeBaseMap($(this).val());
    });
};
/**
 * 배경 맵 선택 사용자 인터페이스 자동 생성 (셀렉트)
 * Auto Create about Map Type User Interface.
 * @method baseMapSelect
 * @param {OGDSM Object} OGDSMObj - OpenGDS Mobile Visualization Object [OpenGDS모바일 시각화 객체]
 * @param {String}       rootDiv - Root div id [상위 DIV 아이디]
 * @param {Array}        options - Map type to support [제공할 지도 타입]
 */
OGDSM.eGovFrameUI.prototype.baseMapSelect = function (OGDSMObj, rootDiv, options) {
//var mapRadioNameObj = uiTest.autoRadioBox('mapSelect','mapType', 'radioMap', ['OSM','VWorld'], ['OSM','VWorld'], ['h']);
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : null;
    var mapRadioNameObj,
        supportMap;

    if (options !== null) {
        supportMap = options.split(' ');
    }
    mapRadioNameObj = this.autoSelect(rootDiv, 'mapType', 'selectMapType', supportMap, supportMap, {
        firstName : '맵 선택',
        selected : supportMap[0],
        inline : true
    });
    OGDSMObj.changeBaseMap(supportMap[0]);
    mapRadioNameObj.change(function () {
        OGDSMObj.changeBaseMap($(this).val());
    });
};

/**
 * VWorld WMS API List (Using autoSelect).
 * @method vworldWMSList
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {Array} User Interface selectbox Name, id array ('vworldWMSChk_1', 'vworldWMSChk_2', 'vworldWMSChk_3', 'vworldWMSChk_4', 'vworldWMSChk_5')
 */
OGDSM.eGovFrameUI.prototype.vworldWMSList = function (divId, theme) {
    'use strict';
    var selectTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<fieldset data-role="controlgroup" id="vworldWMS">',
        OGDSM = this.OGDSM,
        selectName = ['vworldWMSChk_1', 'vworldWMSChk_2', 'vworldWMSChk_3', 'vworldWMSChk_4', 'vworldWMSChk_5'],
        selectState = [0, 0, 0, 0, 0],
        styles,
        stylesText,
        i,
        j,
        btnObj;

    styles = [
        'LP_PA_CBND_BUBUN,LP_PA_CBND_BONBUN',
        'LT_C_UQ111', 'LT_C_UQ112', 'LT_C_UQ113', 'LT_C_UQ114',
        'LT_C_UQ121', 'LT_C_UQ122', 'LT_C_UQ123', 'LT_C_UQ124', 'LT_C_UQ125',
        'LT_C_UQ126', 'LT_C_UQ127', 'LT_C_UQ128', 'LT_C_UQ129', 'LT_C_UQ130',
        'LT_C_UQ141', 'LT_C_UQ162', 'LT_C_UD801',
        'LT_L_MOCTLINK', 'LT_P_MOCTNODE',
        'LT_C_LHZONE', 'LT_C_LHBLPN',
        'LT_P_MGPRTFA', 'LT_P_MGPRTFB', 'LT_P_MGPRTFC', 'LT_P_MGPRTFD',
        'LT_L_SPRD', 'LT_C_SPBD',
        'LT_C_ADSIDO', 'LT_C_ADSIGG', 'LT_C_ADEMD', 'LT_C_ADRI',
        'LT_C_TDWAREA',
        'LT_C_DAMDAN', 'LT_C_DAMYOD', 'LT_C_DAMYOJ', 'LT_C_DAMYUCH',
        'LT_C_RIRSV', 'LT_P_RIFCT',
        'LT_P_UTISCCTV', 'LT_C_USFSFFB',
        'LT_L_FRSTCLIMB', 'LT_P_CLIMBALL', 'LT_L_TRKROAD', 'LT_P_TRKROAD',
        'LT_C_WKMBBSN', 'LT_C_WKMMBSN', 'LT_C_WKMSBSN', 'LT_C_WKMSTRM',
        'LT_C_ASITSOILDRA', 'LT_C_ASITDEEPSOIL', 'LT_C_ASITSOILDEP', 'LT_C_ASITSURSTON',
        'LT_L_AISROUTEU', 'LT_L_AISPATH', 'LT_C_AISALTC', 'LT_C_AISRFLC', 'LT_C_AISACMC', 'LT_C_AISCTRC',
        'LT_C_AISMOAC', 'LT_C_AISADZC', 'LT_C_AISPRHC', 'LT_C_AISFIRC', 'LT_C_AISRESC', 'LT_C_AISDNGC',
        'LT_C_AISTMAC', 'LT_C_AISCATC', 'LT_P_AISBLDG40F', 'LT_L_AISSEARCHL,LT_P_AISSEARCHP',
        'LT_L_AISVFRPATH,LT_P_AISVFRPATH', 'LT_P_AISVFRPT,LT_P_AISVFRPT_SW,LT_P_AISVFRPT_SN',
        'LT_L_AISCORRID_YS,LT_L_AISCORRID_GJ,LT_P_AISCORRID_YS,LT_P_AISCORRID_GJ', 'LT_P_AISHCSTRIP'];
    stylesText = [
        '지적도',
        '도시지역', '관리지역', '농립지역', '자연환경보전지역',
        '경관지구', '미관지구', '고도지구', '방화지구', '방재지구',
        '보존지구', '시설보호지구', '취락지구', '개발진흥지구', '특정용도제한지구',
        '국토계획구역', '도시자연공원구역', '개발제한구역',
        '교통링크', '교통노드',
        '사업지구경계도', '토지이용계획도',
        '아동안전지킴이집', '노인복지시설', '아동복지시설', '기타보호시설',
        '새주소도로', '새주소건물',
        '광역시도', '시군구', '읍면동', '리',
        '보행우선구역',
        '단지경계', '단지용도지역', '단지시설용지', '단지유치업종',
        '저수지', '수리시설',
        '교통CCTV', '소방서관할구역',
        '등산로', '등산로시설', '둘레길링크', '산책로분기점',
        '대권역', '중권역', '표준권역', '하천망',
        '배수등급', '심토토성', '유효토심', '자갈함량',
        '제한고도', '항공로', '경계구역', '공중급유구역', '공중전투기동훈련장', '관제권',
        '군작전구역', '방공식별구역', '비행금지구역', '비행정보구역', '비행제한구역', '위험구역',
        '접근관제구역', '훈련구역', '건물군(40층이상)', '수색비행장비행구역',
        '시계비행로', '시계비행보고지점',
        '한강회랑', '헬기장'];

    rootDiv.append(html);
    for (j = 0; j < selectName.length; j += 1) {
        this.autoSelect("vworldWMS", selectName[j], selectName[j], stylesText, styles, {
            firstName : (j + 1) + '번째 레이어 선택'
        });
    }

    $("#" + selectName[0]).change(function () {
        selectState[0] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[1]).change(function () {
        selectState[1] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[2]).change(function () {
        selectState[2] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[3]).change(function () {
        selectState[3] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    $("#" + selectName[4]).change(function () {
        selectState[4] = this.selectedIndex;
        $("#" + selectName[0] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[1] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[2] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[3] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        $("#" + selectName[4] + ' option').each(function () {
            $(this).removeAttr('disabled');
        });
        for (j = 0; j < selectState.length; j += 1) {
            for (i = 0; i < selectName.length; i += 1) {
                $("#" + selectName[i] + ' option:eq(' + selectState[j] + ')').attr("disabled", "disabled");
            }
        }
    });
    return selectName;
};

OGDSM.eGovFrameUI.prototype.seoulEnvironment = function (divId, theme) {
    'use strict';
    theme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme;
    var environmentImages = [
        '<img src="images/input_bt_pm10.png" width=30>',
        '<img src="images/input_bt_pm25.png" width=30>',
        '<img src="images/input_bt_so2.png" width=30>',
        '<img src="images/input_bt_o3.png" width=30>',
        '<img src="images/input_bt_no2.png" width=30>',
        '<img src="images/input_bt_co.png" width=30>'
    ],
        environmentValues = ['PM10', 'PM25', 'SO2', 'O3', 'NO2', 'CO'];
    var rootDiv = $('#' + divId),
        visualType = this.autoRadioBox(divId, 'visualType', ['맵', '차트'], ['map', 'chart'], {horizontal : true}),
        date = this.dateInput(divId),
        time = this.timeInput(divId),
        environmentType = this.autoRadioBox(divId, 'envType', environmentImages, environmentValues, {horizontal : true});
    return [visualType, date, time, environmentType];
};


/**
 * User Interface Create about visualization type (Radio Button).
 * @method visTypeRadio
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {String} User Interface Radio Button Name (visualType)
 */
OGDSM.eGovFrameUI.prototype.visTypeRadio = function (divId, theme) {
    'use strict';
    var radioTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">',
        arr = ['map', 'chart'],
        arrText = ['맵', '차트'],
        i;
    for (i = 0; i < arr.length; i += 1) {
        html += '<input type="radio" name="visualType" class="custom" data-theme=' + radioTheme +
								' id="id-' + arr[i] + '" value="' + arr[i] + '" ';
        html += '>' + '<label for="id-' + arr[i] + '">' + arrText[i] + '</label>';
    }
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'visualType';
};

/**
 * User Interface Create about Environment Type (Radio Button).
 * @method envTypeRadio
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} provider - public data provider ('seoul' or 'public') (default : seoul)
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {String} User Interface Radio Button Name (envTypeRadio)
 */
OGDSM.eGovFrameUI.prototype.envTypeRadio = function (divId, prov, theme) {
    'use strict';
    var provider = (typeof (prov) !== 'undefined') ? prov : "seoul",
        radioTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<label for="envValue">환경정보:</label>' +
            '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">',
        envTypes = ['pm10', 'pm25', 'so2', 'o3', 'no2', 'co'],
        envTypeValues,
        i;
    if (provider === 'seoul') {
        envTypeValues = ['PM10', 'PM25', 'SO2', 'O3', 'NO2', 'CO'];
    } else if (provider === 'public') {
        envTypeValues = ['pm10Value', 'pm25Value', 'so2Value', 'o3Value', 'no2Value', 'coValue'];
    }
    for (i = 0; i < envTypes.length; i += 1) {
        html += '<input type="radio" name="envTypeRadio" class="custom" data-theme=' + radioTheme +
            ' id="id-' + envTypeValues[i] + '" value="' + envTypeValues[i] + '"/>' +
            '<label for="id-' + envTypeValues[i] + '">' +
            '<img src="images/input_bt_' + envTypes[i] + '.png" width=30>' +
            '</label>';
        if (i !== 0 && (i + 1) % 3 === 0) {
            html += '</fieldset>' +
                '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
        }
    }
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'envTypeRadio';
};
/**
 * User Interface Create about Area Type (Radio Button).
 * @method areaTypeRadio
 * @param {String} divId - div id about HTML tag attribute
 * @param {String} theme - eGovframework theme a~g (default constructor)
 * @return {String} User Interface Radio Button Attribute Name Value (areaTypeRadio)
 */
OGDSM.eGovFrameUI.prototype.areaTypeRadio = function (divId, theme) {
    'use strict';
    var radioTheme = (typeof (theme) !== 'undefined') ? theme : this.dataTheme,
        rootDiv = $('#' + divId),
        html = '<label for="areaValue">지역:</label>' +
            '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">',
        areaTypes = ['인천', '서울', '경기', '강원', '충남', '세종', '충북', '대전', '경북', '전북', '대구', '울산', '전남', '광주', '경남', '부산', '제주'],
        i;
    for (i = 0; i < areaTypes.length; i += 1) {
        html += '<input type="radio" name="areaTypeRadio" class="custom" data-theme=' + this.dataTheme +
            ' id="id-' + areaTypes[i] + '" value="' + areaTypes[i] + '"/>' +
            '<label for="id-' + areaTypes[i] + '">' + areaTypes[i] + '</label>';
        if (i !== 0 && (i + 1) % 3 === 0) {
            html += '</fieldset>' +
                '<fieldset data-role="controlgroup" data-type="horizontal" class="egov-align-center">';
        }
    }
    html += '</fieldset>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'areaTypeRadio';
};
/**
 * User Interface Create about Map List (Select).
 * @method mapListSelect
 * @param {String} divId - div id about HTML tag attribute
 * @param {Array} arr - Select Box Option List
 * @return {String} Select Box Id Value
 */
/*
OGDSM.eGovFrameUI.prototype.mapListSelect = function (divId, arr) {
    'use strict';
    var html, i,
        rootDiv = $('#' + divId);
    console.log(arr);
    html =
        '<select name="geoServerSelectBox" id="geoServerSelectBox" data-theme=' + this.dataTheme + '>' +
        '<option value=""></option>';
    for (i = 0; i < arr.length; i += 1) {
        html += '<option value="' + arr[i] + '">' +
            arr[i] + '</option>';
    }
    html += '</select>';
    rootDiv.append(html);
    rootDiv.trigger("create");
    return 'geoServerSelectBox';
};
*/

/*jslint devel: true, vars : true plusplus : true*/
/*global $, jQuery, ol, OGDSM, d3, Sortable*/
OGDSM.namesapce('mapLayerList');

(function (OGDSM) {
    "use strict";
    var arrlayerObjs = [], arrlabels = [];
    /**
     * 오픈레이어 맵 레이어 목록 객체
     * OpenLayers3 Map layer list class
     * @class OGDSM.mapLayerList
     * @constructor
     * @param {OGDSM.visualization} obj - OGDSM visualization object
     * @param {String} listDiv - List div name
     */
    OGDSM.mapLayerList = function (obj, listDiv) {
        this.listDiv = listDiv;
        this.visualizationObj = obj;
        var thisObj = this;
        var handleList = null, listSize = 200, buttonSize = 120,
            element = document.getElementById(listDiv),
            listElement = document.createElement('div'),
            buttonElement = document.createElement('div'),
            listTitleElement = document.createElement('div'),
            listRootElement = document.createElement('div'),
            listUlElement = document.createElement('ul'),
            btnText = '레이어목록 보이기',
            elementCSS = 'position : absolute; background : rgba(255,255,255,0.0); top: 0px;  z-index : 1;',
            olCustomListCSS = 'float : left; padding : 1px;	background : rgba(255,255,255,0.0); ' +
            'width : ' + listSize + 'px;',
            olCustomButtonCSS = 'cursor:pointer; position : absolute; width:' + buttonSize + 'px; height: 50px;',
            listTitleCSS = 'width: 100%; text-align:center;',
            listUlCSS = 'list-style:none; padding:0; margin:0;',
            listSlideHideCSS = elementCSS + ' left: ' + -(listSize + 3) + 'px; transition: left 0.1s ease;',
            listSlideShowCSS = elementCSS + ' left: 0px; transition: left 0.1s ease;',
            buttonFontShowCSS = 'font-size : 90%; font-weight : bold; color : rgba(0, 0, 0,1.0); text-align:center;',
            buttonFontHideCSS = 'font-size : 90%; font-weight : bold; color : rgba(0, 0, 0,.5); text-align:center;',
            buttonSlideShowCSS = olCustomButtonCSS + 'background: rgba(255, 255, 255, 0.5); left:' + (listSize + 2) + 'px; ' +
            'transition : background 0.1s ease, left 0.1s ease;' + buttonFontShowCSS,
            buttonSlideHideCSS = olCustomButtonCSS + 'background: rgba(0, 0, 0, .0); left:' + (listSize - buttonSize) + 'px; ' +
            'transition : background 0.1s ease, left 0.1s ease;' + buttonFontHideCSS;

        handleList = function (e) {
            var listControl = document.getElementById('listControl');
            if (btnText === '레이어목록 보이기') {
                btnText = '레이어목록 숨기기';
                element.style.cssText = listSlideShowCSS;
                buttonElement.style.cssText = buttonSlideHideCSS;

            } else {
                btnText = '레이어목록 보이기';
                element.style.cssText = listSlideHideCSS;
                buttonElement.style.cssText = buttonSlideShowCSS;
            }
            buttonElement.innerHTML = btnText;
        };

        buttonElement.addEventListener('click', handleList, false);
        buttonElement.addEventListener('touchstart', handleList, false);

        element.style.cssText = listSlideHideCSS;
        listElement.id = listDiv + 'Root';
        listElement.style.cssText = olCustomListCSS;

        listTitleElement.style.cssText = listTitleCSS;
        listTitleElement.setAttribute('class', 'ui-body-a');
        listTitleElement.innerHTML = '<h4>레이어 목록</h4>';

        listRootElement.id = listDiv + 'Div';
        listUlElement.id = listDiv + 'Contents';
        listUlElement.style.cssText = listUlCSS;

        listElement.appendChild(listTitleElement);
        listElement.appendChild(listRootElement);
        listRootElement.appendChild(listUlElement);

        buttonElement.id = listDiv + 'Button';
        buttonElement.className = 'ol-unselectable';
        buttonElement.style.cssText = buttonSlideShowCSS;
        buttonElement.innerHTML = btnText;
        buttonElement.setAttribute('data-role', 'button');

        element.appendChild(listElement);
        element.appendChild(buttonElement);


        this.ulObj = Sortable.create(document.getElementById(this.listDiv + 'Contents'), {
            animation: 150,
            handle: '.drag-handle',
            onUpdate : function (evt) {
                var labels = thisObj.getLabels(), i,
                    objs = thisObj.getLayersObj(),
                    ogdsmObj = thisObj.getVisualizationObj(),
                    length = labels.length - 1,
                    layers = ogdsmObj.getMap().getLayers(),
                    changeValue = labels[length - evt.oldIndex],
                    changeObj = objs[length - evt.oldIndex];
                if (evt.oldIndex > evt.newIndex) {
                    for (i = length - evt.oldIndex; i < length - evt.newIndex; i++) {
                        labels[i] = labels[i + 1];
                        objs[i] = objs[i + 1];
                    }
                    labels[length - evt.newIndex] = changeValue;
                    objs[length - evt.newIndex] = changeObj;
                } else {
                    for (i = length - evt.oldIndex; i > length - evt.newIndex; i--) {
                        labels[i] = labels[i - 1];
                        objs[i] = objs[i - 1];
                    }
                    labels[length - evt.newIndex] = changeValue;
                    objs[length - evt.newIndex] = changeObj;
                }

                for (i = 0; i < objs.length; i++) {
                    layers.setAt(i + 1, objs[i]);
                }
                thisObj.setLayersObj(objs);
                thisObj.setLabels(labels);
            }
        });
    };
    OGDSM.mapLayerList.prototype = {
        constructor : OGDSM.mapLayerList,
        getLayersObj : function () {
            return arrlayerObjs;
        },
        setLayerObj : function (obj) {
            arrlayerObjs.push(obj);
        },
        setLayersObj : function (objs) {
            arrlayerObjs = objs;
        },
        getLabels : function () {
            return arrlabels;
        },
        setLabel : function (label) {
            arrlabels.push(label);
        },
        setLabels : function (labels) {
            arrlabels = labels;
        },
        getVisualizationObj : function () {
            return this.visualizationObj;
        },
        getThis : function () {
            return this;
        }
    };
    return OGDSM.mapLayerList;
}(OGDSM));
/**
 * 레이어 목록 관리 - (이름 변경 및 레이어 내용 변경...)
 * list Management.
 * @method listManager
 * @param {ol3 layer object} obj - openlayers3 layer object to be added
 * @param {String} label - list name
 * @param {String} color - rgb color (ex: rgb(255,255,255))
 * @param {String} type - object type (polygon | point | line)
 */
OGDSM.mapLayerList.prototype.listManager = function (obj, label, color, type) {
    'use strict';
    type = (typeof (type) !== 'undefined') ? type : null;
    var i, olList = $('#' + this.listDiv + 'Contents'),
        thisObj = this,
        labels = this.getLabels(),
        objs = this.getLayersObj(),
        ogdsmObj = this.visualizationObj;
    this.setLayerObj(obj);
    this.setLabel(label);
    function sliderEvent(e, u) {
        var layerName = e.currentTarget.getAttribute('data-label'),
            opacityValue = e.currentTarget.value,
            layerObj = ogdsmObj.layerCheck(layerName);
        layerObj.setOpacity(opacityValue / 100.0);
    }
    function deleteEvent(e, u) {
        var layerName = e.currentTarget.getAttribute('data-label');
        var labels = thisObj.getLabels();
        var layerNum = $.inArray(layerName, labels);
        ogdsmObj.removeMap(layerName);
        labels.splice(layerNum, 1);
        objs.splice(layerNum, 1);
        thisObj.setLayersObj(objs);
        thisObj.setLabels(labels);
        $('#layer' + layerName).remove();
        $('#popup' + layerName).hide();
    }
    function checkBoxEvent(e, u) {
        var layerName = e.currentTarget.getAttribute('data-label');
        if (!e.currentTarget.checked) {
            ogdsmObj.setVisible(layerName, false);
        } else {
            ogdsmObj.setVisible(layerName, true);
        }
    }
    var sublabel = label;
    if (label.length > 8) {
        sublabel = sublabel.substr(0, 8) + '...';
    }

    olList.prepend('<li id="layer' + label + '" style="float:left">' +
                   '<div style="width:15%; float:left; margin-top:4px;">' +
                   '<canvas id="' + label + 'canvas" width="100%" height=30px; class="drag-handle" ></canvas>' +
                   '</div> <div style="width:70%; float:left; padding:0px; margin:0px;">' +
                   '<input type="checkbox" name="listCheckBox" data-corners="false" data-mini="true" style="width:100px;" class="custom" ' +
                   'id="' + 'visualSW' + thisObj.getLabels().length + '" data-label="' + label + '" checked/>' +
                   '<label for="' + 'visualSW' + thisObj.getLabels().length + '">' + sublabel + '</label>' +
                   '</div> <div style="width:15%; float:left; padding:0px; margin:0px;">' +
                   '<a data-role="button" data-rel="popup" data-theme="b" data-corners="false" data-mini="true" data-transition="pop"' +
                   'data-label="' + label + '" href="#popup' + label + '">　</a>' +
                   '</div>' +
                   '<div data-role="popup" id="popup' + label + '" style="width:' + 200 + 'px">' +
                   '<input type="range" value="100" min="0" max="100" data-highlight="true" class="layer-manager"' +
                   'id="' + label + 'slider" data-label="' + label + '">' +
                   '<a data-role="button" data-theme="f" data-mini="true"' +
                   'id="' + label + 'delete" data-label="' + label + '">Delete</a>' +
                   '</div>' +
                   '</li>');

    var labelCanvas = document.getElementById(label + 'canvas').getContext('2d');
    if (type === 'polygon') {
        labelCanvas.fillStyle = color;
        labelCanvas.fillRect(5, 5, 20, 20);
        labelCanvas.strokeRect(5, 5, 20, 20);
    } else if (type === 'point') {
        labelCanvas.beginPath();
        labelCanvas.arc(15, 15, 12, 0, 2 * Math.PI);
        labelCanvas.fillStyle = color;
        labelCanvas.fill();
        labelCanvas.stroke();
    } else if (type === 'line') {
        labelCanvas.moveTo(5, 5);
        labelCanvas.lineTo(20, 20);
        labelCanvas.strokeStyle = color;
        labelCanvas.stroke();
    } else {
        labelCanvas.fillStyle = 'rgb(0, 0, 0)';
        labelCanvas.fillRect(5, 5, 20, 20);
        labelCanvas.strokeRect(5, 5, 20, 20);
    }
    $('#layer' + label).trigger('create');
    $('#' + label + 'slider').bind('change', sliderEvent);
    $('#' + label + 'delete').bind('click', deleteEvent);
    $('input[name=listCheckBox]').bind('click', checkBoxEvent);
};

/*jslint devel: true, vars : true plusplus : true*/
/*global $, jQuery, ol, OGDSM*/

OGDSM.namesapce('attributeTable');
(function (OGDSM) {
    'use strict';
    /**
     * 속성정보 시각화 객체
     *
     * @class OGDSM.attributeTable
     * @constructor
     * @param {String} RootDiv - Attribute table div name
     * @param {String} addr - PostgreSQL connect address
     */
    OGDSM.attributeTable = function (rootDiv, addr) {
        this.rootDiv = rootDiv;
        this.addr = addr;
        var rootElement = document.getElementById(rootDiv),
            ulElement = document.createElement('ul'),
            contentsElement = document.createElement('div');
        var contentsCSS = 'width: 100%; height: 100%; background: rgba(255, 255, 255, 1); margin: 0px;',
            ulCSS = 'list-style: none; position: relative; margin: 0px; z-index: 2; top: 1px; display: table; border-left: 1px solid #f5ab36;';

        ulElement.id = rootDiv + 'Tab';
        ulElement.style.cssText = ulCSS;

        contentsElement.id = rootDiv + 'Contents';
        contentsElement.style.cssText = contentsCSS;

        rootElement.appendChild(ulElement);
        rootElement.appendChild(contentsElement);
    };
    OGDSM.attributeTable.prototype = {
        constructor : OGDSM.attributeTable
    };
    return OGDSM.attributeTable;
}(OGDSM));

/**
 * 속성 정보 추가
 * Add attribute table (Connect PostgreSQL)
 * @method addAttribute
 * @param {String}  layerName   - Database table name
 */
OGDSM.attributeTable.prototype.addAttribute = function (layerName) {
    'use strict';
    var rootDiv = this.rootDiv,
        tabs = $('#' + rootDiv + 'Tab'),
        contents = $('#' + rootDiv + 'Contents');
    var aBaseCSS = 'background:#ffd89b; color: #222; display:block; padding:6px 15px; text-decoration:none; border-right:1px solid #f5ab36;' +
               'border-top:1px solid #f5ab36; border-right:1px solid #f5ab36; margin:0;',
        backgroundNotSelected = '#ffd89b',
        colorNotSelected = '#222',
        backgroundSelected = '#fff',
        colorSelected = '#344385',
        borderSelected = '1px solid #fff';
    function tabClickEvent(e) {
        $('#' + rootDiv + 'Tab a').css('border-bottom', '');
        $('#' + rootDiv + 'Tab a').css('color', colorNotSelected);
        $('#' + rootDiv + 'Tab a').css('background', backgroundNotSelected);
        $(e.currentTarget).css('border-bottom', borderSelected);
        $(e.currentTarget).css('background', backgroundSelected);
        $(e.currentTarget).css('color', colorSelected);
        $('.attrTable').hide();
        $('#divAttrTable' + layerName).css('display', 'block');
    }
    tabs.prepend('<li id="attrTab' + layerName + '" style="float:left;"><a href="#" style="' + aBaseCSS + '">' + layerName + '</a></li>');
    $('#' + rootDiv + 'Tab a').css('border-bottom', '');
    $('#' + rootDiv + 'Tab a').css('color', colorNotSelected);
    $('#' + rootDiv + 'Tab a').css('background', backgroundNotSelected);
    $('#attrTab' + layerName + ' a').css('border-bottom', borderSelected);
    $('#attrTab' + layerName + ' a').css('background', backgroundSelected);
    $('#attrTab' + layerName + ' a').css('color', colorSelected);

    var attrDivHeight = $('#' + rootDiv + 'Contents').height();
    contents.prepend('<div id="divAttrTable' + layerName + '" class="attrTable"><table id="attrTable' + layerName + '" class="display compact" cellspacing="0" width="100%">' +
                     '<thead style="width:100%;"><tr></tr></thead>' +
                     '<tbody></tbody></table></div>');

    $('.attrTable').hide();
    $('#divAttrTable' + layerName).css('display', 'block');
    $('#attrTab' + layerName + ' a').bind('click', tabClickEvent);
    var parm = '{"tableName":"' + layerName + '"}';
    parm = JSON.parse(parm);
    function createTableCol(attrContents, i, tableBody, tableTh) {
        $.each(attrContents, function (key, value) {
            if (key === 'geom') {
                return true;
            }
            if (i === 0) {
                tableTh.append('<th>' + key + '</th>');
            }
            var newCell = tableBody.find('tr:last');
            newCell.append('<td>' + value + '</td>');
        });
    }
    $.ajax({
        type : 'POST',
        url : this.addr,
        data : JSON.stringify(parm),
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            var attrContents = msg.data, i = 0;
            if (attrContents === null) {
                console.log('Not attribute information');
                return -1;
            }
            var tableDiv = $('#attrTable' + layerName),
                tableTh = tableDiv.find('thead').find('tr'),
                tableBody = tableDiv.find('tbody');
            for (i = 0; i < attrContents.length; i++) {
                tableBody.append('<tr>');
                createTableCol(attrContents[i], i, tableBody, tableTh);
                tableBody.append('</tr>');
            }

            var thHeight = $('thead').height() + 7;
            $('#attrTable' + layerName).DataTable({
                'paging' : false,
                'scrollY' : attrDivHeight - thHeight,
                'scrollX' : true,
                'scrollCollapse' : true,
                'bFilter' : false
            });

            $(window).on('resize', function () {
                var attrDivHeight = $('#' + rootDiv + 'Contents').height();
                var thHeight = $('thead').height() + 7;
                $('.divAttrTable table').DataTable({
                    'paging' : false,
                    'scrollY' : attrDivHeight - thHeight,
                    'scrollX' : true,
                    'scrollCollapse' : true,
                    'bFilter' : false
                });
            });
        },
        error : function (e) {
            console.log(e);
        }
    });
};
