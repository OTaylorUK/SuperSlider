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
				prevArrow: '<div class="super-navigation back"> <button class="slick-prev" aria-label="Previous" type="button">Previous</button></div>',
				nextArrow: '<div class="super-navigation forward"> <button class="slick-next" aria-label="Next" type="button">Next</button> </div>',
				autoplay: false,
				autoplaySpeed: 3000,
				centerMode: false,
				centerPadding: '50px',
				cssEase: 'ease',
				dots: false,
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


			// STORES THE INITIAL OPTION SETTINGS AS AN OBJECT //
			_.originalSettings = _.options;


			// STORES FUNCTIONS //
			_.autoPlay = $.proxy(_.autoPlay, _);
			_.autoPlayClear = $.proxy(_.autoPlayClear, _);
			_.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
			_.changeSlide = $.proxy(_.changeSlide, _);
			_.arrowClick = $.proxy(_.arrowClick, _);
			_.moveSlide = $.proxy(_.moveSlide, _);
			_.clickHandler = $.proxy(_.clickHandler, _);
			_.selectHandler = $.proxy(_.selectHandler, _);
			_.reInit = $.proxy(_.reInit, _);

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

		console.log(creation);

		// IF IT IS NOT ALREADY INIT THEN DO THIS //
		if (!$(_.$slider).hasClass('slick-initialized')) {

			$(_.$slider).addClass('slick-initialized');

			// CREATES SLIDES AND DIVS ITEMS //
			_.buildSlides();

			// CREATES OTHER SLIDE ITEMS //
			_.buildOut();

			// SETS ITEM PROPERTIES E.G. TRANSITION/OPACITY //
			// _.setProps(); ADDD IN A MIN

			// LOADING ?? //
			// _.startLoad();

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

		// DO THIS IS TRUE //
		if (creation) {
			_.$slider.trigger('init', [_]);
		}


		if (_.options.accessibility === true) {
			_.initADA();
		}

		// AUTOPLAY //
		if (_.options.autoplay) {

			_.paused = false;
			_.autoPlay();

		}

	};

	Slick.prototype.buildOut = function () {

		var _ = this;



		// STORES SLIDES
        _.$slides =
            _.$slider
                .children( _.options.slide + ':not(.slick-cloned)')
                // .addClass('slick-slide');


		var slideViewCount = _.$slides.length / _.options.slidesToShow;


		_.slideCount = _.$slides.length;
		
		var slideCount = _.slideCount;  // starts 1
		var slidesToShow = _.options.slidesToShow; // MB REPLACE WITH SLIDES TO SCROLL

		_.totalSlides = slideCount / slidesToShow; // SET THE TOTAL SLIDE VALUE




		$(_.$slides).each(function (index) {
			var i = index + 1;
			var slideGroup = Math.ceil(i / slidesToShow);

			$(this)
			.attr('data-slick-index', index)
			.attr('data-group', slideGroup)
			.attr('data-slide', i);
		});

		// _.$slider.addClass('slick-slider');
		
		_.$slideTrack =
		_.$slides.wrapAll('<div class="super-track"/>').parent();

		_.$slideTrackWrapper = _.$slideTrack.wrap(
			'<div class="super-track-wrapper"/>').parent();

	

        _.$list = _.$slideTrackWrapper.wrap(
			'<div class="super-wrapper"/>').parent();

		// _.slideWidth();

		console.log();

		_.buildArrows();

		_.buildDots();

		var wrapperWidth = _.$list.width();
		var itemWidth = (1 * 100) / _.options.slidesToShow;
		

		var slideWidth = wrapperWidth / _.options.slidesToShow;
		
		console.log(slideWidth);

		$(_.$slides).each(function (i) {


			$(this).css('width', `${slideWidth}px`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW

			// $(slide).css('width', `${itemWidth}%`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW
			

		});



		_.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 1);

		_.updateDots();

		console.log(_.$slideTrack);




		if (_.options.draggable === true) {
			_.$list.addClass('draggable');
		}

	};


	Slick.prototype.buildSlides = function () {

		var _ = this, a, b, c, newSlides, numOfSlides, originalSlides, slidesToShow;

		newSlides = document.createDocumentFragment();

		originalSlides = _.$slider.children();
		slidesToShow = _.options.slidesToShow;


		// CREATE SLIDES //
		$(originalSlides).each(function (i) {

			var slide = document.createElement('div');
			slide.className = "super-slide";
			var content = originalSlides.get(i);

			
			var itemWidth = (1 * 100) / slidesToShow;
			// var postition = (i * 100) / slidesToShow;


			$(slide).css('width', `${itemWidth}%`); // SETS WIDTH DEPENDANT ON NUM OF SLIDES TO SHOW
			// $(slide).css('left', `${postition}%`); // SETS POSITION DEPENDANT ON NUM OF SLIDE
			$(slide).css('display', `inline-block`); // SETS POSITION DEPENDANT ON NUM OF SLIDE

			slide.appendChild(content);
			newSlides.appendChild(slide);

		});


		// EMPTY CONTENT AND ADD NEW SLIDES //
		_.$slider.empty().append(newSlides);



	};


	Slick.prototype.loadSlider = function() {

        var _ = this;

		_.setPosition();
		
		var test = parseInt(_.$offsetTrack) / 2;

		console.log(_.$offsetTrack);
		console.log(test);
		

		_.$slideTrack.css({
			"opacity": 1,
			"transform": "translate3d("+0+"px, 0px, 0px)"
		});


        _.$slider.removeClass('slick-loading');

        // _.initUI();

	};


	Slick.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        // _.setHeight();

        // if (_.options.fade === false) {
        //     _.setCSS(_.getLeft(_.currentSlide));
        // } else {
        //     _.setFade();
        // }

		_.$slider.trigger('setPosition', [_]);
		


	};

	Slick.prototype.setDimensions = function() {

        var _ = this;

		_.listWidth = _.$list.width();

		console.log(_.$list);

		
		console.log(`_.listWidth: ${_.listWidth}`);
		
        _.listHeight = _.$list.height();


		if (_.options.vertical === false && _.options.variableWidth === false) {
			_.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);

            _.$slideTrackWrapper.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.super-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrackWrapper.width(5000 * _.slideCount);
        } else {
            _.slideTrackWrapper = Math.ceil(_.listWidth);
            _.$slideTrackWrapper.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
		if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
		

		// IF INFINITE IS TRUE THEN OFFSETT THE SLIDE TRACK
		_.$offsetTrack = '-'+ (_.slideWidth * _.options.slidesToShow) + 'px';

		

		
		_.$slideTrackWrapper.css('left', _.$offsetTrack);

		



	};

	Slick.prototype.setSlideClasses = function(index) {

        var _ = this,
			centerOffset, allSlides, indexOffset, remainder;
		
		var slideCount = _.slideCount;  // starts 1
		var slidesToShow = _.options.slidesToShow; // MB REPLACE WITH SLIDES TO SCROLL

		var totalSlides = _.totalSlides;

		var currentSlide = _.currentSlide;  // starts 1
		var prevSlides = (currentSlide - 1 <= 0)? totalSlides : currentSlide - 1 ;
		var nextSlides = (currentSlide + 1 > totalSlides)? 1 : currentSlide + 1 ;


		// console.log(`prevSlides: ${prevSlides}`);
		// console.log(`currentSlide: ${currentSlide}`);
		// console.log(`nextSlides: ${nextSlides}`);
		console.log(`_.$slides`);
		console.log(_.$slides);
		

		$(_.$slides).each(function (i) {
			var slideNumber = $(this).attr('data-slide');
			var isActive = Math.ceil(slideNumber / slidesToShow); // E.G SLIDE 3 / 2 = 1.5
			var content;
			$(this).removeClass('is-previous is-current is-next');

			if (isActive == prevSlides) {
				content = this.cloneNode(true);
				$(content).addClass('cloned is-previous');

				// CREATE INFINITE LOOP
				if (prevSlides > currentSlide) {
					$('.super-track').prepend(content);
				} else {
					$(this).addClass('is-previous');
					
				}

			} else if (isActive == currentSlide) {
				$(this).addClass('is-current');

			} else if (isActive == nextSlides) {
				$(this).addClass('is-next');
				content = this.cloneNode(true);
				$(content).addClass('cloned');

				// CREATE INFINITE LOOP
				if (nextSlides < currentSlide) {
					$('.super-track').append(content);
				}
			} 

		});

		// POSSIBLE TO DO THIS EARLIER - WHEN SLIDES ARE CREATED? TO CHECK //
		var actSlides = _.$slider.find('.super-slide.is-current');
		var nextSlides = $(actSlides).nextAll().not(".is-current");

		_.nextSlides = nextSlides;

		(nextSlides).each(function (i) {
			i++
			var slideIndex = Math.ceil(i / slidesToShow);
			this.dataset.superIndex = slideIndex;

        });



	};

