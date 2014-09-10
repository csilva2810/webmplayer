Player = (function(window, document, undefined) {

	var player   = document.querySelector("#player"),
	btnPlayPause = document.querySelector("#btn-play-pause"),
	btnPrev 	 = document.querySelector("#btn-prev"),
	btnNext 	 = document.querySelector("#btn-next"),
	btnRepeat 	 = document.querySelector("#btn-repeat"),
	btnRandom 	 = document.querySelector("#btn-random"),
	currentTrack = 0,
	playList 	 = [];

	var playMusic = function(track) {
		console.log(track);
		var reader = new FileReader();

		reader.onload = (function(playerElement){ 
			return function(e){
				playerElement.src = e.target.result;
			}; 
		})(player);

		reader.readAsDataURL(playList[track]);
		currentTrack = parseInt(track);
	};

	var playPause = function(button) {
		switch (button.getAttribute("data-playState")) {
			case 'pause':
				button.setAttribute("data-playState", "play");
				button.textContent = "||";
				player.play(); //metodo nativo do objeto HTMLAudioElement
			break;
			case 'play':
				button.setAttribute("data-playState", "pause");
				button.textContent = "|>";
				player.pause(); //metodo nativo do objeto HTMLAudioElement
			break;
		}
	};

	var playPrev = function() {

		var prev = currentTrack - 1;
		
		(prev > -1) ? playMusic(prev) : playMusic(0);

		player.onloadeddata = function(){
			this.play();
		};
	};

	var playNext = function() {

		if (btnRandom.getAttribute("data-random") == "false") {
			var next = currentTrack + 1;
			var lastMusic = playList.length - 1;

			(next <= lastMusic) ? playMusic(next) : playMusic(0) ;

			player.onloadeddata = function() {
				this.play();
			};
		} else {

			var random = Math.round( Math.random() * (playList.length - 1) );

			playMusic(random);

			player.onloadeddata = function() {
				this.play();
			};

		}
	};

	var repeat = function() {
		switch (btnRepeat.getAttribute("data-repeat")) {
			case "false":
				btnRepeat.textContent = "Repeat On";
				btnRepeat.setAttribute("data-repeat", "true");
				player.setAttribute("loop", "");
			break;
			case "true":
				btnRepeat.textContent = "Repeat Off";
				btnRepeat.setAttribute("data-repeat", "false");
				player.removeAttribute("loop");
			break;
		}
	};

	var randomize = function() {
		switch (btnRandom.getAttribute("data-random")) {
			case "false":
				btnRandom.textContent = "Random On";
				btnRandom.setAttribute("data-random", "true");
			break;
			case "true":
				btnRandom.textContent = "Random Off";
				btnRandom.setAttribute("data-random", "false");
			break;
		}
	};

	//adicionando eventListeners aos controles do player
	btnPlayPause.addEventListener("click", function(){playPause(btnPlayPause)}, false);
	btnPrev.addEventListener("click", function(){playPrev()}, false);
	btnNext.addEventListener("click", function(){playNext()}, false);
	btnRepeat.addEventListener("click", function(){repeat()}, false);
	btnRandom.addEventListener("click", function(){randomize()}, false);

	player.addEventListener("ended", function(){playNext()}, false);

	return {
		player: player,
		playList: playList,
		playMusic: playMusic,
		currentTrack: currentTrack
	}

})(window, document);