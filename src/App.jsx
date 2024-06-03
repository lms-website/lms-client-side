import Cookies from "js-cookie";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
// unAuth route
const UnAuth_Layout = lazy(() =>
  import("./Pages/UnAuthenticated/UnAuthLayout")
);
const Role_Selection = lazy(() =>
  import("./features/Auth/RoleSelection/RoleSelection")
);
const Login = lazy(() => import("./features/Auth/login/Login"));
const Register = lazy(() => import("./features/Auth/Register"));
// auth layout
const Auth_Layout = lazy(() => import("./Pages/AuthLayout/AuthLayout"));
const Home = lazy(() => import("./Pages/AuthLayout/Home"));
// admin
const Users_Container = lazy(() =>
  import("./features/Admin/users/UserContainer")
);
const All_Users = lazy(() => import("./features/Admin/users/AllUsers"));
const Add_User = lazy(() => import("./features/Admin/users/AddNewUser"));
// profile
const Profile_Container = lazy(() =>
  import("./features/Profile/ProfileContainer")
);
const Profile_Admin = lazy(() => import("./features/Profile/ProfileAdmin"));
const Profile_Student = lazy(() => import("./features/Profile/ProfileStudent"));
const Profile_Teacher = lazy(() => import("./features/Profile/ProfileTeacher"));
const PageNotFound = lazy(() => import("./Pages/PageNotFound"));

const App = () => {
  const { token } = useSelector((store) => store.auth);
  const isAuth = token?.length > 0 && token !== undefined;

  return (
    <Suspense>
      <Routes location={location} key={location.pathname}>
        {isAuth ? (
          <Route path="/" element={<Auth_Layout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="users" element={<Users_Container />}>
              <Route index element={<Navigate to="all-users" />} />
              <Route path="all-users" element={<All_Users />} />
              <Route path="create-user" element={<Add_User />} />
            </Route>

            <Route path="profile" element={<Profile_Container />}>
              <Route path="admin" element={<Profile_Admin />} />
              <Route path="student" element={<Profile_Student />} />
              <Route path="teacher" element={<Profile_Teacher />} />
            </Route>
          </Route>
        ) : (
          <Route path="/" element={<UnAuth_Layout />}>
            <Route index element={<Navigate to="user-type" replace />} />
            <Route path="user-type" element={<Role_Selection />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        )}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
