import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const BookingPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [userInfo, setUserInfo] = useState({
        name: "",
        userId: "",
    });
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [dateChosen, setDateChosen] = useState(false); // Pour cacher les autres dates après sélection
    const [selectedSalon, setSelectedSalon] = useState(null); // État pour le salon sélectionné
    const [selectedHairdresser, setSelectedHairdresser] = useState(null); // État pour le coiffeur sélectionné
    const navigate = useNavigate();

    // Vérification de l'état de connexion
    const isLoggedIn = !!localStorage.getItem("token");

    const salons = [
        {
            id: 1, name: "Salon A", hairdressers: [
                { id: 1, name: "Coiffeur A1" },
                { id: 2, name: "Coiffeur A2" },
            ],
            services: [
                { id: 1, name: "Coupe", duration: "30min", price: "50€" },
                { id: 2, name: "Brushing", duration: "1h", price: "70€" },
            ]
        },
        {
            id: 2, name: "Salon B", hairdressers: [
                { id: 3, name: "Coiffeur B1" },
                { id: 4, name: "Coiffeur B2" },
            ],
            services: [
                { id: 3, name: "Coloration", duration: "1h", price: "80€" },
                { id: 4, name: "Mèches", duration: "1h 30min", price: "100€" },
            ]
        },
        {
            id: 3, name: "Salon C", services: [
                { id: 5, name: "Examen de routine", duration: "1h", price: "80€" },
                { id: 6, name: "Consultation spécialisée", duration: "1h 30min", price: "120€" },
            ]
        },
    ];

    useEffect(() => {
        const reservationData = localStorage.getItem("reservationData");
        if (reservationData) {
            const data = JSON.parse(reservationData);
            setSelectedService(data.selectedService);
            setSelectedDate(data.selectedDate);
            setSelectedTime(data.selectedTime);
            setSelectedSalon(data.selectedSalon);
            setSelectedHairdresser(data.selectedHairdresser);
            setUserInfo(data.userInfo);
            setCurrentStep(data.currentStep || 0);
        } else {
            // Récupérer le first_name de l'utilisateur depuis le localStorage
            const userName = localStorage.getItem("userName");
            const userId = localStorage.getItem("userId");
            if (userName) {
                setUserInfo((prev) => ({ ...prev, name: userName, userId: userId || "" }));
            }
        }
    }, []);

    const generateDays = () => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + currentDayIndex + i);
            date.setHours(0, 0, 0, 0);
            days.push({
                date: date,
                dayName: date.toLocaleDateString("fr-FR", { weekday: "long" }),
                dayNumber: date.getDate(),
            });
        }
        return days;
    };

    const generateTimeSlots = () => {
        const slots = [];
        let time = new Date();
        time.setHours(9, 0, 0, 0);
        while (time.getHours() < 20) {
            slots.push(
                time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
            );
            time.setMinutes(time.getMinutes() + 30);
        }
        return slots;
    };



    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDateChosen(false); // Permet de montrer les autres dates
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification que le nom est renseigné
        if (!userInfo.name) {
            toast.error("Le nom est requis.");
            return;
        }

        if (!isLoggedIn) {
            // Stocker les informations de réservation et l'étape actuelle dans le localStorage
            localStorage.setItem("reservationData", JSON.stringify({
                selectedService,
                selectedDate,
                selectedTime,
                selectedSalon,
                selectedHairdresser,
                userInfo,
                currentStep,
            }));

            toast.error("Veuillez vous connecter pour réserver un rendez-vous.");
            setTimeout(() => {
                navigate("/sign-in");
            }, 3000);
            return;
        }

        // Envoyer les données de réservation au backend
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reserve`, {
                selectedService: selectedService.name,
                selectedDate,
                selectedTime,
                selectedSalon: selectedSalon.name,
                selectedHairdresser: selectedHairdresser.name,
                userInfo: {
                    name: userInfo.name,
                },
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            toast.success(response.data.message);
            setIsConfirmed(true);
            setCurrentStep(5);
        } catch (error) {
            console.error(error.response.data);
            toast.error("Erreur lors de la création de la réservation.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <ToastContainer />
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Étape 0: Sélection du salon */}
                {currentStep === 0 && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Choisissez un salon</h2>
                        <div className="space-y-4">
                            {salons.map((salon) => (
                                <div key={salon.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors">
                                    <h3 className="font-medium">{salon.name}</h3>
                                    <button
                                        onClick={() => {
                                            setSelectedSalon(salon);
                                            setCurrentStep(1);
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Choisir
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Étape 1: Sélection du coiffeur */}
                {currentStep === 1 && selectedSalon && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Choisissez un coiffeur</h2>
                        {selectedSalon.hairdressers.map((hairdresser) => (
                            <div key={hairdresser.id} className="p-4 border rounded-lg flex justify-between items-center">
                                <h3 className="font-medium">{hairdresser.name}</h3>
                                <button onClick={() => { setSelectedHairdresser(hairdresser); setCurrentStep(2); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                                    Sélectionner
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Étape 2: Sélection du service */}
                {currentStep === 2 && selectedSalon && selectedHairdresser && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Choisissez un service pour {selectedSalon.name}</h2>
                        <div className="space-y-4">
                            {selectedSalon.services.map((service) => (
                                <div key={service.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-medium">{service.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {service.duration} • {service.price}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedService(service);
                                                setCurrentStep(3);
                                            }}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Programmer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Étape 3: Sélection de la date et heure */}
                {currentStep === 3 && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Choisissez une date et heure</h2>
                        {!dateChosen && (
                            <div className="flex justify-between mb-4">
                                <button
                                    onClick={() => setCurrentDayIndex(currentDayIndex - 1)}
                                    disabled={currentDayIndex === 0}
                                    className="text-blue-600 disabled:opacity-50"
                                >
                                    ◀
                                </button>
                                <button
                                    onClick={() => setCurrentDayIndex(currentDayIndex + 1)}
                                    className="text-blue-600"
                                >
                                    ▶
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {generateDays().map(({ date, dayName, dayNumber }) => (
                                (!dateChosen || selectedDate?.toDateString() === date.toDateString()) && (
                                    <div
                                        key={date}
                                        className={`text-center p-2 border rounded cursor-pointer
                                            ${selectedDate?.toDateString() === date.toDateString()
                                                ? "bg-blue-50 border-blue-600"
                                                : "hover:bg-gray-50"
                                            }`}
                                        onClick={() => handleDateChange(date)}
                                    >
                                        <div className="text-sm font-medium">{dayName}</div>
                                        <div className="text-lg">{dayNumber}</div>
                                    </div>
                                )
                            ))}
                        </div>
                        {selectedDate && (
                            <div className="grid grid-cols-3 gap-2">
                                {generateTimeSlots().map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => {
                                            if (!isLoggedIn) {
                                                toast.error("Veuillez vous connecter pour réserver un rendez-vous.");
                                                setTimeout(() => {
                                                    navigate("/sign-in");
                                                }, 3000);
                                                return;
                                            }
                                            setSelectedTime(time);
                                            setIsConfirmed(true);
                                            setCurrentStep(4);
                                        }}
                                        className="p-2 border rounded hover:bg-blue-50 text-blue-600 font-medium"
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Étape 4: Confirmation */}
                {currentStep === 4 && isConfirmed && (
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                        <h2 className="text-xl font-semibold text-green-600">Réservation confirmée !</h2>
                        <p className="mt-4">Merci, {userInfo.name}, votre rendez-vous est confirmé.</p>
                        <p className="mt-2 font-medium">
                            Salon : {selectedSalon?.name} <br />
                            Coiffeur : {selectedHairdresser?.name} <br />
                            Service : {selectedService?.name} <br />
                            Date : {selectedDate?.toLocaleDateString("fr-FR")} <br />
                            Heure : {selectedTime}
                        </p>
                        <p className="mt-2">Un email de confirmation a été envoyé.</p>

                        <form onSubmit={handleSubmit}>
                            <button type="submit">Réserver</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPage;
