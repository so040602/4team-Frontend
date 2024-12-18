import { useEffect, useState } from "react";


function RefriTitle(props) {
    const [userName, setUserName] = useState(null);
    const rcvData = props.receivedData;

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if(user){
            setUserName(user.displayName);
        }
    }, []);

    return(
    <div className="refrigerator-title">
        <div>
            <h1>{userName ? 
                (rcvData ? `${userName} 님의 냉장고 입니다. `
                        : `${userName} 님의 냉장고가 등록되지 않는 상태입니다.`
                ) : `로그인 부탁드립니다`}</h1>
        </div>
    </div>
    );
}


export default RefriTitle;