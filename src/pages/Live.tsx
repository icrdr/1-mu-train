import React, { useState, useEffect } from "react";
import { ReactFlvPlayer } from "react-flv-player";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Live: React.FC = () => {
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    socket.on("send", (res: any) => setData(prev => prev.concat(res)));
  }, []);

  return (
    <div>
      <ReactFlvPlayer
        url="http://live.1-mu.net/train/steam.flv?auth_key=1575257475-0-0-8dd8042f50455d3ef4a7884628deefef"
        width="100%"
        isMuted={true}
      />
      {data.map((v, i) => (
        <div key={i}>{v}</div>
      ))}
      <button onClick={() => {
        socket.emit('send', 'ddddd');
        console.log('dddddd')
      }}>发送</button>
    </div>
  );
};

export default Live;
