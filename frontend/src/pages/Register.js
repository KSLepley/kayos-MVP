// src/pages/Register.js
import React from 'react';
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const API = process.env.REACT_APP_API_URL;

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        email,
        password,
      })
      console.log(res.data)
      navigate('/login') // or wherever you want to redirect
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account? <a href="/login" className="text-blue-500 underline">Login</a>
        </p>
      </form>
    </div>
  )
}