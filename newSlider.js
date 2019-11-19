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



/* SLIDER OBJECT */

	Slick = (function () {

		var instanceUid = 0;

		function Slick(element, settings) {




			var _ = this,
				dataSettings;


			// console.log('this:');
			// console.log(_);

			// DEFAULT SETTINGS //
			_.defaults = {
				accessibility: true,
				adaptiveHeight: false,
				appendArrows: $(element),
				appendDots: $(element),
				arrows: true,
				asNavFor: null,
				prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
				nextArrow: '<div class="super-navigation forward"> <button class="slick-next" aria-label="Next" type="button">Next</button> </div>',
				autoplay: false,
				autoplaySpeed: 3000,
				centerMode: false,
				centerPadding: '50px',
				cssEase: 'ease',
				dotsShow: true,
				dots: '<div class="super-dot-inner"></div',
				dotsClass: 'slick-dots',
				draggable: true,
				easing: 'linear',
				edgeFriction: 0.35,
				fade: false,
				infinite: false,
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
				touchThreshold: 3, // 1 least sensitive  5 most
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

			dataSettings = $(element).data('slick') || {};

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
				// console.log(`l: ${l}`);

				// console.log(_.breakpoints);


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

	// INITIALISING / CREATES THE SLIDER //
	Slick.prototype.init = function (creation) {

		var _ = this;

		/////////////////////
		// BUILD FUNCTIONS //
		/////////////////////

		//  1. BUILD CONTAINER/WRAPPERS 
		_.buildWrappers();


		//  2. BUILD NAVIGATION 
		_.buildNavigation();

		//  3. BUILD DOTS
		_.buildDots();

		_.buildTrack();

		//  4. SLIDES
		_.buildSlides();
			//  4 - A. BUILD SLIDES
			//  4 - B. POSITION SLIDES
			//  4 - C. BUILD CLONES TO CREATE INFINITE
		
		/////////////////////		
		// EVENT FUNCTIONS //
		/////////////////////

		//  1. INITIALISE EVENT LISTENERS
		_.initEvents();


		//////////////////////
		// UPDATE FUNCTIONS //
		//////////////////////


		//  1. UPDATE NAVIGATION
		// _.updateNavigation();

		//  2. UPDATE DOTS
		// _.updateDots();


	};

	// 

	Slick.prototype.buildWrappers = function () {
		var _ = this;

		_.$originalslides = _.$slider.children(_.options.slide); // ORIGINAL CONTENT

		_.$track = _.$originalslides.wrapAll('<div class="super-track"/>').parent();

		_.$trackWrapper = _.$track.wrap('<div class="super-track-wrapper"/>').parent();

		_.$wrapper = _.$trackWrapper.wrap('<div class="super-wrapper"/>').parent();

		var newSlides = document.createDocumentFragment();
		 

		_.slideCount = _.$originalslides.length;
		_.totalSlides = _.slideCount / _.options.slidesToShow; // SET THE TOTAL SLIDE VALUE


		// CREATE SLIDES //

		_.$originalslides.each(function (i) {  
			var tabIndex = i + 1;

			var slide = document.createElement('div');
			slide.className = `super-slide`;
			slide.dataset.groupIndex =  Math.ceil(tabIndex / _.options.slidesToShow); // GROUP
			slide.dataset.tabIndex =  Math.ceil(tabIndex / _.options.slidesToShow) - 1; // MOVE AMOUNT
			

			var content = _.$originalslides.get(i);

			console.log(i);

			slide.appendChild(content);
			newSlides.appendChild(slide);
			
		});

		// EMPTY CONTENT AND ADD NEW SLIDES //
		_.$track.empty().append(newSlides);


		_.$slides = _.$track.children(); // SLIDES NEW

	};
	Slick.prototype.buildNavigation = function () {

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
	Slick.prototype.buildDots = function () {

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


				console.log(content);
				

				dot.appendChild(content);
				list.appendChild(dot);
			}

			wrapper.appendChild(list);
			dotList.appendChild(wrapper);


			_.$slider.append(dotList);


			_.$dotContainer = _.$slider.find('.super-dots');
			_.$dots = _.$dotContainer.find('.super-list').children();

		}

		_.updateClasses();

	};


	Slick.prototype.buildTrack = function () {
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
	
	//
	Slick.prototype.buildSlides = function () {

		var _ = this;

		let wrapperWidth = _.$wrapper.width();

		var slideWidth = wrapperWidth / _.options.slidesToShow;

		// NEED TO REVERSE THE ORDER IN ORDER TO OUTPUT THE CLONES IN THE CORRECT ORDER //
		$(_.$slides.get().reverse()).each(function (i) {  
			$(this).css('width', `${slideWidth}px`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW
			let groupIndex = $(this).data('group-index');

			// LAST
			if (groupIndex == _.totalSlides) {
				$(this).clone().prependTo(_.$track).addClass('cloned');
			} 
			
		});

		_.$slides.each(function (i) {  
			$(this).css('width', `${slideWidth}px`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW
			let groupIndex = $(this).data('group-index');

			// FIRST
			if (groupIndex == 1) {
				$(this).clone().appendTo(_.$track).addClass('cloned');
			} 
			
		});

		_.$clones = _.$track.children('.cloned'); // STORE CLONES

	};



	Slick.prototype.slideBuild = function () {

	};
	Slick.prototype.slidePosition = function () {

	};
	Slick.prototype.slideClone = function () {

	};
	//

	Slick.prototype.initEvents = function () {
        var _ = this;

		_.initArrowEvents();

		// DRAGGIN FUNCTIONALITY TO ADD LATER //

		console.log();
		
	
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

	};

	Slick.prototype.swipeHandler = function (event) {
		var _ = this;
		
		_.touchObject.minSwipe = Math.round(_.sliderWidth  / (_.options
			.touchThreshold * 3), 2) ;
			
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

	Slick.prototype.swipeStart = function (event) {
		var _ = this,
				touches;
		
		if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
		}

		// SET THE START POSITION 
		_.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;

		// SET DRAGGING TO TRUE
        _.dragging = true;
		
		console.log(`----------         ---------------             -------------`);

		
	};

	Slick.prototype.swipeMove = function (event) {
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


		// console.log(`currentOffset : ${currentOffset}`);
		// console.log(`_.touchObject.swipeLength : ${_.touchObject.swipeLength}`);
		// console.log(`_.touchObject.difference : ${_.touchObject.difference}`);


		// console.log(`moveAmount : ${moveAmount}`);


		

		_.sliderMoveCSS(moveAmount);
		
	};


	Slick.prototype.swipeEnd = function (event) {
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
			console.log('is bigger than minimum');
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

			console.log('RESET SLIDER TO CURRENT SLIDE DUMMY!');
			
		}

		

		console.log(`----------         ---------------             -------------`);

	};

	Slick.prototype.updateTrack = function (targetSlide, movedClone) {
	
		var _ = this;

		var trackMove = (targetSlide - 1) * _.offset;

		// _.$track.css('transform',  'translate3d(' + trackMove + 'px, 0px, 0px)');

		// _.currentSlide = targetSlide; // UPDATE CURRENT SLIDE
	};

	Slick.prototype.resetTrack = function (moveAmount) {
		var _ = this;

		var positionProps = {};

		x = x + 'px';

		var x = -(_.currentSlide - 1) * _.offset;

		positionProps[_.animProp] = 'transform 500ms ease 0s';
		positionProps[_.transformType] = 'translate3d(' + x + 'px, 0px, 0px)';

		_.$track.css(positionProps);





	};

	Slick.prototype.sliderMoveCSS = function (moveAmount) { 
		var _ = this,
		positionProps = {},
		x, y;

		x = moveAmount + 'px';

		// positionProps[_.positionProp] = moveAmount;

		positionProps[_.transformType] = 'translate3d(' + x + ', 0px, 0px)';

		_.$track.css(positionProps);
		// _.$track.css('transform',  'translate3d(' + moveAmount + 'px, 0px, 0px)');
		
		
	};

	Slick.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'previous'
               }, _.changeSlide);
            _.$nextArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'next'
               }, _.changeSlide);

            // if (_.options.accessibility === true) {
            //     _.$prevArrow.on('keydown.slick', _.keyHandler);
            //     _.$nextArrow.on('keydown.slick', _.keyHandler);
            // }
        }

	};
	
	Slick.prototype.changeSlide = function(event, swipeMessage) {

        var _ = this,
            $target = $(event.currentTarget), trackMove, targetSlide;

		var message = event.data.message !== undefined ? event.data.message : swipeMessage;
		
        // If target is a link, prevent default action.
        if($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if(!$target.is('li')) {
            $target = $target.closest('li');
		}
		
		var cloneTab;
		var cloneIsActive = false;

        switch (message) {

            case 'previous':

				targetSlide = (_.currentSlide - 1 < 1) ? _.totalSlides : _.currentSlide - 1;

				if(targetSlide > _.currentSlide){

					cloneIsActive = true;

					trackMove = 1;

					_.$clones.each(function (i) {
						if($(this).data('group-index') == targetSlide){
							cloneTab = ($(this).data('tab-index')); // MUST BE MINUS
							$(this).addClass('active');

						}
					});

				} else {
					
					_.$slides.each(function (i) {
						if($(this).data('group-index') == targetSlide){
							trackMove = -($(this).data('tab-index')); // MUST BE MINUS
							$(this).addClass('active');

						}
					});
				}
	
                break;

            case 'next':
			console.log('next');

				targetSlide = (_.currentSlide + 1 > _.totalSlides) ? 1 : _.currentSlide + 1 ;

				if(targetSlide < _.currentSlide){
					cloneIsActive = true;

					console.log('moves to a cloned slide');
					trackMove = 0;

					_.$clones.each(function (i) {
						if($(this).data('group-index') == targetSlide){
							cloneTab = ($(this).data('tab-index')); 
						}
					});

				} else {
					_.$slides.each(function (i) {
						if($(this).data('group-index') == targetSlide){
							trackMove = -($(this).data('tab-index')); // MUST BE MINUS
						}
					});
				}

				
                break;
            default:
                return;
		}

		if (message !== 'no move') {
			
			var x = trackMove * _.offset;


			_.currentOffset = x;

			var positionProps = {};

			x = x + 'px';

			positionProps[_.animProp] = 'transform 500ms ease 0s';
			positionProps[_.transformType] = 'translate3d(' + x + ', 0px, 0px)';

			_.$track.css(positionProps);

			_.currentSlide = targetSlide; // UPDATE CURRENT SLIDE


			if (cloneIsActive) {
				// setTimeout(_.cloneReset(cloneTab), 1000);

				setTimeout(function () { _.cloneReset(cloneTab); }, 500);

				// _.cloneReset(cloneTab)
				
			}

			
			setTimeout(function () {_.updateClasses(); }, 500);


		}

	};

	Slick.prototype.updateClasses = function () { 
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
	

	Slick.prototype.cloneReset = function (cloneTab) { 

		var _ = this;

		_.$slides.each(function (i) {
			if($(this).data('tab-index') == cloneTab){
				$(this).addClass('current-slide');
			}
		});

		var cloneGroup = cloneTab + 1;



		console.log(`cloneTab: ${cloneTab + 1}`);
		

		var x = -(cloneTab * _.offset);

		_.currentOffset = x;
		
		var positionProps = {};

		x = x + 'px';

		positionProps[_.animProp] = 'transform 0s linear 0s';
		positionProps[_.transformType] = 'translate3d(' + x + ', 0px, 0px)';

		_.$track.css(positionProps);



		
	}



	
// 	Slick.prototype.updateNavigation = function () {

// 	};
// 	Slick.prototype.updateDots = function () {

// 	};

// 	//

// 	Slick.prototype.buildOut = function () {

// 		var _ = this;



// 		// STORES SLIDES
//         _.$slides =
//             _.$slider
//                 .children( _.options.slide + ':not(.slick-cloned)')
//                 // .addClass('slick-slide');


// 		var slideViewCount = _.$slides.length / _.options.slidesToShow;


// 		_.slideCount = _.$slides.length;
		
// 		var slideCount = _.slideCount;  // starts 1
// 		var slidesToShow = _.options.slidesToShow; // MB REPLACE WITH SLIDES TO SCROLL

// 		_.totalSlides = slideCount / slidesToShow; // SET THE TOTAL SLIDE VALUE




// 		$(_.$slides).each(function (index) {
// 			var i = index + 1;
// 			var slideGroup = Math.ceil(i / slidesToShow);

// 			$(this)
// 			.attr('data-slick-index', index)
// 			.attr('data-group', slideGroup)
// 			.attr('data-slide', i);
// 		});

// 		// _.$slider.addClass('slick-slider');
		
// 		_.$slideTrack =
// 		_.$slides.wrapAll('<div class="super-track"/>').parent();

// 		_.$slideTrackWrapper = _.$slideTrack.wrap(
// 			'<div class="super-track-wrapper"/>').parent();

	

//         _.$list = _.$slideTrackWrapper.wrap(
// 			'<div class="super-wrapper"/>').parent();

// 		// _.slideWidth();

// 		console.log();

// 		_.buildArrows();

// 		_.buildDots();

// 		var wrapperWidth = _.$list.width();
// 		var itemWidth = (1 * 100) / _.options.slidesToShow;
		

// 		var slideWidth = wrapperWidth / _.options.slidesToShow;
		
// 		console.log(slideWidth);

// 		$(_.$slides).each(function (i) {


// 			$(this).css('width', `${slideWidth}px`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW

// 			// $(slide).css('width', `${itemWidth}%`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW
			

// 		});



// 		_.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 1);

// 		_.updateDots();

// 		console.log(_.$slideTrack);




// 		if (_.options.draggable === true) {
// 			_.$list.addClass('draggable');
// 		}

// 	};


// 	Slick.prototype.buildSlidess = function () {

// 		var _ = this, a, b, c, newSlides, numOfSlides, originalSlides, slidesToShow;

// 		newSlides = document.createDocumentFragment();

// 		originalSlides = _.$slider.children();
// 		slidesToShow = _.options.slidesToShow;


// 		// CREATE SLIDES //
// 		$(originalSlides).each(function (i) {

// 			var slide = document.createElement('div');
// 			slide.className = "super-slide";
// 			var content = originalSlides.get(i);

			
// 			var itemWidth = (1 * 100) / slidesToShow;
// 			// var postition = (i * 100) / slidesToShow;


// 			$(slide).css('width', `${itemWidth}%`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW
// 			// $(slide).css('left', `${postition}%`); // SETS POSITION DEPENDANT ON NUM OF SLIDE
// 			$(slide).css('display', `inline-block`); // SETS POSITION DEPENDANT ON NUM OF SLIDE

// 			slide.appendChild(content);
// 			newSlides.appendChild(slide);

// 		});


// 		// EMPTY CONTENT AND ADD NEW SLIDES //
// 		_.$slider.empty().append(newSlides);



// 	};


// 	Slick.prototype.loadSlider = function() {

//         var _ = this;

// 		_.setPosition();
		
// 		var test = parseInt(_.$offsetTrack) / 2;

// 		console.log(_.$offsetTrack);
// 		console.log(test);
		

// 		_.$slideTrack.css({
// 			"opacity": 1,
// 			"transform": "translate3d("+0+"px, 0px, 0px)"
// 		});


//         _.$slider.removeClass('slick-loading');

//         // _.initUI();

// 	};


// 	Slick.prototype.setPosition = function() {

//         var _ = this;

//         _.setDimensions();

//         // _.setHeight();

//         // if (_.options.fade === false) {
//         //     _.setCSS(_.getLeft(_.currentSlide));
//         // } else {
//         //     _.setFade();
//         // }

// 		_.$slider.trigger('setPosition', [_]);
		


// 	};

// 	Slick.prototype.setDimensions = function() {

//         var _ = this;

// 		_.listWidth = _.$list.width();

// 		console.log(_.$list);

		
// 		console.log(`_.listWidth: ${_.listWidth}`);
		
//         _.listHeight = _.$list.height();


// 		if (_.options.vertical === false && _.options.variableWidth === false) {
// 			_.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);

//             _.$slideTrackWrapper.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.super-slide').length)));

//         } else if (_.options.variableWidth === true) {
//             _.$slideTrackWrapper.width(5000 * _.slideCount);
//         } else {
//             _.slideTrackWrapper = Math.ceil(_.listWidth);
//             _.$slideTrackWrapper.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
//         }

//         var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
// 		if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
		

// 		// IF INFINITE IS TRUE THEN OFFSETT THE SLIDE TRACK
// 		_.$offsetTrack = '-'+ (_.slideWidth * _.options.slidesToShow) + 'px';

		

		
// 		_.$slideTrackWrapper.css('left', _.$offsetTrack);

		



// 	};

// 	Slick.prototype.setSlideClasses = function(index) {

//         var _ = this,
// 			centerOffset, allSlides, indexOffset, remainder;
		
// 		var slideCount = _.slideCount;  // starts 1
// 		var slidesToShow = _.options.slidesToShow; // MB REPLACE WITH SLIDES TO SCROLL

// 		var totalSlides = _.totalSlides;

// 		var currentSlide = _.currentSlide;  // starts 1
// 		var prevSlides = (currentSlide - 1 <= 0)? totalSlides : currentSlide - 1 ;
// 		var nextSlides = (currentSlide + 1 > totalSlides)? 1 : currentSlide + 1 ;


// 		// console.log(`prevSlides: ${prevSlides}`);
// 		// console.log(`currentSlide: ${currentSlide}`);
// 		// console.log(`nextSlides: ${nextSlides}`);
// 		console.log(`_.$slides`);
// 		console.log(_.$slides);
		

// 		$(_.$slides).each(function (i) {
// 			var slideNumber = $(this).attr('data-slide');
// 			var isActive = Math.ceil(slideNumber / slidesToShow); // E.G SLIDE 3 / 2 = 1.5
// 			var content;
// 			$(this).removeClass('is-previous is-current is-next');

// 			if (isActive == prevSlides) {
// 				content = this.cloneNode(true);
// 				$(content).addClass('cloned is-previous');

// 				// CREATE INFINITE LOOP
// 				if (prevSlides > currentSlide) {
// 					$('.super-track').prepend(content);
// 				} else {
// 					$(this).addClass('is-previous');
					
// 				}

// 			} else if (isActive == currentSlide) {
// 				$(this).addClass('is-current');

// 			} else if (isActive == nextSlides) {
// 				$(this).addClass('is-next');
// 				content = this.cloneNode(true);
// 				$(content).addClass('cloned');

// 				// CREATE INFINITE LOOP
// 				if (nextSlides < currentSlide) {
// 					$('.super-track').append(content);
// 				}
// 			} 

// 		});

// 		// POSSIBLE TO DO THIS EARLIER - WHEN SLIDES ARE CREATED? TO CHECK //
// 		var actSlides = _.$slider.find('.super-slide.is-current');
// 		var nextSlides = $(actSlides).nextAll().not(".is-current");

// 		_.nextSlides = nextSlides;

// 		(nextSlides).each(function (i) {
// 			i++
// 			var slideIndex = Math.ceil(i / slidesToShow);
// 			this.dataset.superIndex = slideIndex;

//         });



// 	};

// /* NAVIGATION */
	
// 	// BUILD NAVIGATION //
// 	Slick.prototype.buildArrows = function() {

//         var _ = this;

// 		// IF ARROWS ARE ALLOWED //
//         if (_.options.arrows === true ) {

// 			// ADD CLASS TO ANY CUSTOM ARROW //
//             _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
//             _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

// 			console.log(`_.slideCount: ${_.slideCount}`);
// 			console.log(`_.options.slidesToShow: ${_.options.slidesToShow}`);

			
//             if( _.slideCount > _.options.slidesToShow ) {
// 				console.log('reached here!!!!');
				
//                 _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
//                 _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

//                 if (_.htmlExpr.test(_.options.prevArrow)) {
//                     _.$prevArrow.prependTo(_.options.appendArrows);
//                 }

//                 if (_.htmlExpr.test(_.options.nextArrow)) {
//                     _.$nextArrow.appendTo(_.options.appendArrows);
//                 }

//                 if (_.options.infinite !== true) {
//                     _.$prevArrow
//                         .addClass('slick-disabled')
//                         .attr('aria-disabled', 'true');
//                 }

//             } else {
// 				// DO THIS IF SLIDE COUNT IS LESS THAN SLIDES TO SHOW //
//                 _.$prevArrow.add( _.$nextArrow )

//                     .addClass('slick-hidden')
//                     .attr({
//                         'aria-disabled': 'true',
//                         'tabindex': '-1'
//                     });

//             }

//         }

// 	};


// /* DOTS */
	
// 	// BUILD DOTS //
// 	Slick.prototype.buildDotss = function() {

//         var _ = this,
// 			i, dot;
			

// 		var dotContent = document.createDocumentFragment();

// 		var wrapper = document.createElement('div');
// 		wrapper.className = "super-dots";

// 		var list = document.createElement('ul');
// 		list.className = "super-list";

// 		var totalSlides = _.totalSlides;

// 		console.log(_);
		

// 		for (let i = 1; i <= totalSlides; i++) {
// 			var dot = document.createElement('li');
// 			dot.className = `super-dot ${i}`;
// 			// dot.setAttribute('data', 'slide', i);
// 			dot.dataset.slide = i;
	
// 			var innerDot = document.createElement('div');

// 			dot.appendChild(innerDot);
// 			list.appendChild(dot);
// 		}
// 		wrapper.appendChild(list);

// 		dotContent.appendChild(wrapper);

// 		// ADD DOTS //
// 		_.$slider.append(dotContent);


//     };

// 	// UPDATE DOTS //
// 	Slick.prototype.updateDots = function() {

// 		var _ = this;
// 		var dots = _.$slider.find('.super-dot');
		
			
// 		$(dots).each(function (i) {
// 			var number = $(this).attr('data-slide');

// 			if (number == _.currentSlide) {
// 				$(this).addClass('active')
// 			} else {
// 				$(this).removeClass('active')
// 			}

// 		});
		

//         if (_.$dots !== null) {

//             // _.$dots
//             //     .find('li')
//             //         .removeClass('slick-active')
//             //         .end();

//             // _.$dots
//             //     .find('li')
//             //     .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
//             //     .addClass('slick-active');

//         }

// 	};
	
// /* EVENTS */

// 	// EVENT INIT //
// 	Slick.prototype.initializeEvents = function() {

//         var _ = this;

//         _.initArrowEvents();

//         // _.initDotEvents();
//         // _.initSlideEvents();

// 		console.log('_.$list');

// 		console.log(_.$list);

// 		// DRAGGIN FUNCTIONALITY TO ADD LATER //
		
//         // _.$list.on('touchstart.slick mousedown.slick', {
//         //     action: 'start'
//         // }, _.swipeHandler);
//         // _.$list.on('touchmove.slick mousemove.slick', {
//         //     action: 'move'
//         // }, _.swipeHandler);
//         // _.$list.on('touchend.slick mouseup.slick', {
//         //     action: 'end'
//         // }, _.swipeHandler);
//         // _.$list.on('touchcancel.slick mouseleave.slick', {
//         //     action: 'end'
//         // }, _.swipeHandler);

//         _.$list.on('click.slick', _.clickHandler);

//         $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

//         if (_.options.accessibility === true) {
//             _.$list.on('keydown.slick', _.keyHandler);
//         }

//         if (_.options.focusOnSelect === true) {
//             $(_.$slideTrack).children().on('click.slick', _.selectHandler);
//         }

//         $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

//         $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

//         $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

//         $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
//         $(_.setPosition);

//     };

// 	// ARROW EVENT //
// 	Slick.prototype.initArrowEventss = function() {

// 		var _ = this;
		

//         if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	
// 			// PREVIOUS ARROW CLICKED //
//             _.$prevArrow
//                .off('click.slick')
//                .on('click.slick', {
//                     message: 'previous'
// 			   }, _.arrowClick);
			
// 			// NEXT ARROW CLICKED //
//             _.$nextArrow
//                .off('click.slick')
//                .on('click.slick', {
//                     message: 'next'
// 			   }, _.arrowClick);
			
// 			//    _.$prevArrow
//             //    .off('click.slick')
//             //    .on('click.slick', {
//             //         message: 'previous'
// 			//    }, _.changeSlide);
			
// 			// // NEXT ARROW CLICKED //
//             // _.$nextArrow
//             //    .off('click.slick')
//             //    .on('click.slick', {
//             //         message: 'next'
//             //    }, _.changeSlide);

// 		// ACCESSIBILITY - KEY //
//             if (_.options.accessibility === true) {
//                 _.$prevArrow.on('keydown.slick', _.keyHandler);
//                 _.$nextArrow.on('keydown.slick', _.keyHandler);
//             }
//         }

// 	};
	

// /* EVENT FUNCTIONS */
	
// 	// ARROW UPDATE //
// 	Slick.prototype.arrowClick = function (event) {

// 		// current slide
// 		// target slide 
// 		var _ = this;

// 		var currentSlide = _.currentSlide;
// 		var direction = event.data.message;
// 		var targetSlide;


// 		switch (direction) {

// 			case 'previous':
// 				// IF LESS THAN ZERO THEN TARGET IS LAST
// 				targetSlide = (_.currentSlide - 1) <= 0 ? _.totalSlides : _.currentSlide - 1;
// 				break;

// 			case 'next':
// 				// IF GREATER THAN NUM OF SLIDES (GROUPS) THEN TARGET IS FIRST
// 				targetSlide = (_.currentSlide + 1) > _.totalSlides ? 1 : _.currentSlide + 1;
// 				break;
				
// 			default:
// 					return;
// 		}


// 		_.moveSlide(targetSlide, direction);
		
			

// 	};


	

// 	// DOT UPDATE //
// 	Slick.prototype.dotClick = function () {
// 	};

// 	// MOVE SLIDE //
// 	Slick.prototype.moveSlide = function (targetSlide, direction) {
// 		var _ = this;
// 		var slidesToShow = _.options.slidesToShow;
// 		var moveGroup;
// 		var trackLeftOrig = parseInt(_.$offsetTrack); // SLIDE OFFSET (SLIDES TO SHOW * WIDTH)

// 		if (direction == 'previous') {
// 			moveGroup = -1; 
			
// 		} else if (direction == 'next') {
// 			moveGroup = $(_.$slides.data('group') ==  targetSlide); 

// 			_.nextSlides.each(function (i) {

// 				if ($(this).attr('data-group') == targetSlide) {
// 					moveGroup = $(this).attr('data-super-index');
// 					return moveGroup;
// 				}
// 				return moveGroup;

// 			});
// 		}

// 		var move = trackLeftOrig * moveGroup;

// 		_.$slideTrack.css('transform',  'translate3d(' + move + 'px, 0px, 0px)');
	
// 		_.reInit(direction);
// 		// NEXT STEP:

// 		// UPDATE CURRENT SLIDE
// 		// UPDATE SLIDES - REMOVE / ADD   
// 		// RESET TRANSFORM TO 0
// 	};



// 	// $(_.$slides).each(function (i) {
// 	// 	var slideNumber = $(this).attr('data-slide');
// 	// 	var isActive = Math.ceil(slideNumber / slidesToShow); // E.G SLIDE 3 / 2 = 1.5
// 	// 	var content;
// 	// 	$(this).removeClass('is-previous is-current is-next');

// 	// 	if (isActive == prevSlides) {
// 	// 		$(this).addClass('is-previous');
// 	// 		content = this.cloneNode(true);
// 	// 		$(content).addClass('cloned');

// 	// 		// CREATE INFINITE LOOP
// 	// 		if (prevSlides > currentSlide) {
// 	// 			$('.super-track').prepend(content);
// 	// 		}

// 	// 	} else if (isActive == currentSlide) {
// 	// 		$(this).addClass('is-current');

// 	// 	} else if (isActive == nextSlides) {
// 	// 		$(this).addClass('is-next');
// 	// 		content = this.cloneNode(true);
// 	// 		$(content).addClass('cloned');

// 	// 		// CREATE INFINITE LOOP
// 	// 		if (nextSlides < currentSlide) {
// 	// 			$('.super-track').append(content);
// 	// 		}
// 	// 	} 

// 	// });
	
// 	// UPDATE SLIDE //
// 	Slick.prototype.reInit = function (direction) { 

// 		var _ = this;

// 		// UPDATE CURRENT SLIDE

// 		switch (direction) {

// 			case 'previous':
// 				// IF LESS THAN ZERO THEN TARGET IS LAST
// 				_.currentSlide  = (_.currentSlide - 1) <= 0 ? _.totalSlides : _.currentSlide - 1;
// 				break;

// 			case 'next':
// 				// IF GREATER THAN NUM OF SLIDES (GROUPS) THEN TARGET IS FIRST
// 				_.currentSlide = (_.currentSlide + 1) > _.totalSlides ? 1 : _.currentSlide + 1;
// 				break;
				
// 			default:
// 					return;
// 		}

// 		// UPDATE SLIDES - REMOVE / ADD  

// 		var prevSlides = (currentSlide - 1 <= 0)? _.totalSlides : currentSlide - 1 ;
// 		var nextSlides = (currentSlide + 1 > _.totalSlides)? 1 : currentSlide + 1 ;
// 		var currentSlide = _.currentSlide;

// 		var clones = _.$slideTrack.find('.super-slide.cloned');

// 		console.log(clones);
// 		$(clones).remove();

// 		// RESET TO ZERO IF CLONED EXISTS // IF NOT OFFSET IS BASE OFFSET * SLIDE GROUP -1? //
// 		_.$slideTrack.css('transform',  'translate3d(0px, 0px, 0px)');

		
// 		$(_.$slides).each(function (i) {
// 			var slideNumber = $(this).attr('data-slide');
// 			var isActive = Math.ceil(slideNumber / _.options.slidesToShow); // E.G SLIDE 3 / 2 = 1.5
// 			var content;
// 			$(this).removeClass('is-previous is-current is-next');

// 			if ($(this).hasClass('cloned')) {
// 				$(this).remove();
// 			}
// 			if (isActive == prevSlides) {
// 				$(this).addClass('is-previous');
// 				content = this.cloneNode(true);
// 				$(content).addClass('cloned');

// 				// CREATE INFINITE LOOP
// 				if (prevSlides > currentSlide) {
// 					$('.super-track').prepend(content);
// 				}

// 			} else if (isActive == currentSlide) {
// 				$(this).addClass('is-current');

// 			} else if (isActive == nextSlides) {
// 				$(this).addClass('is-next');
// 				content = this.cloneNode(true);
// 				$(content).addClass('cloned');

// 				// CREATE INFINITE LOOP
// 				if (nextSlides < currentSlide) {
// 					$('.super-track').append(content);
// 				}
// 			} 

// 		});

		
// 	}
	
// 	// CHANGE SLIDE //
// 	Slick.prototype.changeSlide = function(event, dontAnimate) {

// 		var _ = this,
// 			$target = $(event.currentTarget),
// 			indexOffset, slideOffset, unevenOffset;

// 		// If target is a link, prevent default action.
// 		if($target.is('a')) {
// 			event.preventDefault();
// 		}

// 		// If target is not the <li> element (ie: a child), find the <li>.
// 		if(!$target.is('li')) {
// 			$target = $target.closest('li');
// 		}

// 		unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
// 		indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

// 		switch (event.data.message) {

// 			case 'previous':
// 				slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;

// 				if (_.slideCount > _.options.slidesToShow) {
// 					_.slideHandler(_.currentSlide - slideOffset, event.data.message, dontAnimate);
// 				}

// 				break;

// 			case 'next':
// 				slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
// 				if (_.slideCount > _.options.slidesToShow) {
// 					_.slideHandler(_.currentSlide + slideOffset, event.data.message, dontAnimate);
// 				}
// 				break;

// 			case 'index':
// 				var index = event.data.index === 0 ? 0 :
// 					event.data.index || $target.index() * _.options.slidesToScroll;

// 				_.slideHandler(_.checkNavigable(index), event.data.message, dontAnimate);
// 				$target.children().trigger('focus');
// 				break;

// 			default:
// 				return;
// 		}

// 	};

// 	// MOVE SLIDER TRACK //
// 	Slick.prototype.slideHandler = function (index, direction, dontAnimate) { 

// 		var _ = this;

// 		console.log('slidehandler');

// 		//_.$slideTrack
// 		console.log(_);

// 		var trackLeftOrig = parseInt(_.$offsetTrack); // current position offset


// 		var currentGroup = _.currentSlide;

// 		var offsetAmount = currentGroup * trackLeftOrig;

// 		console.log(`trackLeftOrig: ${trackLeftOrig}`);
// 		console.log(`_.currentSlide: ${_.currentSlide}`);
// 		// console.log(`currentGroup: ${currentGroup}`);
		

// 		if (direction == 'previous') {
// 			trackLeftOrig = Math.abs(trackLeftOrig); // makes offset positive
// 		}


// 		_.$slideTrack.css('transform',  'translate3d(' + trackLeftOrig + 'px, 0px, 0px)');


// 		console.log(trackLeftOrig);

// 		// if (direction == 'previous') {
// 		// 	move = trackLeftOrig - (trackLeftOrig * _.currentSlide);

// 		// 	_.currentSlide = _.currentSlide - 1;


// 		// } else if (direction == 'next') {
// 		// 	move = trackLeftOrig + (trackLeftOrig * _.currentSlide);
// 		// 	_.currentSlide = _.currentSlide + 1;
			
// 		// }







// 		// console.log(index);

// 		// console.log(_.$slides);

// 		// var slideGroup;

// 		// $(_.$slides).each(function (i) {
// 		// 	if ($(this).hasClass('is-previous')) {
// 		// 		slideGroup = $(this).data('group') - 1
// 		// 	}else if ($(this).hasClass('is-next')) {
// 		// 		slideGroup = $(this).data('group') - 1
// 		// 	}
// 		// 	return slideGroup;
// 		// });

// 		// console.log(slideGroup);

// 		// var nextNum = slideGroup * trackLeftOrig;

// 		// console.log(`nextNum: ${nextNum}`);

		


// 		// IF GREATER THAN 3 GO BACK TO 1
// 		// var test =  (trackLeftOrig * _.currentSlide) > totalSlides




// 		// if (direction == 'previous') {
// 		// 	move = trackLeftOrig - (trackLeftOrig * _.currentSlide);

// 		// 	_.currentSlide = _.currentSlide - 1;


// 		// } else if (direction == 'next') {
// 		// 	move = trackLeftOrig + (trackLeftOrig * _.currentSlide);
// 		// 	_.currentSlide = _.currentSlide + 1;
			
// 		// }


// 		// console.log(`_.currentSlide: ${_.currentSlide}`);

// 		// console.log(move);


// 		// _.$slideTrack.css('transform',  'translate3d(' + move + 'px, 0px, 0px)');




		
// 	}





////////////////////////////////
////////////////////////////////
////////////////////////////////


/* SLIDER FUNCTION */
	
	$.fn.slick = function () {
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
				_[i].slick = new Slick(_[i], opt);
			}

			else {
				ret = _[i].slick[opt].apply(_[i].slick, args);

			}

			if (typeof ret != 'undefined') return ret;


		}




		// console.log(i);
		// console.log(ret);

		return _;
	};

}));