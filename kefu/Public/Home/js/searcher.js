/* Searcher class */
// @needs jQuery, underscore

(function($, _) {
	// constructor
	//	conditions: init value for this.conditions
	//  this.conditions: will be sent when calling api
	//		controlled by options and load methods
	//	no this.options, only this.conditions
	var Searcher = function(url, elTempl, elTarget, conditions, options) {
		this.url = url;
		this.elTempl = elTempl;
		this.elTarget = elTarget;

		this.initProps(conditions, options);

		//loading indicator, global lock
		this.isLoading = false;
		//callback for set isLoading
		this.isLoadingCallback = options.isLoadingCallback;

		//scroll loading actions
		this.isScrollLoad = options.isScrollLoad;
		this.scrollEndElement = options.scrollEndElement;

		//callback after successfully loaded a result
		// cb(result, mode)
		// console.log(options);
		this.getResultCb = options.getResultCb || function(){};

		this.template = $(this.elTempl).html();
	};

	// load methods
	Searcher.prototype.init = function() {
		this.clearTarget();
		this.load();
		if (this.isScrollLoad)
			this.setScrollEvent();
	};

	Searcher.prototype.initProps = function(conditions, options) {
		// default props
		var defaults = {
			page: 1,
			//itemPerPage: 4
			mode: 0
		};

		// set props
		this.conditions = conditions;
		this.mode = (options.mode || defaults.mode);

		//load status
		this.page = (options.page || defaults.page);
		//this.itemPerPage = options.itemPerPage || defaults.itemPerPage;
		this.currentPage = 0;
		//this.pageAll = 0;
		this.isDone = false;

		this.isFirstLoad = true;
	};

	Searcher.prototype.reload = function(conditions, options) {
		this.clearTarget();
		this.initProps(conditions, options);
		this.load();
	};

	Searcher.prototype.load = function() {
		if (this.isLoading || this.isDone)
			return false;

		this.setIsLoading(true);

		//load options from form
		this.loadOptionsFromForms();

		var apiOptions = this.conditions;
		apiOptions.p = this.page;
		//this.conditions.ps = this.itemPerPage;

		// console.log(apiOptions);
		$.ajax({
			method: "POST",
			url: this.url,
			type: "json",
			data: {
				conditions: JSON.stringify(apiOptions)
			},
			success: this.onSuccess.bind(this),
			error: this.onError.bind(this)
		});
	};

	Searcher.prototype.loadOptionsFromForms = function() {
		var dict = {};
		//default is 0
		if (this.mode == '1') {
			dict = formToDict('form#search-form-train');
		} else if (this.mode == '2') {
			dict = formToDict('form#search-form-region');
		} else if (this.mode == '3') {
			dict = formToDict('form#search-form-keyword');
		} else if (this.mode == '10') {
			dict = formToDict('form#search-form-shinkansen');
		} else { //'0'
			dict = formToDict('form#search-form-route');
		}
		// this.conditions = dict;
		if (!this.conditions) {
			this.conditions = {};
		}
		// load dict into conditions
		for (var k in dict) {
			this.conditions[k] = dict[k];
		}
	};

	//should bind this as Searcher instance when called
	//default is an ajax object
	Searcher.prototype.onSuccess = function(result) {
		if (result) {
			items = result[3];
			this.appendToTarget(items);
			this.updateOptionsByResult(result);
			this.setIsLoading(false);
			if (this.currentPage <= 1) {
				// first page, changes data
				if (typeof this.getResultCb == 'function') {
					this.getResultCb(result, this.mode);
				}
			}
			if (this.isFirstLoad) {
				this.autoScrollLoad(); //load enough items to fill window height
			}
		} else {
			this.processError();
		}
	};
	//should bind this as Searcher instance whe[3]led
	//default is ajax object
	Searcher.prototype.onError = function() {
		this.processError();
	};

	Searcher.prototype.processError = function(error) {
		this.setIsLoading(false);
		//!! when window is closed when calling api, will send this alert, how?
		alert('出现错误，请重试');
	};

	//target DOM manipulation methods
	Searcher.prototype.clearTarget = function() {
		if (this.conditions.news == 0) {
			return;
		}
		$(this.elTarget).html('');
	};

	Searcher.prototype.appendToTarget = function(items) {
		if (this.conditions.news == 0 || !items) {
			return;
		}
		$(this.elTarget).append(_.template(this.template, {items: items}));
	};

	//paging methods
	// called after a new load successed
	Searcher.prototype.calcNextPageCondition = function() {
		if (this.isDone) return false;
		this.page++;
		return true;
	};

	Searcher.prototype.updateOptionsByResult = function(result) {
		/*
			"p": 1,                    //当前页号 currentPage
			XX "pageCount": 38,            //总页数
			"ps": 15,                   //每页显示数量 pageSize
			XX "recordCount": 570,         //总记录数
		*/
		if (result && result[3]) {
			this.currentPage = this.page;
			// if (result.data.ps > 0) this.itemPerPage = result.data.ps;
			// if (result.data.pageCount) this.pageAll = result.data.pageCount;
			if (result[3].length < 1)
				this.isDone = true;
			if (!this.calcNextPageCondition())
				return false; // no more pages
			return true;
		} else {
			this.isDone = true; //no more result or ??, stop loading more
		}
		return false; //something is wrong
	};

	// loading status lock methods
	Searcher.prototype.setIsLoading = function(isLoading) {
		this.isLoading = isLoading;
		if (typeof this.isLoadingCallback === 'function')
			this.isLoadingCallback(isLoading);
	};

	// get if isLoading
	Searcher.prototype.getLoadingStatus = function() {
		return this.isLoading;
	}

	//scroll loading mthods
	Searcher.prototype.setScrollEvent = function() {
		if (!this.isScrollLoad) return false;
		var _this = this;
		$(window).scroll(function() {
			if (_this.isDone || _this.isLoading) return false;
			if ($(window).scrollTop() >= $(_this.scrollEndElement).offset().top - $(window).height()) {
				_this.load();
			}
		});
	};

	//maybe setScrollEvent is enough
	//auto scroll load if item on first page is not enough	
	Searcher.prototype.autoScrollLoad = function() {
		if (!this.isScrollLoad) return false;
		if ($(window).scrollTop() >= $(this.scrollEndElement).offset().top - $(window).height()) {
			this.load();
		} else {
			this.isFirstLoad = false; //done enough
		}
	};



	/** tool functions **/
	// $form: selector or jquery object
	function formToDict(selector) {
		var dict = {};
		var $form = $(selector);

		var inputs = $form.serializeArray();
		// inputArray to dict
		// checkboxes may have same input name
		for (var key in inputs) {
			if (!inputs.hasOwnProperty(key)) continue;
			var item = inputs[key];
			//console.log(item);
			if (!item.name) continue;
			var value = (item.value != null) ? item.value : '';
			if (dict[item.name] != null) {
				if (!dict[item.name].push) {
					//convert to array
					dict[item.name] = [dict[item.name]];
				}
				dict[item.name].push(value);
			} else {
				dict[item.name] = value;
			}
		}
		return dict;
	}



	window.Searcher = Searcher;

})(window.jQuery, _);

