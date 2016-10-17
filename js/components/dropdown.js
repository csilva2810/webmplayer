var toggles = document.querySelectorAll('.dropdown-toggle');
var dropdowns = [];

var hasClass = function (el, cl) {
	return (el.classList.toString().indexOf(cl) > -1) ? true : false;
}

if (toggles) {
	toggles.forEach(function (toggle) {
		toggle.addEventListener('click', function (e) {

			e.stopPropagation();
			
			var target = this.getAttribute('data-dropdown');
			if (!target) return false;

			var dropdown = document.querySelector('#' + target);
			if (!dropdown) return false;

			if (hasClass(dropdown, 'is-active')) {
				dropdown.classList.remove('is-active');
			} else {
				dropdown.classList.add('is-active');
				dropdowns.push(dropdown);
				dropdown.addEventListener('click', function (e) {
					e.stopPropagation();
				}, false);
			}

		}, false);
	});

	document.body.addEventListener('click', function () {

		dropdowns.forEach(function (dropdown) {
			if (hasClass(dropdown, 'is-active')) {
				dropdown.classList.remove('is-active');
				dropdowns.splice(dropdowns.indexOf(dropdown), 1);
			}
		});

	}, false);

}