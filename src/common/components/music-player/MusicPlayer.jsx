import {
  ArrowUpwardRounded,
  PauseCircleFilledRounded,
  PlayCircleFilledRounded,
} from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsMusicPlaying } from "../../state/selectors";
import { setIsMusicPlaying } from "../../state/slice/MusicSlice";
import { loadAsyncScript } from "../../utils/common";
import styles from "./MusicPlayer.module.scss";

let widget = null;
let iframeId = "soundcloud_player";
export function MusicPlayer(props) {
  let isPlaying = useSelector(selectIsMusicPlaying);

  let dispatch = useDispatch();

  let [title, setTitle] = useState("");
  let [showEmbed, setShowEmbed] = useState(false);
  let play = (dispatchEvent = true) => {
    if (widget) {
      widget.play();
      widget.getCurrentSound((track) => setTitle(track.title));
    }

    dispatchEvent && dispatch(setIsMusicPlaying(true));
  };
  let pause = (dispatchEvent = true) => {
    if (widget) {
      widget.pause();
    }
    dispatchEvent && dispatch(setIsMusicPlaying(false));
  };

  if (isPlaying) {
    play(false);
  } else {
    pause(false);
  }

  useEffect(() => {
    loadAsyncScript("https://w.soundcloud.com/player/api.js", () => {
      widget = window.SC.Widget(iframeId);

      widget.bind(window.SC.Widget.Events.READY, () => {
        // widget.bind(window.SC.Widget.Events.PLAY, play);
        // widget.bind(window.SC.Widget.Events.PAUSE, pause);
      });
    });
  }, []);
  return (
    <div className={styles["player"]}>
      <div className={styles["embed"]} style={{ opacity: showEmbed ? 1 : 0 }}>
        <iframe
          width="100%"
          height="300"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          id={iframeId}
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/300494469&color=%23b18964&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
        ></iframe>

        {/* <div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;">
          <a
            href="https://soundcloud.com/chillhopdotcom"
            title="Chillhop Music"
            target="_blank"
            style="color: #cccccc; text-decoration: none;"
          >
            Chillhop Music
          </a>{" "}
          ·{" "}
          <a
            href="https://soundcloud.com/chillhopdotcom/sets/lofihiphop"
            title="lofi hip hop playlist"
            target="_blank"
            style="color: #cccccc; text-decoration: none;"
          >
            lofi hip hop playlist
          </a>
        </div> */}
      </div>

      <div className={styles["mini-player"]}>
        <div className={styles["cta"]}>
          {!isPlaying && <PlayCircleFilledRounded onClick={play} />}
          {isPlaying && <PauseCircleFilledRounded onClick={pause} />}

          <p className={styles["title"]}>{title || "Music Track"}</p>
        </div>
        <div
          className={
            styles["right"] + " " + (showEmbed ? styles["rotate"] : "")
          }
        >
          <ArrowUpwardRounded onClick={() => setShowEmbed(!showEmbed)} />
        </div>
      </div>
    </div>
  );
}
