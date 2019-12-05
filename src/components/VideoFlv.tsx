import React, { useEffect, useRef, useState } from "react";
import flvjs from "flv.js";
import { Icon, Button } from "antd";
import useInterval from "../hooks/useInterval";

const Video: React.FC<any> = ({ url, isSteaming, setLiveState, ...rest }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [player, setPlayer] = useState();
  const [isPlaying, setPlay] = useState(true);

  useEffect(() => {
    const videoDom = videoRef.current!;
    const flvPlayer = flvjs.createPlayer(
      {
        type: "flv",
        url: url,
        isLive: true
      },
      { enableStashBuffer: false }
    );

    setPlayer(flvPlayer);
    flvPlayer.attachMediaElement(videoDom);
    flvPlayer.load();
    flvPlayer.play();

    let errCount = 0;
    flvPlayer.on(flvjs.Events.STATISTICS_INFO, (err: any) => {
      if (err.speed === 0) {
        if (errCount > 4) {
          errCount = 0;
          setLiveState(1);
        }
        errCount++;
      }
    });

    return () => {
      console.log("destroy player");
      flvPlayer.pause();
      flvPlayer.unload();
      flvPlayer.detachMediaElement();
      flvPlayer.destroy();
    };
  }, []);

  return (
    <div {...rest}>
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        controls
        autoPlay
        muted
      />
      {/* <div className="video-controls-container">
        <button
          className="video-controls-button"
          onClick={() => {
            if (!player) return;
            if (!isPlaying) {
              player.play();
              setPlay(true);
            } else {
              player.pause();
              setPlay(false);
            }
          }}
        >
          {isPlaying ? (
            <i className="iconfont icon-play" />
          ) : (
            <i className="iconfont icon-pause" />
          )}
        </button>
      </div> */}
    </div>
  );
};

export default Video;
