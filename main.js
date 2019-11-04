/*jshint esversion: 6 */

let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';


$(document).ready(function () {
	
	let windowWidth = window.innerWidth || $(window).width();

	$(window).resize(function () {
		windowWidth = window.innerWidth || $(window).width();
	});


	function objIndex(array, id) {
		let ix = array.findIndex((obj => obj.id == id));
		return array[ix];
	}

	function genDynamicPath(getVal, path, resIndex, objVal) {

		let test = objVal;
		let respSet = false,
			respPath = (resIndex !== 'default') ? path.responsive[resIndex].settings : path,
			newPath = (getVal) ? path[objVal] : path;
		
		// check if exists in responsive settings
		Object.entries(respPath).forEach(([key, value], index) => {
			if (key == objVal) {
				// is set in responsive 
				newPath = (getVal) ? respPath[objVal] : respPath;
			}

		});
		

		return (newPath);


	}

	// PAGINATION 
	function pagination(id, resIndex) {
		
		let path = objIndex(settings, id);
		let dots = genDynamicPath(true, path, resIndex, 'dots');
		let actualCount = genDynamicPath(true, path, resIndex, 'actualCount');
		let appendContainer = genDynamicPath(true, path, resIndex, 'appendDots');
		let dotIndicator = genDynamicPath(true, path, resIndex, 'dotIndicator');
		let container = (appendContainer !== id) ? $(`#${id}`).find(`#${appendContainer}`) : $(`#${appendContainer}`);
		let dotContainer = $(container).find(`.super-slider-pagination`).length !== 0 ?  true : false;

		if (dots) {
			if (dotContainer) {
				$(dotContainer).empty();
			} else {
				$(container).append(`<div class="super-slider-pagination"><ul class="super-slider-list"></ul></div>`);
				for (let i = 0; i < actualCount; i++) {
					let dot = `<li data-page="${i}" class='super-slider-pag-elem slider-${i} `;

					if (!i && dotIndicator) {
						dot += `active'><div></div></li>`;
					} else {
						dot += `'><div></div></li>`;
					}
					$(container).find(".super-slider-list").append(dot);
				}
			}
		}
	}

	function addButton(id, resIndex) {
		
		let path = objIndex(settings, id);
		let navButton = genDynamicPath(true, path, resIndex, 'navButton');
		let prevArrow = genDynamicPath(true, path, resIndex, 'prevArrow');
		let nextArrow = genDynamicPath(true, path, resIndex, 'nextArrow');
		let appendContainer = genDynamicPath(true, path, resIndex, 'appendArrows');
		let container = (appendContainer !== id) ? $(`#${id}`).find(`#${appendContainer}`) : $(`#${appendContainer}`);

		let navContainer = $(container).find(`.super-slider-nav`).length !== 0 ?  true : false;
		let directionArray = ['left', 'right'];

		if (navButton) {
			if (navContainer) {
				$(navContainer).empty();
			} else {
				$(directionArray).each(function (i) {
					let direction = directionArray[i];
					let content = `<button class="btn-arrow ${direction}">`;
					if (direction == 'left') {
						content += `${prevArrow}`;
					} else if (direction == 'right') {
						content += `${nextArrow}`;
					}
					content += `</button>`;
					$(container).append(`<div class="super-slider-nav ${direction}" data-direction="${direction}">${content}</div>`);
				});
			}
		}
	
	}

	// CAROUSEL SLIDER
	function sliderPosition(id, resIndex, resize) {

		let path = objIndex(settings, id);
		let numberOfSlides = genDynamicPath(true, path, resIndex, 'numOfSlides');
		let slidesToShow = genDynamicPath(true, path, resIndex, 'slidesToShow');
		let actualCount = genDynamicPath(true, path, resIndex, 'actualCount');
		let adaptiveHeight = genDynamicPath(true, path, resIndex, 'adaptiveHeight');

		let itemWidth;
		let itemHeight;

		let iHeightArray = [];
		
		$(`#${id}`).find('.super-slide').each(function (i) {
			postition = (i * 100) / slidesToShow;
			itemWidth = (1 * 100) / slidesToShow;
			// itemHeight = $(this).find('.super-slide').outerWidth();
			
			$(this).css('left', `${postition}%`);
			$(this).css('width', `${itemWidth}%`);
			$(this).css('height', `100%`);
			$(this).addClass(`slide-${i}`);
			iHeightArray.push(itemHeight);
		});

		sliderWidth = ($(`#${id}`).find('.super-slider-wrapper').width());

		OutersliderWidth = ($(`#${id}`).find('.super-slider-wrapper').outerWidth());
		

		if (resize) {
			itemHeight = ($(`#${id}`).find('.super-slide').outerWidth());
		} else {
			itemHeight = ($(`#${id}`).find('.super-slide').width());
			
		}

		let containerHeight =  itemHeight;
		
		$(`#${id}`).find('.super-slider-wrapper').css('height', `${containerHeight}`);

	}

	function findBreakpoint(array) {
		let responsive = array.responsive;
		let resBreakpoint,
			resIndex,
			smallest;

		resArray = [];

		if (responsive) {
			responsive.forEach((el, index) => {
				let breakPoint = el.breakpoint;

				if (windowWidth > breakPoint) {
					resArray.push(breakPoint);
				} 
			});
		}

		let currentBreakPoint = (resArray === undefined || resArray.length == 0) ? 'default' : Math.max(...resArray);
		return currentBreakPoint;
	}
	function findIndex(array, currentBreakpoint) {
		let resIndex = 'default';
		let responsive = array.responsive;

		if (responsive) {
			responsive.forEach((el, index) => {
				if (el.breakpoint == currentBreakpoint) {
					resIndex = index;
					return resIndex;
				}
			});
		} 
		return resIndex;
	}

	function responsiveActive(sliderSettings) {

		let currentBreakpoint = findBreakpoint(sliderSettings, windowWidth);

		let responsiveIndex = findIndex(sliderSettings, currentBreakpoint);

		return responsiveIndex;
		
	}

	function checkIfSet(objDefault, objSettings, objCustom) {
		Object.entries(objDefault).forEach(([keyDefault, valueDefault], index) => {
			// current value set to default
			let currentValue = valueDefault;

			Object.entries(objCustom).forEach(([key, value], index) => {
				// if it exists change valueDefault to value
				if (key == keyDefault) {
					currentValue = value;
				}
			});
			objSettings[keyDefault] = currentValue;
		});
	}

	function createSlider(id, sliderSettings, settings, numOfSlides, resize) {
		
		let slider = $(`#${id}`).find('.super-slider-track');


		let resIndex = responsiveActive(sliderSettings, windowWidth);
		let path = objIndex(settings, id);
		let actualCalc = Math.ceil((numOfSlides) / genDynamicPath(true, path, resIndex, 'slidesToShow'));
		let animationSpeed = genDynamicPath(true, path, resIndex, 'animationSpeed');
		let animationType = genDynamicPath(true, path, resIndex, 'animationType');

		
		path.resIndex = resIndex;
		path.actualCount = actualCalc;

		// console.log(slider);

		$(slider).css("transition", `transform ${animationSpeed}ms ${animationType}`);

		// addButton(id, resIndex, 'left');
		// addButton(id, resIndex, 'right');
		addButton(id, resIndex);
		pagination(id, resIndex);
		sliderPosition(id, resIndex, resize);
		changeSlideNew(id, true);
	}

	let settings = [];

	// DEFINE CUSTOM JQUERY PLUGIN //

	(function ($) {
		
		$.fn.vJSlider = function (objCustom) {

			/* NOTES:

			// RESPONSIVE //
			The responsive is 'mobile first' meaning the settings given will apply from smallest screen up
			e.g. If you define breakpoint of 600px the settings will be applied to screens 600px and bigger (up to the next defined breakpoint), while the main settings applied (not in a responsive array) will be applied for all screen sizes smaller than the smallest breakpoint (600px in this case).


			*/

			// CONSTANT PARAMTERS //
			let container = $(this);
			let id = $(container).attr('id');


			// DYNAMICALLY ADD WRAPPER ELEMENTS & CLASSES //
			let content = $(container).html();
			$(container).html(`<div class="super-slider-wrapper"><div class="super-slider-track"> ${content} </div></div>`);

			let slider = $(container).find('.super-slider-track');
			let sliderChildren = $(slider).children();

			$(sliderChildren).each(function (i) {
				let itemContent = $(this).html();
				$(this).addClass(`super-slide slide-${i}`);
				$(this).html(`<div class="item"> ${itemContent} </div>`);
			});

			let numOfSlides = $(container).find(".super-slide").length;
			let containerWidth = $(slider).width();
			let display = true; 
			let diff = 0;
			let currentX = 0;
			let startX = 0;
			let currentSlide = 0;
			let transformPercent = 0;
			

			// OBJECT SETTINGS //
			let sliderSettings = {
				id: id, 
				containerWidth: containerWidth, 
				numOfSlides: numOfSlides, 
				currentSlide: currentSlide,  
				diff: diff,  
				startX: startX,  
				currentX: currentX,  
				display: display,
				transformPercent: transformPercent,
			};

			// DEFAULT SETTINGS //   
			let defaultSettings = {
				animationSpeed: 650,
				animationType: 'linear',
				appendArrows: id,
				appendDots: id,
				arrows: true,
				autoPlay: false,
				autoPlaySpeed: 3000,
				dots: true,
				dotIndicator: true,
				dotClass: 'super-dots',
				draggable: true,
				infinite: false,
				navButton: true,
				prevArrow: 'Previous', //content
				nextArrow: 'Next',
				pauseOnDotsHover: false,
				pauseOnFocus: true,
				pauseOnHover: true,
				slidesToScroll: 1,
				slidesToShow: 1,
				swipe: true,
				touchMove: true,
				vertical: false,
				verticalSwiping: false,


				animDelay: 3000,
				slideTimer: 800,
				showButton: true,
				adaptiveHeight: false,
				
			};

			// CHECK IF SETTING IS SET - IF NOT REVERTS TO DEFAULT
			checkIfSet(defaultSettings, sliderSettings, objCustom);


			// ADD THIS OBJECT TO THE SETTINGS ARRAY //
			settings.push(sliderSettings);


			// CREATE SLIDER - POSITION SLIDERS & DOTS - RESPONSIVE //
			createSlider(id, sliderSettings, settings, numOfSlides);
 
			// ON RESIZE - RECREATE SLIDERS //
			$(window).resize(function () {
				createSlider(id, sliderSettings, settings, numOfSlides, true);
			}); 
			 
		};

		
	})(jQuery);

	
	console.log(settings);
  

	//////////////////////
	// SLIDER FUNCTIONS //
	//////////////////////
	function changeSlideNew(container, auto) {

		let path = objIndex(settings, container);
		let resIndex = path.resIndex;

		let numberOfSlides = genDynamicPath(true, path, resIndex, 'numOfSlides');
		let slidesToShow = genDynamicPath(true, path, resIndex, 'slidesToShow');
		let currentSlide = genDynamicPath(true, path, resIndex, 'currentSlide');
		let transformPercentPath = genDynamicPath(false, path, resIndex, 'transformPercent');
 
		let sliderContainer = $(`#${container}`).find('.super-slider-track');
		let slidePagination = $(`#${container}`).find('.super-slider-pagination li');


		$(slidePagination).each(function (i) {
			$(this).removeClass('active');
			if ($(this).data('page') == currentSlide) {
				$(this).addClass('active');
			}
		});

		let transformPercent = -(currentSlide * 100);

		$(sliderContainer).css("transform", `translate3d(${transformPercent}%,0,0)`);

		transformPercentPath.transformPercent = transformPercent;

		if (auto) {
			autoSlide(container);
		}

	}

	function touchStart(container, startX) {

		let path = objIndex(settings, container);
		let resIndex = path.resIndex;

		let startXPath = genDynamicPath(false, path, resIndex, 'startX');

		startXPath.startX = startX;

	}

	function touchMove(container, currentX) {

		let path = objIndex(settings, container);
		let resIndex = path.resIndex;

		let numOfSlides = genDynamicPath(true, path, resIndex, 'numOfSlides');
		let slidesToShow = genDynamicPath(true, path, resIndex, 'slidesToShow');
		let currentSlide = genDynamicPath(true, path, resIndex, 'currentSlide');
		let startX = genDynamicPath(true, path, resIndex, 'startX');
		let containerWidth = genDynamicPath(true, path, resIndex, 'containerWidth');

		let diff = genDynamicPath(true, path, resIndex, 'diff');
		let transformPercent = genDynamicPath(true, path, resIndex, 'transformPercent');
		let transformPercentPath = genDynamicPath(false, path, resIndex, 'transformPercent');
		let slider = $(`#${container}`).find('.super-slider-track');
		let wrapper = $(`#${container}`);
		let actualCount = genDynamicPath(true, path, resIndex, 'actualCount');

		let diffPath = genDynamicPath(false, path, resIndex, 'diff');

		let slideNum = currentSlide + 1;

		// let sliderWidth = (containerWidth * slidesToShow) * slideNum;
		let sliderWidth = containerWidth * (actualCount * slidesToShow) ;

		let difference = (startX - currentX);
		let percentChange = (difference / containerWidth) * 100;

		// let percentChange = (difference / sliderWidth) * 100;
		let cumuChange = -percentChange + transformPercent;


		if ((!currentSlide && difference < 0) || (currentSlide === numOfSlides && difference > 0)) difference /= 2;

		$(wrapper).addClass('dragging');
		$(slider).css("transform", "translate3d(" + cumuChange + "%,0,0)");

		diffPath.diff = percentChange;

	}

	function touchEnd(container) {

		console.log(`container: ${container}`);

		let path = objIndex(settings, container);
		let resIndex = path.resIndex;
		
		let numOfSlides = genDynamicPath(true, path, resIndex, 'numOfSlides');
		let slidesToShow = genDynamicPath(true, path, resIndex, 'slidesToShow');
		let currentSlide = genDynamicPath(true, path, resIndex, 'currentSlide');
		let currentSlidePath = genDynamicPath(false, path, resIndex, 'currentSlide');
		let actualCount = genDynamicPath(true, path, resIndex, 'actualCount')-1;
		let slider = $(`#${container}`).find('.super-slider-track');
		let wrapper = $(`#${container}`);
		let diffPath = genDynamicPath(false, path, resIndex, 'diff');

		let diff = genDynamicPath(true, path, resIndex, 'diff');
		let infinite = genDynamicPath(true, path, resIndex, 'infinite');
		let currentX = genDynamicPath(true, path, resIndex, 'currentX');

		let sensor = 10;

		$(wrapper).removeClass('dragging');

		// MOVE  - DID NOT MOVE (ANIMATION)
		// if (!diff) {
		// 	console.log(diff);
			
		// }

		// MOVE - BACK
		if (diff <= -sensor) {
			if (currentSlide > 0) {
				path.currentSlide = currentSlide - 1;

			} else {
				// Loop  
				if (infinite === true) {
					path.currentSlide = actualCount;
				}

			}
		}


		// MOVE - FORWARD
		if (diff >= sensor) {
			// LESS THAN THE TOTAL NUM OF SLIDES
			if (currentSlide < actualCount) {
				path.currentSlide = currentSlide + 1;
			} else {
				// Loop  
				if (infinite === true) {
					path.currentSlide = 0;
				}

			}
		}

		diffPath.diff = 0;

		changeSlideNew(container);

	}

	function btnChangeSlide(container, direction) {


		let path = objIndex(settings, container);
		let resIndex = path.resIndex;
		let actualCount = (genDynamicPath(true, path, resIndex, 'actualCount'))-1;
		
		let currentSlide = genDynamicPath(true, path, resIndex, 'currentSlide');
		let currentSlidePath = genDynamicPath(false, path, resIndex, 'currentSlide');

		let numOfSlides = genDynamicPath(true, path, resIndex, 'numOfSlides');
		let infinite = genDynamicPath(true, path, resIndex, 'infinite');

		//Update object's currentSlide property.
		if (direction == 'left') {
			if (currentSlide > 0) {
				console.log('A        ');

				currentSlidePath.currentSlide = currentSlide - 1;
			} else {
				console.log('B        ');

				if (infinite === true) {
					// Loop through 
					currentSlidePath.currentSlide = actualCount;
				}

			}
		} else if (direction == 'right') {
			console.log('C        ');

			if (currentSlide < actualCount) {
				currentSlidePath.currentSlide = currentSlide + 1;

			} else {
				if (infinite === true) {
					// Loop through 
					currentSlidePath.currentSlide = 0;
				}

			}
		}
		changeSlideNew(container);
	}

	function pagChangeSlide(container, clickedSlide) {

		let path = objIndex(settings, container);
		let resIndex = path.resIndex;
		let currentSlidePath = genDynamicPath(false, path, resIndex, 'currentSlide');

		currentSlidePath.currentSlide = clickedSlide;

		changeSlideNew(container);
	}

	// automatic slide change
	function autoSlide(container) {

		let path = objIndex(settings, container);
		let resIndex = path.resIndex;
		
		let actualCount = (genDynamicPath(true, path, resIndex, 'actualCount'))-1;
		let currentSlide = genDynamicPath(true, path, resIndex, 'currentSlide');
		let currentSlidePath = genDynamicPath(false, path, resIndex, 'currentSlide');
		let autoPlay = genDynamicPath(true, path, resIndex, 'autoPlay');
		let autoPlaySpeed = genDynamicPath(true, path, resIndex, 'autoPlaySpeed');
		let isDragging = $(`#${container}`).hasClass('dragging');

		if (autoPlay && isDragging !== true) {
			
			autoSlideTimeout = setTimeout(function () {

				if (currentSlide < actualCount) {
					currentSlidePath.currentSlide = currentSlide + 1;
		
				} else {
					currentSlidePath.currentSlide = 0;
		
				}
				changeSlideNew(container, true);

			}, autoPlaySpeed);
		}
			


	}



	///////////////////////
	//  EVENT LISTENERS  //
	//////////////////////

	// btn
	$(document).on(touchEvent, '.super-slider .super-slider-nav .btn-arrow', function (e) {
		e.preventDefault();

		let container = $(this).closest('.super-slider').attr('id');
		let direction = $(this).closest('.super-slider-nav').data('direction');


		
		btnChangeSlide(container, direction);

	});

	// dots
	$(document).on(touchEvent, '.super-slider   .super-slider-pag-elem', function (e) {
		e.preventDefault();
		e.stopPropagation();

		let container = $(this).closest('.super-slider').attr('id');
		let clickedSlide = $(this).data("page");

		pagChangeSlide(container, clickedSlide);
	});

	// $(document).on("mousemove touchmove", function (e) {
	// 	console.log('MOUSE MOVING');
	// });

	$(document).on("mousedown touchstart", ".super-slider  ", function (e) {
		e.preventDefault();
		e.stopPropagation();


		var offset = $('.super-slider').offset();

		let container = $(this).closest('.super-slider').attr('id');

		let startX = event.pageX - offset.left;

		touchStart(container, startX);

		$(document).on("mousemove touchmove", function (e) {

			console.log('2:   ALSO MOUSE MOVING');

			var currentX = event.pageX - offset.left;

			touchMove(container, currentX);

			$(document).on("mouseleave", `#${container}` , function (e) {
				$(document).off("mousemove touchmove");

				e.preventDefault();
				let container = $(this).closest('.super-slider').attr('id');
				touchEnd(container);
			});

			
		});

		
	});

	

	$(document).on("mouseup touchend", ".super-slider ", function (e) {

		$(this).removeClass('currentlyActive');

		e.preventDefault();
		let container = $(this).closest('.super-slider').attr('id');
		$(document).off("mousemove touchmove");

		touchEnd(container);


	});
	

});