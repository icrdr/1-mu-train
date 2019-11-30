import React from "react";
import {ReactFlvPlayer} from 'react-flv-player'


const Live: React.FC = () => {
  return (
    <div>
       <ReactFlvPlayer
          url = "http://47.100.98.20:8080/live/test.flv"
          width = "100%"
          isMuted={true}
        />
    </div>
  );
};

export default Live;
