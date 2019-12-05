import React, { createContext, useContext, useState } from "react";
import { Switch } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import { useMediaQuery } from "react-responsive";
import CourseListPage from "./pages/CourseListPage";
import CourseMainPage from "./pages/CourseMainPage";

export const GlobalContext = createContext<any>(undefined);

const App: React.FC = () => {
  const [state, set] = useState({ me: {} });
  const setState = (values: any) => {
    set((prev: any) => {
      return { ...prev, ...values };
    });
  };
  return (
    <GlobalContext.Provider value={[state, setState]}>
      <Switch>
        <MainLayout exact path="/" component={MainPage} />
        <MainLayout checkLogin exact path="/courses" component={CourseListPage} />
        <MainLayout checkLogin path="/courses/:course_id(\d+)" component={CourseMainPage} />
      </Switch>
    </GlobalContext.Provider>
  );
};
export const useStore = () => useContext(GlobalContext);
export const useMobile = () => useMediaQuery({ query: "(max-width: 768px)" });
export default App;
