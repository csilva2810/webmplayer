Player = (function(window, document, undefined) {

	var player  		 = document.querySelector("#player"),
			btnPlayPause = document.querySelector("#btn-play-pause"),
			btnPrev 		 = document.querySelector("#btn-prev"),
			btnNext 		 = document.querySelector("#btn-next"),
			currentTrack = 0;
			prevTrack    = currentTrack - 1;
			nextTrack    = currentTrack + 1;
			playList 		 = [];

	var setMusic = function(track) {
		var reader = new FileReader();

		reader.onload = (function(player){ 
			return function(e){
				player.src = e.target.result;
			}; 
		})(this.player);

		reader.readAsDataURL(this.playList[track]);
		this.currentTrack = parseInt(track);
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
		
		setMusic(--currentTrack);

		this.player.onloadeddata = function(){
			this.play();
		};
	};

	var playNext = function() {
		
		setMusic(++currentTrack);

		this.player.onloadeddata = function(){
			this.play();
		};
	};

	//adicionando eventListeners aos controles do player
	btnPlayPause.addEventListener("click", function(){playPause(btnPlayPause)}, false);
	btnPrev.addEventListener("click", function(){playPrev()}, false);
	btnNext.addEventListener("click", function(){playNext()}, false);

	return {
		player: player,
		playList: playList,
		setMusic: setMusic
	}

})(window, document);