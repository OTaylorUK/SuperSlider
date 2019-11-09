;
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
	var Slick = window.Slick || {};

	console.log(`Slick: ${Slick}`);


	Slick = (function () {

		var instanceUid = 0;

		function Slick(element, settings) {

			console.log('settings:');
			console.log(settings);


			var _ = this,
				dataSettings;


			// DEFAULT SETTINGS //
			_.defaults = {
				accessibility: true,
				adaptiveHeight: false,
				appendArrows: $(element),
				appendDots: $(element),
				arrows: true,
				asNavFor: null,
				prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
				nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
				autoplay: false,
				autoplaySpeed: 3000,
				centerMode: false,
				centerPadding: '50px',
				cssEase: 'ease',
				customPaging: function (slider, i) {
					return $('<button type="button" />').text(i + 1);
				},
				dots: false,
				dotsClass: 'slick-dots',
				draggable: true,
				easing: 'linear',
				edgeFriction: 0.35,
				fade: false,
				focusOnSelect: false,
				focusOnChange: false,
				infinite: false,
				initialSlide: 0,
				lazyLoad: 'ondemand',
				mobileFirst: true,
				pauseOnHover: true,
				pauseOnFocus: true,
				pauseOnDotsHover: false,
				respondTo: 'window',
				responsive: null,
				rows: 1,
				rtl: false,
				slide: '',
				slidesPerRow: 1,
				slidesToShow: 1,
				slidesToScroll: 1,
				speed: 500,
				swipe: true,
				swipeToSlide: false,
				touchMove: true,
				touchThreshold: 5,
				useCSS: true,
				useTransform: true,
				variableWidth: false,
				vertical: false,
				verticalSwiping: false,
				waitForAnimate: true,
				zIndex: 1000
			};

			// DEFAULT INITIALS //
			_.initials = {
				animating: false,
				dragging: false,
				autoPlayTimer: null,
				currentDirection: 0,
				currentLeft: null,
				currentSlide: 0,
				direction: 1,
				$dots: null,
				listWidth: null,
				listHeight: null,
				loadIndex: 0,
				$nextArrow: null,
				$prevArrow: null,
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
			_.animType = null;
			_.animProp = null;
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
			_.transformType = null;
			_.transitionType = null;
			_.visibilityChange = 'visibilitychange';
			_.windowWidth = 0;
			_.windowTimer = null;

			dataSettings = $(element).data('slick') || {};

			// ADDS CUSTOMISED SETTINGS TO THE OPTIONS //
			_.options = $.extend({}, _.defaults, settings, dataSettings);

			// CHANGES - DEFAULT SET TO START AT  0 //
			_.currentSlide = _.options.initialSlide;


			// STORES THE INITIAL OPTION SETTINGS AS AN OBJECT //
			_.originalSettings = _.options;


			// STORES FUNCTIONS //
			_.autoPlay = $.proxy(_.autoPlay, _);
			_.autoPlayClear = $.proxy(_.autoPlayClear, _);
			_.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
			_.changeSlide = $.proxy(_.changeSlide, _);
			_.clickHandler = $.proxy(_.clickHandler, _);
			_.selectHandler = $.proxy(_.selectHandler, _);
			_.setPosition = $.proxy(_.setPosition, _);
			_.swipeHandler = $.proxy(_.swipeHandler, _);
			_.dragHandler = $.proxy(_.dragHandler, _);
			_.keyHandler = $.proxy(_.keyHandler, _);

			// STARTS AT 0 - INCREMENT EACH TIME THIS IS CALLED //
			_.instanceUid = instanceUid++;

			// A simple way to check for HTML strings
			// Strict HTML recognition (must start with <)
			// Extracted from jQuery v1.11 source
			_.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

			// CREATE BREAKPOINTS FROM USER CUSTOM SETTINGS //
			_.registerBreakpoints();

			// INITIALISE AND CREATE THE SLIDER //
			_.init(true);

		}

		return Slick;

	}());

	// FIRST FUNCTIONS //

	// INIT RELATED FUNCTIONS //

	// ADDS BREAKPOINTS TO THE SLIDER SETTINGS //
	Slick.prototype.registerBreakpoints = function () {

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
				console.log(`l: ${l}`);

				console.log(_.breakpoints);


				if (responsiveSettings.hasOwnProperty(breakpoint)) {

					currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

					console.log(`currentBreakpoint: ${currentBreakpoint}`);

					// Removes duplicates 

					while (l >= 0) {
						// console.log(`_.breakpoints[l]: ${_.breakpoints[l]}`);
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

	// INITIALISING / CREATES THE SLIDER //
	Slick.prototype.init = function (creation) {

		var _ = this;

		// IF IT IS NOT ALREADY INIT THEN DO THIS //
		if (!$(_.$slider).hasClass('slick-initialized')) {

			$(_.$slider).addClass('slick-initialized');

			// CREATES SLIDES AND DIVS ITEMS //
			_.buildRows();

			// CREATES OTHER SLIDE ITEMS //
			_.buildOut();

			// SETS ITEM PROPERTIES E.G. TRANSITION/OPACITY //
			_.setProps();

			// LOADING ?? //
			_.startLoad();

			// SET POSITION? //
			_.loadSlider();

			// INIT EVENT LISTENERS //
			_.initializeEvents();

			// HIDE/SHOW DEPENDING ON SLIDE NUMBER //
			_.updateArrows();

			// HIDE/SHOW DEPENDING ON SLIDE NUMBER //
			_.updateDots();

			// UPDATES DEPENDING ON THE BREAKPOINT AND WINDOW WIDTH //
			_.checkResponsive(true);

			// IGNORE THIS! //
			// _.focusHandler();

		}

		if (creation) {
			_.$slider.trigger('init', [_]);
		}

		if (_.options.accessibility === true) {
			_.initADA();
		}

		if (_.options.autoplay) {

			_.paused = false;
			_.autoPlay();

		}

	};








////////////////////////////////
////////////////////////////////
////////////////////////////////
	
	
	// CREATE SLIDER FUNCTION //
	$.fn.slick = function () {
		let _ = this,
			opt = arguments[0], // USER CUSTOMISATION
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;
		// console.log(_);
		// console.log(opt);
		// console.log(args);
		// console.log(l);




		for (i = 0; i < l; i++) {
			// console.log(`i ${i}`);
			// console.log(`opt ${opt}`);
			// console.log(args);



			if (typeof opt == 'object' || typeof opt == 'undefined')
				_[i].slick = new Slick(_[i], opt);
				
			else
				ret = _[i].slick[opt].apply(_[i].slick, args);
			
			if (typeof ret != 'undefined') return ret;


		}
		
		
		

		// console.log(i);
		// console.log(ret);

		return _;
	};
}));