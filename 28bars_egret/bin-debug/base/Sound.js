var snd;
(function (snd) {
    function setEffect() {
    }
    snd.setEffect = setEffect;
    function setBg() {
    }
    snd.setBg = setBg;
    function playEffect(sound) {
        sound.play(0, 1);
    }
    snd.playEffect = playEffect;
    snd.bgShoundChannel = null;
    snd.bgSound = null;
    /** 如果正在播放相同音乐，是否重新播放。如果正在播放音乐，是否替换 */
    function playBg(sound, replay, override) {
        if (replay === void 0) { replay = false; }
        if (override === void 0) { override = true; }
        if (snd.bgShoundChannel == null) {
            snd.bgSound = sound;
            snd.bgShoundChannel = sound.play();
        }
        else {
            if (snd.bgShoundChannel != null && !override)
                return;
            if (snd.bgSound == sound && !replay)
                return;
            stopBg();
            snd.bgSound = sound;
            snd.bgShoundChannel = sound.play();
        }
    }
    snd.playBg = playBg;
    function stopBg() {
        if (snd.bgShoundChannel != null) {
            snd.bgShoundChannel.stop();
            snd.bgShoundChannel = null;
        }
    }
    snd.stopBg = stopBg;
})(snd || (snd = {}));
//# sourceMappingURL=Sound.js.map