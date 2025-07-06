import { useState } from 'react';
import { supabase } from '../supabaseClient'; // Adjust based on the actual file location

function Auth({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let response;
      if (isLogin) {
        console.log('Attempting to sign in with:', email);
        response = await supabase.auth.signInWithPassword({ email, password });
        console.log('Sign in response:', response);
      } else {
        console.log('Attempting to sign up with:', email);
        response = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        console.log('Sign up response:', response);
      }

      if (response.error) {
        console.error('Auth error:', response.error);
        setError(response.error.message);
      } else {
        if (!isLogin && response.data?.user?.identities?.length === 0) {
          setError('User already exists. Please sign in instead.');
        } else {
          console.log('Auth success:', response);
          onAuth();
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
          {isLogin ? 'Sign in' : 'Create an Account'}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            {isLogin ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          {isLogin ? "Need an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-medium hover:underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
