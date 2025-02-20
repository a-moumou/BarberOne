import { Home, Profile, SignIn, SignUp, Reserve } from "@/pages";

export const routes = [
  {
    name: "",
    path: "/home",
    element: <Home />,
  },
  {
    name: "",
    path: "/profile",
    element: <Profile />,
  },
  {
    name: "",
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    name: "",
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    name: "",
    path: "/reserve",
    element: <Reserve />,
  },
];

export default routes;