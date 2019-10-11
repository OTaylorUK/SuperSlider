/*jshint esversion: 6 */
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

		$(`#${id}`).find(".slider-pagi").empty();

		if (dots) {
			for (let i = 0; i < actualCount; i++ ){
				let listItem = `<li data-page="${i}" class='slider-pagi__elem slider-pagi__elem-${i} `;
				if (!i) {
					listItem += `active'><div></div></li>`;
				} else {
					listItem += `'><div></div></li>`;
				}
				$(`#${id}`).find(".slider-pagi").append(listItem);
			}
		}
	}

	// CAROUSEL SLIDER
	function sliderPosition(id, resIndex) {

		let path = objIndex(settings, id);
		let numberOfSlides = genDynamicPath(true, path, resIndex, 'numOfSlides');
		let slidesToShow = genDynamicPath(true, path, resIndex, 'slidesToShow');
		let actualCount = genDynamicPath(true, path, resIndex, 'actualCount');


		
		$(`#${id}`).find('.slide').each(function (i) {
			postition = (i * 100) / slidesToShow;
			width = (1 * 100) / slidesToShow;
			$(this).css('left', `${postition}%`);
			$(this).css('width', `${width}%`);
			$(this).addClass(`slide-${i}`);
		});
		
	}

	function findBreakpoint(array) {
		let responsive = array.responsive;
		let resBreakpoint,
			resIndex,
			smallest;

		resArray = [];

		responsive.forEach((el, index) => {
			let breakPoint = el.breakpoint;

			if (windowWidth > breakPoint) {
				resArray.push(breakPoint);
			} 
		});

		let currentBreakPoint = (resArray === undefined || resArray.length == 0) ? 'default' : Math.max(...resArray);
		return currentBreakPoint;
	}
	function findIndex(array, currentBreakpoint) {
		let resIndex = 'default';
		let responsive = array.responsive;

		responsive.forEach((el, index) => {
			if (el.breakpoint == currentBreakpoint) {
				resIndex = index;
				return resIndex;
			}
		});
		return resIndex;
	}

	function responsiveActive(sliderSettings) {

		let currentBreakpoint = findBreakpoint(sliderSettings, windowWidth);

		console.log(`breakpoint: ${currentBreakpoint}`);


		let responsiveIndex = findIndex(sliderSettings, currentBreakpoint);

		console.log(`responsiveIndex: ${responsiveIndex}`);

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

	function createSlider(id, sliderSettings, settings, numOfSlides) {
		
		let slider = $(`#${id}`).find('.slider');


		let resIndex = responsiveActive(sliderSettings, windowWidth);
		let path = objIndex(settings, id);
		let actualCalc = Math.ceil((numOfSlides) / genDynamicPath(true, path, resIndex, 'slidesToShow'));
		let speed = genDynamicPath(true, path, resIndex, 'animSpeed');
		
		path.resIndex = resIndex;
		path.actualCount = actualCalc;

		$(slider).css("transition", `transform ${speed}ms linear`);
		pagination(id, resIndex);
		sliderPosition(id, resIndex);


	}

	let settings = [];

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
			let slider = $(container).find('.slider');
			let numOfSlides = $(slider).find(".slide").length;
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
				infinite: false,
				navIndicator: true,
				slidesToShow: 3,
				slidesToScroll: 3,
				autoPlay: true,
				animSpeed: 500,
				slideTimer: 800,
				dots: true,
				responsive: [{
					breakpoint: 1200,
					settings: {
						slidesToShow: 3,
						infinite: false
					}
				}, {
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
					}
				}, {
					breakpoint: 768,
					settings: {
						slidesToShow: 2,
					}
				}, {
					breakpoint: 576,
					settings: {
						slidesToShow: 2,
						dots: true
					}
				}]
			};

			// CHECK IF SETTING IS SET - IF NOT REVERTS TO DEFAULT
			checkIfSet(defaultSettings, sliderSettings, objCustom);


			// ADD THIS OBJECT TO THE SETTINGS ARRAY //
			settings.push(sliderSettings);


			// CREATE SLIDER - POSITION SLIDERS & DOTS - RESPONSIVE //
			createSlider(id, sliderSettings, settings, numOfSlides);

			// ON RESIZE - RECREATE SLIDERS //
			$(window).resize(function () {
				createSlider(id, sliderSettings, settings, numOfSlides);
			});
			
		};
	})(jQuery);

	console.log(settings);

	//////////////////////
	// SLIDER FUNCTIONS //
	//////////////////////
	function changeSlideNew(container) {

		let path = objIndex(settings, container);
		let resIndex = path.resIndex;

		let numberOfSlides = genDynamicPath(true, path, resIndex, 'numOfSlides');
		let slidesToShow = genDynamicPath(true, path, resIndex, 'slidesToShow');
		let currentSlide = genDynamicPath(true, path, resIndex, 'currentSlide');
		let transformPercentPath = genDynamicPath(false, path, resIndex, 'transformPercent');
 
		let sliderContainer = $(`#${container}`).find('.slider');
		let slidePagination = $(`#${container}`).find('.slide-pagination li');


		$(slidePagination).each(function (i) {
			$(this).removeClass('active');
			if ($(this).data('page') == currentSlide) {
				$(this).addClass('active');
			}
		});


		let transformPercent = -(currentSlide * 100);

		$(sliderContainer).css("transform", `translate3d(${transformPercent}%,0,0)`);



		transformPercentPath.transformPercent = transformPercent;


	}

	function touchStart(container, startX) {

		let path = objIndex(settings, container);
		let resIndex = path.resIndex;
		console.log(resIndex);

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
		let diffTest = genDynamicPath(true, path, resIndex, 'diff');
		let transformPercent = genDynamicPath(true, path, resIndex, 'transformPercent');
		let transformPercentPath = genDynamicPath(false, path, resIndex, 'transformPercent');
		let slider = $(`#${container}`).find('.slider');

		let diffPath = genDynamicPath(false, path, resIndex, 'diff');

		let slideNum = currentSlide + 1;

		let sliderWidth = (containerWidth * slidesToShow) * slideNum;
		let difference = (startX - currentX);
		let percentChange = (difference / sliderWidth) * 100;
		let cumuChange = -percentChange + transformPercent;


		if ((!currentSlide && difference < 0) || (currentSlide === numOfSlides && difference > 0)) difference /= 2;
		$(slider).addClass('dragging');
		$(slider).css("transform", "translate3d(" + cumuChange + "%,0,0)");

		diffPath.diff = percentChange;
	}

	function touchEnd(container) {

		let path = objIndex(settings, container);
		let resIndex = path.resIndex;
		
		let numOfSlides = genDynamicPath(true, path, resIndex, 'numOfSlides');
		let slidesToShow = genDynamicPath(true, path, resIndex, 'slidesToShow');
		let currentSlide = genDynamicPath(true, path, resIndex, 'currentSlide');
		let currentSlidePath = genDynamicPath(false, path, resIndex, 'currentSlide');
		let actualCount = genDynamicPath(true, path, resIndex, 'actualCount')-1;
		let slider = $(`#${container}`).find('.slider');


		let diff = genDynamicPath(true, path, resIndex, 'diff');
		let infinite = genDynamicPath(true, path, resIndex, 'infinite');
		let currentX = genDynamicPath(true, path, resIndex, 'currentX');

		let sensor = 8;

		// MOVE  - DID NOT MOVE (ANIMATION)
		if (!diff) {
			console.log(diff);
			
		}

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
		console.log(diff);
		console.log(sensor);


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

		$(slider).removeClass('dragging');

		changeSlideNew(container);

	}

	function btnChangeSlide(container, direction) {


		let path = objIndex(settings, container);
		let resIndex = path.resIndex;
		
		let numberOfSlides = genDynamicPath(true, path, resIndex, 'numOfSlides');
		let slidesToShow = genDynamicPath(true, path, resIndex, 'slidesToShow');
		let dots = genDynamicPath(true, path, resIndex, 'dots');
		let actualCount = (genDynamicPath(true, path, resIndex, 'actualCount'))-1;
		
		let currentSlide = genDynamicPath(true, path, resIndex, 'currentSlide');
		let currentSlidePath = genDynamicPath(false, path, resIndex, 'currentSlide');

		let numOfSlides = genDynamicPath(true, path, resIndex, 'numOfSlides');
		let infinite = genDynamicPath(true, path, resIndex, 'infinite');

	
		//Update object's currentSlide property.
		if (direction == 'left') {
			if (currentSlide > 0) {
				currentSlidePath.currentSlide = actualCount - 1;
			} else {
				if (infinite === true) {
					// Loop through 
					currentSlidePath.currentSlide = actualCount;
				}

			}
		} else if (direction == 'right') {
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


		let id = container.id;
		let currentSlide = container.currentSlide;
		let numOfSlides = container.numOfSlides;
		let autoSlideDelay = container.autoSlideDelay;



		let autoSlideTimeout = setTimeout(function () {
			container.currentSlide = currentSlide + 1;

			if (currentSlide > numOfSlides) currentSlide = 0;

			changeSlideNew(container);

		}, autoSlideDelay);
	}


	///////////////////////
	//    SLIDER INIT    //
	//////////////////////	

	


	///////////////////////
	//  EVENT LISTENERS  //
	//////////////////////



	// btn
	$(document).on("click", '.slider-container  .slider-control .btn-arrow', function (e) {
		e.preventDefault();

		let container = $(this).closest('.slider-container').attr('id');
		let direction = $(this).closest('.slider-control').data('direction');

		btnChangeSlide(container, direction);

	});

	// dots
	$(document).on("click", '.slider-container   .slider-pagi__elem', function (e) {
		e.preventDefault();
		e.stopPropagation();

		let container = $(this).closest('.slider-container').attr('id');
		let clickedSlide = $(this).data("page");

		pagChangeSlide(container, clickedSlide);
	});


	$(document).on("mousedown touchstart", ".slider-container   .wrapper ", function (e) {
		e.preventDefault();
		e.stopPropagation();

		var offset = $('.slider').offset();

		let container = $(this).closest('.slider-container').attr('id');
		let startX = event.pageX - offset.left;

		touchStart(container, startX);

		$(document).on("mousemove touchmove", function (e) {
			var currentX = event.pageX - offset.left;

			touchMove(container, currentX);
		});


		$(document).on("mouseleave", ".slider-container   .wrapper ", function (e) {
			e.preventDefault();
			let container = $(this).closest('.slider-container').attr('id');
			$(document).off("mousemove touchmove");
	
			touchEnd(container);
	
		});
	});

	$(document).on("mouseup touchend", ".slider-container  .wrapper ", function (e) {
		e.preventDefault();
		let container = $(this).closest('.slider-container').attr('id');
		$(document).off("mousemove touchmove");

		touchEnd(container);


	});
	

});