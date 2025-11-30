import { useState } from 'react';

const LoginPanel = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <section className="login-card">
      <h1>
        Bem <span>vindo!</span>
      </h1>
      <p>Ao melhor da região</p>

      <form onSubmit={handleSubmit}>
        <label>
          Usuário
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="digite o username do seu usuário" />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="senha segura do seu usuário"
          />
        </label>
        <button type="submit">Acessar sistema</button>
      </form>
    </section>
  );
};

export default LoginPanel;
