"use client";
import { useEffect, useState } from "react";

export default function GitHubLogin() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (token) setLoggedIn(true);
  }, []);

  return (
    <div className="mb-4">
      {loggedIn ? (
        <p className="text-green-600 font-medium">✅ Logged in</p>
      ) : (
        <a
          href="http://localhost:8080/auth/github/login"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Sign in with GitHub
        </a>
      )}
    </div>
  );
}
