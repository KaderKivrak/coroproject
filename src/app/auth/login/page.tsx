'use client';

import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false, // Vi vil håndtere redirect manuelt
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      // Hent den opdaterede session for at sikre korrekt omdirigering
      const session = await getSession();

      if (session?.user.role === 'admin') {
        router.push('/admin'); // Omdiriger til admin-panelet
      } else {
        router.push('/upload'); // Omdiriger til uploads-siden for normale brugere
      }
    }
  };

  return (
    <div className="upload-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
