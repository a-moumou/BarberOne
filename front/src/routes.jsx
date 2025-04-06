import { Home, Profile, SignIn, SignUp, Reserve,  } from "@/pages";

export const routes = [
  {
    name: "",
    path: "/home",
    element: <Home />,
    protected: false
  },
  {
    name: "",
    path: "/profile",
    element: <Profile />,
    protected: true
  },
  {
    name: "",
    path: "/sign-in",
    element: <SignIn />,
    protected: false
  },
  {
    name: "",
    path: "/sign-up",
    element: <SignUp />,
    protected: false
  },
  {
    name: "",
    path: "/reserve",
    element: <Reserve />,
    protected: true
  },
  {
    name: "",
    path: "/loginAdmin",
    element: () => {
      window.location.href = 'http://localhost:5174/loginAdmin';
      return null;
    },
    protected: false
  }
];

export default routes;