import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8989/api/data")
            .then((response) => setData(response.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return <div>{data}</div>;
}

export default App;
