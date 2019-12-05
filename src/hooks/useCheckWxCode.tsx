import { useEffect, useState } from "react";
import queryString from "query-string";
import { isWxAgent, fetchData } from "../utility";
import { useCookies } from "react-cookie";
const COOKIE_DOMAIN = process.env.REACT_APP_COOKIE_DOMAIN
const useCheckWxCode = ({location,history}:any) => {
  const [hasCode, setHasCode] = useState(false);
  // eslint-disable-next-line
  const [cookies, setCookie] = useCookies([]);
  useEffect(() => {
    const values = queryString.parse(location.search);
    if (values.code) {
      setHasCode(true);
      const url = "/wechat/auth";
      const params = {
        wxcode: values.code,
        wxtype: isWxAgent() ? "gz" : "kf"
      };
      fetchData(url, params).then((res: any) => {
        setCookie("token", res.data.token, {
          path: "/",
          domain: COOKIE_DOMAIN
        });
        setCookie("me", res.data.user, {
          path: "/",
          domain: COOKIE_DOMAIN
        });
      }).finally(()=>{
        history.push(location.pathname);
      })
    } else {
      setHasCode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return hasCode;
};

export default useCheckWxCode;
