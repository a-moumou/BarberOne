import {
  BriefcaseIcon,
  ChartBarIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";

export const contactData = [
  {
    title: "Coupe Classique",
    icon: BriefcaseIcon,
    imageUrl: "/img/service1.jpg",
    description:
      "Une coupe classique adaptée à votre style et morphologie, avec taille de barbe. Shampooing inclus.",
    position: "Coiffeur",
  },
  {
    title: "Coloration & Balayage",
    icon: ChartBarIcon,
    imageUrl: "/img/service2.jpg",
    description:
      "Apportez de la lumière et de la profondeur à vos cheveux avec nos colorations professionnelles.",
    position: "Coloriste",
  },
  {
    title: "Soin Capillaire",
    icon: PlayIcon,
    imageUrl: "/img/service3.jpg",
    description:
      "Un soin en profondeur pour hydrater et fortifier vos cheveux, adapté à tous types de cheveux.",
    position: "Soin Capillaire",
  },
];

export default contactData;
