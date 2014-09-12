var btnUpload   = document.querySelector("#btn-upload"),
	  fileElement = document.querySelector("#file-element"),
	  themeLight  = document.querySelector("#theme-light"),
	  themeDark   = document.querySelector("#theme-dark");
		
btnUpload.addEventListener("click", function(e) {
	if (fileElement) {
		fileElement.click();
	}
	
	e.stopPropagation();
	e.preventDefault();
}, false);

fileElement.addEventListener("change", function() {

	Player.playList = [];
	for(var i = 0, len = this.files.length; i < len; i++) {
		Player.playList.push(this.files[i]);
	}

	Player.playMusic(0);
	Player.createPlayList();

}, false);

themeLight.addEventListener("click", function() {
	setTheme(" ");
}, false);

themeDark.addEventListener("click", function() {
	setTheme("dark");
}, false);

var setTheme = function(theme) {
	document.getElementsByTagName("html")[0].className=theme;

	if ('localStorage' in window) {
		localStorage.setItem("theme", theme);
	}
};

if ('localStorage' in window) {
	if (localStorage.getItem('theme')) {
		setTheme(localStorage.getItem('theme'));
	}
};