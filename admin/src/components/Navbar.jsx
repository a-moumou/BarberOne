import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer les tokens et données de session
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    
    // Message de confirmation
    toast.success('Déconnexion réussie', {
      position: "top-right",
      autoClose: 2000
    });

    // Rediriger vers la page de connexion client
    setTimeout(() => {
      window.location.href = 'http://localhost:5173/login';
    }, 1500);
  };

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
      <button 
        onClick={handleLogout} 
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'
      >
        Déconnexion
      </button>
    </div>
  )
}

export default Navbar