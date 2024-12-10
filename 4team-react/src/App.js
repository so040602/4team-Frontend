import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import AppRouter from "./AppRouter";
import "./App.css";

function App() {
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
            <SearchPage/>
            <h1>오늘의 메뉴 추천 시스템</h1>
            <MenuList/>
        </div>
    );
}

export default App;
