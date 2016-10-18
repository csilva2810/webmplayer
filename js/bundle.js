(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var timeHelper = require('../helpers/time');

console.log(timeHelper);

var audio           = document.querySelector("#player"),
    btnPlay         = document.querySelector("#btn-play"),
    btnPause        = document.querySelector("#btn-pause"),
    btnPrev         = document.querySelector("#prev"),
    btnNext         = document.querySelector("#next"),
    btnRepeat       = document.querySelector("#repeat"),
    btnRandom       = document.querySelector("#random"),
    volumeControl   = document.querySelector("#volume"),
    timeLine        = document.querySelector("#timeline"),
    musicTimeCount  = document.querySelector("#time-count"),
    musicTime       = document.querySelector("#time"),
    musicName       = document.querySelector("#music-name"),
    playListElement = document.querySelector("#play-list"),
    loading         = document.querySelector("#loading-music"),
    flip            = document.querySelector("#flip-container"),
    rd              = new FileReader();

var Player = {};

Player.currentTrack = 0;
Player.isPlaying    = false;
Player.isRepeating  = false;
Player.isRandomized = false;
Player.playList     = [];

Player.setPlayList = function (music) {
    Player.playList.push(music);
}

Player.clearPlayList = function () {
    Player.playList = [];
}

Player.showLoading = function () {
    loading.classList.add("show");
};

Player.hideLoading = function () {
    loading.classList.remove("show");
};

//atacha a musica passada como argumento no player
Player.playMusic = function (track) {
    
    rd.onloadstart = Player.showLoading();

    rd.onload = function () {
        audio.src = this.result;
    }

    rd.readAsDataURL(Player.playList[track]);

    audio.onloadeddata = function() {
        Player.hideLoading();
        Player.play(track, parseInt(Player.currentTrack) );
        Player.currentTrack = parseInt(track) || 0;
        Player.setMusicName(Player.playList[track].name);
        Player.setTimeLineMax(this.duration);
        Player.setMusicTime(this.duration);
    };
    
};

Player.play = function (track, lastTrack) {
    
    track = track || Player.currentTrack;

    if (audio.src == "") return false;

    Player.isPlaying = true;
    audio.play(); //metodo nativo do objeto HTMLAudioElement

    flip.classList.add('is-flipped');

    if (lastTrack > -1) document.querySelector("#list-icon-"+lastTrack).classList.remove("playing");
    document.querySelector("#list-icon-"+track).classList.add("playing");
};

Player.pause = function () {
    
    if (audio.src == "") return false;

    Player.isPlaying = false;
    audio.pause(); //metodo nativo do objeto HTMLAudioElement
    
    flip.classList.remove('is-flipped');
    document.querySelector("#list-icon-"+Player.currentTrack).classList.remove("playing");
};

Player.playPrev = function () {
    if (audio.src == "") return false;
    var prev = Player.currentTrack - 1;
    
    (prev > -1) ? Player.playMusic(prev) : Player.playMusic(0);
};

Player.playNext = function () {
    if (audio.src == "") return false;

    var next = Player.currentTrack + 1;
    var lastMusic = Player.playList.length - 1;

    if (Player.isRandomized === false) {
        (next <= lastMusic) ? Player.playMusic(next) : Player.playMusic(0) ;
    } else {
        var random = Math.round( Math.random() * (lastMusic) );
        Player.playMusic(random);
    }
};

Player.repeat = function () {
    if (Player.isRepeating === false) {
        btnRepeat.classList.add('is-on');
        audio.setAttribute("loop", "");
        Player.isRepeating = true;
    } else {
        btnRepeat.classList.remove('is-on');
        audio.removeAttribute("loop");
        Player.isRepeating = false;
    }
};

Player.randomize = function () {
    if (Player.isRandomized === false) {
        btnRandom.classList.add('is-on');
        Player.isRandomized = true;
    } else {
        btnRandom.classList.remove('is-on');
        Player.isRandomized = false;
    }
};

Player.changeVolume = function () {
    audio.volume = volumeControl.value / 10;
};

Player.changeTime = function () {
    if (audio.readyState != 0) audio.currentTime = timeLine.value;
};

Player.timeLineUpdate = function () {
    timeLine.value = audio.currentTime;
};

Player.setTimeLineMax = function (time) {
    timeLine.setAttribute( "max", Math.round(time) );
};

Player.setMusicTime = function (time) {
    musicTime.innerHTML = timeHelper.secondsToTime( Math.round(time) );
};

Player.musicCountUpdate = function (time) {
    musicTimeCount.innerHTML = timeHelper.secondsToTime( Math.round(time) );
};

Player.setMusicName = function (name) {
    musicName.innerHTML = name.replace(".mp3", "");
};

Player.createPlayList = function () {
    var musicName,
        i,
        len = Player.playList.length,
        li,
        button,
        span;

    playListElement.innerHTML = "";

    for (i = 0; i < len; i += 1) {
        
        musicName = document.createTextNode(Player.playList[i].name.replace(".mp3", ""));

        li     = document.createElement("li");
        button = document.createElement("button");
        span   = document.createElement("span");

        button.setAttribute("type", "button");
        button.setAttribute("class", "btn btn-circle btn-small icon icon-play");
        
        (function (id) {
            button.addEventListener('click', function () { Player.playMusic(id) } , false);
        })(i);

        span.setAttribute("id", "list-icon-"+i);
        span.setAttribute("class", "sound-wave");
        span.innerHTML = "<span class='bar'></span><span class='bar'></span><span class='bar'></span>";

        li.setAttribute("class", "list-item");
        li.appendChild(button);
        li.appendChild(musicName);
        li.appendChild(span);
        playListElement.appendChild(li);

    };
};

//bot�es
btnPlay.addEventListener("click", function () { Player.play(Player.currentTrack) }, false);
btnPause.addEventListener("click", Player.pause, false);
btnPrev.addEventListener("click", Player.playPrev, false);
btnNext.addEventListener("click", Player.playNext, false);
btnRepeat.addEventListener("click", Player.repeat, false);
btnRandom.addEventListener("click", Player.randomize, false);

//volume
volumeControl.addEventListener("change", Player.changeVolume, false);

//timeLine
timeLine.addEventListener("change", Player.changeTime, false);
timeLine.addEventListener("mousedown", function() {
    audio.removeEventListener("timeupdate", Player.timeLineUpdate);
}, false);
timeLine.addEventListener("mouseup", function() {
    audio.addEventListener("timeupdate", Player.timeLineUpdate, false);
}, false);

//player
audio.addEventListener("ended", Player.playNext, false);
audio.addEventListener("timeupdate", Player.timeLineUpdate, false);
audio.addEventListener("timeupdate", function() { 
    Player.musicCountUpdate( Math.floor(this.currentTime) );
}, false);

module.exports = {
    setPlayList: Player.setPlayList,
    clearPlayList: Player.clearPlayList,
    playMusic: Player.playMusic.bind(Player),
    createPlayList: Player.createPlayList
}
},{"../helpers/time":3}],3:[function(require,module,exports){
function padLeft(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var secondsToTime = function (seconds) {

  if (isNaN(seconds) || seconds == "" || typeof seconds != 'number') return "00:00";

  var hours   = parseInt( seconds / 3600 ) % 24,
    minutes = parseInt( seconds / 60 ) % 60,
    seconds = parseInt( seconds % 60);

  if (hours > 0) {
    var result = padLeft(hours, 2, 0) + ':' + padLeft(minutes, 2, 0) + ':' + padLeft(seconds, 2, 0); 
  } else {
    var result = padLeft(minutes, 2, 0) + ':' + padLeft(seconds, 2, 0); 
  }

  return result;

};

module.exports = {
  secondsToTime: secondsToTime
}
},{}],4:[function(require,module,exports){
"use strict";

require('./components/dropdown.js');

var Player = require('./components/player.js');

(function () {
    
    var btnUpload   = document.querySelector("#btn-upload"),
        fileElement = document.querySelector("#file-element"),
        themeLight  = document.querySelector("#theme-light"),
        themeDark   = document.querySelector("#theme-dark"),
        btnsTheme   = document.querySelectorAll('.theme-item-btn'),
        btnsColor   = document.querySelectorAll('.btn-color'),
        
        setLocalStorage = function (item, value) {
            if (window.hasOwnProperty('localStorage')) {
                localStorage.setItem(item, value);
            }
        },

        getLocalStorage = function (item) {
            if (window.hasOwnProperty('localStorage')) {
                return localStorage.getItem(item);
            }
        },

        setTheme = function (theme) {
            
            theme = theme || "light";
            document.body.classList.remove('dark', 'light');
            document.body.classList.add(theme);
            setLocalStorage("theme", theme);
            
        },

        setColor = function (color) {

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

        Player.playMusic.apply(Player, [0]);
        Player.createPlayList();

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

}());
},{"./components/dropdown.js":1,"./components/player.js":2}],5:[function(require,module,exports){
require('./index.js');
},{"./index.js":4}]},{},[5])
//# sourceMappingURL=bundle.js.map
