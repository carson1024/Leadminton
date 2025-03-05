import { useMemo, useState } from "react";
import AuthModal from "../components/auth/AuthModal";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import SlideFirst from '../assets/img/slide/first.jpg';
import SlideSecond from '../assets/img/slide/second.jpg';
import SlideThird from '../assets/img/slide/third.jpg';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [authModalType, setAuthModalType] = useState<'login' | 'register' | null>(null);
  const { isLogin, user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    isLogin ? navigate('/dashboard') : setAuthModalType('login');
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  }

  return (<>
    <div className="h-screen relative">
      <div className="relative">
        <img src={SlideFirst} className="w-full"/>
        <button className="absolute btn-slide top-[70%] left-[7%]" style={{fontSize: '2vw'}} onClick={handleClick}>Play now</button>
      </div>
      <div className="relative">
        <img src={SlideSecond} className="w-full"/>
        <button className="absolute btn-slide top-[34.3%] left-[7.5%]" style={{fontSize: '2vw'}} onClick={handleClick}>Play now</button>
      </div>
      <div className="relative">
        <img src={SlideThird} className="w-full"/>
        <button className="absolute btn-slide top-[34.3%] left-[7.5%]" style={{fontSize: '2vw'}} onClick={handleClick}>Play now</button>
      </div>
      <div className="absolute right-5 top-3">
        {
          isLogin ? <div className="flex items-center gap-3">
            <div className="font-bold">{ user?.user_metadata['name'] }</div>
            <button className="btn-outline" onClick={() => handleLogout()}>Log out</button>
          </div> : <div className="flex gap-3">
            <button className="btn-outline" onClick={() => setAuthModalType('login')}>Login</button>
            <button className="btn-outline" onClick={() => setAuthModalType('register')}>Register</button>
          </div>
        }
      </div>
    </div>
    <AuthModal isOpen={!!authModalType} type={authModalType} onClose={() => {
      setAuthModalType(null)
    }}/>
  </>);
}
