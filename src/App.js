import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NaverMap from "./NaverMap"; // NaverMap 컴포넌트를 import합니다.

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/map" element={<NaverMap />} />
                {/* 필요한 다른 라우트들도 여기에 추가할 수 있습니다. */}
            </Routes>
        </Router>
    );
};

export default App;
