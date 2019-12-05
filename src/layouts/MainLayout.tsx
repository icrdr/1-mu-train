import React, { useState, useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import { Layout, Menu, Row, Col, Icon, Affix } from "antd";
import { useStore, useMobile } from "../App";
import useCheckToken from "../hooks/useCheckToken";
import LoginQrcode from "../pages/LoginQrcode";

const { Header, Content, Footer } = Layout;

const Main: React.FC<any> = ({
  checkLogin,
  location,
  history,
  props,
  component: Component,
  ...rest
}) => {
  const [menuKey, setMenuKey] = useState([""]);
  const hasToken = useCheckToken();

  useEffect(() => {
    setMenuKey([location.pathname]);
  }, [location]);

  const changeMenu = ({ key }: any) => {
    setMenuKey([key]);
    history.push(key);
  };

  const menuItems = [
    <Menu.Item key="/">
      <Icon type="sound" />
      发现
    </Menu.Item>,
    <Menu.Item key="/courses">
      <Icon type="read" />
      上课
    </Menu.Item>
  ];

  const headerRender = (
    <Row>
      <Col xs={12} md={18} className="t-a:l">
        <Menu
          theme={"light"}
          mode="horizontal"
          style={{
            lineHeight: "64px",
            height: "64px",
            borderBottom: "0px"
          }}
          selectedKeys={menuKey}
          onClick={changeMenu}
        >
          {menuItems}
        </Menu>
      </Col>
    </Row>
  );

  return (
    <Route
      {...rest}
      render={matchProps => (
        <Layout>
          <Affix offsetTop={0}>
            <Header
              className="p-x:.5 main-header"
              style={{ background: "#fff" }}
            >
              {headerRender}
            </Header>
          </Affix>
          <Content
            className="main-container"
            style={{ minHeight: "calc(100vh - 64px)" }}
          >
            {checkLogin && !hasToken ? (
              <LoginQrcode />
            ) : (
              <Component {...matchProps} {...props} />
            )}
          </Content>
          <Footer
            style={{
              textAlign: "center",
              background: "#333",
              height: "200px",
              color: "#999"
            }}
          >
            1-mu ©2019 Created by emu
          </Footer>
        </Layout>
      )}
    />
  );
};

export default withRouter(Main);
