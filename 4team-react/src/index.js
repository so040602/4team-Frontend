import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ReactDOM.render를 ReactDOM.createRoot로 변경
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// 성능 측정을 위한 코드 (선택 사항)
reportWebVitals();
