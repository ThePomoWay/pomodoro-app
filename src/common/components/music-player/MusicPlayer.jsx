import {
  ArrowUpwardRounded,
  PauseCircleFilledRounded,
  PlayCircleFilledRounded,
} from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDefaultMusic,
  selectIsMusicPlaying,
  selectIsTimerFullScreen,
  selectPomoState,
  selectVolume,
} from "../../state/selectors";
import {
  setHasInteracted,
  setIsMusicPlaying,
} from "../../state/slice/MusicSlice";
import { loadAsyncScript } from "../../utils/common";
import { HideOnFullScreen } from "../hide-on-full-screen/HideOnFullScreen";
import styles from "./MusicPlayer.module.scss";

import { ReactComponent as SettingsIcon } from "../../svgs/SettingsIcon.svg";
import {
  setSettingsModal,
  setSettingsTab,
  showErrorToast,
} from "../../state/slice/GlobalSlice";
import {
  POMO_IDLE_STATE,
  POMO_PAUSED_STATE,
  POMO_RUNNING_STATE,
} from "../../utils/constants";
import { useLocation } from "react-router-dom";
import { MUSIC } from "../../state/reducers/MusicReducer";

let widget = null;
let iframeId = "soundcloud_player";
export function MusicPlayer(props) {
  let isPlaying = useSelector(selectIsMusicPlaying);

  let pomoState = useSelector(selectPomoState);
  let isFullScreen = useSelector(selectIsTimerFullScreen);
  let volume = useSelector(selectVolume);
  let defaultMusic = useSelector(selectDefaultMusic);

  let location = useLocation();

  let dispatch = useDispatch();

  let [title, setTitle] = useState("");
  let [showEmbed, setShowEmbed] = useState(false);
  let play = (dispatchEvent = true) => {
    if (dispatchEvent && pomoState !== POMO_RUNNING_STATE) {
      dispatch(showErrorToast("Music will play during a pomodoro session"));
    } else {
      if (widget) {
        widget.play();
        widget.getCurrentSound((track) => setTitle(track.title));
      }

      dispatchEvent && dispatch(setHasInteracted(true));

      dispatchEvent && dispatch(setIsMusicPlaying(true));
    }
  };
  let pause = (dispatchEvent = true) => {
    if (widget) {
      widget.pause();
    }
    dispatchEvent && dispatch(setIsMusicPlaying(false));
  };

  let openSettingsModal = () => {
    dispatch(setSettingsModal(true));
    dispatch(setSettingsTab(3));
  };

  if (isPlaying) {
    play(false);
  } else {
    pause(false);
  }

  useEffect(() => {
    if (navigator.userAgent !== "ReactSnap") {
    loadAsyncScript("https://w.soundcloud.com/player/api.js", () => {
      widget = window.SC.Widget(iframeId);

      widget.bind(window.SC.Widget.Events.READY, () => {
        // widget.bind(window.SC.Widget.Events.PLAY, play);
        // widget.bind(window.SC.Widget.Events.PAUSE, pause);
      });
    });

    return () => {
      if (widget) {
        widget.pause();
      }
      widget = null;
    };
  }
  }, []);

  useEffect(() => {
    if (widget) {
      widget.setVolume(volume === undefined ? 100 : volume);
    }
  }, [volume]);

  useEffect(() => {
    if (
      widget &&
      pomoState !== POMO_IDLE_STATE &&
      pomoState !== POMO_RUNNING_STATE &&
      pomoState !== POMO_PAUSED_STATE
    ) {
      widget.pause();
    }
  }, [pomoState]);

  let showComponent =
    isFullScreen &&
    (location.pathname === "/" ||
      location.pathname === "/home" ||
      location.pathname === "/app") &&
    (pomoState === POMO_IDLE_STATE ||
      pomoState === POMO_PAUSED_STATE ||
      pomoState === POMO_RUNNING_STATE) &&
    defaultMusic === MUSIC.LOFI;

    if(navigator.userAgent === 'ReactSnap') {
      return (<div></div>)
    }
  return (
    <HideOnFullScreen>
      <div
        className={styles["player"]}
        style={{
          display: showComponent ? "block" : "none",
        }}
      >
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
          <div className={styles["right"]}>
            <SettingsIcon
              style={{ width: "20px" }}
              onClick={openSettingsModal}
            />
            <ArrowUpwardRounded
              className={
                styles["arrow"] + " " + (showEmbed ? styles["rotate"] : "")
              }
              onClick={() => setShowEmbed(!showEmbed)}
            />
          </div>
        </div>
      </div>
    </HideOnFullScreen>
  );
}
