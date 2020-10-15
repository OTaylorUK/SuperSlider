
(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports !== 'undefined') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery); 
	}
  
}(function ($) { 
	'use strict';
	var Super = window.Super || {};


	/* SLIDER OBJECT */

	Super = (function () {

		var instanceUid = 0;

		function Super(element, settings) {


			var _ = this,
				dataSettings;

			// DEFAULT SETTINGS //
			_.defaults = {

				accessibility: true,
				// BOOLEAN: KEYS NAVIGATE THROUGH SLIDES (LEFT & RIGHT)

				arrows: true,
				// BOOLEAN: CREATE ARROWS FOR THE SLIDER

				arrowElement: '<button></button>',
				// STRING: ARROW HTML ELEMENT

				arrowClass: '', // MAKE NULL
				// STRING: CUSTOM CLASS FOR THE ARROW WRAPPER

				arrowDirections: ['left', 'right'],
				// ARRAY: DIRECTION NAMES DEFINED HERE

				arrowLeft: '<svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 12L13 22" stroke="#0E1427" stroke-width="3"/></svg>',
				// STRING: CONTENT FOR THE LEFT ARROW

				arrowRight: '<svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2L12 12L2 22" stroke="#0E1427" stroke-width="3"/></svg>',
				// STRING: CONTENT FOR THE RIGHT ARROW

				arrowAppend: $(element),
				// ELEMENT: DOM ELEMENT WHERE TO APPEND THE ARROWS
			
				autoPlay: false, 
				// BOOLEAN: AUTO SLIDES THROUGH THE SLIDES
				
				autoPlayDelay: 3000,
				// INT: DELAY FOR THE AUTOPLAY

				pauseOnHover: true,
				// BOOLEAN: PAUSE AUTOPLAY ON HOVER

				customClass: null,
				// BOOLEAN: PAUSE AUTOPLAY ON HOVER

				fadeEffect: false,
				
				indicator: true,
				// BOOLEAN: CREATE SLIDE INDICATORS

				cloneSlides: true,
				// BOOLEAN: CREATE SLIDE INDICATORS

				indicatorElement: '<div></div>',
				// STRING: INDICATOR HTML ELEMENT

				indicatorClass: 'TEST', // MAKE NULL
				// STRING: CUSTOM CLASS FOR THE INDICATOR WRAPPER


				indicatorAppend: $(element),
				// ELEMENT: DOM ELEMENT WHERE TO APPEND THE INDICATORS
			
				responsive: null,
				// ARRAY: CHANGE HOW THE SLIDER APPEARS/WORKS AT CUSTOM BREAKPOINTS

				respondTo: 'window',
				// STRING: RESPONDS TO EITHER THE WINDOW OR SLIDER WIDTH
			
				transitions: true, 
				// BOOLEAN: CSS TRANSITION ON THE TRANSFORM 

				transitionProperty: 'ease',
				// STRING: CSS TRANSITION PROPERTY

				transitionSpeed: 800,  
				// INT: CSS TRANSITION PROPERTY

				transitionDelay: 0,
				// INT: CSS TRANSITION DELAY

				transitionUnit: 'ms',
				// STRING: CSS TRANSITION SPEED/DELAY UNIT

				infiniteScroll: true, 
				// BOOLEAN: CONTINOUS SCROLLING
			
				removeSuper: false,
				// BOOLEAN: REMOVES SLIDER

				slidesToScroll: 1,
				// INT: NUMBER OF SLIDES TO SCROLL

				slidesToShow: 1, 
				// INT: NUMBER OF SLIDES THAT ARE VISIBLE
			
				touchSensitivity: 'default', 
				// STRING: HOW MUCH THE SLIDER NEEDS TO BE DRAGGED TO CHANGE SLIDE - ACCEPTS 'LOW', 'NORMAL', 'DEFAULT' AND 'HIGH'
				
				zIndex: 100,
				// INT: CONTROL THE Z-INDEX OF THE SLIDER

				initialSlide: 1,
				// INT: THE SLIDE TO START ON

				mobileFirst: true, 
				// BOOLEAN: BREAKPOINTS ARE MOBILE FIRST
			
			};

			// DEFAULT INITIALS //
			_.initials = {
				animating: false,
				dragging: false,
				autoPlayTimer: null,
				currentDirection: 0,
				currentLeft: null,
				currentSlide: 1,
				direction: 1,
				$dots: null,
				listWidth: null,
				listHeight: null,
				loadIndex: 0,
				$nextArrow: null,
				$previousArrow: null,
				scrolling: false,
				slideCount: null,
				slideWidth: null,
				$slideTrack: null,
				$slides: null,
				sliding: false,
				slideOffset: 0,
				swipeLeft: null,
				swiping: false,
				$list: null,
				touchObject: {},
				transformsEnabled: false,
				unslicked: false
			};

			// MERGE THE ABOVE //
			$.extend(_, _.initials);

			_.activeBreakpoint = null;
			_.transformType = null;
			_.animProp = 'transition';
			_.breakpoints = [];
			_.breakpointSettings = [];
			_.cssTransitions = false;
			_.focussed = false;
			_.interrupted = false;
			_.hidden = 'hidden';
			_.paused = true;
			_.positionProp = null;
			_.respondTo = null;
			_.rowCount = 1;
			_.shouldClick = true;
			_.$slider = $(element);
			_.$slidesCache = null;
			_.transitionType = null;
			_.visibilityChange = 'visibilitychange';
			_.windowWidth = 0;
			_.windowTimer = null;

			dataSettings = $(element).data('super') || {}; // get 'data-super' values

			// ADDS CUSTOMISED SETTINGS TO THE OPTIONS //
			_.options = $.extend({}, _.defaults, settings, dataSettings);

			// CHANGES - DEFAULT SET TO START AT  0 //


			// STORES THE INITIAL OPTION SETTINGS AS AN OBJECT //
			_.originalSettings = _.options;


			// STORES FUNCTIONS //

			
			_.config = $.proxy(_.config, _);
			_.buildWrappers = $.proxy(_.buildWrappers, _);
			_.buildNavigation = $.proxy(_.buildNavigation, _);
			_.buildIndicators = $.proxy(_.buildIndicators, _);
			_.buildSlides = $.proxy(_.buildSlides, _);
			_.initEvents = $.proxy(_.initEvents, _);
			_.updateNavigation = $.proxy(_.updateNavigation, _);
			_.updateDots = $.proxy(_.updateDots, _);
			_.changeSlide = $.proxy(_.changeSlide, _);
			_.cloneReset = $.proxy(_.cloneReset, _);
			_.updateClasses = $.proxy(_.updateClasses, _);
			_.keyHandler = $.proxy(_.keyHandler, _);
			_.removeSuper = $.proxy(_.removeSuper, _);
			_.swipeHandler = $.proxy(_.swipeHandler, _);
			_.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
			_.setUpAnimation = $.proxy(_.setUpAnimation, _);
			_.resetSlider = $.proxy(_.resetSlider, _);
			
			
			// STARTS AT 0 - INCREMENT EACH TIME THIS IS CALLED //
			_.instanceUid = instanceUid++;


			// CREATE BREAKPOINTS FROM USER CUSTOM SETTINGS //
			_.registerBreakpoints();

			// INITIALISE AND CREATE THE SLIDER //
			_.init(true);

		}

		return Super;

	}());


	// ADDS BREAKPOINTS TO THE SLIDER SETTINGS //
	Super.prototype.registerBreakpoints = function () {

		var _ = this,
			breakpoint, currentBreakpoint, l,
			responsiveSettings = _.options.responsive || null;



		// if there are responsive settings it will be a type of array  && the array has settings in it then it'll be more than 0

		if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {

			// responds to the window OR slider width - defined in settings

			_.respondTo = _.options.respondTo || 'window';

			for (breakpoint in responsiveSettings) {

				// starts as -1 //

				l = _.breakpoints.length - 1;


				if (responsiveSettings.hasOwnProperty(breakpoint)) {

					currentBreakpoint = responsiveSettings[breakpoint].breakpoint;


					// Removes duplicates

					while (l >= 0) {
						if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
							_.breakpoints.splice(l, 1);
						}
						l--;
					}

					_.breakpoints.push(currentBreakpoint);
					_.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

				}

			}

			// uses mobile first as default - can change in settings

			_.breakpoints.sort(function (a, b) {
				return (_.options.mobileFirst) ? a - b : b - a;
			});

		}

	};


	/* INITIALISE SLIDER */
	
	Super.prototype.init = function (init) {

		var _ = this;

		_.config();

		//  1. CONTAINER/WRAPPERS
		_.buildWrappers();

		//  2. NAVIGATION 
		_.buildNavigation();

		//  3. DOTS
		_.buildIndicators(init);

		//  4. TRACK
		_.buildTrack();

		//  5. SLIDES
		_.buildSlides();

		//  6. INITIALISE EVENT LISTENERS
		_.initEvents();

		_.checkResponsive();

		
		_.$slides.each(function () {

			if ($(this).data('group-index') == _.currentSlide) {
				var new_track_height = $(this).outerHeight() + 'px';
				console.log(new_track_height);

				_.$trackWrapper.css({
					height: new_track_height
				});
			}
		});
	
		

		if (_.options.autoplay) {
			
			_.autoPlay(init);
		}

		if (_.options.removeSuper) {
			_.removeSuper(true);
		}



	};
	Super.prototype.config = function () {

		var _ = this,
			bodyStyle = document.body.style;
		
		// BROWSER SUPPORT FOR TRANSFORM ON DRAG  -- PUT SOMEWHERE SEPARATE //
		if (bodyStyle.OTransform !== undefined) {
			_.transformType = 'OTransform';
			_.transformType = '-o-transform';
			_.transitionType = 'OTransition';
			if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.transformType = false;
		}
		if (bodyStyle.MozTransform !== undefined) {
			_.transformType = 'MozTransform';
			_.transformType = '-moz-transform';
			_.transitionType = 'MozTransition';
			if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.transformType = false;
		}
		if (bodyStyle.webkitTransform !== undefined) {
			_.transformType = 'webkitTransform';
			_.transformType = '-webkit-transform';
			_.transitionType = 'webkitTransition';
			if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.transformType = false;
		}
		if (bodyStyle.msTransform !== undefined) {
			_.transformType = 'msTransform';
			_.transformType = '-ms-transform';
			_.transitionType = 'msTransition';
			if (bodyStyle.msTransform === undefined) _.transformType = false;
		}
		if (bodyStyle.transform !== undefined && _.transformType !== false) {
			_.transformType = 'transform';
			_.transformType = 'transform';
			_.transitionType = 'transition';
		}

	};
	Super.prototype.buildWrappers = function () {
		var _ = this,
			customClass = _.options.customClass !== null ? _.options.customClass : '',
			newSlides,
			tabIndex,
			group,
			slide,
			content;

		// CREATE SLIDER DOM CONTENT //

		// ORIGINAL CONTENT BEFORE INIT
		_.$originalslides = _.$slider.children();

		_.$slider.addClass('super-slider ' + customClass + '').attr('tabindex', 1);

		_.$track = _.$originalslides
			.wrapAll('<div/>')
			.parent()
			.addClass('super-track');

		_.$trackWrapper = _.$track
			.wrap('<div/>')
			.parent()
			.addClass('super-track-wrapper');

		_.$wrapper = _.$trackWrapper
			.wrap('<div/>')
			.parent()
			.addClass('super-wrapper');

		
		
		

		// TOTAL ACTUAL SLIDES & TOTAL SLIDE GROUPS 
		_.slideCount = _.$originalslides.length;
		_.totalSlides = Math.ceil(_.slideCount / _.options.slidesToShow);

		// REMOVE DOM ELEMENTS - TO BE REPLACED BY NEW SLIDES
		_.$track.empty();

		_.$originalslides.each(function (i) {
			tabIndex = i + 1;
			group = Math.ceil(tabIndex / _.options.slidesToShow);
			content = $(_.$originalslides.get(i));

			slide = $(content)
				.addClass('item')
				.wrap('<div/>')
				.parent()
				.addClass('super-slide')
				.attr('data-group-index', group)
				.attr('data-group-tab-index', (group - 1));

			_.$track.append(slide);
		});

		// STORE NEW DOM ELEMENTS AS THE SLIDES
		_.$slides = _.$track.children();

		

	};
	Super.prototype.buildNavigation = function () {

		var _ = this,
			element,
			direction,
			directions = _.options.arrowDirections,
			content;

			

		// ADD NAVIGATION IF ALLOWED
		if (_.options.arrows === true) {
			for (var i = 0; i <= 1; i++) {
			
				if (i == 0) {
					content = _.options.arrowLeft;
					direction = 'previous';
				} else {
					content = _.options.arrowRight;
					direction = 'next';
				}


				element = _.options.arrowElement;
				element = $(element)
					.html(content)
					.addClass('super-' + direction + '')
					.attr('aria-label', direction);

				element = $(element)
					.wrap('<div/>')
					.parent()
					.addClass('super-navigation ' + direction + '');


				if (i == 0) {
					_.$previousArrow = element;

					
					
					element
						.prependTo(_.options.arrowAppend);
				} else {
					_.$nextArrow = element;
					element
						.appendTo(_.options.arrowAppend);
				}

			}


			// for (direction of directions) {

			// 	if (i = 1) {
			// 		content = _.options.arrowLeft;
			// 	} else {
			// 		content = _.options.arrowright;
			// 	}
				
		
			
			// 	i++;
			// }
		} else{
			//full width wrapper			
			_.$wrapper.css('flex-basis', '100%');
		}

	};
	Super.prototype.buildIndicators = function (init) {

		var _ = this,
			i = 1,
			container,
			element;

		
		// ADD INDICATORS IF ALLOWED
		if (_.options.indicator === true) {

			container = $('<ul/>')
				.addClass('super-list');

			while (i <= _.totalSlides) {

				element = $(_.options.indicatorElement)
					.addClass('super-indicator-inner')
					.wrap('<li/>')
					.parent()
					.addClass('super-indicator ' + _.options.indicatorClass + '')
					.attr('data-tab-index', i);

				element.appendTo(container);
				i++;
			}

			container = $(container)
				.wrap('<div/>')
				.parent()
				.addClass('super-indicators')

			container.appendTo(_.options.indicatorAppend);

			_.$dotContainer = _.$slider.find('.super-indicators');
			_.$list = _.$dotContainer.children();
			_.$indicators = _.$list.children();
		}
	
		_.updateClasses(init);
	};

	Super.prototype.buildTrack = function () {
		var _ = this,
			groupCount,
			trackWidth,
			init_offset;
			_.sliderWidth = _.$wrapper.width(),
			

			_.offset = _.sliderWidth;

		groupCount = _.totalSlides + (2); // ADD TWO FOR CLONED GROUP AT START AND END
		trackWidth = _.sliderWidth * groupCount;

		if (_.options.cloneSlides === true) { 
			init_offset = -(_.offset)+'px';
		} else {
			init_offset = -0+'px';
		}

		_.$trackWrapper
			.css('left', init_offset)
			.width(trackWidth);
		
		_.setUpAnimation();


		
	};

	Super.prototype.setUpAnimation = function () {
		var _ = this,
			animationProp = {};
		
		
		// TRANSFORM IS USED TO MOVE SLIDER REGARDLESS
		animationProp[_.transformType] = 'translate3d(' + _.currentOffset + 'px, 0px, 0px)';

		if (_.options.fadeEffect) { 
			// NO TRANSITION ON THE TRANFORM

			_.$slides.each(function () {
				var opacity = 0;
				var slideProp = {};

				if ($(this).data('group-index') == _.currentSlide) {
					opacity = 1;

					slideProp['transition'] = 'opacity ' + _.options.transitionSpeed + _.options.transitionUnit + ' ' + _.options.transitionProperty + ' ' + 0 + _.options.transitionUnit;
				} 
				slideProp['opacity'] = opacity;
				$(this).css(slideProp);

			});


		} else {
			animationProp[_.animProp] = 'transform ' + '0' + _.options.transitionUnit + ' ' + _.options.transitionProperty + ' ' + '0' + _.options.transitionUnit;
		}

		_.$track.css(animationProp);
		
	};


	Super.prototype.buildSlides = function () {

		var _ = this,
			slideWidth,
			addSlide = false,
			i = 0,
			groupIndex;

		slideWidth = _.sliderWidth / _.options.slidesToShow;

		function fits(x, y) {
			if (Number.isInteger(y / x)) {
				return true;
			}
			return false;
		}

		if (fits(_.options.slidesToShow, _.$originalslides.length) === false) {
			addSlide = true;
		}

		// SIZE SLIDES & CREATE CLONES
		_.$slides.each(function (i) {
			$(this)
				.css('width', `${slideWidth}px`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW
			groupIndex = $(this).data('group-index');

			if (_.options.cloneSlides === true) {
				if (groupIndex == 1) {
					$(this).clone().appendTo(_.$track).addClass('cloned last');

					// IF A SLIDE IS MISSING THEN ADD A 'FILLER SLIDE'
					if (addSlide) {
						// LIMIT TO ONLY ONCE
						while (i < 1) {
							$(this).clone().prependTo(_.$track).addClass('cloned cloned-filler');
							i++;
						}
					}
				}
			} 

		}); 
		
		// NEED TO REVERSE THE ORDER IN ORDER TO OUTPUT THE CLONES IN THE CORRECT ORDER //
		if (_.options.cloneSlides === true) {

			$(_.$slides.get().reverse()).each(function (i) {
				groupIndex = $(this).data('group-index');

				if (groupIndex == _.totalSlides) {
					$(this).clone().prependTo(_.$track).addClass('cloned first');
				}
			
			});

			_.$clones = _.$track.children('.cloned'); // STORE CLONES
		}

	};


	Super.prototype.initEvents = function () {
		var _ = this;
		
		_.currentOffset = 0;

		_.initArrowEvents();
		_.initDotEvents();

		_.$wrapper.on('touchstart mousedown', {
			action: 'start'
		}, _.swipeHandler);
		_.$wrapper.on('touchmove mousemove', {
			action: 'move'
		}, _.swipeHandler);
		_.$wrapper.on('touchend mouseup', {
			action: 'end'
		}, _.swipeHandler);
		_.$wrapper.on('touchcancel mouseleave', {
			action: 'end'
		}, _.swipeHandler);
		
		

		$(window).on('orientationchange', $.proxy(_.orientationChange, _));


		$(window).on('resize', _.resetSlider);
		


		// $(window).on('resize', function () {
			 

		// 	clearTimeout(window.resizedFinished);
		// 	window.resizedFinished = setTimeout(_.resetSlider, 250);
		// });
		
		// PAUSE AUTOPLAY ON MOUSE ENTER/HOVER //
		if (_.options.pauseOnHover) {

			_.$slider.on('mouseenter', $.proxy(_.interrupt, _, true));
			_.$slider.on('mouseleave', $.proxy(_.interrupt, _, false));

		}
		
		if (_.options.accessibility === true) {
			_.$slider.unbind('keydown').on('keydown', _.keyHandler);
		}
	};

	// SWIPE EVENT HANDLERS //
	Super.prototype.swipeHandler = function (event) {
		var _ = this,
			touchSensivity;
		
		

		switch (_.options.touchSensitivity) {
			case 'low':
				touchSensivity = 1;
				break;

			case 'normal':
				touchSensivity = 2;
				break;

			case 'default':
				touchSensivity = 2;
				break;

			case 'high':
				touchSensivity = 3;
			break;

			default: 
				touchSensivity = 2;
        	 break;

		}
		
		
		// MINIMUM DRAG AMOUNT TO TRIGGER SLIDE MOVE
		_.touchObject.minSwipe = Math.round(_.sliderWidth / (touchSensivity * 3), 2);
			

		switch (event.data.action) {
			case 'start':
				_.swipeStart(event);
				break;

			case 'move':
				_.swipeMove(event);
				break;

			case 'end':
				_.swipeEnd(event);
				break;

			default: 
        	 break;

		}
		
	};

	Super.prototype.swipeStart = function (event) {
		var _ = this,
			touches,
			positionProps = {};
		
		if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
			touches = event.originalEvent.touches[0];
		}


		// SET THE START POSITION 
		_.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;


		// SET DRAGGING TO TRUE
		_.dragging = true;

		// positionProps[_.animProp] = 'transform 0ms ' + _.options.transitionProperty + ' 0s';

		// _.$track.css(positionProps);
		
	};

	Super.prototype.swipeMove = function (event) {
		var _ = this,
			touches,
			currentOffset,
			positionMove,
			moveAmount,
			mouseLeave;



		if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
			return false;
		}

		_.$wrapper.on('touchcancel mouseleave', function () {
			mouseLeave = true;
			
		});

		if (mouseLeave) {
			return false;
		}

		
		
		if (_.dragging && mouseLeave !== true) {
			
			touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;
			currentOffset = _.currentOffset !== undefined ? _.currentOffset : 0;

			_.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
			_.touchObject.difference = _.touchObject.curX - _.touchObject.startX;

			positionMove = _.touchObject.curX > _.touchObject.startX ? 1 : -1;

			// CALCULATE THE DIFFERENCE BETWEEN START AND CURRENT POINT
			_.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.difference, 2)));

			// IF CURRENT POSITION IS GREATER THAN THE START POSITION THEN POSITIVE NUMBER
			moveAmount = currentOffset + _.touchObject.swipeLength * positionMove;

			_.$slider.addClass('dragging');
			_.sliderMoveCSS(moveAmount);
				
			

		
		}


	};

	Super.prototype.swipeEnd = function (event) {
		var _ = this,
			movedClone = false,
			swipeMessage;

		
		_.dragging = false;
		_.swiping = false; 
		_.interrupted = false;

		_.$slider.removeClass('dragging');


		
		if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
			// PREVIOUS SLIDE //
			if (_.touchObject.difference > 0) {
				swipeMessage = 'previous';

				// NEXT SLIDE //
			} else if (_.touchObject.difference < 0) {
				swipeMessage = 'next';
			}
		} else {
			swipeMessage = 'no move';
		}
		
		// RESET THE TOUCH OBJECT
		_.touchObject = {};

		if (swipeMessage !== 'no move') {
			// MOVE TRACK TO NEW SLIDE
			_.changeSlide(event, swipeMessage)

		} else {
			// RESET TRACK TO CURRENT SLIDE
			_.resetTrack(event, swipeMessage)
		}

	};


	Super.prototype.resetTrack = function (moveAmount) {
		var _ = this,
			positionProps = {},
			x;

		x = -(_.currentSlide - 1) * _.offset;

		
		positionProps[_.animProp] = 'transform ' + _.options.transitionSpeed + _.options.transitionUnit + ' ' + _.options.transitionProperty + ' ' + _.options.transitionDelay + _.options.transitionUnit;
		
		positionProps[_.transformType] = 'translate3d(' + x + 'px, 0px, 0px)';

		_.$track.css(positionProps);

		// RESET TRANSITION TO NONE - SO IT DOES NOT INTERFERE WITH DRAGGING

		positionProps[_.animProp] = 'transform ' + '0' + _.options.transitionUnit + ' ' + _.options.transitionProperty + ' ' + '0' + _.options.transitionUnit;


	};

	Super.prototype.sliderMoveCSS = function (moveAmount) {
		var _ = this,
			positionProps = {},
			x, y;

		x = moveAmount + 'px';

		// positionProps[_.positionProp] = moveAmount;

		

		if (_.options.fadeEffect !== true) {
			
			positionProps[_.transformType] = 'translate3d(' + x + ', 0px, 0px)';
		}

		_.$track.css(positionProps);
		// _.$track.css('transform',  'translate3d(' + moveAmount + 'px, 0px, 0px)');
		
		
	};

	// NAVIGATION EVENT HANDLER //

	Super.prototype.initArrowEvents = function () {

		var _ = this;



		if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
			_.$previousArrow
				.off('click ontouchstart')
				.on('click ontouchstart', {
					message: 'previous'
				}, _.changeSlide);
			_.$nextArrow
				.off('click ontouchstart')
				.on('click ontouchstart', {
					message: 'next'
				}, _.changeSlide);

			// if (_.options.accessibility === true) {
			//     _.$previousArrow.on('keydown.super', _.keyHandler);
			//     _.$nextArrow.on('keydown.super', _.keyHandler);
			// }
		}

	};

	Super.prototype.autoPlay = function (init) {

		var _ = this;

		_.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoPlayDelay);

		// if (!init) {
		// 	_.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoPlayDelay);
			
		// }
	};

	Super.prototype.interrupt = function (toggle) {

		var _ = this;
		
		_.autoPlayClear();
		

		if (!toggle) {
			_.autoPlay();
		}
		
		_.interrupted = toggle;

	};

	Super.prototype.autoPlayClear = function () {

		var _ = this;

		if (_.autoPlayTimer) {
			clearInterval(_.autoPlayTimer);
		}

	};

	
	Super.prototype.pause = Super.prototype.slickPause = function () {

		var _ = this;

		_.autoPlayClear();
		_.paused = true;

	};
	
	Super.prototype.autoPlayIterator = function () {
		var _ = this;
		
		if (_.options.autoplay) {
			_.changeSlide(event, 'next');
		}
	};

	// DOT EVENT HANDLER //
	Super.prototype.initDotEvents = function () {

		var _ = this;
		
		if (_.options.indicator === true && _.slideCount > _.options.slidesToShow) {

			_.$indicators.on('click', {
				message: 'dots'
			}, _.changeSlide);
				
			
			
		}


	};

	Super.prototype.keyHandler = function (event) {
		var _ = this;

		// IGNORE IF SELECTION ON A FORM
		if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {

			if (event.keyCode === 37) {
				_.changeSlide({
					data: {
						message: 'previous'
					}
				});
			} else if (event.keyCode === 39) {
				_.changeSlide({
					data: {
						message: 'next'
					}
				});
			}
		}
	};
	
	Super.prototype.changeSlide = function (event, swipeMessage) {
		var _ = this,
			targetGroup,
			positionMove,
			$target,
			message = swipeMessage,
			moveToClone = false,
			slideTab,
			animationProp = {};


		if (event !== undefined) {
			$target = $(event.currentTarget);
			message = event.data.message !== undefined ? event.data.message : swipeMessage;
		}

		if ($target) {
			// If target is a link, prevent default action.
			if ($target.is('a')) {
				event.preventDefault();
			}

			// If target is not the <li> element (ie: a child), find the <li>.
			if (!$target.is('li')) {
				$target = $target.closest('li');
			}
		}


		// EVENT HANDLER 
		switch (message) {

			case 'previous':
				// IF THE PREVIOUS SLIDE IS SMALLER THAN 1 THEN RESET TO LAST ELSE MINUS 1
				targetGroup = (_.currentSlide - 1 < 1) ? _.totalSlides : _.currentSlide - 1;

				if (_.options.cloneSlides === true) {
					// INFINITE SCROLL -  IF PREVIOUS SLIDE IS HIGHER THAN CURRENT 
					if (_.options.infiniteScroll && targetGroup > _.currentSlide) {
						moveToClone = true;
						positionMove = -1;
					}
				}
				break;

			case 'next':

				// IF THE NEXT SLIDE IS EQUAL TO OR BIGGER THAN MAX SLIDES THEN RESET TO FIRST
				targetGroup = (_.currentSlide + 1 > _.totalSlides) ? 1 : _.currentSlide + 1;
				
				if (_.options.cloneSlides === true) {
					// INFINITE SCROLL -  IF NEXT SLIDE IS LOWER THAN CURRENT 
					if (_.options.infiniteScroll && targetGroup < _.currentSlide) {
						moveToClone = true;
						positionMove = _.totalSlides;
					}
				}

				break;
			
			case 'dots':

				targetGroup = $target.data('tab-index');

				// INFINITE SCROLL -  IF PREVIOUS SLIDE IS HIGHER THAN CURRENT 
				if (_.options.infiniteScroll &&  _.currentSlide == 1 && targetGroup == _.totalSlides) {
					moveToClone = true;
					positionMove = -1;

				} else if (_.options.infiniteScroll && _.currentSlide == _.totalSlides && targetGroup == 1) {
					moveToClone = true;
					positionMove = _.totalSlides;
				}
				break;

			default:
				return;
		}


		var previousSlide = _.currentSlide;


		// UPDATE CURRENT SLIDE
		_.currentSlide = targetGroup;
		
		
		slideTab = moveToClone !== true ? _.currentSlide - 1 : 1 * positionMove;

		// NEW CURRENT OFFSET
		_.currentOffset = -(slideTab * _.offset);


		if (_.options.fadeEffect !== true) {
			
			animationProp[_.animProp] = 'transform ' + _.options.transitionSpeed + _.options.transitionUnit + ' ' + _.options.transitionProperty + ' ' + _.options.transitionDelay + _.options.transitionUnit;
		
			animationProp[_.transformType] = 'translate3d(' + _.currentOffset + 'px, 0px, 0px)';


		} else {

			animationProp[_.transformType] = 'translate3d(' + _.currentOffset + 'px, 0px, 0px)';
			animationProp['transition'] = 'opacity ' + _.options.transitionSpeed + _.options.transitionUnit + ' ' + _.options.transitionProperty + ' ' + 0 + _.options.transitionUnit;

			_.$slides.each(function () {
				var opacity = 0;
				var opacityProp = {};

				if ($(this).data('group-index') == _.currentSlide) {
					opacity = 1;

					opacityProp['transition'] = 'opacity ' + _.options.transitionSpeed + _.options.transitionUnit + ' ' + _.options.transitionProperty + ' ' + 0 + _.options.transitionUnit;
				} 

				opacityProp['opacity'] = opacity;

				$(this).css(opacityProp);

			});

			
		}


		_.$track.css(animationProp);

		if (_.options.cloneSlides === true) {
			// RESET TRACK TO CLONES REAL POSITION
			if (moveToClone === true) {
				setTimeout(function () { _.cloneReset(_.currentSlide - 1, positionMove); }, _.options.transitionSpeed);
			}
		}
		setTimeout(function () { _.updateClasses(); }, 250);

	};

	Super.prototype.updateClasses = function (init) {
		var _ = this,
			positionProps = {};;

		positionProps[_.animProp] = 'transform ' + '0' + _.options.transitionUnit + ' ' + _.options.transitionProperty + ' ' + '0' + _.options.transitionUnit;

		_.$track.css(positionProps);

		if (_.options.indicator === true && _.slideCount > _.options.slidesToShow) {

			_.$indicators.each(function () {
				$(this).removeClass('current-slide active');

				if ($(this).data('tab-index') == _.currentSlide) {
					$(this).addClass('active');
				}
			});
		}
		_.$slides.each(function () {
			$(this).removeClass('current-slide');

			if ($(this).data('group-index') == _.currentSlide) {
				$(this).addClass('current-slide');
				var new_track_height = $(this).outerHeight() + 'px';
				_.$trackWrapper.css({
					height: new_track_height
				});
				// console.log($(this).outerHeight());
			}
		});

		

		if (init) {
			_.$wrapper.addClass('loading');
		}
		
		
	};
	

	Super.prototype.cloneReset = function (cloneTab, positionMove) {

		var _ = this,
			positionProps = {};

		_.$slides.each(function (i) {
			if ($(this).data('tab-index') == cloneTab) {
				$(this).addClass('current-slide');
			}
		});
		
		// NEW CURRENT OFFSET
		_.currentOffset = -(cloneTab * _.offset);  // e.g.  (2 * 400px) * -1 = -800px

		positionProps[_.animProp] = 'transform ' + '0' + _.options.transitionUnit + ' ' + _.options.transitionProperty + ' ' + '0' + _.options.transitionUnit;

		positionProps[_.transformType] = 'translate3d(' + _.currentOffset + 'px, 0px, 0px)';

		_.$track.css(positionProps);

	}


	Super.prototype.resize = function () {

		var _ = this;
		
		// ADJUST SIZES OF ELEMENTS
		_.updateSizes();
		
		if ($(window).width() !== _.windowWidth) {
			clearTimeout(_.windowDelay);
			_.windowDelay = window.setTimeout(function () {
				_.windowWidth = $(window).width();
				_.checkResponsive();
			}, 50);
		}
	};

	Super.prototype.updateSizes = function () {
		var _ = this,
			wrapperWidth = _.$wrapper.width(),
			slideWidth;


		slideWidth = wrapperWidth / _.options.slidesToShow;

		_.sliderWidth = wrapperWidth;

		_.offset = wrapperWidth;

		if (_.options.cloneSlides === true) { 
			init_offset = -(_.offset)+'px';
		} else {
			init_offset = -0+'px';
		}


		_.$track.children().each(function () {
			$(this).css('width', `${slideWidth}px`);
		});
		
		_.$trackWrapper.css('left', `-${_.offset}px`);
		
	};

	Super.prototype.checkResponsive = function (initial, forceUpdate) {

		var _ = this,
			breakpoint,
			targetBreakpoint,
			triggerBreakpoint = false,
			windowWidth = window.innerWidth || $(window).width(),
			wrapperWidth = _.$wrapper.width();
		

		if (_.options.responsive !== null && _.options.responsive.length > 0) {

			targetBreakpoint = null;

			for (breakpoint in _.breakpoints) {
				if (_.breakpoints.hasOwnProperty(breakpoint)) {
					
                   
					if (windowWidth > _.breakpoints[breakpoint]) {
						targetBreakpoint = _.breakpoints[breakpoint];
					}
				}
			}

			if (targetBreakpoint !== null) {
				if (_.activeBreakpoint !== null) {
					if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
						_.activeBreakpoint =
							targetBreakpoint;
                      
						_.options = $.extend({}, _.originalSettings,
							_.breakpointSettings[
							targetBreakpoint]);
						if (initial === true) {
							_.currentSlide = _.options.initialSlide;
						}
						_.refresh(initial);
						triggerBreakpoint = targetBreakpoint;
					}
				} else {
					_.activeBreakpoint = targetBreakpoint;
					_.options = $.extend({}, _.originalSettings,
						_.breakpointSettings[
						targetBreakpoint]);
					if (initial === true) {
						_.currentSlide = _.options.initialSlide;
					}
					_.refresh(initial);
					triggerBreakpoint = targetBreakpoint;
				}
			} else {
				if (_.activeBreakpoint !== null) {
					_.activeBreakpoint = null;
					_.options = _.originalSettings;
					if (initial === true) {
						_.currentSlide = _.options.initialSlide;
					}
					_.refresh(initial);
					triggerBreakpoint = targetBreakpoint;
				}
			}

		}

		_.$wrapper.removeClass('loading');
		

	};
	
	Super.prototype.orientationChange = function () {

		var _ = this;
		
		_.checkResponsive();
	};
	
	Super.prototype.resetSlider = function () {

		var _ = this;

		_.destroy(false);

		clearTimeout(window.resizedFinished);

		window.resizedFinished = setTimeout(_.init(), 250);
		
	};

	Super.prototype.refresh = function (initializing) {

		var _ = this,
			currentSlide,
			lastVisibleIndex = _.slideCount - _.options.slidesToShow;

		// IF NOT INFINITE
		if (!_.options.infiniteScroll && (_.currentSlide > lastVisibleIndex)) {
			_.currentSlide = lastVisibleIndex;
		}

		// if less slides than to show, go to start.
		if (_.slideCount <= _.options.slidesToShow) {
			_.currentSlide = 0;
		}

		currentSlide = _.currentSlide;

		_.destroy(true);
		
		$.extend(_, _.initials, { currentSlide: currentSlide });

		_.init();

		if (!initializing) {

			_.changeSlide({
				data: {
					message: 'index',
					index: currentSlide
				}
			}, false);

		}

	};
	
	Super.prototype.removeSuper = function () {
		var _ = this;
		_.destroy(true);	
	};
	
	Super.prototype.destroy = function(refresh) {

        var _ = this;

        _.touchObject = {};


        if (_.$indicators) {
            _.$indicators.remove();
        }

        if ( _.$previousArrow && _.$previousArrow.length ) {

            _.$previousArrow
                .removeClass('super-disabled super-arrow super-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

           
			_.$previousArrow.remove();
        }

        if ( _.$nextArrow && _.$nextArrow.length ) {

            _.$nextArrow
                .removeClass('super-disabled super-arrow super-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');
          
			_.$nextArrow.remove();
        }


        if (_.$slides) {
			_.$slider.empty(); // empty all added content 
			_.$slider.append(_.$originalslides); // add the original content
        }


        _.$slider.removeClass('super-slider');
        _.$slider.removeClass('super-initialized');
        _.$slider.removeClass('super-dotted');

        _.unslicked = true;

        if(!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

/* SLIDER FUNCTION */
	$.fn.super = function () {
		let _ = this,
			opt = arguments[0], // CUSTOMISED SETTINGS OBJECT
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;

		
		
		for (i = 0; i < l; i++) {

			// CREATE SLIDER IF OBJECT (SETTINGS SET) OR EMPTY (NO SETTINGS)

			if (typeof opt == 'object' || typeof opt == 'undefined') {
				_[i].super = new Super(_[i], opt);
			}

			else {
				ret = _[i].super[opt].apply(_[i].super, args);
			}

			

			if (typeof ret != 'undefined') {
				return ret;
			}
		}
	
		return _;
	};

}));