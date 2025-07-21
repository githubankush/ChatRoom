import React, { useState } from "react";
import axios from "../axios";
import Input from "../components/Input";


const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", form, { withCredentials: true });
      alert("Registration successful");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 w-full text-white p-3 rounded-lg mt-4 font-semibold"
        >
          Register
        </button>
        <p className="text-center mt-4 text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-blue-600 font-medium">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
