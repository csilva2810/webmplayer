var Player = (function (window, document) {

        "use strict";
        var player          = document.querySelector("#player"),
            btnPlayPause    = document.querySelector("#play-pause"),
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
            currentTrack    = 0,
            isPlaying       = false,
            isRepeating     = false,
            isRandomized    = false,
            playList        = [],
            rd              = new FileReader(),

            showLoading = function () {
                loading.classList.add("show");
            },

            hideLoading = function () {
                loading.classList.remove("show");
            },

            //atacha a musica passada como argumento no player
            playMusic = function (track) {
                
                rd.onloadstart = showLoading();

                rd.onload = function () {
                    player.src = rd.result;
                }

                rd.readAsDataURL(Player.playList[track]);

                player.onloadeddata = function() {
                    play(track, parseInt(currentTrack) );
                    currentTrack = parseInt(track) || 0;
                    setTimeLineMax(player.duration);
                    setMusicTime(player.duration);
                    setMusicName(Player.playList[track].name);

                    hideLoading();
                };
                
            },

            //toca ou pausa a musica
            playPause = function () {

                if (player.src == "") return false;

                if (Player.isPlaying === false) {
                    play();
                } else {
                    pause();
                }
                
            },

            play = function (track, lastTrack) {
                if (player.src == "") return false;
                isPlaying = true;
                btnPlayPause.classList.remove("icon-play");
                btnPlayPause.classList.add("icon-pause");
                player.play(); //metodo nativo do objeto HTMLAudioElement

                document.querySelector("#list-icon-"+lastTrack).classList.remove("playing");
                document.querySelector("#list-icon-"+track).classList.add("playing");
            },

            pause = function () {
                if (player.src == "") return false;
                Player.isPlaying = false;
                btnPlayPause.classList.remove("icon-pause");
                btnPlayPause.classList.add("icon-play");
                player.pause(); //metodo nativo do objeto HTMLAudioElement
            },

            playPrev = function () {
                if (player.src == "") return false;
                var prev = currentTrack - 1;
                
                (prev > -1) ? playMusic(prev) : playMusic(0);
            },

            playNext = function () {
                if (player.src == "") return false;

                var next = currentTrack + 1;
                var lastMusic = Player.playList.length - 1;

                if (isRandomized === false) {
                    (next <= lastMusic) ? playMusic(next) : playMusic(0) ;
                } else {
                    var random = Math.round( Math.random() * (lastMusic) );
                    playMusic(random);
                }

            },

            repeat = function () {
                if (isRepeating === false) {
                    btnRepeat.classList.add("on");
                    player.setAttribute("loop", "");
                    isRepeating = true;
                } else {
                    btnRepeat.classList.remove("on");
                    player.removeAttribute("loop");
                    isRepeating = false;
                }
            },

            randomize = function () {
                if (isRandomized === false) {
                    btnRandom.classList.add('on');
                    isRandomized = true;
                } else {
                    btnRandom.classList.remove('on');
                    isRandomized = false;
                }
            },

            changeVolume = function () {
                player.volume = volumeControl.value / 10;
            },

            changeTime = function () {
                if (player.readyState != 0) player.currentTime = timeLine.value;
            },

            timeLineUpdate = function () {
                timeLine.value = player.currentTime;
            },

            setTimeLineMax = function (time) {
                timeLine.setAttribute( "max", Math.round(time) );
            },

            setMusicTime = function (time) {
                musicTime.innerHTML = convertTime(time);
            },

            musicCountUpdate = function (time) {
                musicTimeCount.innerHTML = convertTime(time);
            },

            setMusicName = function (name) {
                musicName.innerHTML = name.replace(".mp3", "");
            },

            createPlayList = function () {
                var musicName,
                    i,
                    len = Player.playList.length,
                    li,
                    button,
                    span;

                playListElement.innerHTML = "";

                for (i = 0; i < len; i += 1) {
                    musicName = document.createTextNode(Player.playList[i].name.replace(".mp3", ""));

                    li = document.createElement("li");
                    button = document.createElement("button");
                    span = document.createElement("span");

                    button.setAttribute("type", "button");
                    button.setAttribute("class", "btn player-btn small icon icon-play");
                    
                    (function (id) {
                        button.addEventListener('click', function () { Player.playMusic(id) } , false);
                    })(i);

                    span.setAttribute("id", "list-icon-" + i);
                    span.setAttribute("class", "list-icon icon icon-headphones");

                    li.setAttribute("class", "list-item");
                    li.appendChild(button);
                    li.appendChild(musicName);
                    li.appendChild(span);
                    playListElement.appendChild(li);

                };
            },

            convertTime = function (time) {

                if (isNaN(time) || time == "" || typeof time != 'number') return "00:00";

                var hours   = parseInt( time / 3600 ) % 24,
                    minutes = parseInt( time / 60 ) % 60,
                    seconds = parseInt( time % 60);

                if (hours > 0) {
                    var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds); 
                } else {
                    var result = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);    
                }

                return result;

            };

            //botões
            btnPlayPause.addEventListener("click", playPause, false);
            btnPrev.addEventListener("click", playPrev, false);
            btnNext.addEventListener("click", playNext, false);
            btnRepeat.addEventListener("click", repeat, false);
            btnRandom.addEventListener("click", randomize, false);
            
            //volume
            volumeControl.addEventListener("change", changeVolume, false);
            
            //timeLine
            timeLine.addEventListener("change", changeTime, false);
            timeLine.addEventListener("mousedown", function() {
                player.removeEventListener("timeupdate", timeLineUpdate);
            }, false);
            timeLine.addEventListener("mouseup", function() {
                player.addEventListener("timeupdate", timeLineUpdate, false);
            }, false);

            //player
            player.addEventListener("ended", playNext, false);
            player.addEventListener("timeupdate", timeLineUpdate, false);
            player.addEventListener("timeupdate", function(){ musicCountUpdate( Math.floor(this.currentTime) ); } , false);

            return {
                playList: playList,
                playMusic: playMusic,
                createPlayList: createPlayList
            }

})( window, document );