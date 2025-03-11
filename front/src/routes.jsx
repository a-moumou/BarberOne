import { Home, Profile, SignIn, SignUp, Reserve, AddHairdresser, AddSalon } from "@/pages";

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
  {
    name: "Ajouter Coiffeur",
    path: "/add-hairdresser",
    element: <AddHairdresser />,
  },
  {
    name: "Ajouter Salon",
    path: "/add-salon",
    element: <AddSalon />,
  },
];

export default routes;