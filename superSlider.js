
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
				adaptiveHeight: false,
				appendArrows: $(element),
				appendDots: $(element),
				arrows: true,
				asNavFor: null,
				prevArrow: '<button class="super-prev" aria-label="Previous" type="button">Previous</button>',
				nextArrow: '<div class="super-navigation forward"> <button class="super-next" aria-label="Next" type="button">Next</button> </div>',
				autoplay: false,
				autoplaySpeed: 3000,
				centerMode: false,
				centerPadding: '50px',
				cssEase: 'ease',
				dotsShow: true,
				dots: '<div class="super-dot-inner"></div',
				dotsClass: 'super-dots',
				draggable: true,
				easing: 'linear',
				edgeFriction: 0.35,
				fade: false,
				infinite: true,
				initialSlide: 1,
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
				touchThreshold: 2, // 1 least sensitive  5 most
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
				currentSlide: 1,
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

			dataSettings = $(element).data('super') || {};

			// ADDS CUSTOMISED SETTINGS TO THE OPTIONS //
			_.options = $.extend({}, _.defaults, settings, dataSettings);

			// CHANGES - DEFAULT SET TO START AT  0 //


			// STORES THE INITIAL OPTION SETTINGS AS AN OBJECT //
			_.originalSettings = _.options;


			// STORES FUNCTIONS //
			_.buildWrappers = $.proxy(_.buildWrappers, _);
			_.buildNavigation = $.proxy(_.buildNavigation, _);
			_.buildDots = $.proxy(_.buildDots, _);
			_.buildSlides = $.proxy(_.buildSlides, _);
			_.initEvents = $.proxy(_.initEvents, _);
			_.updateNavigation = $.proxy(_.updateNavigation, _);
			_.updateDots = $.proxy(_.updateDots, _);
			_.changeSlide = $.proxy(_.changeSlide, _);
			_.cloneReset = $.proxy(_.cloneReset, _);
			_.updateClasses = $.proxy(_.updateClasses, _);

			_.swipeHandler = $.proxy(_.swipeHandler, _);
			_.autoPlayIterator = $.proxy(_.autoPlayIterator, _);


			
			



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


