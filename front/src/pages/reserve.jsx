import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import api from '../utils/axios';

const ReservePage = () => {
    const [steps] = useState(['Salon', 'Coiffeur', 'Service', 'Date/Heure', 'Confirmation']);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedSalon, setSelectedSalon] = useState(null);
    const [selectedHairdresser, setSelectedHairdresser] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [salons, setSalons] = useState([]);
    const [hairdressers, setHairdressers] = useState([]);
    const [services, setServices] = useState([]);
    const [reservedTimes, setReservedTimes] = useState([]);
    const [userInfo, setUserInfo] = useState({ name: '', userId: '' });
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Vérification de l'authentification au chargement
    useEffect(() => {
        const checkAuth = () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                console.log('UserInfo au chargement:', userInfo);

                if (!userInfo || !userInfo.token) {
                    toast.error('Veuillez vous connecter pour faire une réservation');
                    navigate('/sign-in');
                    return false;
                }
                setIsAuthenticated(true);
                return true;
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'authentification:', error);
                navigate('/sign-in');
                return false;
            }
        };

        checkAuth();
    }, [navigate]);

    // Chargement initial
    useEffect(() => {
        const loadUserData = () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.token) {
                    toast.error('Veuillez vous connecter pour faire une réservation');
                    navigate('/sign-in');
                    return;
                }
                if (userInfo) {
                    setUserInfo({
                        name: `${userInfo.first_name} ${userInfo.last_name}`,
                        userId: userInfo._id
                    });
                }
            } catch (error) {
                console.error('Erreur chargement utilisateur:', error);
                navigate('/sign-in');
            }
        };

        const fetchSalons = async () => {
            try {
                const { data } = await api.get('/api/salons');
                setSalons(data);
            } catch (error) {
                toast.error('Erreur chargement des salons');
            }
        };

        const fetchServices = async () => {
            try {
                const { data } = await api.get('/api/services');
                setServices(data);
            } catch (error) {
                toast.error('Erreur chargement des services');
            }
        };

        loadUserData();
        fetchSalons();
        fetchServices();
    }, [navigate]);

    // Chargement des coiffeurs
    useEffect(() => {
        const fetchHairdressers = async () => {
            if (selectedSalon?._id) {
                try {
                    const { data } = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/hairdressers`,
                        {
                            params: {
                                salonId: selectedSalon._id
                            }
                        }
                    );
                    // Filtrer les coiffeurs en vérifiant le salonId._id
                    const filteredHairdressers = data.filter(
                        hairdresser => hairdresser.salonId?._id === selectedSalon._id
                    );
                    console.log('Coiffeurs filtrés:', filteredHairdressers); // Pour déboguer
                    setHairdressers(filteredHairdressers);
                } catch (error) {
                    console.error('Erreur:', error);
                    toast.error('Erreur lors du chargement des coiffeurs');
                }
            } else {
                setHairdressers([]);
            }
        };
        fetchHairdressers();
    }, [selectedSalon]);

    // Fonction pour récupérer les horaires réservés
    const fetchReservedTimes = async (date) => {
        setIsLoading(true);
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo || !userInfo.token) {
                toast.error('Veuillez vous connecter pour continuer');
                navigate('/sign-in');
                return;
            }

            console.log('Token utilisé pour la requête:', userInfo.token);
            console.log('URL de la requête:', '/api/reservations/reserved-times');
            console.log('Paramètres:', {
                hairdresserId: selectedHairdresser._id,
                date: date.toISOString()
            });

            const { data } = await api.get('/api/reservations/reserved-times', {
                params: {
                    hairdresserId: selectedHairdresser._id,
                    date: date.toISOString()
                }
            });

            console.log('Réponse reçue:', data);
            setReservedTimes(data);
        } catch (error) {
            console.error('Erreur complète:', error);
            console.error('Status de l\'erreur:', error.response?.status);
            console.error('Message d\'erreur:', error.response?.data);

            if (error.response?.status === 401) {
                localStorage.removeItem('userInfo');
                toast.error('Session expirée, veuillez vous reconnecter');
                navigate('/sign-in');
            } else {
                toast.error('Erreur lors de la récupération des horaires');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour gérer la sélection de date
    const handleDateSelection = (date) => {
        if (!selectedHairdresser) {
            toast.warning("Veuillez d'abord sélectionner un coiffeur");
            return;
        }

        if (!isAuthenticated) {
            toast.error('Veuillez vous connecter pour continuer');
            navigate('/sign-in');
            return;
        }

        setSelectedDate(date);
        fetchReservedTimes(date);
    };

    // Fonction pour gérer la réservation
    const handleReservation = async () => {
        if (!selectedService || !selectedDate || !selectedTime || !selectedSalon || !selectedHairdresser) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        setIsLoading(true);
        try {
            const reservationData = {
                selectedService: selectedService._id,
                selectedDate,
                selectedTime,
                selectedSalon: selectedSalon._id,
                selectedHairdresser: selectedHairdresser._id,
                userInfo: {
                    name: userInfo.name,
                    userId: userInfo.userId
                }
            };

            const { data } = await api.post('/api/reservations', reservationData);
            toast.success('Réservation effectuée avec succès');
            navigate('/');
        } catch (error) {
            console.error('Erreur lors de la réservation:', error);
            toast.error(error.response?.data?.message || 'Erreur lors de la réservation');
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour générer les créneaux horaires
    const generateTimeSlots = () => {
        const slots = [];
        const start = 9; // 9h
        const end = 20; // 20h
        const interval = 30; // 30 minutes

        for (let hour = start; hour < end; hour++) {
            for (let minutes = 0; minutes < 60; minutes += interval) {
                const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                slots.push({
                    time,
                    isReserved: reservedTimes.includes(time),
                    isSelected: selectedTime === time,
                    isPast: selectedDate?.toDateString() === new Date().toDateString() &&
                        new Date().getHours() > hour ||
                        (new Date().getHours() === hour && new Date().getMinutes() > minutes)
                });
            }
        }
        return slots;
    };

    // Fonction pour générer les dates disponibles
    const generateDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + currentDayIndex + i);
            dates.push({
                date: date,
                dayName: date.toLocaleDateString('fr-FR', { weekday: 'long' }),
                dayNumber: date.getDate(),
                month: date.toLocaleDateString('fr-FR', { month: 'long' })
            });
        }
        return dates;
    };

    // Fonction pour revenir à l'étape précédente
    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Fonction pour passer à l'étape suivante
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <ToastContainer position="bottom-right" />

            {/* En-tête des étapes */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
                    {steps.map((step, index) => (
                        <div
                            key={step}
                            className={`flex flex-col items-center ${index <= currentStep
                                    ? 'text-blue-600'
                                    : 'text-gray-400'
                                }`}
                        >
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center mb-2
                                ${index <= currentStep
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200'
                                }
                            `}>
                                {index + 1}
                            </div>
                            <span className="text-sm font-medium hidden sm:block">{step}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Étape 1: Sélection du salon */}
                {currentStep === 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Choisissez votre salon</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {salons.map(salon => (
                                <div
                                    key={salon._id}
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
                                    onClick={() => {
                                        setSelectedSalon(salon);
                                        setCurrentStep(1);
                                    }}
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{salon.name}</h3>
                                        <p className="text-gray-600 mb-4">{salon.address}</p>
                                        <div className="flex justify-end">
                                            <span className="text-blue-600 font-medium">Sélectionner →</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Étape 2: Sélection du coiffeur */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Choisissez votre coiffeur pour {selectedSalon?.name}
                        </h2>
                        {hairdressers && hairdressers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hairdressers.map(hairdresser => (
                                    <div
                                        key={hairdresser._id}
                                        className={`bg-white rounded-lg shadow-sm transition-shadow duration-200 overflow-hidden ${
                                            !hairdresser.isAvailable 
                                                ? 'opacity-50 cursor-not-allowed' 
                                                : 'hover:shadow-md cursor-pointer'
                                        }`}
                                        onClick={() => {
                                            if (!hairdresser.isAvailable) {
                                                toast.warning("Ce coiffeur est actuellement indisponible");
                                                return;
                                            }
                                            setSelectedHairdresser(hairdresser);
                                            setCurrentStep(2);
                                        }}
                                    >
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {hairdresser.name}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                {hairdresser.specialty || 'Coiffeur polyvalent'}
                                            </p>
                                            {!hairdresser.isAvailable ? (
                                                <div className="flex items-center text-red-500">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    <span className="font-medium">Coiffeur indisponible</span>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end">
                                                    <span className="text-blue-600 font-medium">
                                                        Sélectionner →
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-lg">
                                    Aucun coiffeur disponible pour ce salon
                                </p>
                                <button
                                    onClick={() => setCurrentStep(0)}
                                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Choisir un autre salon
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Étape 3: Sélection du service */}
                {currentStep === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-center">Choisissez votre service</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((service) => (
                                <div
                                    key={service._id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                        selectedService?._id === service._id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                    onClick={() => setSelectedService(service)}
                                >
                                    <h3 className="font-semibold">{service.name}</h3>
                                    <p className="text-gray-600">{service.duration} minutes</p>
                                    <p className="text-blue-600 font-bold">{service.price} €</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Étape 4: Sélection de la date/heure */}
                {currentStep === 3 && (
                    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Choisissez votre date et heure
                        </h2>

                        {/* Sélection de la date */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => setCurrentDayIndex(prev => Math.max(0, prev - 3))}
                                    disabled={currentDayIndex === 0}
                                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div className="grid grid-cols-3 gap-4 flex-1 mx-4">
                                    {generateDates().map(({ date, dayName, dayNumber, month }) => (
                                        <button
                                            key={date.toISOString()}
                                            onClick={() => handleDateSelection(date)}
                                            className={`
                                                p-4 rounded-lg border-2 transition-all duration-200
                                                ${selectedDate?.toDateString() === date.toDateString()
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-400'
                                                }
                                            `}
                                            disabled={!selectedHairdresser}
                                        >
                                            <div className="text-sm font-medium text-gray-600 capitalize">
                                                {dayName}
                                            </div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {dayNumber}
                                            </div>
                                            <div className="text-sm text-gray-600 capitalize">
                                                {month}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentDayIndex(prev => prev + 3)}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Affichage des créneaux horaires */}
                            {selectedDate && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Horaires disponibles pour le {selectedDate.toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long'
                                        })}
                                    </h3>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                        {generateTimeSlots().map(slot => (
                                            <button
                                                key={slot.time}
                                                onClick={() => setSelectedTime(slot.time)}
                                                disabled={slot.isPast || slot.isReserved}
                                                className={`
                                                    p-3 rounded-lg text-sm font-medium transition-all duration-200
                                                    ${slot.isSelected
                                                        ? 'bg-blue-600 text-white'
                                                        : slot.isPast || slot.isReserved
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                    }
                                                `}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bouton de confirmation */}
                            {selectedDate && selectedTime && (
                                <button
                                    onClick={handleReservation}
                                    className="w-full sm:w-auto mt-6 px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Confirmer la réservation
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Étape 5: Confirmation */}
                {currentStep === 4 && (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-2xl mx-auto">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Réservation confirmée !</h2>
                            <p className="text-gray-600 mb-6">Votre rendez-vous a été réservé avec succès.</p>
                        </div>
                        <div className="space-y-3 text-left bg-gray-50 p-6 rounded-lg">
                            <p><span className="font-semibold">Salon:</span> {selectedSalon?.name}</p>
                            <p><span className="font-semibold">Coiffeur:</span> {selectedHairdresser?.name}</p>
                            <p><span className="font-semibold">Service:</span> {selectedService?.name}</p>
                            <p><span className="font-semibold">Date:</span> {selectedDate?.toLocaleDateString('fr-FR')}</p>
                            <p><span className="font-semibold">Heure:</span> {selectedTime}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Indication de chargement */}
            {isLoading && (
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            <div className="mt-6 flex justify-between">
                <button
                    onClick={handleBack}
                    className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-lg ${
                        currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
                    }`}
                    disabled={currentStep === 0}
                >
                    Retour
                </button>
                <button
                    onClick={currentStep === steps.length - 1 ? handleReservation : handleNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    {currentStep === steps.length - 1 ? 'Confirmer' : 'Suivant'}
                </button>
            </div>
        </div>
    );
};

export default ReservePage;