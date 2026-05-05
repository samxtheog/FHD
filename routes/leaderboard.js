import express from 'express';
import axios from 'axios';

const router = express.Router();

const GOOGLE_SHEETS_CSV_URL = process.env.GOOGLE_SHEETS_CSV_URL;

// Parse CSV data with proper handling for quoted values
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle quoted values properly
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim()); // Push the last value
    
    if (values.length >= headers.length) {
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = values[index] || '';
      });
      data.push(entry);
    }
  }
  
  return data;
};

// Clean currency string to number
const cleanCurrency = (value) => {
  if (!value) return 0;
  // Remove quotes, dollar signs, commas
  const cleaned = value.toString().replace(/["$,]/g, '').trim();
  return parseFloat(cleaned) || 0;
};

// Get leaderboard data - fetches directly from Google Sheets
router.get('/', async (req, res) => {
  if (!GOOGLE_SHEETS_CSV_URL) {
    return res.status(500).json({ success: false, message: 'GOOGLE_SHEETS_CSV_URL is not configured' });
  }
  try {
    const response = await axios.get(GOOGLE_SHEETS_CSV_URL, { timeout: 10000 });
    const csvData = parseCSV(response.data);
    
    console.log('Parsed entries:', csvData.length);
    console.log('First entry:', csvData[0]);
    
    // Transform data using actual column names
    const leaderboardData = csvData
      .map((row, index) => {
        const wageredAmount = cleanCurrency(row.wagered);
        
        return {
          rank: index + 1,
          username: row.user_name || row.username || 'Unknown',
          referrals: 0,
          wagered: wageredAmount,
          prize: 0,
          verified: false,
          level: 0
        };
      })
      .filter(entry => entry.username !== 'Unknown' && entry.wagered > 0)
      .sort((a, b) => b.wagered - a.wagered)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
      .slice(0, 100);
    
    console.log('Transformed data count:', leaderboardData.length);
    if (leaderboardData.length > 0) {
      console.log('First transformed entry:', leaderboardData[0]);
    }
    
    res.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch leaderboard',
      error: error.message 
    });
  }
});

export default router;
