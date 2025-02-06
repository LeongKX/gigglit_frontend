import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import PostAddNew from "./pages/PostAddNew";
import PostEdit from "./pages/PostEdit";
import TopicAddNew from "./pages/TopicAddNew";
import TopicEdit from "./pages/TopicEdit";
import BookmarkPage from "./pages/BookMark";
import AdminPosts from "./pages/AllPost";

function App() {
  return (
    <div className="App">
      <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/posts/new" element={<PostAddNew />} />
            <Route path="/posts/:id/edit" element={<PostEdit />} />
            <Route path="/topics/new" element={<TopicAddNew />} />
            <Route path="/topics/:id/edit" element={<TopicEdit />} />
            <Route path="/bookmark" element={<BookmarkPage />} />
            <Route path="/adminPosts" element={<AdminPosts />} />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </div>
  );
}

export default App;
