var timeHelper = require('../helpers/time');

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

var Player = {
    currentTrack : 0,
    isPlaying    : false,
    isRepeating  : false,
    isRandomized : false,
    playList     : []
};

var setPlayList = function (music) {
    Player.playList.push(music);
}

var activateListItem = function (id) {
    document.querySelector("#list-item-" + id).classList.add("is-active");
    document.querySelector("#list-icon-" + id).classList.add("is-active");
}

var inactivateListItem = function (id) {
    document.querySelector("#list-item-" + id).classList.remove("is-active");
    document.querySelector("#list-icon-" + id).classList.remove("is-active");
}

var clearPlayList = function () {
    Player.playList = [];
}

var showLoading = function () {
    loading.classList.add("show");
};

var hideLoading = function () {
    loading.classList.remove("show");
};

var playMusic = function (track) {
    
    rd.onloadstart = function () {
        showLoading();
    };

    rd.onload = function () {
        audio.src = this.result;
    };

    rd.readAsDataURL(Player.playList[track]);

    audio.onloadeddata = function() {
        
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

var pause = function () {
    
    if (audio.src == "") return false;

    flip.classList.remove('is-flipped');
    inactivateListItem(Player.currentTrack);
    
    Player.isPlaying = false;
    audio.pause();
    
};

var resume = function () {
    
    if (audio.src == "") return false;

    flip.classList.add('is-flipped');
    activateListItem(Player.currentTrack);
    
    Player.isPlaying = true;
    audio.play();
    
}

var playPrev = function () {
    
    if (audio.src == "") return false;
    
    var prev = Player.currentTrack - 1;
    (prev > -1) ? playMusic(prev) : playMusic(0);
    
};

var playNext = function () {
    
    if (audio.src == "") return false;
    
    var next      = Player.currentTrack + 1;
    var lastMusic = Player.playList.length - 1;
    var random    = Math.round( Math.random() * lastMusic );

    if (!Player.isRandomized) {
        (next <= lastMusic) ? playMusic(next) : playMusic(0);
    } else {
        playMusic(random);
    }
    
};

var repeat = function () {
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

var randomize = function () {
    if (!Player.isRandomized) {
        btnRandom.classList.add('is-on');
        Player.isRandomized = true;
    } else {
        btnRandom.classList.remove('is-on');
        Player.isRandomized = false;
    }
};

var changeVolume = function () {
    audio.volume = volumeControl.value / 10;
};

var changeTime = function () {
    if (audio.readyState != 0) audio.currentTime = timeLine.value;
};

var timeLineUpdate = function () {
    timeLine.value = audio.currentTime;
};

var setTimeLineMax = function (time) {
    timeLine.setAttribute( "max", Math.round(time) );
};

var setMusicTime = function (time) {
    musicTime.innerHTML = timeHelper.secondsToTime( Math.round(time) );
};

var musicCountUpdate = function (time) {
    musicTimeCount.innerHTML = timeHelper.secondsToTime( Math.round(time) );
};

var setMusicName = function (name) {
    musicName.innerHTML = name.replace(".mp3", "");
};

var createPlayList = function () {
    
    var musicName, i, li, button, span,
        len = Player.playList.length;

    playListElement.innerHTML = "";

    for (i = 0; i < len; i += 1) {
        
        musicName = document.createTextNode(Player.playList[i].name.replace(".mp3", ""));

        li     = document.createElement("li");
        button = document.createElement("button");
        span   = document.createElement("span");

        button.setAttribute("type", "button");
        button.setAttribute("class", "btn btn-circle btn-small");
        button.innerHTML = '<i class="icon icon-play"></i>';
        
        (function (id) {
            button.addEventListener('click', function () { 
                playMusic(id);
            }, false);
        })(i);

        span.setAttribute("id", "list-icon-"+i);
        span.setAttribute("class", "sound-wave");
        span.innerHTML = "<span class='bar'></span><span class='bar'></span><span class='bar'></span>";
    
        li.setAttribute("id", "list-item-"+i);
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
timeLine.addEventListener("mousedown", function() {
    audio.removeEventListener("timeupdate", timeLineUpdate);
}, false);
timeLine.addEventListener("mouseup", function() {
    audio.addEventListener("timeupdate", timeLineUpdate, false);
}, false);

//player
audio.addEventListener("ended", playNext, false);
audio.addEventListener("timeupdate", timeLineUpdate, false);
audio.addEventListener("timeupdate", function() { 
    musicCountUpdate( Math.floor(this.currentTime) );
}, false);

module.exports = {
    setPlayList: setPlayList,
    clearPlayList: clearPlayList,
    playMusic: playMusic,
    createPlayList: createPlayList
}