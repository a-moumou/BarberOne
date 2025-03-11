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
    const [dateChosen, setDateChosen] = useState(false);
    const [selectedSalon, setSelectedSalon] = useState(null);
    const [selectedHairdresser, setSelectedHairdresser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [salons, setSalons] = useState([]);
    const [hairdressersBySalon, setHairdressersBySalon] = useState({});
    const [reservedTimes, setReservedTimes] = useState([]);
    const navigate = useNavigate();

    // Vérification de l'état de connexion
    const isLoggedIn = !!localStorage.getItem("token");

    const [services] = useState([
        { id: 1, name: "Coupe Homme", duration: "30 min", price: "25€" },
        { id: 2, name: "Coupe Femme", duration: "45 min", price: "35€" },
        { id: 3, name: "Coupe + Couleur", duration: "90 min", price: "65€" },
        { id: 4, name: "Barbe", duration: "20 min", price: "15€" },
        { id: 5, name: "Coupe Enfant", duration: "20 min", price: "18€" },
        { id: 6, name: "Brushing", duration: "30 min", price: "30€" },
        { id: 7, name: "Soin Profond", duration: "40 min", price: "45€" }
    ]);

    // Charger les salons
    useEffect(() => {
        const fetchSalons = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/salons`);
                setSalons(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSalons();
    }, []);

    // Charger les coiffeurs
    useEffect(() => {
        const fetchHairdressers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hairdressers`);
                const hairdressers = response.data;

                // Regrouper les coiffeurs par salon
                const groupedHairdressers = hairdressers.reduce((acc, hairdresser) => {
                    const salonId = hairdresser.salonId._id;
                    if (!acc[salonId]) {
                        acc[salonId] = [];
                    }
                    acc[salonId].push(hairdresser);
                    return acc;
                }, {});

                setHairdressersBySalon(groupedHairdressers);
            } catch (error) {
                console.error(error);
            }
        };

        fetchHairdressers();
    }, []);

    // Charger les créneaux réservés
    useEffect(() => {
        const fetchReservedTimes = async () => {
            if (selectedDate && selectedHairdresser) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/reserved-times`, {
                        params: {
                            selectedHairdresser: selectedHairdresser._id,
                            selectedDate: selectedDate.toISOString()
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    setReservedTimes(response.data);
                } catch (error) {
                    console.error("Error fetching reserved times:", error);
                }
            }
        };

        fetchReservedTimes();
    }, [selectedDate, selectedHairdresser]);

    // Récupérer les infos utilisateur au chargement
    useEffect(() => {
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            if (userData) {
                setUserInfo({
                    name: `${userData.first_name} ${userData.last_name}`,
                    userId: userData._id
                });
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
        }
    }, []);

    // Générer les jours disponibles
    const generateDays = () => {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Generate 4 days for mobile instead of 3
        for (let i = 0; i < 4; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + currentDayIndex + i);
            date.setHours(0, 0, 0, 0);

            const isPastDate = date < today;

            days.push({
                date,
                dayName: date.toLocaleDateString("fr-FR", { weekday: "long" }),
                dayNumber: date.getDate(),
                isPastDate
            });
        }
        return days;
    };

    // Générer les créneaux horaires
    const generateTimeSlots = () => {
        const slots = [];
        const now = new Date();
        let time = new Date(selectedDate);
        time.setHours(9, 0, 0, 0);

        while (time.getHours() < 20) {
            const slotTime = new Date(time);
            const isPast = selectedDate.toDateString() === now.toDateString() && slotTime < now;
            const timeString = slotTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

            slots.push({
                time: timeString,
                isPast,
                isReserved: reservedTimes.includes(timeString)
            });

            time.setMinutes(time.getMinutes() + 30);
        }
        return slots;
    };

    // Gérer la sélection de la date
    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDateChosen(false);
    };

    // Gérer la sélection de l'heure
    const handleTimeSelection = (time) => {
        if (!isLoggedIn) {
            toast.error("Veuillez vous connecter pour réserver un rendez-vous.");
            setTimeout(() => {
                navigate("/sign-in");
            }, 3000);
            return;
        }
        setSelectedTime(time);
        setShowConfirmModal(true);
    };

    // Gérer la sélection du coiffeur
    const handleHairdresserSelection = (hairdresser) => {
        setSelectedHairdresser(hairdresser);
        setCurrentStep(2);
    };

    // Soumettre la réservation
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/reserve`,
                {
                    selectedService: selectedService.name,
                    selectedDate: selectedDate.toISOString(),
                    selectedTime,
                    selectedSalon: selectedSalon._id,
                    selectedHairdresser: selectedHairdresser._id,
                    userInfo: {
                        name: userInfo.name
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            // Simplifier la réponse
            toast.success("Réservation confirmée !");
            setIsConfirmed(true);
            setCurrentStep(4);
            setShowConfirmModal(false);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erreur lors de la réservation";
            toast.error(errorMessage);
        }
    };

    // Composant Modal de confirmation
    const ConfirmationModal = () => {
        if (!showConfirmModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Confirmer votre réservation</h2>
                    <div className="mb-6">
                        <p className="mb-2"><span className="font-medium">Salon:</span> {selectedSalon?.name}</p>
                        <p className="mb-2"><span className="font-medium">Coiffeur:</span> {selectedHairdresser?.name}</p>
                        <p className="mb-2"><span className="font-medium">Service:</span> {selectedService?.name} ({selectedService?.price})</p>
                        <p className="mb-2"><span className="font-medium">Date:</span> {selectedDate?.toLocaleDateString("fr-FR")}</p>
                        <p className="mb-2"><span className="font-medium">Heure:</span> {selectedTime}</p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Réserver
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-8 sm:px-4">
            <ToastContainer />
            <ConfirmationModal />
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-8">
                {/* Étape 0: Sélection du salon */}
                {currentStep === 0 && (
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Choisissez un salon</h2>
                        <div className="space-y-3 sm:space-y-4">
                            {salons.map((salon) => (
                                <div key={salon._id} className="p-3 sm:p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 hover:bg-gray-50 transition-colors">
                                    <h3 className="font-medium">{salon.name}</h3>
                                    <button
                                        onClick={() => {
                                            setSelectedSalon(salon);
                                            setCurrentStep(1);
                                        }}
                                        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Choisissez un coiffeur</h2>
                        {hairdressersBySalon[selectedSalon._id] && Array.isArray(hairdressersBySalon[selectedSalon._id]) ? (
                            hairdressersBySalon[selectedSalon._id].length > 0 ? (
                                <div className="space-y-4">
                                    {hairdressersBySalon[selectedSalon._id].map((hairdresser) => (
                                        <div key={hairdresser._id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex justify-between items-center">
                                            <h3 className="font-medium">{hairdresser.name}</h3>
                                            <button
                                                onClick={() => handleHairdresserSelection(hairdresser)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Choisir
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="mb-4">Aucun coiffeur spécifique disponible dans ce salon.</p>
                                    <button
                                        onClick={() => {
                                            setCurrentStep(2);
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        Continuer vers les services
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="text-center">
                                <p className="mb-4">Aucun coiffeur disponible pour ce salon.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Étape 2: Sélection du service */}
                {currentStep === 2 && selectedSalon && (
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Choisissez un service pour {selectedSalon.name}</h2>
                        <div className="space-y-3 sm:space-y-4">
                            {services.map((service) => (
                                <div key={service.id} className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
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
                                            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Choisissez une date et heure</h2>
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 mb-4">
                            {generateDays().map(({ date, dayName, dayNumber, isPastDate, shortDayName }) => (
                                <div
                                    key={date.toString()}
                                    className={`text-center p-1 sm:p-2 border rounded cursor-pointer text-xs
                                        ${isPastDate ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
                                            selectedDate?.toDateString() === date.toDateString() ?
                                                "bg-blue-50 border-blue-600" : "hover:bg-gray-50"}`}
                                    onClick={!isPastDate ? () => handleDateChange(date) : undefined}
                                >
                                    <div className="font-medium">
                                        <span className="sm:hidden">{date.toLocaleDateString("fr-FR", { weekday: "short" })}</span>
                                        <span className="hidden sm:inline">{dayName}</span>
                                    </div>
                                    <div className="text-sm sm:text-lg font-bold">{dayNumber}</div>
                                </div>
                            ))}
                        </div>
                        {selectedDate && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {generateTimeSlots().map(({ time, isPast, isReserved }) => {
                                    const isDisabled = isPast || isReserved;
                                    return (
                                        <button
                                            key={time}
                                            onClick={!isDisabled ? () => handleTimeSelection(time) : undefined}
                                            className={`p-2 border rounded font-medium text-sm sm:text-base
                                                ${isDisabled ?
                                                    "bg-gray-100 text-gray-400 cursor-not-allowed" :
                                                    "text-blue-600 hover:bg-blue-50"}`}
                                            disabled={isDisabled}
                                        >
                                            {time}
                                            {isReserved}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Étape 4: Confirmation */}
                {currentStep === 4 && isConfirmed && (
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm text-center">
                        <h2 className="text-lg sm:text-xl font-semibold text-green-600">Réservation confirmée !</h2>
                        <p className="mt-4">Merci, votre rendez-vous est confirmé.</p>
                        <p className="mt-2 font-medium text-sm sm:text-base">
                            Salon : {selectedSalon?.name} <br />
                            {selectedHairdresser && `Coiffeur : ${selectedHairdresser?.name} `} <br />
                            Service : {selectedService?.name} <br />
                            Date : {selectedDate?.toLocaleDateString("fr-FR")} <br />
                            Heure : {selectedTime}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPage;