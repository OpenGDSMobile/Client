/*jslint devel: true, vars : true */
/*global $, jQuery, ol*/
/*
 * OpenGDS Mobile JavaScript Library
 * Released under the MIT license
 */
var OGDSM = OGDSM || {};
/**
* OGDSM
* --
* 객체(Classes)
*  - attributeTable
*  - eGovFrameUI
*  - externalConnection
*  - mapLayerList
*  - visulaization
*
* @class OGDSM
*/
OGDSM = (function (window, $) {
    'use strict';
    /**
    * OGDS Mobile Super Class
    * @class OGDSM
    * @constructor
    */
    OGDSM.prototype = {
        constructor : OGDSM,
        version : '1.2'
    };
    return OGDSM;
}(window, jQuery));

/**
* OGDSM 네임스페이스 모듈 (OGDSM 'namespace' module)
*
* - 사용 방법 (Use)
*       OGDSM.namesace('example');
*       OGDSM.example=(function(){
*         //Source Code
*       }());
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
 * OGDSM JSON 객체 배열 변환 모듈 (OGDSM json to Array module)
 * - 사용 방법(Use)
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
 * OGDSM Layer list sorting open source
 * Sortable
 * author	RubaXa   <trash@rubaxa.org>
 * license MIT
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
	 * class  Sortable
	 * param  {HTMLElement}  el
	 * param  {Object}       [options]
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
    * @class OGDSM.visualization
    * @constructor
    * @param {String} mapDiv - 지도 DIV 아이디 이름
    * @param {JSON Object} options - 옵션 JSON 객체 키 값{layerListDiv=null, attrTableDiv=null, attrAddr=''}<br>
  layerListDiv : 레이어 관리 리스트 DIV 아이디 이름<br>
  attrTableDiv : 속성 시각화 DIV 아이디 이름<br>
  attrAddr : 속성 시각화 서버 주소<br>
    */
    OGDSM.visualization = function (mapDiv, options) {
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
         * @method getMap
         * @return {ol.Map} 오픈레이어3 객체
         */
        getMap : function () {
            return this.mapObj;
        },
        /**
         * 지도 레이어 존재 여부 확인
         * @method layerCheck
         * @param {String} layerName - 레이어 이름
         * @return {OpenLayer3 Layer Object | Boolean} 레이어가 있을 경우 : 레이어 객체, 없을 경우 : false
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
         * @method indexOf
         * @param {ol3 layers object} layers - 레이어 객체
         * @return {Number} 레이어 인덱스 값
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
 * @method olMapView
 * @param {Array}  latlng  - 지도 초기 위,경도 값 (옵션) [default=[37.582200, 127.010031] ]
 * @param {String} mapType - 배경 지도 초기 값 (옵션) [default='OSM']
 * @param {String} baseProj  - 지도 투영 값 (옵션)   [default='EPSG:3857']
 * @return {ol.Map} openlayers3 ol.Map 객체
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
 * @method changeBaseMap
 * @param {String} mapStyle - 지도 스타일 이름 ("OSM" | "VWorld" | "VWorld_m" | "VWorld_h")
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
 * @method trackingGeoLocation
 * @param {boolean} sw - Geolocation 스위치 (true | false)
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
 * 해상도에 맞는 지도 레이아웃
 * @method updateLayoutSetting
 * @param {String} mapDiv - 지도 DIV 아이디 이름
 **/
OGDSM.visualization.prototype.updateLayoutSetting = function (mapDiv) {
    'use strict';
    mapDiv = (typeof (mapDiv) !== 'undefined') ? mapDiv : this.mapDiv;
    if (typeof (this.mapObj) !== 'undefined') {
        this.mapObj.updateSize();
    }
};
/**
 * WMS 및 WFS 맵 레이어 추가
 * @method addMap
 * @param {ol Map Object} data - 오픈레이어3 지도 객체
 * @param {String} type - WFS 객체 타입 [default=polygon | point]
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
 * @method imageLayer
 * @param {String} imgURL - 이미지 주소
 * @param {String} imgTitle - 이미지 타이틀
 * @param {Array} imgSize - 이미지 사이즈 [width, height]
 * @param {Array} imgExtent - 이미지 위치 [lower left lon, lower left lat, upper right lon, upper right lat] or [left, bottom, right, top]
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
 * @method removeMap
 * @param {String} layerName - 레이어 이름
 */
OGDSM.visualization.prototype.removeMap = function (layerName) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        this.getMap().removeLayer(obj);
        if (typeof (this.layerListObj) !== 'undefined') {
            this.layerListObj.removelist(layerName);
        }
    }
};
/**
 * 맵 레이어 시각화 여부
 * @method setVisible
 * @param {String} layerName - 레이어 이름
 * @param {Boolean} flag - 시각화 스위치 [true | false}
 */
