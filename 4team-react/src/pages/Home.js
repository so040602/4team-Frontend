import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchPage from "../components/SearchPage";
import MenuList from "../components/MenuList";
import LinkList from "../components/LinkList";

function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8989/api/data")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>네이버 쇼핑 API 검색</h1>
      <div>{data}</div>

      {/* SearchPage 컴포넌트 추가했습니다. */}
      <SearchPage />
      <h1>오늘의 메뉴 추천 시스템</h1>
      <MenuList />
      <h1>유튜브 추천 시스템</h1>
      <LinkList />
    </div>
  );
}

export default Home;
