import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { isWxAgent } from "../utility";
import { Button, Row, Col, Card } from "antd";
import useInterval from "../hooks/useInterval";
import { fetchData } from "../utility";
import { useCookies } from "react-cookie";
import useCheckWxCode from "../hooks/useCheckWxCode";
const DOMAIN_URL = process.env.REACT_APP_DOMAIN_URL;
const WX_KF_APPID = "wx9c88c3320f959b7c";
const WX_GZ_APPID = "wxe2e76dfd60ec74b1";
const WX_QRCODE_TRY = process.env.REACT_APP_WX_QRCODE_TRY;
const WX_QRCODE_DELAY = process.env.REACT_APP_WX_QRCODE_DELAY;
const COOKIE_DOMAIN = process.env.REACT_APP_COOKIE_DOMAIN;

const LoginQrcode: React.FC<any> = ({ location, history }) => {
  const hasWxCode = useCheckWxCode({ location, history });

  let wx_qrcode_url = "";
  if (isWxAgent()) {
    wx_qrcode_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WX_GZ_APPID}&redirect_uri=${DOMAIN_URL +
      location.pathname}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
  } else {
    wx_qrcode_url = `https://open.weixin.qq.com/connect/qrconnect?appid=${WX_KF_APPID}&redirect_uri=${DOMAIN_URL +
      location.pathname}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`;
  }

  const [qrcode, setQrcode] = useState("");
  const [scene_str, setScene_str] = useState("");
  const [count, setCount] = useState(1);
  const [isChecking, setChecking] = useState(false);
  const [isShowing, setShowing] = useState(false);
  // eslint-disable-next-line
  const [cookies, setCookie] = useCookies();

  useInterval(
    () => {
      fetchCheck();
      if (parseInt(WX_QRCODE_TRY!) <= count) {
        setChecking(false);
      }
      setCount(count + 1);
    },
    isChecking ? WX_QRCODE_DELAY : null
  );

  useEffect(() => {
    const path = "/wechat/qrcode";
    if (isShowing) {
      setCount(1);
      fetchData(path)
        .then((res: any) => {
          setQrcode(
            `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${res.data.ticket}`
          );
          setScene_str(res.data.scene_str);
          setChecking(true);
        })
        .catch(err => {
          setShowing(false);
        });
    }
  }, [isShowing]);

  const fetchCheck = () => {
    const path = "/wechat/check";
    const params = {
      scene_str: scene_str
    };
    fetchData(path, params).then((res: any) => {
      if (res.data.token) {
        setCookie("token", res.data.token, {
          path: "/",
          domain: COOKIE_DOMAIN
        });
        setChecking(false);
        setShowing(false);
        history.push("/dashboard");
      }
    });
  };
  let loginRender;

  if (!isWxAgent()) {
    loginRender = (
      <Button type="primary" href={wx_qrcode_url} block>
        微信登陆
      </Button>
    );
  } else {
    if (isChecking) {
      loginRender = <img width="100%" src={qrcode} alt="qrcode" />;
    } else {
      loginRender = (
        <Button onClick={() => setShowing(true)} block>
          微信登陆
        </Button>
      );
    }
  }

  return (
    <Row
      type="flex"
      justify="center"
      style={{ height: "1000px", background: "#eee" }}
    >
      <Col xs={22} sm={14} md={6} style={{ height: "auto" }}>
        <Card>{hasWxCode ? "微信登入中" : loginRender}</Card>
      </Col>
    </Row>
  );
};

export default withRouter(LoginQrcode);
