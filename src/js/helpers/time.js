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