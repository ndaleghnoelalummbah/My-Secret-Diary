import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Auth from "./components/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import { auth } from "./firebase";
import { useAppDispatch } from "./hooks/storeHook";
import { login } from "./features/authSlice";
import AuthRoutes from "./components/HOC/AuthRoutes";
import Home from "./pages/Home/Home";
import DiaryEntry from "./pages/DiaryEntry";

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email)
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoUrl: user?.photoURL || null,
          })
        );
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Routes>
      {/* define your routes here using Route components */}
      <Route path="/" element={<Home />} />
      <Route path="journal" element={<Dashboard />} />
      <Route element={<AuthRoutes />}>
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="auth" element={<Auth />} />
      <Route path="journal/create" element={<DiaryEntry />} />
    </Routes>
  );
};

export default App;
//Routes componenent wraps the varion independent Route. and this Routes replaces Switch with react-router-dom versions from 6
