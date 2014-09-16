var btnUpload   = document.querySelector("#btn-upload"),
	fileElement = document.querySelector("#file-element"),
	themeLight  = document.querySelector("#theme-light"),
	themeDark   = document.querySelector("#theme-dark"),
	colorGreen  = document.querySelector("#btn-green"),
	colorBlue   = document.querySelector("#btn-blue"),
	colorRed    = document.querySelector("#btn-red"),
	colorPink   = document.querySelector("#btn-pink");
		
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
	setTheme("light");
}, false);

themeDark.addEventListener("click", function() {
	setTheme("dark");
}, false);

colorGreen.addEventListener("click", function() {
	setColor("green");
}, false);

colorBlue.addEventListener("click", function() {
	setColor("blue");
}, false);

colorRed.addEventListener("click", function() {
	setColor("red");
}, false);

colorPink.addEventListener("click", function() {
	setColor("pink");
}, false);

var setTheme = function(theme) {
	document.querySelector("html").className = document.querySelector("html").className.replace(/(dark|light)/g, theme);
	document.querySelector("html").classList.add(theme);

	setLocalStorage("theme", theme);
};

var setColor = function(color) {
	document.querySelector("html").className = document.querySelector("html").className.replace(/(blue|red|green|pink)/g, color);
	document.querySelector("html").classList.add(color);

	setLocalStorage("color", color);
};

var setLocalStorage = function(item, value) {
	if ('localStorage' in window) {
		localStorage.setItem(item, value);
	} else {
		return "";
	}
}

var getLocalStorage = function(item) {
	if (localStorage.getItem(item)) {
		return localStorage.getItem(item);
	} else {
		return "";
	}
}

if ('localStorage' in window) {
	setTheme(getLocalStorage('theme'));
	setColor(getLocalStorage('color'));
};