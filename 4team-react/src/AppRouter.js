import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OAuth2Callback from "./pages/OAuth2Callback";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import ReviewList from "./pages/ReviewList";
import ReviewForm from "./pages/ReviewForm";
import ReviewDetail from "./pages/ReviewDetail";
import MyPage from "./pages/MyPage";
import ChatBot from "./components/chatbot/ChatBot";
import UserProfile from "./pages/UserProfile";
import RefriUI from "./pages/MyRefriUI";
import RecipeCreate from "./pages/RecipeCreate";
import SearchRecipes from "./pages/SearchRecipe"
import SearchPage from "./components/SearchPage";
import MenuList from "./components/MenuList";
import LinkList from "./components/LinkList";
import BottomNavigation from "./components/BottomNavigation";
import TopNavigation from "./components/TopNavigation";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/*"
          element={
            <>
              <Header />
              <TopNavigation/>
              <Routes>
                <Route path="/SearchPage" element={<SearchPage />} />
                <Route path="/MenuList" element={<MenuList />} />
                <Route path="/LinkList" element={<LinkList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/oauth2/callback" element={<OAuth2Callback />} />
                <Route path="/reviews" element={<ReviewList />} />
                <Route path="/reviews/new" element={<ReviewForm />} />
                <Route path="/reviews/:id" element={<ReviewDetail />} />
                <Route path="/reviews/:id/edit" element={<ReviewForm />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/chatbot/Chatbot" element={<ChatBot />} />
                <Route path="/users/:memberId" element={<UserProfile />} />
                <Route path="/refriUI" element={<RefriUI />} />
                <Route path="/recipe/create" element={<RecipeCreate />} />
                <Route path="/searchrecipe" element={<SearchRecipes/>}/>
              </Routes>
              <BottomNavigation />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
