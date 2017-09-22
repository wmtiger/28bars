module snd {



    export function setEffect():void {

    }

    export function setBg():void {

    }

    export function playEffect(sound:egret.Sound):void {
        sound.play(0,1);
   }

    export var bgShoundChannel:egret.SoundChannel = null;
    export var bgSound:egret.Sound = null;
    /** 如果正在播放相同音乐，是否重新播放。如果正在播放音乐，是否替换 */
    export function playBg(sound:egret.Sound, replay:boolean=false, override:boolean=true):void {
        if (bgShoundChannel==null) {
            bgSound = sound;
            bgShoundChannel = sound.play();
        } else {
            if (bgShoundChannel!=null && !override) return;
            if (bgSound==sound && !replay) return;
            stopBg();
            bgSound = sound;
            bgShoundChannel = sound.play();
        }
    }
    export function stopBg():void {
        if (bgShoundChannel!=null) {
            bgShoundChannel.stop();
            bgShoundChannel = null;
        }
    }

}
