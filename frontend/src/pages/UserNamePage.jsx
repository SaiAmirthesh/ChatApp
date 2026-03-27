import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import ThemeSelector from '../components/ThemeSelector';
import { User, ArrowRight } from 'lucide-react';
import { useState } from 'react'; 

const UserNamePage = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('chat-username', userName.trim());
      navigate('/chat');
    }
  };

  return (
    <div className="split-layout">
      <div className="split-left">
        <div className="branding">
          <img src={logo} alt="Ping Logo" className="branding-logo" />
          <h1>Ping</h1>
          <p className="branding-tagline">Seamless communication, reimagined.</p>
        </div>
      </div>
      <div className="split-right">
        <div className="top-nav">
          <ThemeSelector />
        </div>
        <div className="login-container">
          <h2>Welcome to Ping</h2>
          <p className="subtitle">Please enter your username to continue.</p>
          <form onSubmit={handleSubmit} className="username-form">
            <div className="input-group">
              <User className="input-icon" size={20} />
              <input 
                type="text" 
                placeholder="Username" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                autoFocus
                className="base-input"
              />
            </div>
            <button type="submit" className="primary-btn base-button">
              Continue <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserNamePage;
