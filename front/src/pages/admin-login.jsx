import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        toast.success("Connexion réussie");
        navigate("/admin/dashboard");
      } else {
        toast.error(data.message || "Erreur de connexion");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-96">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Administration
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input
            type="email"
            label="Email"
            size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label="Mot de passe"
            size="lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" onClick={handleSubmit} fullWidth>
            Se connecter
          </Button>
          <Typography variant="small" className="mt-4 flex justify-center">
            <Link to="/sign-in" className="text-blue-500 hover:text-blue-700">
              Retour à la connexion utilisateur
            </Link>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AdminLogin; 