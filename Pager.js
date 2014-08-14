(function ($) {
	$.fn.pager = function (opts) {
		var settings = {
			count: 5,//显示的页数量
			url: null,//翻页Url
			pageName: "page",
			total: 0,//页总数
			current: 0,//当前页
			onChanging: null//翻页事件
		};
		this.settings = $.extend(settings, opts);
		$.proxy(builder, this)();
	};
	function builder() {
		this.empty();
		$.proxy(buildFirst, this)();
		$.proxy(buildPrev, this)();
		$.proxy(buildPage, this)();
		$.proxy(buildNext, this)();
		$.proxy(buildLast, this)();
	}
	function buildFirst() {
		if ($.proxy(isFirst, this)()) {
			this.append(buildDisabledTemp('首页'));
		} else {
			this.append($.proxy(buildEnabledTemp, this)(1, '首页'));
		}
	}
	function buildPrev() {
		if ($.proxy(hasPrev, this)()) {
			this.append($.proxy(buildEnabledTemp, this)($.proxy(getPrev, this)(), '上一页'));
		} else {
			this.append(buildDisabledTemp('上一页'));
		}
	}
	function buildPage() {
		var start = $.proxy(getCurrentSectionStart, this)();
		var end = $.proxy(getCurrentSectionEnd, this)();
		if ($.proxy(hasPrevSection, this)()) {
			this.append($.proxy(buildDotTemp, this)(start - 1));
		}
		for (; start <= end; start++) {
			if (start == this.settings.current) {
				this.append('<span class="mod_page_on" style="margin-right:5px;">' + this.settings.current + '</span>');
			} else {
				this.append($.proxy(buildEnabledTemp, this)(start, start));
			}
		}
		if ($.proxy(hasNextSection, this)()) {
			this.append($.proxy(buildDotTemp, this)(end + 1));
		}
	}
	function buildNext() {
		if ($.proxy(hasNext, this)()) {
			this.append($.proxy(buildEnabledTemp, this)($.proxy(getNext, this)(), '下一页'));
		} else {
			this.append(buildDisabledTemp('下一页'));
		}
	}
	function buildLast() {
		if ($.proxy(isLast, this)()) {
			this.append(buildDisabledTemp('末页'));
		} else {
			this.append($.proxy(buildEnabledTemp, this)(this.settings.total, '末页'));
		}
	}
	function buildDisabledTemp(text) {
		return '<a disabled="disabled" style="margin-right:5px;">' + text + '</a>';
	}
	function buildEnabledTemp(page, text) {
		var a = $('<a href="javascript:" style="margin-right:5px;">' + text + '</a>');
		if (this.settings.url != null) {
			a.attr('href', this.settings.url + $.proxy(getSeparator, this)() + this.settings.pageName + '=' + page);
		}
		if ($.isFunction(this.settings.onChanging)) {
			a.bind("click", $.proxy(function () { this.settings.onChanging(page); }, this));
		}
		return a;
	}
	function buildDotTemp(page) {
		var a = $('<span style="margin-right:5px;"><a href="javascript:">...</a></span>');
		if (this.settings.url != null) {
			a.find('a').attr('href', this.settings.url + $.proxy(getSeparator, this)() + this.settings.pageName + '=' + page);
		}
		if ($.isFunction(this.settings.onChanging)) {
			a.bind("click", $.proxy(function () { this.settings.onChanging(page); }, this));
		}
		return a;
	}
	function isFirst() { return this.settings.current <= 1; }
	function isLast() { return this.settings.total <= this.settings.current; }
	function hasPrev() { return !$.proxy(isFirst, this)(); }
	function hasNext() { return !$.proxy(isLast, this)(); }
	function getPrev() { return $.proxy(isFirst, this)() ? this.settings.current : this.settings.current - 1; }
	function getNext() { return $.proxy(isLast, this)() ? this.settings.current : this.settings.current + 1; }
	function hasPrevSection() { return this.settings.current > this.settings.count; }
	function hasNextSection() { return this.settings.current + parseInt(this.settings.total % this.settings.count) <= this.settings.total; }
	function getCurrentSection() { return parseInt(this.settings.current / this.settings.count) + (parseInt(this.settings.current % this.settings.count) > 0 ? 1 : 0); }
	function getCurrentSectionStart() { return ($.proxy(getCurrentSection, this)() - 1) * this.settings.count + 1; }
	function getCurrentSectionEnd() { return $.proxy(hasNextSection, this)() ? $.proxy(getCurrentSection, this)() * this.settings.count : this.settings.total; }
	function getSeparator() { return this.settings.url.indexOf("?") > 0 ? "&" : "?"; }
})(jQuery);