import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Users from "scenes/users";
import Posts from "scenes/posts";
import RoutesL from "scenes/routes";
import Comments from "scenes/comments";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="admin/users" replace />} />
              <Route path="admin/users" element={<Users />} />
              <Route path="admin/posts" element={<Posts />} />
              <Route path="admin/routes" element={<RoutesL />} />
              <Route path="admin/comments" element={<Comments />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
