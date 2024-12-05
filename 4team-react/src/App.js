import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchPage from './components/SearchPage';

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
            <h1>Spring Boot와 React 연동</h1>
            <div>{data}</div>

            {/* SearchPage 컴포넌트 추가했습니다. */}
            <SearchPage/>
        </div>
    );
}

export default App;
