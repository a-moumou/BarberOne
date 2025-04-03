import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Navbar as MTNavbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export function Navbar({ brandName, routes, action }) {
  const [openNav, setOpenNav] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem('userInfo'));

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize); // Nettoyage de l'événement
  }, []);

  // Ajout du console.log pour afficher l'état de connexion
  React.useEffect(() => {
    console.log(`État de connexion : ${isLoggedIn ? "Connecté" : "Non connecté"}`);
  }, [isLoggedIn]); // Dépendance sur isLoggedIn

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {routes.map(({ name, path, icon, href, target }) => (
        <Typography
          key={name}
          as="li"
          variant="small"
          color="inherit"
          className="capitalize"
        >
          {href ? (
            <a
              href={href}
              target={target}
              className="flex items-center gap-1 p-1 font-bold"
            >
              {icon &&
                React.createElement(icon, {
                  className: "w-[18px] h-[18px] opacity-75 mr-1",
                })}
              {name}
            </a>
          ) : (
            <Link
              to={path}
              target={target}
              className="flex items-center gap-1 p-1 font-bold"
            >
              {icon &&
                React.createElement(icon, {
                  className: "w-[18px] h-[18px] opacity-75 mr-1",
                })}
              {name}
            </Link>
          )}
        </Typography>
      ))}
    </ul>
  );

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token
    setIsLoggedIn(false); // Met à jour l'état de connexion
    window.location.reload(); // Recharge la page pour mettre à jour l'état
  };

  return (
    <MTNavbar color="transparent" className="p-3">
      <div className="container mx-auto flex items-center justify-between text-white">
        <Link to="/">
          <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-bold">
            <img src="/img/logo.png" alt="Logo" className="h-28" />
            {brandName}
          </Typography>
        </Link>
        <div className="hidden lg:block">{navList}</div>
        <div className="hidden gap-2 lg:flex">
          {isLoggedIn ? ( // Vérifie si l'utilisateur est connecté
            <Button variant="gradient" size="lg" fullWidth onClick={handleLogout}>
              Se déconnecter
            </Button>
          ) : (
            <Link to="/sign-in">
              <Button variant="gradient" size="lg" fullWidth>
                Se connecter
              </Button>
            </Link>
          )}
          {React.cloneElement(action, {
            className: "hidden lg:inline-block",
          })}
        </div>
        <IconButton
          variant="text"
          size="sm"
          color="white"
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <MobileNav
        className="rounded-xl bg-white px-4 pt-2 pb-4 text-blue-gray-900"
        open={openNav}
      >
        <div className="container mx-auto">
          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <Button variant="gradient" size="lg" fullWidth onClick={handleLogout}>
                Se déconnecter
              </Button>
            ) : (
              <Link to="/sign-in" className="[&>*]:w-full">
                <Button variant="gradient" size="lg" fullWidth>
                  Se connecter
                </Button>
              </Link>
            )}
            {React.cloneElement(action, {
              className: "w-full",
              variant: "gradient",
              size: "lg"
            })}
          </div>
        </div>
      </MobileNav>
    </MTNavbar>
  );
}

Navbar.defaultProps = {
  brandName: "",
  action: (
    <Link to="/reserve">
      <Button variant="gradient" size="lg" fullWidth>
        Réserver
      </Button>
    </Link>
  ),
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.node,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;
