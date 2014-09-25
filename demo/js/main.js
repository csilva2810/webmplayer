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
            if (localStorage) {
                localStorage.setItem(item, value);
            } else {
                return "";
            }
        },

        getLocalStorage = function (item) {
            if (localStorage.getItem(item)) {
                return localStorage.getItem(item);
            }

            return "";
        },

        setTheme = function (theme) {
            htmlTag.className = document.querySelector("html").className.replace(/(dark|light)/g, "");
            htmlTag.classList.add(theme);

            setLocalStorage("theme", theme);
        },

        setColor = function (color) {
            htmlTag.className = document.querySelector("html").className.replace(/(blue|red|green|pink)/g, "");
            htmlTag.classList.add(color);

            setLocalStorage("color", color);
        };

    if (localStorage) {
        setTheme(getLocalStorage('theme'));
        setColor(getLocalStorage('color'));
    }

    btnUpload.addEventListener("click", function (e) {
        if (fileElement) {
            fileElement.click();
        }

        e.stopPropagation();
        e.preventDefault();
    }, false);

    fileElement.addEventListener("change", function () {
        var i,
            len = this.files.length;

        Player.playList = [];
        for (i = 0; i < len; i += 1) {
            Player.playList.push(this.files[i]);
        }

        Player.playMusic(0);
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