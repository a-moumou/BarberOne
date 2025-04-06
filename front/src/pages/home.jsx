import React from "react";
import {
  Typography,
} from "@material-tailwind/react";
import { FingerPrintIcon, UsersIcon } from "@heroicons/react/24/solid";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard, TeamCard } from "@/widgets/cards";
import { featuresData, teamData, contactData } from "@/data";
import LocationSection from "@/widgets/layout/LocationSection";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function Home() {
  const navigate = useNavigate();

  const handleReservation = (e) => {
    e.preventDefault();
    const userInfo = localStorage.getItem('userInfo');
    
    if (!userInfo) {
      toast.warning('Veuillez vous connecter pour faire une réservation');
      navigate('/login');
      return;
    }
    
    navigate('/reserve');
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative flex min-h-screen content-center items-center justify-center pt-16 pb-32 md:pt-24 md:pb-48">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="container relative mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="mx-auto w-full px-4 text-center lg:w-8/12">
              <Typography variant="h1" color="white" className="mb-6 text-4xl md:text-  lg:text-6xl">
                Barber ONE
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
                Offrez à vos cheveux l'attention qu'ils méritent.
                Barber ONE vous accueille pour une expérience coiffure unique,
                alliant savoir-faire et style, dans une ambiance élégante et chaleureuse."
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="-mt-32 bg-white px-4 pt-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {featuresData.map(({ color, title, icon, description }) => (
              <FeatureCard
                key={title}
                color={color}
                title={title}
                icon={React.createElement(icon, {
                  className: "w-5 h-5 text-white",
                })}
                description={description}
              />
            ))}
          </div>
          <div className="mt-32 flex flex-wrap items-center">

          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4">
        <div className="container mx-auto">
          <PageTitle heading="Notre équipe" />
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-12">
            {teamData.map(({ id, img, name, position }) => (
              <TeamCard
                key={id}
                img={img}
                name={name}
                position={position}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative bg-white py-12 px-4 md:py-24">
        <div className="container mx-auto">
          <PageTitle heading="Nos services">
            Coupe, couleur, soin ou coiffure événementielle – chez Barber ONE, chaque prestation est une touche de créativité pour révéler votre style. Laissez-nous sublimer vos cheveux !
          </PageTitle>
          <div className="mx-auto mt-12 grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 md:mt-20 md:gap-16">
            {contactData.map(({ title, description, imageUrl }) => (
              <TeamCard
                key={title}
                img={imageUrl}
                name={title}
                position={description}
                imgClassName="h-20 w-32 object-cover"
              />
            ))}
          </div>


        </div>
        <LocationSection />
      </section>
      <div className="bg-white">
        <Footer />
      </div>

    

    </>
  );
}

export default Home;