/* NAVIGATION */
	
	// BUILD NAVIGATION //
	Slick.prototype.buildArrows = function() {

        var _ = this;

		// IF ARROWS ARE ALLOWED //
        if (_.options.arrows === true ) {

			// ADD CLASS TO ANY CUSTOM ARROW //
            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

			console.log(`_.slideCount: ${_.slideCount}`);
			console.log(`_.options.slidesToShow: ${_.options.slidesToShow}`);

			
            if( _.slideCount > _.options.slidesToShow ) {
				console.log('reached here!!!!');
				
                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .attr('aria-disabled', 'true');
                }

            } else {
				// DO THIS IF SLIDE COUNT IS LESS THAN SLIDES TO SHOW //
                _.$prevArrow.add( _.$nextArrow )

                    .addClass('slick-hidden')
                    .attr({
                        'aria-disabled': 'true',
                        'tabindex': '-1'
                    });

            }

        }

	};


/* DOTS */
	
	// BUILD DOTS //
	Slick.prototype.buildDots = function() {

        var _ = this,
			i, dot;
			

		var dotContent = document.createDocumentFragment();

		var wrapper = document.createElement('div');
		wrapper.className = "super-dots";

		var list = document.createElement('ul');
		list.className = "super-list";

		var totalSlides = _.totalSlides;

		console.log(_);
		

		for (let i = 1; i <= totalSlides; i++) {
			var dot = document.createElement('li');
			dot.className = `super-dot ${i}`;
			// dot.setAttribute('data', 'slide', i);
			dot.dataset.slide = i;
	
			var innerDot = document.createElement('div');

			dot.appendChild(innerDot);
			list.appendChild(dot);
		}
		wrapper.appendChild(list);

		dotContent.appendChild(wrapper);

		// ADD DOTS //
		_.$slider.append(dotContent);


    };

	// UPDATE DOTS //
	Slick.prototype.updateDots = function() {

		var _ = this;
		var dots = _.$slider.find('.super-dot');
		
			
		$(dots).each(function (i) {
			var number = $(this).attr('data-slide');

			if (number == _.currentSlide) {
				$(this).addClass('active')
			} else {
				$(this).removeClass('active')
			}

		});
		

        if (_.$dots !== null) {

            // _.$dots
            //     .find('li')
            //         .removeClass('slick-active')
            //         .end();

            // _.$dots
            //     .find('li')
            //     .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
            //     .addClass('slick-active');

        }

	};
	
