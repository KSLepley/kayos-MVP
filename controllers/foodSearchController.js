const axios = require('axios');
require('dotenv').config();

exports.searchFood = async (req, res) => {
    const query = req.query.query;
    const pageSize = req.query.pageSize || 1;
  
    if (!query) return res.status(400).json({ error: 'Missing query parameter' });
  
    try {
      const response = await axios.get(
        'https://api.nal.usda.gov/fdc/v1/foods/search',
        {
          params: {
            api_key: process.env.USDA_API_KEY,
            query,
            pageSize
          }
        }
      );
  
      const foods = response.data.foods.map(food => {
        const nutrients = {};
        for (const n of food.foodNutrients) {
          if (n.nutrientName === 'Energy' && n.unitName === 'KCAL')
            nutrients.calories = n.value;
          if (n.nutrientName === 'Protein') nutrients.protein = n.value;
          if (n.nutrientName === 'Carbohydrate, by difference')
            nutrients.carbs = n.value;
          if (n.nutrientName === 'Total lipid (fat)') nutrients.fat = n.value;
        }
  
        return {
          name: food.description,
          ...nutrients
        };
      });
  
      res.json({ results: foods });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'USDA search failed' });
    }
  };
  