OGDSM.visualization.prototype.setVisible = function (layerName, flag) {
    'use strict';
    var obj = this.layerCheck(layerName);
    if (obj !== false) {
        obj.setVisible(flag);
    }
};
/**
 * WFS 스타일 변경
 * @method changeWFSStyle
 * @param {String} layerName - 오픈레이어3 레이어 이름
 * @param {Hex Color, String or Array} colors - 변경할 색상
 * @param {JSON Object} options - 옵션 JSON 객체 키 값 {type:'polygon', opt : '0.5', attr: null, range: null, xyData: null}<br>
  type(String) : 객체 타입 (polygon, point)<br>
  opt(Number) : 레이어 투명도 <br>
  attr(String) : 속성 이름 <br>
  range(Array) : 색상 범위<br>
  xyData(Array) : 색상 데이터<br>
 */
OGDSM.visualization.prototype.changeWFSStyle = function (layerName, colors, options) {
    'use strict';
    var i = null, name,
        map = this.layerCheck(layerName),
        styleCache = {},
        style = null;
    options = (typeof (options) !== 'undefined') ? options : {};
    var defaults = {
        type : 'polygon',
        opt : 0.5,
        attr : null,
        range : null,
        xyData : null
    };

    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
    }
    if (map === false) {
        console.error('Not Map Layer');
        return -1;
    }
    map.setStyle(function (f, r) {
        var i,
            j,
            color = '#FFFFFF',
            text = r < 5000 ? f.get(defaults.attr) : '';
        if (!styleCache[text]) {
            if (Array.isArray(colors)) {
                for (i = 0; i < defaults.xyData[1].length; i += 1) {
                    if (text === defaults.xyData[1][i]) {
                        for (j = 0; j < defaults.range.length; j += 1) {
                            if (defaults.xyData[0][i] <= defaults.range[j]) {
                                color = colors[j];
                                break;
                            }
                        }
                    }
                }
            } else {
                color = colors;
            }
            if (defaults.type === 'polygon') {
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
            } else if (defaults.type === 'point') {
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
    map.setOpacity(defaults.opt);
};
/**
 * 가로 막대 차트 시각화
 * @method barChart
 * @param {String} divId - 막대 차트 시각화할 DIV 아이디 이름
 * @param {Array} data - 데이터 값 2차원 배열 (0 : x, 1 : y)
 * @param {Array} range - 데이터 범위 1차원 배열
 * @param {Array} color - 데이터 색 범위 1차원 배열 [default=#000000 (range와 배열 길이 같아야함)]
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

/** GeoServer, Public data, VWorld Connect Class **/
/*jslint devel: true, vars : true */
/*global $, jQuery, ol, OGDSM*/
OGDSM.namesapce('externalConnection');
(function (OGDSM) {
    'use strict';
    /**
     * 외부 데이터 접속 요청 객체
     * @class OGDSM.externalConnection
     * @constructor
     */
    OGDSM.externalConnection = function () {

    };
    OGDSM.externalConnection.prototype = {
        constructor : OGDSM.externalConnection
    };
    return OGDSM.externalConnection;
}(OGDSM));

/**
 * GeoServer WFS 데이터 요청 (OpenLayers3 ol.source.GeoJSON)
 * @method geoServerWFSLoad
 * @param {OGDSM Obj} obj - OpenGDS Mobile 시각화 객체
 * @param {String} addr - 주소
 * @param {String} workspace - 워크스페이스
 * @param {String} layerName - 레이어 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{type='polygon', color='rgba(0, 0, 0, 0.0)', callback=function () {}}<br>
  type(String) : 레이어 타입( polygon | point)<br>
  color(String) : 색상 rgba<br>
  callback(Function) : 요청 후 색상 변경시 콜백 함수
 */
OGDSM.externalConnection.prototype.geoServerWFSLoad = function (obj, addr, workspace, layerName, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var fullAddr = addr + '/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeNames=' + workspace + ':' + layerName +
        '&outputFormat=json&srsname=' + obj.baseProj;
    var objStyles, name;
    var defaults = {
        type : 'polygon',
        color : 'rgba(0, 0, 0, 0.0)',
        callback : function (wfslayer) {}
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    if (defaults.type === 'polygon') {
        objStyles = [
            new ol.style.Style({
                fill : new ol.style.Fill({
                    color : defaults.color
                }),
                stroke : new ol.style.Stroke({
                    color : 'rgba(0, 0, 0, 1.0)',
                    width : 1
                })
            })];
    } else if (defaults.type === 'point') {
        objStyles = [
            new ol.style.Style({
                image : new ol.style.Circle({
                    radius : 5,
                    fill : new ol.style.Fill({
                        color : defaults.color
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
    layerName = layerName.replace(/[ \{\}\[\]\/?.,;:|\)*~`!^\-+┼<>@\#$%&\'\"\\\(\=]/gi,'');
    $.ajax({
        type : 'POST',
        url : fullAddr,
        crossDomain: true,
        dataType : 'json',
        success : function (msg) {
            var wfsLayer = new ol.layer.Vector({
                title : layerName,
                source : new ol.source.GeoJSON({
                    object: msg
                }),
                style : objStyles
            });
            obj.addMap(wfsLayer, defaults.type);
            $.mobile.loading('hide');
            defaults.callback(wfsLayer);
        },
        error : function (e) {
            console.log(e);
        }
    });
};
/**
 * GeoServer WFS 요청 (OpenLayers3 ol.source.ServerVector)
 * @method geoServerWFS
 * @param {String} addr - 주소
 * @param {String} ws - 워크스페이스
 * @param {String} layerName - 레이어 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{type='polygon', epsg='epsg3857'}<br>
  type(String) : 레이어 타입( polygon | point)<br>
  epsg(String) : EPSG String<br>
 * @return {ol.layer.Vector} vectorSource - OpenLayers3 백터 객체
 */
OGDSM.externalConnection.prototype.geoServerWFS = function (addr, ws, layerName, options) {
    options = (typeof (options) !== 'undefined') ? options : {};
    var vectorSource, styles, resultData, name;

    var defaults = {
        type : 'polygon',
        epsg : 'epsg3857'
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}

    vectorSource = new ol.source.ServerVector({
        format: new ol.format.GeoJSON(),
        loader: function (extent, resolution, projection) {
            var fullAddr = addr + '/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature' +
                '&typeNames=' + ws + ':' + layerName +
                '&outputFormat=text/javascript&format_options=callback:loadFeatures' +
                '&srsname=' + defaults.epsg + '&bbox=' + extent.join(',') + ',' + defaults.epsg;
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
    if (defaults.type === 'polygon') {
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
    } else if (defaults.type === 'point') {
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
        title : layerName,
        source : vectorSource,
        style: styles
    });
    return resultData;
};
/**
 * VWorld WMS 데이터 요청
 * @method vworldWMSLoad
 * @param {String} apiKey - API 키
 * @param {String} domain - 도메인
 * @param {String} data - WMS 레이어 이름
 * @return {ol.layer.Tile} OpenLayers 타일 객체
 */
OGDSM.externalConnection.prototype.vworldWMSLoad = function (apiKey, domain, data) {
    'use strict';
    data = data.join(',');
    var resultData = new ol.layer.Tile({
        title : 'VWorldWMS',
        source : new ol.source.TileWMS(({
            url : 'http://map.vworld.kr/js/wms.do',
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
};

/**
 * 서울 열린 데이터 광장 환경 데이터 요청
 * @method seoulEnvironmentLoad
 * @param {String} addr - 주소
 * @param {String} apiKey - api 키
 * @param {String} envType - 환경 정보 이름
 * @param {date} date - 날짜
 * @param {time} time - 시간
 * @param {function} callback - 성공 콜백 함수
 */
OGDSM.externalConnection.prototype.seoulEnvironmentLoad = function (addr, apiKey, envType, date, time, callback) {
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
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            resultData = JSON.parse(msg.data);
            $.mobile.loading('hide');
            callback(resultData);
        },
        error : function (e) {
            console.log(e);
            $.mobile.loading('hide');
        }
    });
};


/**
 * 데이터 포털 환경 데이터 요청
 * @method seoulEnvironmentLoad
 * @param {String} addr - 주소
 * @param {String} apiKey - API 키
 * @param {String} envType - 환경 정보 이름
 * @param {date} date - 날짜
 * @param {time} time - 시간
 * @param {function} callback - 성공 콜백 함수
 */
OGDSM.externalConnection.prototype.dataPortalEnvironmentLoad = function (addr, apiKey, envType, area, callback) {
    'use strict';
    var parm = '{"serviceName":"ArpltnInforInqireSvc",' +
            ' "keyValue":"' + apiKey + '",' +
            '"areaType":' + '"' + encodeURIComponent(area) + '",' +
            '"envType":' + '"' + envType + '"}';
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
        contentType : "application/json;charset=UTF-8",
        dataType : 'json',
        success : function (msg) {
            resultData = JSON.parse(msg.data);
            $.mobile.loading('hide');
            callback(resultData);
        },
        error : function (e) {
            console.log(e);
            $.mobile.loading('hide');
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
     * @class OGDSM.eGovFrameUI
     * @constructor
     * @param {String} theme - eGovframework 테마 a~g (default c)
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
 * @method autoButton
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} linkId - 생성될 버튼 아이디 이름
 * @param {String} buttonTitle - 버튼 이름
 * @param {String} url - 링크 주소
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, corners=true, inline=false, mini=false}<br>
  theme(String) : 테마<br>
  corners(Boolean) : 모서리 둥글게 여부<br>
  inline(Boolean) : 가로 정렬 여부<br>
  mini(Boolean) : 버튼 크기<br>
 * @return {jQuery Object} 제이쿼리 아이디 버튼 객체
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
 * @method autoCheckBox
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} chkId - 생성될 체크박스 아이디 이름
 * @param {String | Array} labels - 체크박스 라벨
 * @param {String | Array} values - 체크박스 값
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, horizontal=true, checkName=chkId + 'Name'}<br>
  theme(String) : 테마<br>
  horizontal(Boolean) : 체크박스 수평 여부<br>
  checkName(String) : 체크박스 그룹 이름<br>
 * @return {jQuery Object} 제이쿼리 체크박스 그룹 이름 객체
 */
OGDSM.eGovFrameUI.prototype.autoCheckBox = function (rootDivId, chkId, labels, values, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
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
 * 라디오 박스 자동 생성
 * @method autoRadioBox
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} radioId - 생성될 라디오박스 아이디 이름
 * @param {String | Array} labels - 라디오박스 라벨
 * @param {String | Array} values - 라디오박스 값
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, horizontal=true, radioName=radioId + 'Name'}<br>
  theme(String) : 테마<br>
  horizontal(Boolean) : 라디오박스 수평 여부<br>
  radioName(String) : 라디오박스 그룹 이름<br>
 * @return {jQuery Object} 제이쿼리 그룹 이름 객체
 */
OGDSM.eGovFrameUI.prototype.autoRadioBox = function (rootDivId, radioId, labels, values, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
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
 * @method autoSelect
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} selectId - 생성될 선택 아이디 이름
 * @param {String | Array} text - 선택 라벨 텍스트
 * @param {String | Array} values - 선택 값
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{firstName='', theme=this.dataTheme, corners=true, inline=false, selected:0}<br>
  firstName(String) : 첫번째 값<br>
  theme(String) : 테마<br>
  corners(Boolean) : 테두리 둥글게 여부<br>
  inline(Boolean) : 가로 정렬 여부<br>
  selected(Boolean) : 처음 선택된 인덱스 값<br>
 * @return {jQuery Object} 제이쿼리 그룹 이름 객체
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
 * 스위치 자동 생성
 * @method autoSwitch
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} switchId - 생성될 스위치 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, track_theme=this.dataTheme, switchName=switchId+'Name'}<br>
  theme(String) : 테마<br>
  track-theme(String) : 버튼 테마<br>
  switchName(String) : 스위치 그룹 이름<br>
 * @return {jQuery Object} 제이쿼리 아이디 객체
 */
OGDSM.eGovFrameUI.prototype.autoSwitch = function (rootDivId, switchId, switchName, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var rootDiv = $('#' + rootDivId), name,
        html = '',
        optionName = ['data-theme', 'data-track-theme'],
        optionData = [this.dataTheme, this.dataTheme],
        i = 0;

    var defaults = {
        theme : this.dataTheme,
        track_theme : this.dataTheme,
        switchName : switchId + 'Name'
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    html = '<select name="' + defaults.switchName + '" id="' + switchId + '" data-theme="' + defaults.theme +
           '" data-track-theme="' + defaults.track_theme + '" data-role="slider" data-inline="true">';
    html += '<option value="off">Off</option>';
    html += '<option value="on">On</option>';
    html += '</select>';
    rootDiv.append(html);
    rootDiv.trigger('create');
    return $('#' + switchId);
};

/**
 * 시간 태그 생성
 * @method timeInput
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @return {jQuery Object} 제이쿼리 아이디 이름 객체
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
 * 날짜 태그 생성
 * @method DateInput
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @return {jQuery Object} 제이쿼리 아이디 이름 객체 (Date YYYY/MM/DD)
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
 * 배경 맵 선택 사용자 인터페이스 자동 생성: 라디오 박스
 * @method baseMapRadioBox
 * @param {OGDSM Object} OGDSMObj - OpenGDS모바일 시각화 객체
 * @param {String}       rootDiv - 최상위 DIV 아이디 이름
 * @param {Array}        options - 제공할 지도 타입
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
    mapRadioNameObj = this.autoRadioBox(rootDiv, 'mapType', supportMap, supportMap, ['h']);

    mapRadioNameObj.change(function () {
        OGDSMObj.changeBaseMap($(this).val());
    });
};
/**
 * 배경 맵 선택 사용자 인터페이스 자동 생성: 셀렉트 박스
 * @method baseMapSelect
 * @param {OGDSM Object} OGDSMObj - OpenGDS모바일 시각화 객체
 * @param {String}       rootDiv - 최상위 DIV 아이디 이름
 * @param {Array}        options - 제공할 지도 타입
 */
OGDSM.eGovFrameUI.prototype.baseMapSelect = function (OGDSMObj, rootDiv, options) {
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
 * 브이월드 WMS API 리스트 요청 인터페이스
 * @method vworldWMSList
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {String} theme - 테마 default : this.dataTheme
 * @return {Array} 선택 박스 아이디 이름 배열 ('vworldWMSChk_1', 'vworldWMSChk_2', 'vworldWMSChk_3', 'vworldWMSChk_4', 'vworldWMSChk_5')
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

/**
 * 서울 열린 데이터 광장 환경정보 요청 인터페이스
 * @method seoulEnvironment
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, path='./images/'}
  theme(String) : 테마
  path(String) : 이미지 위치
 * @return {String} 생성된 객체 배열 [visualType, date, time, environmentType]
 */
OGDSM.eGovFrameUI.prototype.seoulEnvironment = function (divId, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var name;
    var defaults = {
        theme : this.dataTheme,
        path : './images/openGDSMobile/'
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    var environmentImages = [
        '<img src="' + defaults.path + 'input_bt_pm10.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_pm25.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_so2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_o3.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_no2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_co.png" width=30>'
    ],
        environmentValues = ['PM10', 'PM25', 'SO2', 'O3', 'NO2', 'CO'];
    var rootDiv = $('#' + divId),
        visualType = this.autoRadioBox(divId, 'visualType', ['맵', '차트'], ['map', 'chart'], {horizontal : true}),
        date = this.dateInput(divId),
        time = this.timeInput(divId),
        environmentType,
        i;
    for (i = 0; i < environmentValues.length; i += 3) {
        environmentType = this.autoRadioBox(divId, 'areenvTypeaType',
                                      [environmentImages[i], environmentImages[i + 1], environmentImages[i + 2]],
                                      [environmentValues[i], environmentValues[i + 1], environmentValues[i + 2]],
                                      {horizontal : true});
    }
    return [visualType, date, time, environmentType];
};


/**
 * 데이터 포털 환경정보 요청 인터페이스
 * @method dataProtalEnvironment
 * @param {String} divId - 최상위 DIV 아이디 이름
 * @param {JSON Object} options - 옵션 JSON 객체 키 값{theme=this.dataTheme, path='./images/'}
  theme(String) : 테마
  path(String) : 이미지 위치
 * @return {String} 생성된 객체 배열 [visualType, areaType, environmentType]
 */
OGDSM.eGovFrameUI.prototype.dataProtalEnvironment = function (divId, options) {
    'use strict';
    options = (typeof (options) !== 'undefined') ? options : {};
    var name, i;
    var defaults = {
        theme : this.dataTheme,
        path : './images/openGDSMobile/'
    };
    for (name in defaults) {
        if (defaults.hasOwnProperty(name)) {
            if (options.hasOwnProperty(name)) {
                defaults[name] = options[name];
            }
        }
	}
    var environmentImages = [
        '<img src="' + defaults.path + 'input_bt_pm10.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_pm25.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_so2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_o3.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_no2.png" width=30>',
        '<img src="' + defaults.path + 'input_bt_co.png" width=30>'
    ],
        environmentValues = ['pm10Value', 'pm25Value', 'so2value', 'o3Value', 'no2Value', 'coValue'],
        areaTypes = ['인천', '서울', '경기', '강원', '충남', '세종', '충북', '대전', '경북', '전북', '대구', '울산', '전남', '광주', '경남', '부산', '제주'],
        areaValues = ['incheon', 'seoul', 'gyeonggi', 'gangwon', 'chungnam', 'sejong', 'chungbuk', 'daejeon', 'gyeongbuk', 'jeonbuk', 'daegu', 'ulsan', 'jeonnam', 'gwangju', 'gyeongnam', 'busan', 'jeju'];
    var rootDiv = $('#' + divId),
        visualType = this.autoRadioBox(divId, 'visualType', ['맵', '차트'], ['map', 'chart'], {horizontal : true}),
        areaRadio,
        environmentType;

    for (i = 0; i < areaTypes.length - 2; i += 3) {
        areaRadio = this.autoRadioBox(divId, 'areaType',
                                      [areaTypes[i], areaTypes[i + 1], areaTypes[i + 2]],
                                      [areaValues[i], areaValues[i + 1], areaValues[i + 2]],
                                      {horizontal : true});
    }
    areaRadio = this.autoRadioBox(divId, 'areaType',
                                  [areaTypes[areaTypes.length - 2], areaTypes[areaTypes.length - 1]],
                                  [areaValues[areaValues.length - 2], areaValues[areaValues.length - 1]],
                                  {horizontal : true});
    for (i = 0; i < environmentValues.length; i += 3) {
        environmentType = this.autoRadioBox(divId, 'areenvTypeaType',
                                      [environmentImages[i], environmentImages[i + 1], environmentImages[i + 2]],
                                      [environmentValues[i], environmentValues[i + 1], environmentValues[i + 2]],
                                      {horizontal : true});
    }
    return [visualType, areaRadio, environmentType];
};

/*jslint devel: true, vars : true plusplus : true*/
/*global $, jQuery, ol, OGDSM, d3, Sortable*/
OGDSM.namesapce('mapLayerList');

(function (OGDSM) {
    "use strict";
    var arrlayerObjs = [], arrlabels = [];
    /**
     * 오픈레이어 맵 레이어 목록 객체
     * @class OGDSM.mapLayerList
     * @constructor
     * @param {OGDSM.visualization} obj - OGDSM 시각화 객체
     * @param {String} listDiv - 생성할 list DIV 이름
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
 * 레이어 목록 관리
 * @method listManager
 * @param {ol3 layer object} obj - 레이어 목록에 추가할 Openlayers3 레이어 객체
 * @param {String} label - 목록 이름
 * @param {String} color - 레이어 색상 (ex: rgb(255,255,255))
 * @param {String} type - 객체 타입 (polygon | point | line)
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

/**
 * 레이어 목록 삭제
 * @method removelist
 * @param {String} layerName - 레이어 이름
 */
OGDSM.mapLayerList.prototype.removelist = function (layerName) {
    'use strict';
    var labels = this.getLabels(),
        objs = this.getLayersObj();
    var layerNum = $.inArray(layerName, labels);

    labels.splice(layerNum, 1);
    objs.splice(layerNum, 1);
    $('#layer' + layerName).remove();
};

/*jslint devel: true, vars : true plusplus : true*/
/*global $, jQuery, ol, OGDSM*/

OGDSM.namesapce('attributeTable');
(function (OGDSM) {
    'use strict';
    /**
     * 속성정보 시각화 객체
     * @class OGDSM.attributeTable
     * @constructor
     * @param {String} RootDiv - 속성 테이블 DIV 이름
     * @param {String} addr - PostgreSQL 접속 주소
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
 * @method addAttribute
 * @param {String}  layerName   - 데이터 베이스 테이블 이름
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