/* EVENTS */

	// EVENT INIT //
	Slick.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        // _.initDotEvents();
        // _.initSlideEvents();

		console.log('_.$list');

		console.log(_.$list);

		// DRAGGIN FUNCTIONALITY TO ADD LATER //
		
        // _.$list.on('touchstart.slick mousedown.slick', {
        //     action: 'start'
        // }, _.swipeHandler);
        // _.$list.on('touchmove.slick mousemove.slick', {
        //     action: 'move'
        // }, _.swipeHandler);
        // _.$list.on('touchend.slick mouseup.slick', {
        //     action: 'end'
        // }, _.swipeHandler);
        // _.$list.on('touchcancel.slick mouseleave.slick', {
        //     action: 'end'
        // }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(_.setPosition);

    };

	// ARROW EVENT //
	Slick.prototype.initArrowEvents = function() {

		var _ = this;
		

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	
			// PREVIOUS ARROW CLICKED //
            _.$prevArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'previous'
			   }, _.arrowClick);
			
			// NEXT ARROW CLICKED //
            _.$nextArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'next'
			   }, _.arrowClick);
			
			//    _.$prevArrow
            //    .off('click.slick')
            //    .on('click.slick', {
            //         message: 'previous'
			//    }, _.changeSlide);
			
			// // NEXT ARROW CLICKED //
            // _.$nextArrow
            //    .off('click.slick')
            //    .on('click.slick', {
            //         message: 'next'
            //    }, _.changeSlide);

		// ACCESSIBILITY - KEY //
            if (_.options.accessibility === true) {
                _.$prevArrow.on('keydown.slick', _.keyHandler);
                _.$nextArrow.on('keydown.slick', _.keyHandler);
            }
        }

	};
	

