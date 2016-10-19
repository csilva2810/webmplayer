(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var toggles = document.querySelectorAll('.dropdown-toggle');
var dropdowns = [];

var hasClass = function hasClass(el, cl) {
	return el.classList.toString().indexOf(cl) > -1 ? true : false;
};

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

},{}],2:[function(require,module,exports){
"use strict";

var timeHelper = require('../helpers/time');

var audio = document.querySelector("#player"),
    btnPlay = document.querySelector("#btn-play"),
    btnPause = document.querySelector("#btn-pause"),
    btnPrev = document.querySelector("#prev"),
    btnNext = document.querySelector("#next"),
    btnRepeat = document.querySelector("#repeat"),
    btnRandom = document.querySelector("#random"),
    volumeControl = document.querySelector("#volume"),
    timeLine = document.querySelector("#timeline"),
    musicTimeCount = document.querySelector("#time-count"),
    musicTime = document.querySelector("#time"),
    musicName = document.querySelector("#music-name"),
    playListElement = document.querySelector("#play-list"),
    loading = document.querySelector("#loading-music"),
    flip = document.querySelector("#flip-container"),
    rd = new FileReader();

var Player = {
    currentTrack: 0,
    isPlaying: false,
    isRepeating: false,
    isRandomized: false,
    playList: []
};

var setPlayList = function setPlayList(music) {
    Player.playList.push(music);
};

var activateListItem = function activateListItem(id) {
    document.querySelector("#list-item-" + id).classList.add("is-active");
    document.querySelector("#list-icon-" + id).classList.add("is-active");
};

var inactivateListItem = function inactivateListItem(id) {
    document.querySelector("#list-item-" + id).classList.remove("is-active");
    document.querySelector("#list-icon-" + id).classList.remove("is-active");
};

var clearPlayList = function clearPlayList() {
    Player.playList = [];
};

var showLoading = function showLoading() {
    loading.classList.add("show");
};

var hideLoading = function hideLoading() {
    loading.classList.remove("show");
};

var playMusic = function playMusic(track) {

    rd.onloadstart = function () {
        showLoading();
    };

    rd.onload = function () {
        audio.src = this.result;
    };

    rd.readAsDataURL(Player.playList[track]);

    audio.onloadeddata = function () {

        audio.play();

        flip.classList.add('is-flipped');
        if (Player.currentTrack > -1) {
            inactivateListItem(Player.currentTrack);
        }

        activateListItem(track);

        Player.isPlaying = true;
        Player.currentTrack = track;

        hideLoading();
        setMusicName(Player.playList[track].name);
        setTimeLineMax(this.duration);
        setMusicTime(this.duration);
    };
};

var pause = function pause() {

    if (audio.src == "") return false;

    flip.classList.remove('is-flipped');
    inactivateListItem(Player.currentTrack);

    Player.isPlaying = false;
    audio.pause();
};

var resume = function resume() {

    if (audio.src == "") return false;

    flip.classList.add('is-flipped');
    activateListItem(Player.currentTrack);

    Player.isPlaying = true;
    audio.play();
};

var playPrev = function playPrev() {

    if (audio.src == "") return false;

    var prev = Player.currentTrack - 1;
    prev > -1 ? playMusic(prev) : playMusic(0);
};

var playNext = function playNext() {

    if (audio.src == "") return false;

    var next = Player.currentTrack + 1;
    var lastMusic = Player.playList.length - 1;
    var random = Math.round(Math.random() * lastMusic);

    if (!Player.isRandomized) {
        next <= lastMusic ? playMusic(next) : playMusic(0);
    } else {
        playMusic(random);
    }
};

var repeat = function repeat() {
    if (!Player.isRepeating) {
        btnRepeat.classList.add('is-on');
        audio.setAttribute("loop", "");
        Player.isRepeating = true;
    } else {
        btnRepeat.classList.remove('is-on');
        audio.removeAttribute("loop");
        Player.isRepeating = false;
    }
};

var randomize = function randomize() {
    if (!Player.isRandomized) {
        btnRandom.classList.add('is-on');
        Player.isRandomized = true;
    } else {
        btnRandom.classList.remove('is-on');
        Player.isRandomized = false;
    }
};

var changeVolume = function changeVolume() {
    audio.volume = volumeControl.value / 10;
};

var changeTime = function changeTime() {
    if (audio.readyState != 0) audio.currentTime = timeLine.value;
};

var timeLineUpdate = function timeLineUpdate() {
    timeLine.value = audio.currentTime;
};

var setTimeLineMax = function setTimeLineMax(time) {
    timeLine.setAttribute("max", Math.round(time));
};

var setMusicTime = function setMusicTime(time) {
    musicTime.innerHTML = timeHelper.secondsToTime(Math.round(time));
};

var musicCountUpdate = function musicCountUpdate(time) {
    musicTimeCount.innerHTML = timeHelper.secondsToTime(Math.round(time));
};

var setMusicName = function setMusicName(name) {
    musicName.innerHTML = name.replace(".mp3", "");
};

var createPlayList = function createPlayList() {

    var musicName,
        i,
        li,
        button,
        span,
        len = Player.playList.length;

    playListElement.innerHTML = "";

    for (i = 0; i < len; i += 1) {

        musicName = document.createTextNode(Player.playList[i].name.replace(".mp3", ""));

        li = document.createElement("li");
        button = document.createElement("button");
        span = document.createElement("span");

        button.setAttribute("type", "button");
        button.setAttribute("class", "btn btn-circle btn-small");
        button.innerHTML = '<i class="icon icon-play"></i>';

        (function (id) {
            button.addEventListener('click', function () {
                playMusic(id);
            }, false);
        })(i);

        span.setAttribute("id", "list-icon-" + i);
        span.setAttribute("class", "sound-wave");
        span.innerHTML = "<span class='bar'></span><span class='bar'></span><span class='bar'></span>";

        li.setAttribute("id", "list-item-" + i);
        li.setAttribute("class", "list-item");
        li.appendChild(button);
        li.appendChild(musicName);
        li.appendChild(span);
        playListElement.appendChild(li);
    };
};

//botões
btnPlay.addEventListener("click", resume, false);
btnPause.addEventListener("click", pause, false);
btnPrev.addEventListener("click", playPrev, false);
btnNext.addEventListener("click", playNext, false);
btnRepeat.addEventListener("click", repeat, false);
btnRandom.addEventListener("click", randomize, false);

//volume
volumeControl.addEventListener("change", changeVolume, false);

//timeLine
timeLine.addEventListener("change", changeTime, false);
timeLine.addEventListener("mousedown", function () {
    audio.removeEventListener("timeupdate", timeLineUpdate);
}, false);
timeLine.addEventListener("mouseup", function () {
    audio.addEventListener("timeupdate", timeLineUpdate, false);
}, false);

//player
audio.addEventListener("ended", playNext, false);
audio.addEventListener("timeupdate", timeLineUpdate, false);
audio.addEventListener("timeupdate", function () {
    musicCountUpdate(Math.floor(this.currentTime));
}, false);

module.exports = {
    setPlayList: setPlayList,
    clearPlayList: clearPlayList,
    playMusic: playMusic,
    createPlayList: createPlayList
};

},{"../helpers/time":3}],3:[function(require,module,exports){
'use strict';

function padLeft(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var secondsToTime = function secondsToTime(seconds) {

  if (isNaN(seconds) || seconds == "" || typeof seconds != 'number') return "00:00";

  var hours = parseInt(seconds / 3600) % 24,
      minutes = parseInt(seconds / 60) % 60,
      seconds = parseInt(seconds % 60);

  if (hours > 0) {
    var result = padLeft(hours, 2, 0) + ':' + padLeft(minutes, 2, 0) + ':' + padLeft(seconds, 2, 0);
  } else {
    var result = padLeft(minutes, 2, 0) + ':' + padLeft(seconds, 2, 0);
  }

  return result;
};

module.exports = {
  secondsToTime: secondsToTime
};

},{}],4:[function(require,module,exports){
'use strict';

require('./components/dropdown.js');

var Player = require('./components/player.js');

(function () {

    var btnUpload = document.querySelector("#btn-upload"),
        fileElement = document.querySelector("#file-element"),
        themeLight = document.querySelector("#theme-light"),
        themeDark = document.querySelector("#theme-dark"),
        btnsTheme = document.querySelectorAll('.theme-item-btn'),
        btnsColor = document.querySelectorAll('.btn-color'),
        setLocalStorage = function setLocalStorage(item, value) {
        if (window.hasOwnProperty('localStorage')) {
            localStorage.setItem(item, value);
        }
    },
        getLocalStorage = function getLocalStorage(item) {
        if (window.hasOwnProperty('localStorage')) {
            return localStorage.getItem(item);
        }
    },
        setTheme = function setTheme(theme) {

        theme = theme || "light";
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(theme);
        setLocalStorage("theme", theme);
    },
        setColor = function setColor(color) {

        color = color || "green";
        document.body.className = document.body.className.replace(/(blue|red|green|pink|purple|cyan|teal|yellow|orange)/g, '');
        document.body.classList.add(color);
        setLocalStorage("color", color);
    };

    if (window.hasOwnProperty('localStorage')) {
        setTheme(getLocalStorage('theme'));
        setColor(getLocalStorage('color'));
    }

    btnUpload.addEventListener("click", function (e) {

        e.stopPropagation();
        e.preventDefault();

        if (fileElement) {
            fileElement.click();
        }
    }, false);

    fileElement.addEventListener("change", function () {

        Player.clearPlayList();

        for (var i = 0, len = this.files.length; i < len; i += 1) {
            Player.setPlayList(this.files[i]);
        }

        Player.createPlayList();
        Player.playMusic(0);
    }, false);

    btnsTheme.forEach(function (btnTheme) {
        btnTheme.addEventListener('click', function () {
            var themeScheme = this.getAttribute('data-theme-scheme');
            setTheme(themeScheme);
        }, false);
    });

    btnsColor.forEach(function (btnColor) {
        btnColor.addEventListener('click', function () {
            var color = this.getAttribute('data-theme-color');
            setColor(color);
        }, false);
    });
})();

},{"./components/dropdown.js":1,"./components/player.js":2}],5:[function(require,module,exports){
'use strict';

require('./index.js');

},{"./index.js":4}]},{},[5]);

//# sourceMappingURL=maps/bundle.js.map
