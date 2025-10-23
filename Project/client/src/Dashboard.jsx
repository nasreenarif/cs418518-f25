import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Call backend session-based profile API
    fetch(import.meta.env.VITE_API_KEY + 'profile', {
      method: 'GET',
      credentials: 'include', // This includes the session cookie
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data.user); // e.g. { email: test@gmail.com }
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to your Dashboard!
        </h1>
        <p className="text-gray-600">
          You are successfully loggedIn User id {Cookies.get("userid")}
           You are successfully logged in as <strong>{user?.email}</strong>
          </p>
        
      </div>
    </div>
  );
}
