import React, { useState } from "react";
import axiosInstance from "../../services/AxiosIntance";

const Login = ({
  setIsVerified,
}: {
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();
    // Simulate a login process
    const username = (e.target as HTMLFormElement).username.value;
    const password = (e.target as HTMLFormElement).password.value;
    console.log( username === "admin" , password === "admin");
    const response =await axiosInstance.post("/api/auth/login", {
      username,
      password,
    });
    if(response.status === 200) {
      setIsVerified(true);
      localStorage.setItem("token", response.data.token);
    } else {
      alert("Invalid credentials"); 
    }
    };
  return (
    <div className="w-full  flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
      <form
        className="bg-white p-6 rounded shadow-md w-96"
        onSubmit={handleLogin}
      >
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
