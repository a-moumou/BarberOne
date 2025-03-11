import { useState } from "react";
import axios from "axios";
import { Input, Button, Typography } from "@material-tailwind/react";

const AddSalon = () => {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/salons`, {
                name,
                address,
                phone,
            });
            alert("Salon ajouté avec succès !");
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <div>
            <Typography variant="h2">Ajouter un Salon</Typography>
            <form onSubmit={handleSubmit}>
                <Input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} />
                <Input placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Button type="submit">Ajouter</Button>
            </form>
        </div>
    );
};

export default AddSalon; 