// ==UserScript==
// @name        Freelo Dashboard
// @version     7
// @match       https://app.freelo.io/dashboard
// @updateURL   https://github.com/hnizdil/userscripts/raw/master/freelo-dashboard.user.js
// @downloadURL https://github.com/hnizdil/userscripts/raw/master/freelo-dashboard.user.js
// ==/UserScript==

(function($) {
	'use strict';

	if (!$) {
		return;
	}

	function sortClients() {
		const $headers = $('a[href^="/project/"]');
		$headers.each((_, header) => {
			const $header = $(header);
			$header.next('ul').addBack().wrapAll(`<div class=client data-name="${$header.text().trim()}" />`);
		});
		$('.client').sort((a, b) => {
			return a.dataset.name.localeCompare(b.dataset.name);
		}).appendTo('#js-dashboard-filter-data-wrapper');
	}

	function replaceStars() {
		const $tasks = $('div.task-new-dashboard');
		$tasks.forEach(task => {
			const $star = $('.task-new-dashboard__my-priority', task);
			if ($star.length != 1) {
				return;
			}
			const $checkbox = $('<input type=checkbox class=finish-task />');
			$checkbox.css('margin', 0);
			$star.empty().append($checkbox);
		})
	}

	$(document).on('change', ':checkbox.finish-task', event => {
		const $checkbox = $(event.target);
		const isChecked = $checkbox.prop('checked');
		const taskId = $checkbox.closest('li').attr('data-task-id');
		$checkbox.prop('checked', !isChecked);
		let path;
		let data;
		if (isChecked) {
			path = 'finish';
			data = { is_finished: 'on' };
		}
		else {
			path = 'activate';
			data = null;
		}
		$.post(`/front/task/${path}/?s=-gm&tid=${taskId}`, data, (_, status) => {
			if (status == "success") {
				$checkbox.prop('checked', isChecked);
			}
		});
	});

	function observeWrapper() {
		const observer = new MutationObserver((_, observer) => {
			observer.disconnect();
			run();
			observeWrapper();
		});
		const wrapper = document.getElementById('js-dashboard-filter-data-wrapper');
		observer.observe(wrapper, { childList: true });
	}

	function observeBody() {
		const bodyObserver = new MutationObserver(() => {
			run();
			observeWrapper();
		});
		const body = document.getElementById('js-dashboard-filters-body');
		bodyObserver.observe(body, { childList: true });
	}

	function run() {
		replaceStars();
		sortClients();
	}

	run();
	observeBody();
	observeWrapper();
})(jQuery);
