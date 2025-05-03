const pool = require('../db');

// Log a food entry for a user
exports.addDiaryEntry = async (req, res) => {
  const userId = req.user.id;
  const { food, date, quantity } = req.body;

  try {
    // First, insert or find the food
    let foodResult = await pool.query(
      'SELECT * FROM foods WHERE name = $1 LIMIT 1',
      [food.name]
    );

    let foodId;

    if (foodResult.rows.length > 0) {
      foodId = foodResult.rows[0].id;
    } else {
      const insertFood = await pool.query(
        'INSERT INTO foods (name, calories, protein, carbs, fat) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [food.name, food.calories, food.protein, food.carbs, food.fat]
      );
      foodId = insertFood.rows[0].id;
    }

    // Insert diary entry
    await pool.query(
      'INSERT INTO diary_entries (user_id, food_id, date, quantity) VALUES ($1, $2, $3, $4)',
      [userId, foodId, date, quantity || 1]
    );

    res.status(201).json({ message: 'Food entry logged!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log food' });
  }
};

// Get food entries for a specific date
exports.getDiaryByDate = async (req, res) => {
  const userId = req.user.id;
  const { date } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT f.name, f.calories, f.protein, f.carbs, f.fat, e.quantity
      FROM diary_entries e
      JOIN foods f ON e.food_id = f.id
      WHERE e.user_id = $1 AND e.date = $2
      `,
      [userId, date]
    );

    res.json({ entries: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch diary' });
  }
};

exports.getDailySummary = async (req, res) => {
    const userId = req.user.id;
    const { date } = req.query;
  
    try {
      const result = await pool.query(
        `
        SELECT 
          SUM(f.calories * e.quantity) AS total_calories,
          SUM(f.protein * e.quantity) AS total_protein,
          SUM(f.carbs * e.quantity) AS total_carbs,
          SUM(f.fat * e.quantity) AS total_fat
        FROM diary_entries e
        JOIN foods f ON e.food_id = f.id
        WHERE e.user_id = $1 AND e.date = $2
        `,
        [userId, date]
      );
  
      res.json(result.rows[0]); // returns { total_calories, ... }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to calculate daily summary' });
    }
};  