import { useMemo } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import { HomePage, LoginPage, ProfilePage } from "./pages";
import { themeSettings } from "./theme";
import { LangProvider } from "./context/LangProvider";
import { ContactPage } from "./pages/ContactPage";
import { ForgotPassword } from "./pages/ForgotPassword";
import { RecupPassword } from "./pages/RecupPassword";
import { UpdatePage } from "./pages/UpdatePage";
import { NotFound } from "./pages/NotFound";
import { GoogleCookie, RemoveCookie } from "GoogleCookie";
import { Users } from "./pages/Admin/Users";
import { RoutesL } from "./pages/Admin/Routes";
import { Posts } from "./pages/Admin/Posts";
import { Comments } from "./pages/Admin/Comments";
import { Layout } from "./pages/Admin/Layout";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  GoogleCookie();
  const isAuth = Boolean(useSelector((state) => state.token));
  RemoveCookie();


  return (
    <div className="app">
      <BrowserRouter>
        <LangProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route
                path="/"
                element={
                  !isAuth ? <LoginPage to="/" /> : <Navigate to="/home" />
                }
              />
              <Route
                path="/forgot-password"
                element={
                  !isAuth ? <LoginPage to="/" /> : <Navigate to="/home" />
                }
              />
              <Route
                path="/home"
                element={isAuth ? <HomePage /> : <Navigate to="/" />}
              />
              <Route
                path="/profile/:userId"
                element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
              />
              <Route
                path="/contact"
                element={isAuth ? <ContactPage /> : <Navigate to="/" />}
              />

              <Route
                path="/update-user"
                element={isAuth ? <UpdatePage /> : <Navigate to="/" />}
              />

              <Route
                path="/reset-password/:id/:token"
                element={<RecupPassword />}
              />
              <Route path="/reset-password" element={<ForgotPassword />} />

              <Route element={<Layout />}>
              <Route path="/admin/users" element={<Users />} />
              <Route path="admin/posts" element={<Posts />} />
              <Route path="admin/routes" element={<RoutesL />} />
              <Route path="admin/comments" element={<Comments />} />
              </Route>
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </ThemeProvider>
        </LangProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