/* EVENT FUNCTIONS */
	
	// ARROW UPDATE //
	Slick.prototype.arrowClick = function (event) {

		// current slide
		// target slide 
		var _ = this;

		var currentSlide = _.currentSlide;
		var direction = event.data.message;
		var targetSlide;


		switch (direction) {

			case 'previous':
				// IF LESS THAN ZERO THEN TARGET IS LAST
				targetSlide = (_.currentSlide - 1) <= 0 ? _.totalSlides : _.currentSlide - 1;
				break;

			case 'next':
				// IF GREATER THAN NUM OF SLIDES (GROUPS) THEN TARGET IS FIRST
				targetSlide = (_.currentSlide + 1) > _.totalSlides ? 1 : _.currentSlide + 1;
				break;
				
			default:
					return;
		}


		_.moveSlide(targetSlide, direction);
		
			

	};


	

	// DOT UPDATE //
	Slick.prototype.dotClick = function () {
	};

	// MOVE SLIDE //
	Slick.prototype.moveSlide = function (targetSlide, direction) {
		var _ = this;
		var slidesToShow = _.options.slidesToShow;
		var moveGroup;
		var trackLeftOrig = parseInt(_.$offsetTrack); // SLIDE OFFSET (SLIDES TO SHOW * WIDTH)

		if (direction == 'previous') {
			moveGroup = -1; 
			
		} else if (direction == 'next') {
			moveGroup = $(_.$slides.data('group') ==  targetSlide); 

			_.nextSlides.each(function (i) {

				if ($(this).attr('data-group') == targetSlide) {
					moveGroup = $(this).attr('data-super-index');
					return moveGroup;
				}
				return moveGroup;

			});
		}

		var move = trackLeftOrig * moveGroup;

		_.$slideTrack.css('transform',  'translate3d(' + move + 'px, 0px, 0px)');
	
		_.reInit(direction);
		// NEXT STEP:

		// UPDATE CURRENT SLIDE
		// UPDATE SLIDES - REMOVE / ADD   
		// RESET TRANSFORM TO 0
	};



	// $(_.$slides).each(function (i) {
	// 	var slideNumber = $(this).attr('data-slide');
	// 	var isActive = Math.ceil(slideNumber / slidesToShow); // E.G SLIDE 3 / 2 = 1.5
	// 	var content;
	// 	$(this).removeClass('is-previous is-current is-next');

	// 	if (isActive == prevSlides) {
	// 		$(this).addClass('is-previous');
	// 		content = this.cloneNode(true);
	// 		$(content).addClass('cloned');

	// 		// CREATE INFINITE LOOP
	// 		if (prevSlides > currentSlide) {
	// 			$('.super-track').prepend(content);
	// 		}

	// 	} else if (isActive == currentSlide) {
	// 		$(this).addClass('is-current');

	// 	} else if (isActive == nextSlides) {
	// 		$(this).addClass('is-next');
	// 		content = this.cloneNode(true);
	// 		$(content).addClass('cloned');

	// 		// CREATE INFINITE LOOP
	// 		if (nextSlides < currentSlide) {
	// 			$('.super-track').append(content);
	// 		}
	// 	} 

	// });
	
	// UPDATE SLIDE //
	Slick.prototype.reInit = function (direction) { 

		var _ = this;

		// UPDATE CURRENT SLIDE

		switch (direction) {

			case 'previous':
				// IF LESS THAN ZERO THEN TARGET IS LAST
				_.currentSlide  = (_.currentSlide - 1) <= 0 ? _.totalSlides : _.currentSlide - 1;
				break;

			case 'next':
				// IF GREATER THAN NUM OF SLIDES (GROUPS) THEN TARGET IS FIRST
				_.currentSlide = (_.currentSlide + 1) > _.totalSlides ? 1 : _.currentSlide + 1;
				break;
				
			default:
					return;
		}

		// UPDATE SLIDES - REMOVE / ADD  

		var prevSlides = (currentSlide - 1 <= 0)? _.totalSlides : currentSlide - 1 ;
		var nextSlides = (currentSlide + 1 > _.totalSlides)? 1 : currentSlide + 1 ;
		var currentSlide = _.currentSlide;

		var clones = _.$slideTrack.find('.super-slide.cloned');

		console.log(clones);
		$(clones).remove();

		// RESET TO ZERO IF CLONED EXISTS // IF NOT OFFSET IS BASE OFFSET * SLIDE GROUP -1? //
		_.$slideTrack.css('transform',  'translate3d(0px, 0px, 0px)');

		
		$(_.$slides).each(function (i) {
			var slideNumber = $(this).attr('data-slide');
			var isActive = Math.ceil(slideNumber / _.options.slidesToShow); // E.G SLIDE 3 / 2 = 1.5
			var content;
			$(this).removeClass('is-previous is-current is-next');

			if ($(this).hasClass('cloned')) {
				$(this).remove();
			}
			if (isActive == prevSlides) {
				$(this).addClass('is-previous');
				content = this.cloneNode(true);
				$(content).addClass('cloned');

				// CREATE INFINITE LOOP
				if (prevSlides > currentSlide) {
					$('.super-track').prepend(content);
				}

			} else if (isActive == currentSlide) {
				$(this).addClass('is-current');

			} else if (isActive == nextSlides) {
				$(this).addClass('is-next');
				content = this.cloneNode(true);
				$(content).addClass('cloned');

				// CREATE INFINITE LOOP
				if (nextSlides < currentSlide) {
					$('.super-track').append(content);
				}
			} 

		});

		
	}
	
	// CHANGE SLIDE //
	Slick.prototype.changeSlide = function(event, dontAnimate) {

		var _ = this,
			$target = $(event.currentTarget),
			indexOffset, slideOffset, unevenOffset;

		// If target is a link, prevent default action.
		if($target.is('a')) {
			event.preventDefault();
		}

		// If target is not the <li> element (ie: a child), find the <li>.
		if(!$target.is('li')) {
			$target = $target.closest('li');
		}

		unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
		indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

		switch (event.data.message) {

			case 'previous':
				slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;

				if (_.slideCount > _.options.slidesToShow) {
					_.slideHandler(_.currentSlide - slideOffset, event.data.message, dontAnimate);
				}

				break;

			case 'next':
				slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
				if (_.slideCount > _.options.slidesToShow) {
					_.slideHandler(_.currentSlide + slideOffset, event.data.message, dontAnimate);
				}
				break;

			case 'index':
				var index = event.data.index === 0 ? 0 :
					event.data.index || $target.index() * _.options.slidesToScroll;

				_.slideHandler(_.checkNavigable(index), event.data.message, dontAnimate);
				$target.children().trigger('focus');
				break;

			default:
				return;
		}

	};

	// MOVE SLIDER TRACK //
	Slick.prototype.slideHandler = function (index, direction, dontAnimate) { 

		var _ = this;

		console.log('slidehandler');

		//_.$slideTrack
		console.log(_);

		var trackLeftOrig = parseInt(_.$offsetTrack); // current position offset


		var currentGroup = _.currentSlide;

		var offsetAmount = currentGroup * trackLeftOrig;

		console.log(`trackLeftOrig: ${trackLeftOrig}`);
		console.log(`_.currentSlide: ${_.currentSlide}`);
		// console.log(`currentGroup: ${currentGroup}`);
		

		if (direction == 'previous') {
			trackLeftOrig = Math.abs(trackLeftOrig); // makes offset positive
		}


		_.$slideTrack.css('transform',  'translate3d(' + trackLeftOrig + 'px, 0px, 0px)');


		console.log(trackLeftOrig);

		// if (direction == 'previous') {
		// 	move = trackLeftOrig - (trackLeftOrig * _.currentSlide);

		// 	_.currentSlide = _.currentSlide - 1;


		// } else if (direction == 'next') {
		// 	move = trackLeftOrig + (trackLeftOrig * _.currentSlide);
		// 	_.currentSlide = _.currentSlide + 1;
			
		// }







		// console.log(index);

		// console.log(_.$slides);

		// var slideGroup;

		// $(_.$slides).each(function (i) {
		// 	if ($(this).hasClass('is-previous')) {
		// 		slideGroup = $(this).data('group') - 1
		// 	}else if ($(this).hasClass('is-next')) {
		// 		slideGroup = $(this).data('group') - 1
		// 	}
		// 	return slideGroup;
		// });

		// console.log(slideGroup);

		// var nextNum = slideGroup * trackLeftOrig;

		// console.log(`nextNum: ${nextNum}`);

		


		// IF GREATER THAN 3 GO BACK TO 1
		// var test =  (trackLeftOrig * _.currentSlide) > totalSlides




		// if (direction == 'previous') {
		// 	move = trackLeftOrig - (trackLeftOrig * _.currentSlide);

		// 	_.currentSlide = _.currentSlide - 1;


		// } else if (direction == 'next') {
		// 	move = trackLeftOrig + (trackLeftOrig * _.currentSlide);
		// 	_.currentSlide = _.currentSlide + 1;
			
		// }


		// console.log(`_.currentSlide: ${_.currentSlide}`);

		// console.log(move);


		// _.$slideTrack.css('transform',  'translate3d(' + move + 'px, 0px, 0px)');




		
	}





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