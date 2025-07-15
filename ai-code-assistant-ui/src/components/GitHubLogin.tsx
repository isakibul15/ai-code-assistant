"use client";
import { useEffect, useState } from "react";

export default function GitHubLogin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/auth/github/me", {
      credentials: "include", // Send cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) setLoggedIn(true);
      })
      .catch(() => {
        // Not logged in
        setLoggedIn(false);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  return (
    <div className="mb-4">
      {checking ? (
        <p className="text-sm text-gray-500">Checking login...</p>
      ) : loggedIn ? (
        <p className="text-green-600 font-medium">✅ Logged in</p>
      ) : (
        <a
          href="http://localhost:8080/auth/github/login"
          className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Sign in with GitHub
        </a>
      )}
    </div>
  );
}
