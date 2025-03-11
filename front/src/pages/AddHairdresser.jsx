import { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Typography } from "@material-tailwind/react";

const AddHairdresser = () => {
    const [name, setName] = useState("");
    const [salonId, setSalonId] = useState("");
    const [services, setServices] = useState("");
    const [salons, setSalons] = useState([]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/hairdressers`, {
                name,
                salonId,
                services: services.split(","),
            });
            alert("Coiffeur ajouté avec succès !");
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <div>
            <Typography variant="h2">Ajouter un Coiffeur</Typography>
            <form onSubmit={handleSubmit}>
                <Input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
                <select value={salonId} onChange={(e) => setSalonId(e.target.value)} required>
                    <option value="">Sélectionnez un salon</option>
                    {salons.map((salon) => (
                        <option key={salon._id} value={salon._id}>
                            {salon.name}
                        </option>
                    ))}
                </select>
                <Input placeholder="Services (séparés par des virgules)" value={services} onChange={(e) => setServices(e.target.value)} />
                <Button type="submit">Ajouter</Button>
            </form>
        </div>
    );
};

export default AddHairdresser; 