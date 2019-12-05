import React, { useState, useEffect, useRef, useCallback } from "react";

import io from "socket.io-client";
import { fetchData, updateData } from "../utility";
import { Row, Col, Icon, Button, Input, Badge } from "antd";
import { useMobile, useStore } from "../App";
import Video from "../components/VideoFlv";
import useInterval from "../hooks/useInterval";
import TextArea from "antd/lib/input/TextArea";
import { useCookies } from "react-cookie";
const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;

const CourseMainPage: React.FC<any> = ({ match }) => {
  // const [{ me }] = useStore();
  const [cookies] = useCookies();
  const me = cookies.me;
  const [courseData, setCourseData] = useState<any>();
  const [isloading, setLoading] = useState(false);
  const [liveState, setLiveState] = useState(1);
  const [isUpdate, setUpdate] = useState(true);
  const [msgList, setMessageList] = useState<Array<any>>([]);
  const isMobile = useMobile();
  const MsgContainterRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<any>();
  const [streamData, setStreamData] = useState<any>();

  useEffect(() => {
    if (!me) return;
    const socket = io(REACT_APP_SERVER_URL);
    setSocket(socket);

    //try connnect
    socket.emit("connect");

    //join room
    const emitData = { name: me.name, room: "room_" + match.params.course_id };
    console.log(emitData);
    socket.emit("join", emitData);

    //on message
    socket.on("message", (msg: any) => {
      console.log("received message:" + msg.content);
      setMessageList(prev => prev.concat(msg));
      if (MsgContainterRef.current) {
        const containter = MsgContainterRef.current;
        if (
          containter.scrollTop >
          containter.scrollHeight - containter.clientHeight - 100
        ) {
          containter.scrollTop =
            containter.scrollHeight - containter.clientHeight;
        }
      }
    });

    //destory
    return () => {
      socket.emit("leave", emitData);
      socket.close()
    };
  }, [me]);

  const fetchCourseDate = () => {
    console.log("try to fetch");
    if (!me) return;
    setLoading(true);
    const path = `/courses/${match.params.course_id}`;
    fetchData(path)
      .then((res: any) => {
        setCourseData(res.data);
        if (res.data.current_host.id) {
          if (res.data.live_room.streaming) {
            setLiveState(2);
          } else {
            setLiveState(1);
          }
        } else {
          setLiveState(0);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useInterval(fetchCourseDate, liveState === 1 && me ? 4000 : null, true);

  const handleMessageSend = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    // if (!event.target.checkValidity()) {
    //   console.log("form is invalid!");
    //   return;
    // }
    event.target.reset();
    if (socket) {
      const sendData = {
        name: me.name,
        content: formData.get("msg"),
        room: "room_" + match.params.course_id
      };
      socket.send(sendData);
      console.log("send message:" + formData.get("msg"));
    }
  };

  const handleLiveReady = () => {
    console.log("onReady");
    const path = `/courses/${match.params.course_id}/ready`;
    updateData(path).then((res: any) => {
      setStreamData(res.data);
      setLiveState(1);
    });
  };
  const handleLiveEnd = () => {
    console.log("onEnd");
    const path = `/courses/${match.params.course_id}/end`;
    updateData(path).then((res: any) => {
      setStreamData(null);
      setLiveState(0);
    });
  };

  const liveChatRender = (
    <div className="card course-live-chat-card">
      <div className="live-chat-header-bar"></div>
      <div ref={MsgContainterRef} className="live-chat-msg-containter">
        {msgList.map((msg, i) => (
          <div className="live-chat-msg-item" key={i}>
            <span className="live-chat-msg-item-name">{msg.name}: </span>
            <span className="live-chat-msg-item-content">{msg.content}</span>
          </div>
        ))}
      </div>
      <form className="live-chat-send-bar" onSubmit={handleMessageSend}>
        <div className="live-chat-send-input-container">
          <input
            className="live-chat-send-input"
            type="text"
            name="msg"
            required
          />
        </div>
        <button className="live-chat-send-button">发送</button>
      </form>
    </div>
  );

  const livePlayerRender = (
    <div className="card course-live-player-card">
      <div className="course-live-player-container">
        {liveState === 2 && courseData && courseData.live_room.flv_url && (
          <Video
            url={courseData.live_room.flv_url}
            className="course-live-player"
            // isSteaming={courseData.live_room.streaming}
            setLiveState={setLiveState}
          />
        )}
      </div>
      {liveState < 2 && (
        <div className="course-live-player-mask">
          {streamData && (
            <div>
              <Input value={streamData.stream_url} />
              <TextArea value={streamData.stream_auth} autoSize />
            </div>
          )}
        </div>
      )}
    </div>
  );
  const liveStateRender = () => {
    switch (liveState) {
      case 1:
        return <Badge color={"red"} text={"等待上播"} />;
      case 2:
        return <Badge color={"green"} text={"正在直播"} />;
      default:
        return <Badge color={"grey"} text={"无直播"} />;
    }
  };

  const courseDetailRender = (
    <div className="card course-detail-card">
      <div>
        {liveState < 2 && (
          <Button className="m-r:1" type="primary" onClick={handleLiveReady}>
            我要上播
          </Button>
        )}
        {liveState > 0 && <Button onClick={handleLiveEnd}>下播</Button>}
      </div>
      {liveStateRender()}
    </div>
  );

  return (
    <div className="course-live-container">
      {/* <button
        onClick={() => {
          console.log("current:" + liveState);
          setUpdate(!isUpdate);
        }}
      >
        dfdfsefsef
      </button> */}
      <div className="course-live-primary">
        {livePlayerRender}
        {isMobile && liveChatRender}
        {courseDetailRender}
      </div>

      {!isMobile && (
        <div className="course-live-secondary">{liveChatRender}</div>
      )}
    </div>
  );
};

export default CourseMainPage;
