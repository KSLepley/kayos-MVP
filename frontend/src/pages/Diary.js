import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;
console.log('API is:', API);

function Diary() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // Fetch diary entries
  const fetchDiary = async () => {
    try {
      const token = localStorage.getItem('token');
      const today = new Date().toISOString().split('T')[0];
      const res = await axios.get(`${API}/api/diary?date=${today}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEntries(res.data.entries);
    } catch (err) {
      console.error(err);
      setError('Failed to load diary entries.');
    }
  };

  useEffect(() => {
    fetchDiary();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit food log
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const today = new Date().toISOString().split('T')[0];

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

      // Reset form
      setFormData({
        food: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
      });

      fetchDiary(); // Refresh entries
    } catch (err) {
      console.error(err);
      setError('Failed to log food entry.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Diary</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Food log form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
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
          <input
            type="number"
            name="calories"
            placeholder="Calories"
            value={formData.calories}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="protein"
            placeholder="Protein (g)"
            value={formData.protein}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="carbs"
            placeholder="Carbs (g)"
            value={formData.carbs}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="fat"
            placeholder="Fat (g)"
            value={formData.fat}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Log Food
        </button>
      </form>

      {/* Diary Entries */}
      {entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry, index) => (
            <li key={index} className="border p-4 rounded bg-white shadow">
              <p><strong>Food:</strong> {entry.name}</p>
              <p><strong>Calories:</strong> {entry.calories}</p>
              <p><strong>Protein:</strong> {entry.protein}g</p>
              <p><strong>Carbs:</strong> {entry.carbs}g</p>
              <p><strong>Fat:</strong> {entry.fat}g</p>
              <p><strong>Quantity:</strong> {entry.quantity}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Diary;