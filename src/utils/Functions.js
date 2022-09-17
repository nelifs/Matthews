const { MessageEmbed } = require('discord.js');
const client = require('../index.js');

class Functions {
    classicProgressBar(current, position, width) {
        const position1 = (width * (current / position)) | 0
        return '[▬](https://www.youtube.com/watch?v=dQw4w9WgXcQ)'.repeat(position1) + '▬'.repeat((width - position1) | 0)
    }

    progressBar(track, player, length) {
        return `[▬](${track.uri})`.repeat(Math.floor(player.shoukaku.position / track.length * length)) + '▬'.repeat(length - Math.floor(player.shoukaku.position / track.length * length))
    }

    replace(string, replace) {
        return string.replace(/{(\d+)}/g, (_, i) => replace[i]);
    }

    format(millis) {
        try {
            let s = Math.floor((millis / 1000) % 60);
            let m = Math.floor((millis / (1000 * 60)) % 60);
            let h = Math.floor((millis / (1000 * 60 * 60)) % 24);
            h = h < 10 ? "0" + h : h;
            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;
            return h + ":" + m + ":" + s
        } catch (e) {
            console.error(e)
        }
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

    duration(duration) {
        if (isNaN(duration) || typeof duration === 'undefined') return '00:00';
        if (duration > 3600000000) return 'Live';
        return this.convertTime(duration, true);
    };
}

module.exports = Functions;
