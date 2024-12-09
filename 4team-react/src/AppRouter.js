import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OAuth2Callback from "./pages/OAuth2Callback";
import Navbar from "./components/Navbar";


function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<MainPage />} /> 메인 페이지용 */}
        <Route path="/Menu" element={<Menu />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
