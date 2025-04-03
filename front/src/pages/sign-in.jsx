import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from '../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/login', { email, password });

      if (response?.data) {
        const userInfo = {
          token: response.data.token,
          ...response.data.user
        };
        console.log('UserInfo à sauvegarder:', userInfo);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        toast.success("Connexion réussie !");
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      const errorMessage = error.response?.data?.message || "Erreur de connexion";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Se connecter</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Entrez votre e-mail et votre mot de passe pour vous connecter.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Votre e-mail
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Mot de passe
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
          </div>

          <Button className="mt-6" fullWidth type="submit">
            Se connecter
          </Button>

          <div className="mt-4 text-center">
            <a href="http://localhost:5174/loginAdmin" target="_blank">
              <Button variant="outlined" size="sm" className="text-gray-900">
                Accès Administration
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-between gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Mot de passe oublié ?
              </a>
            </Typography>
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Pas encore inscrit ?
            <Link to="/sign-up" className="text-gray-900 ml-1">Créer un compte</Link>
          </Typography>
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;
