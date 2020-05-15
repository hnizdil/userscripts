// ==UserScript==
// @name         Freelo dashboard task finish
// @description  Možnost ukončovat úkoly přímo z dashboardu
// @version     1
// @match        https://app.freelo.cz/dashboard
// ==/UserScript==

(function($) {
	'use strict';

	const $tasks = $('div.task-new-dashboard');

	$tasks.forEach(task => {
		const $checkbox = $('<input type=checkbox class=finish />');
		const $star = $('.task-new-dashboard__my-priority', task);
		$checkbox.css('margin', 0);
		$star.empty();
		$star.append($checkbox);
	})

	$(document).on('change', ':checkbox.finish', event => {
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
})(jQuery);
