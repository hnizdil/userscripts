// ==UserScript==
// @name         Freelo Dashboard Alpha Order
// @description  Řazení klientů na dashboardu podle abecedy
// @match        https://app.freelo.cz/dashboard
// @version      1
// @updateURL   https://raw.githubusercontent.com/hnizdil/userscripts/master/freelo-dashboard-alpha-order.user.js
// @downloadURL https://raw.githubusercontent.com/hnizdil/userscripts/master/freelo-dashboard-alpha-order.user.js
// ==/UserScript==

(function($) {
    'use strict';

	const projects = [];
	const $headers = $('a[href^="/project/"]');

	$headers.each((_, header) => {
		projects.push({
			tasks: $(header).next('ul').detach(),
			header: $(header).detach(),
		});
	});

	projects.sort((a, b) => {
		const aText = a.header.text().trim();
		const bText = b.header.text().trim();
		return aText.localeCompare(bText);
	});

	const $wrapper = $('#js-dashboard-filter-data-wrapper');

	projects.forEach(element => {
		$wrapper.append(element.header);
		$wrapper.append(element.tasks);
	});
})(jQuery);
