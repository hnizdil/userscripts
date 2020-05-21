// ==UserScript==
// @name        Freelo Dashboard Task Finish
// @description Možnost ukončovat úkoly přímo z dashboardu
// @version     4
// @match       https://app.freelo.cz/dashboard
// @updateURL   https://raw.githubusercontent.com/hnizdil/userscripts/master/freelo-dashboard-finish.user.js
// @downloadURL https://raw.githubusercontent.com/hnizdil/userscripts/master/freelo-dashboard-finish.user.js
// ==/UserScript==

(function($) {
	'use strict';

	if (!$) {
		return;
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
			$star.empty();
			$star.append($checkbox);
		})
	};

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

	replaceStars();

	const dashboardBody = document.getElementById('js-dashboard-filters-body');
	const observer = new MutationObserver(replaceStars);
	observer.observe(dashboardBody, { childList: true });
})(jQuery);
