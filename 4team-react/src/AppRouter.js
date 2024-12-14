import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OAuth2Callback from "./pages/OAuth2Callback";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import ReviewList from "./pages/ReviewList";
import ReviewForm from "./pages/ReviewForm";
import ReviewDetail from "./pages/ReviewDetail";
import MyPage from './pages/MyPage';
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/Menu" element={<Menu />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/oauth2/callback" element={<OAuth2Callback />} />
              <Route path="/reviews" element={<ReviewList />} />
              <Route path="/reviews/new" element={<ReviewForm />} />
              <Route path="/reviews/:id" element={<ReviewDetail />} />
              <Route path="/reviews/:id/edit" element={<ReviewForm />} />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
