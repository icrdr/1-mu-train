import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import { fetchData } from "../utility";

const COOKIE_DOMAIN = process.env.REACT_APP_COOKIE_DOMAIN;
const useCheckToken: any = () => {
  const [cookies, setCookie] = useCookies();
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    if (cookies.token) {
      const tokenJosn: any = jwtDecode(cookies.token);
      if (tokenJosn.exp > Date.now() / 1000) {
        setHasToken(true);
      } else {
        setHasToken(false);
      }
    } else {
      setHasToken(false);
    }
    // eslint-disable-next-line
  }, [cookies.token]);

  return hasToken;
};

export default useCheckToken;
