Player = (function(window, document, undefined) {

	var player     = document.querySelector("#player"),
	btnPlayPause   = document.querySelector("#play-pause"),
	btnPrev 	   = document.querySelector("#prev"),
	btnNext 	   = document.querySelector("#next"),
	btnRepeat 	   = document.querySelector("#repeat"),
	btnRandom 	   = document.querySelector("#random"),
	volumeControl  = document.querySelector("#volume"),
	timeLine       = document.querySelector("#timeline"),
	musicTimeCount = document.querySelector("#time-count"),
	musicTime      = document.querySelector("#time"),
	currentTrack   = 0,
	playList 	   = [];

	//atacha a musica passado como argumento no player
	var playMusic = function(track) {
		var reader = new FileReader();

		reader.onload = (function(player){ 
			return function(e){
				player.src = e.target.result;
			}; 
		})(player);

		reader.readAsDataURL(playList[track]);
		currentTrack = parseInt(track);
	};

	//toca ou pausa a musica
	var playPause = function(button) {

		if (player.src == "") return false;

		switch (button.getAttribute("data-playState")) {
			case 'pause':
				button.setAttribute("data-playState", "play");
				button.classList.remove("icon-play");
				button.classList.add("icon-pause");
				player.play(); //metodo nativo do objeto HTMLAudioElement
			break;
			case 'play':
				button.setAttribute("data-playState", "pause");
				button.classList.remove("icon-pause");
				button.classList.add("icon-play");
				player.pause(); //metodo nativo do objeto HTMLAudioElement
			break;
		}
		setTimeLineMax(player.duration);
		setMusicTime(player.duration);
	};

	//toca a musica anterior
	var playPrev = function() {

		var prev = currentTrack - 1;
		
		(prev > -1) ? playMusic(prev) : playMusic(0);

		player.onloadeddata = function(){
			this.play();
			setTimeLineMax(this.duration);
			setMusicTime(this.duration);
		};
	};

	//toca a proxima musica
	var playNext = function() {

		if (btnRandom.getAttribute("data-random") == "false") {
			var next = currentTrack + 1;
			var lastMusic = playList.length - 1;

			(next <= lastMusic) ? playMusic(next) : playMusic(0) ;

			player.onloadeddata = function() {
				this.play();
				setTimeLineMax(this.duration);
				setMusicTime(this.duration);
			};
		} else {

			var random = Math.round( Math.random() * (playList.length - 1) );

			playMusic(random);

			player.onloadeddata = function() {
				this.play();
				setTimeLineMax(this.duration);
				setMusicTime(this.duration);
			};

		}
	};

	//ativa e desativa a repeticao
	var repeat = function() {
		switch (btnRepeat.getAttribute("data-repeat")) {
			case "false":
				btnRepeat.classList.add("on");
				btnRepeat.setAttribute("data-repeat", "true");
				player.setAttribute("loop", "");
			break;
			case "true":
				btnRepeat.classList.remove("on");
				btnRepeat.setAttribute("data-repeat", "false");
				player.removeAttribute("loop");
			break;
		}
	};

	//ativa e desativa musica randomica
	var randomize = function() {
		switch (btnRandom.getAttribute("data-random")) {
			case "false":
				btnRandom.classList.add('on');
				btnRandom.setAttribute("data-random", "true");
			break;
			case "true":
				btnRandom.classList.remove('on');
				btnRandom.setAttribute("data-random", "false");
			break;
		}
	};

	//muda o volume
	var changeVolume = function() {
		player.volume = volumeControl.value / 10;
	};

	//muda o tempo atual da musica em reproducao
	var changeTime = function() {
		player.currentTime = timeLine.value;
	};

	//muda a posicao do timeline
	var timeLineUpdate = function() {
		timeLine.value = player.currentTime;
	}

	//seta o tamanho maximo do timeline
	var setTimeLineMax = function(time) {
		timeLine.setAttribute( "max", Math.round(player.duration) );
	}

	//atualiza o label do tamanho da musica
	var setMusicTime = function(time) {
		musicTime.innerHTML = convertTime(time);
	}

	//atualiza o contador de tempo da musica em reproducao
	var musicCountUpdate = function(time) {
		musicTimeCount.innerHTML = convertTime(time);
	}

	//funcao de ajuda para converter o tempo da musica de segundos para hh:mm:ss
	var convertTime = function(time) {

		var hours   = parseInt(time/3600);
		var minutes = parseInt(time/60);
		var seconds = parseInt(time%60);
		        
		hours   = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;

		minutes = (minutes > 59) ? "00" : minutes;
		seconds = (seconds > 59) ? "00" : seconds;

		return (hours > 0) ? hours+":"+minutes+":"+seconds : minutes+":"+seconds;

	}

	//botões
	btnPlayPause.addEventListener("click", function(){playPause(btnPlayPause)}, false);
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
	player.addEventListener("timeupdate", function(){musicCountUpdate( Math.floor(this.currentTime) );} , false);

	return {
		player: player,
		playList: playList,
		playMusic: playMusic
	}

})(window, document);