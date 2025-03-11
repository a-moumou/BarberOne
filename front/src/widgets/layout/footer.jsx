import PropTypes from "prop-types";
import { Typography, IconButton } from "@material-tailwind/react";

const year = new Date().getFullYear();

export function Footer({ title, description, socials, menus, copyright }) {
  return (
    <footer className="relative px-4 pt-8 pb-6">
      <div className="container mx-auto">
        <div className="flex flex-wrap pt-6 text-center lg:text-left">
          <div className="w-full px-4 lg:w-6/12">
            <Typography variant="h4" className="mb-4 text-2xl lg:text-4xl" color="blue-gray">
              {title}
            </Typography>
            <Typography className="font-normal text-sm lg:text-base text-blue-gray-500 lg:w-2/5 mx-auto lg:mx-0">
              {description}
            </Typography>
            <div className="mx-auto mt-6 mb-8 flex justify-center gap-2 md:mb-0 lg:justify-start">
              {socials.map(({ color, name, path }) => (
                <a
                  key={name}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton color="white" className="rounded-full shadow-none bg-transparent">
                    <Typography color={color}>
                      <i className={`fa-brands fa-${name}`} />
                    </Typography>
                  </IconButton>
                </a>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-12 grid w-max grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            {menus.map(({ name, items }) => (
              <div key={name}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 block font-medium uppercase"
                >
                  {name}
                </Typography>
                <ul className="mt-3">
                  {items.map((item) => (
                    <li key={item.name}>
                      <Typography
                        as="a"
                        href={item.path}
                        target="_blank"
                        rel="noreferrer"
                        variant="small"
                        className="mb-2 block font-normal text-blue-gray-500 hover:text-blue-gray-700"
                      >
                        {item.name}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-6 border-gray-300" />
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full px-4 text-center">
            <Typography
              variant="small"
              className="text-xs lg:text-sm font-normal text-blue-gray-500"
            >
              {copyright}
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  title: "Barber ONE",
  description:
    "Votre coiffeur de proximité, à votre écoute, vous offrant des services de qualité.",
  socials: [
    {
      color: "gray",
      name: "snapchat",
      path: "https://www.twitter.com/",
    },
    {
      color: "gray",
      name: "tiktok",
      path: "https://www.youtube.com/",
    },
    {
      color: "gray",
      name: "instagram",
      path: "https://www.instagram.com/",
    },
    {
      color: "gray",
      name: "facebook",
      path: "https://www.facebook.com/",
    },
  ],
  menus: [
    {
      name: "Contact",
      items: [
        { name: "Email: contact@barberone.com", path: "mailto:contact@barberone.com" },
        { name: "Téléphone: +33 1 23 45 67 89", },
        { name: "Adresse: 123 Rue de la Coiffure, Paris", },
      ],
    },
  ],
  copyright: (
    <>
      Copyright © {year} Barber ONE - Tous droits réservés
      .
    </>
  ),
};

Footer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  socials: PropTypes.arrayOf(PropTypes.object),
  menus: PropTypes.arrayOf(PropTypes.object),
  copyright: PropTypes.node,
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
