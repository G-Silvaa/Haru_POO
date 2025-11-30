import { FaSmile, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ isAuthenticated, onLogout }) => (
  <header className="top-bar">
    <div className="top-bar__brand">
      <img src="/logo.svg" alt="Mercadinho" />
      <div>
        <h2>Mercadinho do Povo</h2>
        <p className="eyebrow">Administração</p>
      </div>
    </div>
    <div className="user-chip">
      <FaSmile size={20} />
      <span>{isAuthenticated ? 'Olá, Admin' : 'Bem vindo'}</span>
      {isAuthenticated && (
        <button type="button" onClick={onLogout} title="Sair">
          <FaSignOutAlt />
        </button>
      )}
    </div>
  </header>
);

export default Header;
