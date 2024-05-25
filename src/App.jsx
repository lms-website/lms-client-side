import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// unAuth route
const UnAuth_Layout = lazy(() =>
  import("./Pages/UnAuthenticated/UnAuthLayout")
);
const Login = lazy(() => import("./features/Auth/Login"));
const Register = lazy(() => import("./features/Auth/Register"));
// auth layout
const Auth_Layout = lazy(() => import("./Pages/AuthLayout/AuthLayout"));
const Home = lazy(() => import("./Pages/AuthLayout/Home"));
const App = () => {
  const isAuth = true;
  return (
    <Suspense>
      <Routes location={location} key={location.pathname}>
        {isAuth ? (
          <Route path="/" element={<Auth_Layout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
          </Route>
        ) : (
          <Route path="/" element={<UnAuth_Layout />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        )}
      </Routes>
    </Suspense>
  );
};

export default App;
