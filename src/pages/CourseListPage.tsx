import React, { useState, useEffect } from "react";
import { List, Avatar, Badge } from "antd";
import { fetchData } from "../utility";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";

const CourseListPage: React.FC<any> = ({ location }) => {
  const [courseListData, setCourseListData] = useState([]);
  const [isloading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setCourseListData([]);
    setPage(1);
    handleLoadcourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleLoadcourse = () => {
    setLoading(true);
    const path = "/courses";
    const params = {
      page: page,
      pre_page: 10
    };

    fetchData(path, params)
      .then((res: any) => {
        if (res.data.courses.length > 0) {
          setCourseListData((prev: any) => {
            return prev.concat(res.data.courses);
          });
          setPage((prev: any) => {
            return prev + 1;
          });
        } else {
          setHasMore(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ height: "calc(100vh - 160px)", overflowY: "scroll" }}>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={handleLoadcourse}
        hasMore={!isloading && hasMore}
        useWindow={false}
      >
        <List
          loading={isloading}
          dataSource={courseListData}
          renderItem={(course: any) => (
            <Link target="_blank" to={"/courses/" + course.id}>
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={course.name}
                  description={course.excerpt || "无描述"}
                />
                {course.streaming?(<Badge color={'green'} text={'正在直播'} />):(<Badge color={'grey'} text={'等待'} />)}
              </List.Item>
            </Link>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default CourseListPage;
