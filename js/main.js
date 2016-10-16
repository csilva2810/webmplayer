(function () {
    
    "use strict";
    var btnUpload   = document.querySelector("#btn-upload"),
        fileElement = document.querySelector("#file-element"),
        themeLight  = document.querySelector("#theme-light"),
        themeDark   = document.querySelector("#theme-dark"),
        colorGreen  = document.querySelector("#btn-green"),
        colorBlue   = document.querySelector("#btn-blue"),
        colorRed    = document.querySelector("#btn-red"),
        colorPink   = document.querySelector("#btn-pink"),
        htmlTag     = document.querySelector('html'),
        
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
            document.body.classList.remove('blue', 'red', 'green', 'pink');
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
        // this.files.forEach(function (file, index) {
        //     Player.setPlayList(file);
        // });
        
        for (var i = 0, len = this.files.length; i < len; i += 1) {
            Player.setPlayList(this.files[i]);
        }

        Player.playMusic.apply(Player, [0]);
        Player.createPlayList();

    }, false);

    themeLight.addEventListener("click", function () {
        setTheme("light");
    }, false);

    themeDark.addEventListener("click", function () {
        setTheme("dark");
    }, false);

    colorGreen.addEventListener("click", function () {
        setColor("green");
    }, false);

    colorBlue.addEventListener("click", function () {
        setColor("blue");
    }, false);

    colorRed.addEventListener("click", function () {
        setColor("red");
    }, false);

    colorPink.addEventListener("click", function () {
        setColor("pink");
    }, false);

}());