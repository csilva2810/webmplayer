var Player = (function(window, document, undefined) {

	var player      = document.querySelector("#player"),
	btnPlayPause    = document.querySelector("#play-pause"),
	btnPrev 	      = document.querySelector("#prev"),
	btnNext 	      = document.querySelector("#next"),
	btnRepeat 	    = document.querySelector("#repeat"),
	btnRandom 	    = document.querySelector("#random"),
	volumeControl   = document.querySelector("#volume"),
	timeLine        = document.querySelector("#timeline"),
	musicTimeCount  = document.querySelector("#time-count"),
	musicTime       = document.querySelector("#time"),
	musicName       = document.querySelector("#music-name"),
	playListElement = document.querySelector("#play-list"),
	loading         = document.querySelector("#loading-music"),
  currentTrack    = 0,
	playList 	      = [];

	//atacha a musica passada como argumento no player
	var playMusic = function(track) {
		
		var reader = new FileReader();

		reader.onloadstart = showLoading();

		reader.onload = (function(player) { 
			return function(e){
				player.src = e.target.result;
			}; 
		})(player);

		reader.readAsDataURL(Player.playList[track]);
		Player.currentTrack = parseInt(track);

		player.onloadeddata = function() {
			this.play();
			setTimeLineMax(this.duration);
			setMusicTime(this.duration);
			setMusicName(Player.playList[track].name);

			hideLoading();
		};
		
	};

	//toca ou pausa a musica
	var playPause = function() {

		if (player.src == "") return false;

		switch (btnPlayPause.getAttribute("data-playState")) {
			case 'pause':
				btnPlayPause.setAttribute("data-playState", "play");
				btnPlayPause.classList.remove("icon-play");
				btnPlayPause.classList.add("icon-pause");
				player.play(); //metodo nativo do objeto HTMLAudioElement
			break;
			case 'play':
				btnPlayPause.setAttribute("data-playState", "pause");
				btnPlayPause.classList.remove("icon-pause");
				btnPlayPause.classList.add("icon-play");
				player.pause(); //metodo nativo do objeto HTMLAudioElement
			break;
		}

		setTimeLineMax(player.duration);
		setMusicTime(player.duration);
		setMusicName(Player.playList[Player.currentTrack].name);
		
	};

	//toca a musica anterior
	var playPrev = function() {
		var prev = Player.currentTrack - 1;
		
		(prev > -1) ? playMusic(prev) : playMusic(0);

		player.onloadeddata = function(){
			this.play();
			setTimeLineMax(this.duration);
			setMusicTime(this.duration);
			setMusicName(Player.playList[prev].name);

			hideLoading();
		};
	};

	//toca a proxima musica
	var playNext = function() {

		if (btnRandom.getAttribute("data-random") == "false") {
			var next = Player.currentTrack + 1;
			var lastMusic = Player.playList.length - 1;

			(next <= lastMusic) ? playMusic(next) : playMusic(0) ;

			player.onloadeddata = function() {
				this.play();
				setTimeLineMax(this.duration);
				setMusicTime(this.duration);
				setMusicName(Player.playList[next].name);

				hideLoading();
			};
		} else {

			var random = Math.round( Math.random() * (Player.playList.length - 1) );

			playMusic(random);

			player.onloadeddata = function() {
				this.play();
				setTimeLineMax(this.duration);
				setMusicTime(this.duration);
				setMusicName(Player.playList[random].name);

				hideLoading();
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
	};

	//seta o tamanho maximo do timeline
	var setTimeLineMax = function(time) {
		timeLine.setAttribute( "max", Math.round(time) );
	};

	//atualiza o label do tamanho da musica
	var setMusicTime = function(time) {
		musicTime.innerHTML = convertTime(time);
	};

	//atualiza o contador de tempo da musica em reproducao
	var musicCountUpdate = function(time) {
		musicTimeCount.innerHTML = convertTime(time);
	};

	var setMusicName = function(name) {
		musicName.innerHTML = name.replace(".mp3", "");
	};

	//cria a playlist das musicas selecionadas
	var createPlayList = function() {
		var listItem, musicName;
		playListElement.innerHTML = "";
		for (var i = 0, len = Player.playList.length; i < len; i++) {
			musicName = Player.playList[i].name.replace(".mp3", "");
			listItem = "<li class='list-item' id='list-item-"+i+"'>";
			listItem+= "    <button type='button' onclick=\"Player.playMusic("+i+");\" class='btn player-btn small icon icon-play'></button> - "+musicName+"";
			listItem+= "    <span class='playing-icon icon icon-headphones'></span>";
			listItem+= "</li>";
			playListElement.innerHTML += listItem;
		};
	};

	var showLoading = function() {
		loading.classList.add("show");
	};

	var hideLoading = function() {
		loading.classList.remove("show");
	};

	//funcao de ajuda para converter o tempo da musica de segundos para hh:mm:ss
	var convertTime = function(time) {

		if (isNaN(time) || time == "" || typeof time != 'number') return "00:00";

		var hours   = parseInt( time / 3600 ) % 24;
		var minutes = parseInt( time / 60 ) % 60;
		var seconds = parseInt( time % 60);

		if (hours > 0) {
			var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);	
		} else {
			var result = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);	
		}

		return result;

	}

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
	player.addEventListener("timeupdate", function(){musicCountUpdate( Math.floor(this.currentTime) );} , false);

	return {
		playList: playList,
		playMusic: playMusic,
		createPlayList: createPlayList
	}

})(window, document);