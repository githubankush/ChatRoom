import React, { useState } from "react";
import axios from "../axios";
import Input from "../components/Input";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", form, { withCredentials: true });
      alert("Login successful");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Messenger</h2>
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 w-full text-white p-3 rounded-lg mt-4 font-semibold"
        >
          Login
        </button>
        <p className="text-center mt-4 text-sm text-gray-500">
          Don't have an account? <a href="/register" className="text-blue-600 font-medium">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
