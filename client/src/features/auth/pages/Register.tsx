import useAuth from '../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    await register({ username, email, password });
  };

  return (
    <main>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" name="username" required />
        <input type="email" placeholder="email" name="email" required />
        <input type="password" placeholder="password" name="password" required />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
};

export default Register;
