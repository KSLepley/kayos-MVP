// Updated Diary.js with full UI enhancements: summary card, macro bar chart, and goal comparison

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const API = process.env.REACT_APP_API_URL;

function Diary() {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const goals = {
    calories: 1850,
    protein: 140,
    carbs: 160,
    fat: 65,
  };

  const today = new Date().toISOString().split('T')[0];

  const fetchDiary = async () => {
    try {
      const token = localStorage.getItem('token');

      const [entriesRes, summaryRes] = await Promise.all([
        axios.get(`${API}/api/diary?date=${today}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/api/diary/summary?date=${today}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setEntries(entriesRes.data.entries);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load diary data.');
    }
  };

  useEffect(() => {
    fetchDiary();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/api/diary`,
        {
          food: {
            name: formData.food,
            calories: Number(formData.calories),
            protein: Number(formData.protein),
            carbs: Number(formData.carbs),
            fat: Number(formData.fat),
          },
          date: today,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({ food: '', calories: '', protein: '', carbs: '', fat: '' });
      fetchDiary();
    } catch (err) {
      console.error(err);
      setError('Failed to log food entry.');
    }
  };

  const macroData = [
    { name: 'Calories', goal: goals.calories, actual: summary?.total_calories || 0 },
    { name: 'Protein (g)', goal: goals.protein, actual: summary?.total_protein || 0 },
    { name: 'Carbs (g)', goal: goals.carbs, actual: summary?.total_carbs || 0 },
    { name: 'Fat (g)', goal: goals.fat, actual: summary?.total_fat || 0 },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">Your Diary</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Summary */}
      {summary && (
        <div className="bg-blue-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Today's Summary</h2>
          <p><strong>Calories:</strong> {summary.total_calories || 0}</p>
          <p><strong>Protein:</strong> {summary.total_protein || 0}g</p>
          <p><strong>Carbs:</strong> {summary.total_carbs || 0}g</p>
          <p><strong>Fat:</strong> {summary.total_fat || 0}g</p>
        </div>
      )}

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Macro Goal Progress</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={macroData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="goal" fill="#cbd5e1" name="Goal" />
            <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Food log form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <input
          type="text"
          name="food"
          placeholder="Food name"
          value={formData.food}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input type="number" name="calories" placeholder="Calories" value={formData.calories} onChange={handleChange} required className="border p-2 rounded" />
          <input type="number" name="protein" placeholder="Protein (g)" value={formData.protein} onChange={handleChange} required className="border p-2 rounded" />
          <input type="number" name="carbs" placeholder="Carbs (g)" value={formData.carbs} onChange={handleChange} required className="border p-2 rounded" />
          <input type="number" name="fat" placeholder="Fat (g)" value={formData.fat} onChange={handleChange} required className="border p-2 rounded" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Log Food
        </button>
      </form>

      {/* Diary Entries */}
      {entries.length === 0 ? (
        <p className="text-center text-gray-500">No entries yet.</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry, index) => (
            <li key={index} className="border p-4 rounded bg-white shadow">
              <p><strong>Food:</strong> {entry.name}</p>
              <p><strong>Calories:</strong> {entry.calories}</p>
              <p><strong>Protein:</strong> {entry.protein}g</p>
              <p><strong>Carbs:</strong> {entry.carbs}g</p>
              <p><strong>Fat:</strong> {entry.fat}g</p>
              <p className="text-sm text-gray-500">Quantity: {entry.quantity}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Diary;
