/* header-nav shade scroll effect */
	var navWidth, viewWidth, navPosL, navPosR,
		navShadeMin = 0,
		navShadeMax = 30,
		navShadeL,
		navShadeR;

$(function() {

	/* shade close menus */
		$('#shade').click(function() {
			$('#shade').hide();
			$('.header-nav-submenu').slideUp(250, function() {
				$('.header-nav-submenu').addClass('hide').attr('style','');
			});
			/* move to searchmenu.js
			$('.search-container .tab-menu').addClass('pc-hide').attr('style','');
			$('.search-container .condition-menu').addClass('pc-hide').attr('style','');
			*/
		});


	/* expand header-nav */
		$('a.header-nav-toggle').click(function() {
			var id = $(this).data('id');
			var $submenu = $('#'+id);
			if ($submenu.hasClass('hide')) { //show
				$('#shade').show();
				$('.header-nav-submenu').hide().addClass('hide');
				$submenu.slideDown(250, function () {
					$submenu.removeClass('hide').attr('style','');
				});
			}
			else { //hide
				$('#shade').hide();
				$submenu.slideUp(250, function() {
					$submenu.addClass('hide').attr('style','');
				});
			}
		});

	/* back to top */
		$("a.backtotop-btn").click(function() {
			$("html, body").animate({ scrollTop: 0 }, Math.abs((function(){
				if (window.scrollY) {
					return window.scrollY;
				} else {
					return document.documentElement.scrollTop;
				}
			})()) * 0.3, "swing");
			return false;
		});

		$(window).bind('scroll', function () {
			if ($(window).scrollTop() > 55) {
				$('.backtotop').css('opacity','1');
			} else {
				$('.backtotop').css('opacity','0');
			}
		});

	/* sp: header-nav shade scroll effect */
		// init values
		navShadeL = $('.header-nav-shade.left');
		navShadeR = $('.header-nav-shade.right');
		navWidth = $('.header-nav')[0].scrollWidth;
		viewWidth = $('#header-bar > .wrap').width();
		navPosL = $('.header-nav').scrollLeft();
		navPosR = navWidth - viewWidth - navPosL;

		// init right nav shade
		if (navPosR > navShadeMin) {
			navShadeR.css('opacity', Math.min(1, (navPosR - navShadeMin)/(navShadeMax - navShadeMin)));
		}
		// window on resize and init right shade
		$(window).on('resize',function () {
			viewWidth = $('#header-bar > .wrap').width();
			navPosR = navWidth - viewWidth - navPosL;
			if (navPosR <= navShadeMin) {
				navShadeR.css('opacity',0);
			} else {
				navShadeR.css('opacity', Math.min(1, (navPosR - navShadeMin)/(navShadeMax - navShadeMin)));
			}
		});

		// nav on scroll
		$('.header-nav').on('scroll', function () {
			navPosL = $(this).scrollLeft();
			navPosR = navWidth - viewWidth - navPosL;
			if (navPosL <= navShadeMin) {
				navShadeL.css('opacity',0);
			} else {
				navShadeL.css('opacity', Math.min(1, (navPosL - navShadeMin)/(navShadeMax - navShadeMin)));
			}

			if (navPosR <= navShadeMin) {
				navShadeR.css('opacity',0);
			} else {
				navShadeR.css('opacity', Math.min(1, (navPosR - navShadeMin)/(navShadeMax - navShadeMin)));
			}
		});


	/* right div scroll to fixed pos */
	var sideDiv = $('.post-box-aside-container, .news-aside-container');
	var innerDiv = sideDiv.find('.aside-inner-wrapper');
	sideDiv.parent().css({'min-height': '490px'});
	sideDiv.addClass('fixed-aside-container');
	$(window).scroll(function() {
		// use absolute div
		if (sideDiv.length == 0) return false;

		var pos = sideDiv.parent().offset().top - $(window).scrollTop();
		//cannot go pass the footer
		var posMax = $('footer').offset().top - sideDiv.offset().top - innerDiv.height();
		if (pos < 0) {
			if (posMax > -pos) {
				innerDiv.css({'top': -pos + 'px'});
			} else {
				innerDiv.css({'top': posMax + 'px'});
			}
		} else {
			innerDiv.css({'top': '0px'});
		}

		/* fixed method
		var pos = sideDiv.parent().offset().top - $(window).scrollTop();
		if (pos < 0) {
			sideDiv.addClass('fixed-aside-container');
		} else {
			sideDiv.removeClass('fixed-aside-container')
		}
		*/
	});
});