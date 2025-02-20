import React from "react";
import { PageTitle } from ".";

const LocationSection = () => {
    return (
        <section className="py-16 bg-white text-center ">
            <PageTitle heading="Où nous trouver ?" className="mb-6" />


            <div className="flex flex-col lg:flex-row items-center justify-center mt-10">
                {/* Horaires d'ouverture */}
                <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg text-black ">
                    <h3 className="text-xl font-semibold mb-4">Horaires d'ouverture</h3>
                    <ul className="grid grid-cols-2 text-gray-700 text-left space-y-1">
                        <li className="flex justify-end font-bold">Lundi :</li>
                        <li className="ml-2">9h00 - 20h00</li>
                        <li className="flex justify-end font-bold">Mardi :</li>
                        <li className="ml-2">9h00 - 20h00</li>
                        <li className="flex justify-end font-bold">Mercredi :</li>
                        <li className="ml-2">9h00 - 20h00</li>
                        <li className="flex justify-end font-bold">Jeudi :</li>
                        <li className="ml-2">9h00 - 20h00</li>
                        <li className="flex justify-end font-bold">Vendredi :</li>
                        <li className="ml-2">9h00 - 20h00</li>
                        <li className="flex justify-end font-bold">Samedi :</li>
                        <li className="ml-2">9h00 - 20h00</li>
                        <li className="flex justify-end font-bold">Dimanche :</li>
                        <li className="ml-2">9h00 - 20h00</li>
                    </ul>
                </div>

                {/* Google Maps */}
                <div className="w-90% lg:w-1/2 mt-6 lg:mt-0 lg:ml-20">
                    <iframe
                        title="Google Maps"
                        className="w-full h-80 rounded-lg shadow-lg mr-5"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2633.5735349886327!2d2.307217976576742!3d48.69451777131054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e5d98740bf81a7%3A0x45373cdec82cf17!2sSalon%20De%20Coiffure%20Barber%20One!5e0!3m2!1sfr!2sfr!4v1739800820945!5m2!1sfr!2sfr"
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

export default LocationSection; 