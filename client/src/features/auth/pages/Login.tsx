import { useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    await login({ email, password });
    navigate('/');
  };
  return (
    <main>
      <h1>Login page</h1>
      <form onSubmit={handleLoginSubmit}>
        <input type="email" name="email" placeholder="Enter your email" required />
        <input type="password" name="password" placeholder="Enter your password" required />
        <button type="submit">Login</button>
      </form>
    </main>
  );
};

export default Login;
