const { MessageEmbed } = require('discord.js');
const client = require('../index.js');

class Functions {
    classicProgressBar(current, position, width) {
        const position1 = (width * (current / position)) | 0
        return '[▬](https://www.youtube.com/watch?v=dQw4w9WgXcQ)'.repeat(position1) + '▬'.repeat((width - position1) | 0)
    }

    generateToken(number, symbols) {
        number = parseInt(number, 10);
        let text = '';
        let possible
        if(symbols !== true) {
            possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        } else {
            possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$%^&*()-_=+[]{}|;:/?><,.';
        }
        for (let i = 0; i < number; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    progressBar(track, player, length) {
        return `[▬](${track.uri})`.repeat(Math.floor(player.shoukaku.position / track.length * length)) + '▬'.repeat(length - Math.floor(player.shoukaku.position / track.length * length))
    }

    replace(string, replace) {
        return string.replace(/{(\d+)}/g, (_, i) => replace[i]);
    }

    numberFormat(number, decimals, decPoint, thousandsSep) {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        let n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep,
            dec = (typeof decPoint === 'undefined') ? '.' : decPoint,
            s = '',
            toFixedFix = function (n, prec) {
                let k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    convertTime(duration) {

        let milliseconds = parseInt((duration % 1000) / 100),
            seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        if (duration < 3600000) {
            return minutes + ":" + seconds;
        } else {
            return hours + ":" + minutes + ":" + seconds;
        }
    }
}

module.exports = Functions;
