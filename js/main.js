var btnUpload  = document.querySelector("#btn-upload"),
	fileElement = document.querySelector("#file-element");
		
btnUpload.addEventListener("click", function(e) {
	if (fileElement) {
		fileElement.click(); //chamando janela de upload
	}

	//cancelando ação padrão
	e.stopPropagation();
	e.preventDefault();
}, false);

fileElement.addEventListener("change", function() {
	//guardando cada arquivo de audio em uma playlist
	for(var i = 0, len = this.files.length; i < len; i++) {
		Player.playList.push(this.files[i]);
	}
	//carregando primeira musica por padrão
	Player.playMusic(0);

}, false);