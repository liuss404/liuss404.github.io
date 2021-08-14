/* ---------------------
	search menu events
-----------------------*/

// can only init once
var hasInitializedSearchEvents = false;
// cb initTabAndSearch(tabId)
function initSearchEvents(initTabAndSearch) {
	if (hasInitializedSearchEvents)
		return;

	/* shade close menus */
		$('#shade').click(function() {
			//hide twice, as already defined in common.js, but ok
			$('#shade').hide();
			$('.search-container .tab-menu').addClass('pc-hide').attr('style','');
			$('.search-container .condition-menu').addClass('pc-hide').attr('style','');
		});


	/* label click for checkbox */
		$('.checkbox-label').click(function(){
			$(this).siblings('input[type="checkbox"],input[type="radio"]').trigger("click");
		});


	/* expand search-tab-menu */
		$('.search-container .tab-indicator a.tab').click(function(){
			var $menu = $(this).parent().next('.tab-menu');
			if ($menu.hasClass('pc-hide')) {
				$('#shade').show();
				$menu.slideDown(250, function () {
					$menu.removeClass('pc-hide').attr('style','');
				});
			}
			else { //pc-hide
				$('#shade').hide();
				$menu.slideUp(250, function() {
					$menu.addClass('pc-hide').attr('style','');
				});
			}
		});

		$('.search-container .condition-indicator a').click(function(){
			var $menu = $(this).parent().next('.condition-menu');
			if ($menu.hasClass('pc-hide')) {
				$('#shade').show();
				$menu.slideDown(250, function () {
					$menu.removeClass('pc-hide').attr('style','');
				});
			}
			else { //pc-hide
				$('#shade').hide();
				$menu.slideUp(250, function() {
					$menu.addClass('pc-hide').attr('style','');
				});
			}
		});

	/* sp: toggle search-container */
		// collapse
		$('.tab-toggle a.toggle').click(function(){
			var id = $('.search-container .tab-menu a.tab.on').data('id');
			$('.search-container').slideUp(250, function() {
				$('.search-container').addClass('sp-hide').attr('style','');
				$('.tab-toggle a.toggle').removeClass('on');
				$('#tab-toggle-' + id).addClass('on');
			});
		});
		// expand
		$('.tab-toggle a.tab').click(function(){
			$(this).removeClass('on');
			$('.tab-toggle a.toggle').addClass('on');
			$('.search-container').slideDown(250, function() {
				$('.search-container').attr('style','').removeClass('sp-hide');
			});
		});


	/* switch search-tabs */
		$('.search-container .tab-menu a.tab').click(function(){
			var $menu = $(this).closest('.tab-menu');
			// switch tabs
			var id = $(this).data('id'),
				$tab = $('#tab-indicator-'+id),
				$content = $('#tab-content-'+id);
			if ($(this).hasClass('on') === false) {
				$('.search-container .tab-menu a.tab.on').removeClass('on');
				$(this).addClass('on');
			}
			if ($tab.hasClass('on') === false) {
				$('.search-container .tab-indicator a.tab.on').removeClass('on');
				$tab.addClass('on');
			}
			if ($content.hasClass('on') === false) {
				$('.search-container .tab-content.on').removeClass('on');
				$content.addClass('on');
				if (typeof initTabAndSearch == 'function') {
					initTabAndSearch(id);
				}
			}
			// close menu
			$('#shade').hide();
			$menu.attr('style','').addClass('pc-hide');
		});

	hasInitializedSearchEvents = true;
}