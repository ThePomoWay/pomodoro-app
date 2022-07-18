import {
  PauseCircleFilledRounded,
  PlayCircleFilledOutlined,
  PlayCircleFilledRounded,
} from "@material-ui/icons";
import { useEffect, useState } from "react";
import { loadAsyncScript } from "../../utils/common";
import styles from "./MusicPlayer.module.scss";

let widget = null;
let iframeId = "soundcloud_player";
export function MusicPlayer(props) {
  let [isPlaying, setIsPlaying] = useState(false);
  let play = () => {
    widget.play();
    setIsPlaying(true);
  };
  let pause = () => {
    widget.pause();
    setIsPlaying(false);
  };

  useEffect(() => {
    loadAsyncScript("https://w.soundcloud.com/player/api.js", () => {
      widget = window.SC.Widget(iframeId);
    });
  }, []);
  return (
    <div className={styles["player"]}>
      <div className={styles["embed"]}>
        <iframe
          width="100%"
          height="300"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          id={iframeId}
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/300494469&color=%23ff5500&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
        ></iframe>
      </div>

      <div className={styles["mini-player"]}>
        <div className={styles["cta"]}>
          {!isPlaying && <PlayCircleFilledRounded onClick={play} />}
          {isPlaying && <PauseCircleFilledRounded onClick={pause} />}
        </div>
      </div>
    </div>
  );
}
