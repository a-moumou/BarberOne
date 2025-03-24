import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/admin/login', {
                email,
                password
            });

            console.log('Réponse de l\'API:', response.data);

            if (response.status === 200) {
                toast.success('Connexion admin réussie !', {
                    position: "top-right",
                    autoClose: 2000
                });

                localStorage.setItem('admin_token', response.data.token);
                localStorage.setItem('admin_role', 'admin');

                setTimeout(() => {
                    navigate('/list');
                }, 1500);
            }
        } catch (error) {
            console.log(error);
            toast.error('Erreur de connexion admin', {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>Connexion Administrateur</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            <input
                className='w-full px-3 py-2 border border-gray-800'
                type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                className='w-full px-3 py-2 border border-gray-800'
                type="password"
                placeholder='Mot de passe'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4'>
                Se connecter
            </button>

            <button
                type="button"
                onClick={() => window.location.href = 'http://localhost:5173/login'}
                className='text-gray-600 hover:text-black mt-2'
            >
                Retour à la connexion client
            </button>
        </form>
    );
};

export default LoginAdmin;
