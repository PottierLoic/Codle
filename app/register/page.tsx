"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      console.error("Passwords do not match!");
      // TODO display this error to the user
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      console.error("Registration error:", error.message);
    } else {
      console.log("Registration successful!", data);
      router.push("/auth");
    }
  };

  const handleGitHubAuth = () => {
    console.log("GitHub registration triggered!");
  };

  const handleGoogleAuth = () => {
    console.log("Google registration triggered!");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8">Register</h1>

      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2 text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Your username"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="email@example.com"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="********"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="********"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-xl hover:bg-blue-600 transition mb-4"
        >
          Register
        </button>
      </form>

      <div className="mt-4">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/auth" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-400 mb-4">Or register with</p>
        <div className="flex gap-4 justify-center">
          {/* GitHub Button */}
          <button
            onClick={handleGitHubAuth}
            className="flex items-center bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.019c0 4.424 2.867 8.17 6.839 9.504.5.092.682-.218.682-.485 0-.24-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.15-1.11-1.456-1.11-1.456-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.532 2.341 1.088 2.91.833.092-.646.35-1.088.636-1.338-2.22-.252-4.555-1.111-4.555-4.944 0-1.091.39-1.984 1.03-2.683-.104-.253-.447-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.503.337 1.908-1.296 2.747-1.026 2.747-1.026.547 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.688-4.566 4.937.359.31.678.923.678 1.861 0 1.343-.012 2.424-.012 2.754 0 .27.18.584.688.484A10.004 10.004 0 0022 12.019C22 6.484 17.523 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold">GitHub</span>
          </button>

          {/* Google Button */}
          <button
            onClick={handleGoogleAuth}
            className="flex items-center bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            <svg
              viewBox="0 0 48 48"
              className="w-6 h-6 mr-2"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.732 1.23 9.23 3.23l6.45-6.45C35.17 3.19 29.86 1 24 1 14.89 1 6.705 6.44 2.83 14.13l7.38 5.73C12.55 13.05 17.55 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.44 24.5c0-1.38-.13-2.7-.38-3.96H24v7.44h12.64c-.55 2.96-2.19 5.49-4.67 7.23l7.43 5.74c4.32-4 6.92-9.88 6.92-16.45z"
              />
              <path
                fill="#FBBC05"
                d="M10.21 28.66a13.91 13.91 0 0 1 0-8.3l-7.38-5.73a23.88 23.88 0 0 0 0 19.76l7.38-5.73z"
              />
              <path
                fill="#34A853"
                d="M24 47a22.5 22.5 0 0 0 15.31-5.13l-7.43-5.74c-2.06 1.38-4.7 2.18-7.88 2.18-6.45 0-11.94-4.36-13.9-10.23l-7.38 5.73A23.882 23.882 0 0 0 24 47z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            <span className="font-semibold">Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
