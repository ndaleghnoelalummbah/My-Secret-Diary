import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
//import { Provider } from "react-redux";
//import store from "./store";
import HomePage from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard";

import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import { auth } from "./firebase";
import { useAppDispatch } from "./hooks/storeHook";
import { login } from "./features/authSlice";
import AuthRoutes from "./components/HOC/AuthRoutes";
import Home from "./pages/Home/Home";

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
      <Route path="Dashboard" element={<Dashboard />} />
      <Route element={<AuthRoutes />}>
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="auth" element={<Auth />} />
    </Routes>
  );
};

export default App;
//Routes componenent wraps the varion independent Route. and this Routes replaces Switch with react-router-dom versions from 6
