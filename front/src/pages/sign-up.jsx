import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Données à envoyer :", { firstName, lastName, email, phone, password });
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
      });
      console.log(response.data);
      navigate("/sign-in");
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <section className="ml-8 mr-8 mb-8 flex gap-4">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl mt-20"
        />
      </div>
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">S'inscrire</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Entrez vos informations pour créer un compte.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-4">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Votre prénom
            </Typography>
            <Input
              size="lg"
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Votre nom
            </Typography>
            <Input
              size="lg"
              placeholder="Votre nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
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
              Votre téléphone
            </Typography>
            <Input
              size="lg"
              placeholder="Votre téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            S'inscrire maintenant
          </Button>

          <div className="space-y-4 mt-8">
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Vous avez déjà un compte ?
            <Link to="/sign-in" className="text-gray-900 ml-1">Se connecter</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
