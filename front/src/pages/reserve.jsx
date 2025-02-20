import { useState } from "react";

const BookingPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [dateChosen, setDateChosen] = useState(false); // Pour cacher les autres dates après sélection

    const services = [
        { id: 1, name: "Consultation standard", duration: "30min", price: "50€" },
        { id: 2, name: "Examen complet", duration: "1h", price: "90€" },
        { id: 3, name: "Suivi médical", duration: "45min", price: "70€" },
    ];

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

    const handleDateSelection = (date) => {
        setSelectedDate(date);
        setDateChosen(true); // Cache les autres dates
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setDateChosen(false); // Permet de montrer les autres dates
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsConfirmed(true);
        setCurrentStep(4);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Étape 1: Sélection du service */}
                {currentStep === 1 && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Choisissez un service</h2>
                        <div className="space-y-4">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
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
                                                setCurrentStep(2);
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

                {/* Étape 2: Sélection de la date et heure */}
                {currentStep === 2 && (
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
                                            setSelectedTime(time);
                                            setCurrentStep(3);
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

                {/* Étape 3: Formulaire de contact */}
                {currentStep === 3 && (
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nom complet</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded-lg"
                                    value={userInfo.name}
                                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full p-2 border rounded-lg"
                                    value={userInfo.email}
                                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Téléphone</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full p-2 border rounded-lg"
                                    value={userInfo.phone}
                                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Confirmer la réservation
                            </button>
                        </div>
                    </form>
                )}

                {/* Étape 4: Confirmation */}
                {currentStep === 4 && isConfirmed && (
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                        <h2 className="text-xl font-semibold text-green-600">Réservation confirmée !</h2>
                        <p className="mt-4">Merci, {userInfo.name}. Votre rendez-vous est confirmé.</p>
                        <p className="mt-2 font-medium">
                            {selectedService?.name} - {selectedDate?.toLocaleDateString("fr-FR")} à {selectedTime}
                        </p>
                        <p className="mt-2">Un email de confirmation a été envoyé à {userInfo.email}.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPage;