/* INITIALISE SLIDER */
	
	Super.prototype.init = function (init) {

		var _ = this;

		//  1. CONTAINER/WRAPPERS
		_.buildWrappers();

		//  2. NAVIGATION 
		_.buildNavigation();

		//  3. DOTS
		_.buildDots();

		//  4. TRACK
		_.buildTrack();

		//  5. SLIDES
		_.buildSlides();

		//  6. INITIALISE EVENT LISTENERS
		_.initEvents();

		_.checkResponsive();

		if (_.options.autoplay) {
			_.autoPlay(init);
		}

	};

	Super.prototype.buildWrappers = function () {
		var _ = this;

		_.$slider.addClass(`super-slider super-${_.instanceUid} `)
		
		_.$originalslides = _.$slider.children(_.options.slide); // ORIGINAL CONTENT

		_.$track = _.$originalslides.wrapAll('<div class="super-track"/>').parent();

		_.$trackWrapper = _.$track.wrap('<div class="super-track-wrapper"/>').parent();

		_.$wrapper = _.$trackWrapper.wrap('<div class="super-wrapper"/>').parent();

		var newSlides = document.createDocumentFragment();
		 

		_.slideCount = _.$originalslides.length;
		_.totalSlides = Math.ceil(_.slideCount / _.options.slidesToShow); // SET THE TOTAL SLIDE VALUE
		

		// CREATE SLIDES //

		_.$originalslides.each(function (i) {  
			var tabIndex = i + 1;

			var slide = document.createElement('div');
			slide.className = `super-slide`;
			slide.dataset.groupIndex =  Math.ceil(tabIndex / _.options.slidesToShow); // GROUP
			slide.dataset.tabIndex =  Math.ceil(tabIndex / _.options.slidesToShow) - 1; // MOVE AMOUNT
			

			var content = _.$originalslides.get(i);

			$(content).addClass('item');

			slide.appendChild(content);
			newSlides.appendChild(slide);
			
		});

		// EMPTY CONTENT AND ADD NEW SLIDES //
		_.$track.empty().append(newSlides);


		_.$slides = _.$track.children(); // SLIDES NEW

	};
	Super.prototype.buildNavigation = function () {

		var _ = this;

		if (_.options.arrows === true) {

			// PREVIOUS ARROW //
			_.$prevArrow = _.options.prevArrow;
			_.$prevArrow = $(_.$prevArrow).wrap('<div class="super-navigation back"/>').parent();
			$(_.$prevArrow).addClass(''); // ADD CUSTOM CLASS
			_.$prevArrow.prependTo(_.options.appendArrows);

			// NEXT ARROW //
			_.$nextArrow = _.options.nextArrow;
			_.$nextArrow = $(_.$nextArrow).wrap('<div class="super-navigation forward"/>').parent();
			$(_.$nextArrow).addClass(''); // ADD CUSTOM CLASS
			_.$nextArrow.appendTo(_.options.appendArrows);

		}

	};
	Super.prototype.buildDots = function () {

		var _ = this;
		
		if (_.options.dotsShow === true) {

			var dotList = document.createDocumentFragment();
			var wrapper = document.createElement('div');
			wrapper.className = `super-dots`;

			var list = document.createElement('ul');
			list.className = `super-list`;

			
			for (let i = 1; i <= _.totalSlides; i++) {

				var dot = document.createElement('li');
				dot.className = `super-dot`;
				dot.dataset.tabIndex = i;


				var content = document.createElement('div');
				content.className = `super-dot-inner`;


				dot.appendChild(content);
				list.appendChild(dot);
			}

			wrapper.appendChild(list);
			dotList.appendChild(wrapper);


			_.$slider.append(dotList);


			_.$dotContainer = _.$slider.find('.super-dots');
			_.$list = _.$dotContainer.children();

			_.$dots = _.$list.children();

		}

		_.updateClasses();

	};
	Super.prototype.buildTrack = function () {
		var _ = this,
			bodyStyle = document.body.style;

		_.sliderWidth =  _.$wrapper.width();
		let slideCount = _.totalSlides + (2); // ADD TWO FOR CLONED GROUP AT START AND END
		let trackWidth = _.sliderWidth * slideCount;
		_.offset = _.sliderWidth; // THIS IS BASICALLY THE WRAPPER WIDTH BUT BETTER TO SET IT SEPERATE

		_.$trackWrapper.css('left', `-${_.offset}px`);

		_.$trackWrapper.width(trackWidth);


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
	Super.prototype.buildSlides = function () {

		var _ = this;

		let wrapperWidth = _.$wrapper.width();

		var slideWidth = wrapperWidth / _.options.slidesToShow;


		function fits(x, y) {
			if (Number.isInteger(y / x)) {
			  return true;
			}
			return false;
		}



		var addSlide;
		if (fits(_.options.slidesToShow, _.$originalslides.length) === false) {
			addSlide = true;
		}


		var i = 0;

		_.$slides.each(function (i) {  
			$(this).css('width', `${slideWidth}px`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW
			let groupIndex = $(this).data('group-index');

			// FIRST
			if (groupIndex == 1) {
				
				$(this).clone().appendTo(_.$track).addClass('cloned last');

				// IF A SLIDE IS MISSING THEN ADD A 'FILLER SLIDE'
				if (addSlide) { 
						while (i < 1) {
							$(this).clone().prependTo(_.$track).addClass('cloned cloned-filler');
							i++;
						}
				}
				
			} 
			
		});

		
		// NEED TO REVERSE THE ORDER IN ORDER TO OUTPUT THE CLONES IN THE CORRECT ORDER //
		$(_.$slides.get().reverse()).each(function (i) {  
			$(this).css('width', `${slideWidth}px`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW
			let groupIndex = $(this).data('group-index');

			
			// LAST
			if (groupIndex == _.totalSlides) {
				$(this).clone().prependTo(_.$track).addClass('cloned first');
			} 
		
			
		});

	
	

		_.$clones = _.$track.children('.cloned'); // STORE CLONES

	};



	Super.prototype.slideBuild = function () {

	};

	Super.prototype.slidePosition = function () {

	};
	Super.prototype.slideClone = function () {

	};

	Super.prototype.initEvents = function () {
        var _ = this;

		_.initArrowEvents();
		_.initDotEvents();

		

		// DRAGGIN FUNCTIONALITY TO ADD LATER //

		// CONFIG SETTINGS
		_.currentOffset = 0;

	
	
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


		$(window).on('orientationchange' , $.proxy(_.orientationChange, _));

		$(window).on('resize' , $.proxy(_.resize, _));
		
		if ( _.options.pauseOnHover ) {

            _.$slider.on('mouseenter', $.proxy(_.interrupt, _, true));
            _.$slider.on('mouseleave', $.proxy(_.interrupt, _, false));

        }
	};

	// SWIPE EVENT HANDLERS //
	Super.prototype.swipeHandler = function (event) {
		var _ = this;
		
		_.touchObject.minSwipe = Math.round(_.sliderWidth  / (_.options.touchThreshold * 3), 2) ;
			
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

        }
	};

	Super.prototype.swipeStart = function (event) {
		var _ = this,
				touches;
		
		if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
		}

		// SET THE START POSITION 
		_.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;

		// SET DRAGGING TO TRUE
		_.dragging = true;
		

		// SET TRANSITION TO NOTHING ON CLICK
		var positionProps = {};

		positionProps[_.animProp] = 'transform 0ms ease 0s';

		_.$track.css(positionProps);
		
	};

	Super.prototype.swipeMove = function (event) {
		var _ = this,
				touches;

		touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

		var currentOffset = _.currentOffset !== undefined ? _.currentOffset : 0;

		_.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;

		_.touchObject.difference = _.touchObject.curX - _.touchObject.startX;

		var positionMove = _.touchObject.curX > _.touchObject.startX ? 1 : -1;


		// CALCULATE THE DIFFERENCE BETWEEN START AND CURRENT POINT

		_.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.difference, 2)));

		// GET CURRENT OFFSET AMOUNT
		// 

		// IF CURRENT POSITION IS GREATER THAN THE START POSITION THEN POSITIVE NUMBER

		var moveAmount = currentOffset + _.touchObject.swipeLength * positionMove;


		_.sliderMoveCSS(moveAmount);
		
	};

	Super.prototype.swipeEnd = function (event) {
		var _ = this,
		slideCount,
		direction,
		targetSlide;

		_.dragging = false;
		_.swiping = false;

		if (_.scrolling) {
			_.scrolling = false;
			return false;
		}

		_.interrupted = false;
		_.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;

		if ( _.touchObject.curX === undefined ) {
			return false;
		}

		var movedClone = false, swipeMessage;
		
		if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
			if (_.touchObject.difference > 0) {
				// // PREVIOUS SLIDE //
				swipeMessage = 'previous';

			} else if (_.touchObject.difference < 0) {
				// // NEXT SLIDE //
				swipeMessage = 'next';

			}
		} else {
			swipeMessage = 'no move';

		}

		_.touchObject = {};

		if (swipeMessage !== 'no move') {
			_.changeSlide(event, swipeMessage)

		} else {
			_.resetTrack(event, swipeMessage)

		}

	};

	// UPDATE SLIDER //
	Super.prototype.updateTrack = function (targetSlide, movedClone) {
	
		var _ = this;

		var trackMove = (targetSlide - 1) * _.offset;

		// _.$track.css('transform',  'translate3d(' + trackMove + 'px, 0px, 0px)');

		// _.currentSlide = targetSlide; // UPDATE CURRENT SLIDE
	};

	Super.prototype.resetTrack = function (moveAmount) {
		var _ = this;

		var positionProps = {};

		x = x + 'px';

		var x = -(_.currentSlide - 1) * _.offset;

		positionProps[_.animProp] = 'transform '+ _.options.speed +'ms '+ _.options.cssEase +' 0s';
		positionProps[_.transformType] = 'translate3d(' + x + 'px, 0px, 0px)';

		_.$track.css(positionProps);





	};

	Super.prototype.sliderMoveCSS = function (moveAmount) { 
		var _ = this,
		positionProps = {},
		x, y;

		x = moveAmount + 'px';

		// positionProps[_.positionProp] = moveAmount;

		positionProps[_.transformType] = 'translate3d(' + x + ', 0px, 0px)';

		_.$track.css(positionProps);
		// _.$track.css('transform',  'translate3d(' + moveAmount + 'px, 0px, 0px)');
		
		
	};

	// NAVIGATION EVENT HANDLER //

	Super.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow
               .off('click')
               .on('click', {
                    message: 'previous'
               }, _.changeSlide);
            _.$nextArrow
               .off('click')
               .on('click', {
                    message: 'next'
               }, _.changeSlide);

            // if (_.options.accessibility === true) {
            //     _.$prevArrow.on('keydown.super', _.keyHandler);
            //     _.$nextArrow.on('keydown.super', _.keyHandler);
            // }
        }

	};

	Super.prototype.autoPlay = function(init) {

        var _ = this;

        // _.autoPlayClear();

		// _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );

		if (!init) {
			_.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
			
		}
	};

	Super.prototype.interrupt = function( toggle ) {

		var _ = this;
		
        _.autoPlayClear();
		

        if( !toggle ) {
            _.autoPlay();
		}
		
        _.interrupted = toggle;

	};

	Super.prototype.autoPlayClear = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

	
	Super.prototype.pause = Super.prototype.slickPause = function() {

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
		
		if (_.options.dotsShow === true && _.slideCount > _.options.slidesToShow) {

			_.$dots.on('click', {
				message: 'dots'
			}, _.changeSlide);
				
		}

        // if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
        //     $('li', _.$dots).on('click.super', {
        //         message: 'index'
        //     }, _.changeSlide);

        //     if (_.options.accessibility === true) {
        //         _.$dots.on('keydown.super', _.keyHandler);
        //     }
        // }

        // if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {

        //     $('li', _.$dots)
        //         .on('mouseenter.super', $.proxy(_.interrupt, _, true))
        //         .on('mouseleave.super', $.proxy(_.interrupt, _, false));

        // }

    };
	
	Super.prototype.changeSlide = function(event, swipeMessage) {
		var _ = this, trackMove, targetSlide, $target, message;

		message = swipeMessage;
		if (event !== undefined) {
			$target = $(event.currentTarget);
			message = event.data.message !== undefined ? event.data.message : swipeMessage;
		}

		var positionMove;
		var moveToClone = false;
		var targetGroup;


		if($target){
			// If target is a link, prevent default action.
			if($target.is('a')) {
				event.preventDefault();
			}

			// If target is not the <li> element (ie: a child), find the <li>.
			if(!$target.is('li')) {
				$target = $target.closest('li');
			}
		}

		switch (message) {

			case 'previous':

				// IF THE PREVIOUS SLIDE IS SMALLER THAN 1 THEN RESET TO LAST ELSE MINUS 1
				targetGroup = (_.currentSlide - 1 < 1) ? _.totalSlides : _.currentSlide - 1;

				// INFINITE SCROLL -  IF PREVIOUS SLIDE IS HIGHER THAN CURRENT 
				if (targetGroup > _.currentSlide) {
					moveToClone = true;
					positionMove = -1;
				}

				break;

			case 'next':


				// IF THE NEXT SLIDE IS EQUAL TO OR BIGGER THAN MAX SLIDES THEN RESET TO FIRST
				targetGroup = (_.currentSlide + 1 > _.totalSlides) ? 1 : _.currentSlide + 1;


				// INFINITE SCROLL -  IF NEXT SLIDE IS LOWER THAN CURRENT 
				if(targetGroup < _.currentSlide){
					moveToClone = true;
					positionMove = _.totalSlides;

				}

				break;
			
			case 'dots':

				targetGroup = $target.data('tab-index');

				// INFINITE SCROLL -  IF PREVIOUS SLIDE IS HIGHER THAN CURRENT 
				if (_.currentSlide == 1 && targetGroup == _.totalSlides) {
					moveToClone = true;
					positionMove = -1;

				} else if (_.currentSlide == _.totalSlides && targetGroup == 1) {
					moveToClone = true;
					positionMove = _.totalSlides;

				} 


				break;

			default:

				return;
		}


		// UPDATE CURRENT SLIDE
		_.currentSlide = targetGroup;
		
		var slideTab = moveToClone !== true ? _.currentSlide - 1 : 1 * positionMove ; 

		// NEW CURRENT OFFSET
		_.currentOffset = -(slideTab * _.offset);  // e.g.  (2 * 400px) * -1 = -800px

		// MOVE TRACK TO NEW OFFSET
		var positionProps = {};

		positionProps[_.animProp] = 'transform '+ _.options.speed +'ms '+ _.options.cssEase +' 0s';
		positionProps[_.transformType] = 'translate3d(' + _.currentOffset + 'px, 0px, 0px)';

		_.$track.css(positionProps);



		if (moveToClone === true) {

			// RESET TRACK TO CLONES REAL POSITION
			setTimeout(function () { _.cloneReset(_.currentSlide - 1, positionMove); }, 500);

		}

		setTimeout(function () { _.updateClasses(); }, 250);

        

	};

	Super.prototype.updateClasses = function () { 
		var _ = this;

		var positionProps = {};

		positionProps[_.animProp] = 'transform 0s linear 0s';

		_.$track.css(positionProps);

		_.$dots.each(function (i) {
			$(this).removeClass('current-slide');

			if ($(this).data('tab-index') == _.currentSlide) {
				$(this).addClass('active');
			} else {
				$(this).removeClass('active');
				
			}
		});
		

		_.$slides.each(function (i) {
			$(this).removeClass('current-slide');

			if ($(this).data('group-index') == _.currentSlide) {
				$(this).addClass('current-slide');
			}
		});
		
	};
	

	Super.prototype.cloneReset = function (cloneTab, positionMove) { 

		var _ = this;


		_.$slides.each(function (i) {
			if($(this).data('tab-index') == cloneTab){
				$(this).addClass('current-slide');
			}
		});


		
		// NEW CURRENT OFFSET
		_.currentOffset = -(cloneTab * _.offset) ;  // e.g.  (2 * 400px) * -1 = -800px



		// MOVE TRACK TO NEW OFFSET
		var positionProps = {};

		positionProps[_.animProp] = 'transform 0ms ease 0s';
		positionProps[_.transformType] = 'translate3d(' + _.currentOffset + 'px, 0px, 0px)';

		_.$track.css(positionProps);


		
	}


	// TO CHECK //
	Super.prototype.resize = function() {

		var _ = this;
		
		// ADJUST SIZES OF ELEMENTS
		_.updateSizes();
		
        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function() {
                _.windowWidth = $(window).width();
                _.checkResponsive();
            }, 50);
        }
	};

	Super.prototype.updateSizes = function () {
		var _ = this;


		let wrapperWidth = _.$wrapper.width();

		var slideWidth = wrapperWidth / _.options.slidesToShow;

		_.sliderWidth =  wrapperWidth;
		_.offset = _.sliderWidth;


		_.$track.children().each(function (i) {
			$(this).css('width', `${slideWidth}px`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW

		});

		_.$trackWrapper.css('left', `-${_.offset}px`);


		
		function fits(x, y) {
			if (Number.isInteger(y / x)) {
			  return 'Fits!';
			}
			return 'Does NOT fit!';
		}

		
	};

	Super.prototype.checkResponsive = function(initial, forceUpdate) {

        var _ = this,
			breakpoint, 
			targetBreakpoint, 
			respondToWidth,
			triggerBreakpoint = false;
		
        var sliderWidth = _.$slider.width();
		var windowWidth = window.innerWidth || $(window).width();
		
		let wrapperWidth = _.$wrapper.width();

		var slideWidth = wrapperWidth / _.options.slidesToShow;

		
        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
		}
		
		// 

        if ( _.options.responsive  !== null && _.options.responsive.length > 0) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
				if (_.breakpoints.hasOwnProperty(breakpoint)) {
					
                   
					if (respondToWidth > _.breakpoints[breakpoint]) {
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

            // only trigger breakpoints during an actual break. not on initialize.
            if( !initial && triggerBreakpoint !== false ) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };
	
	Super.prototype.orientationChange = function() {

        var _ = this;
		
        // _.checkResponsive();
        // _.setPosition();

	};
	


	Super.prototype.refresh = function( initializing ) {

		var _ = this, currentSlide, lastVisibleIndex;
		
        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if ( _.slideCount <= _.options.slidesToShow ) {
            _.currentSlide = 0;

        }

        currentSlide = _.currentSlide;

		_.destroy(true);
		
		

        $.extend(_, _.initials, { currentSlide: currentSlide });


        _.init();

        if( !initializing ) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

	};
	
	Super.prototype.destroy = function(refresh) {

        var _ = this;

		
        // _.autoPlayClear();

        _.touchObject = {};

        // _.cleanUpEvents();


        if (_.$dots) {
            _.$dots.remove();
        }

        if ( _.$prevArrow && _.$prevArrow.length ) {

            _.$prevArrow
                .removeClass('super-disabled super-arrow super-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.prevArrow )) {
                _.$prevArrow.remove();
            }
        }

        if ( _.$nextArrow && _.$nextArrow.length ) {

            _.$nextArrow
                .removeClass('super-disabled super-arrow super-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.nextArrow )) {
                _.$nextArrow.remove();
            }
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



////////////////////////////////
////////////////////////////////
////////////////////////////////


/* SLIDER FUNCTION */
	
	$.fn.super = function () {
		let _ = this,
			opt = arguments[0], // USER CUSTOMISATION
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;

		// console.log(args);
		// console.log(l);




		for (i = 0; i < l; i++) {
			// console.log(`i ${i}`);
			// console.log(`opt ${opt}`);

			// FOR EACH SLIDER THAT MATCHES SELECTOR CREATE NEW SLIDER   -  E.G. console.log(this[0]);//
			if (typeof opt == 'object' || typeof opt == 'undefined') {
				_[i].super = new Super(_[i], opt);
			}

			else {
				ret = _[i].super[opt].apply(_[i].super, args);

			}

			if (typeof ret != 'undefined') return ret;


		}

		// console.log(i);
		// console.log(ret);

		return _;
	};

}));