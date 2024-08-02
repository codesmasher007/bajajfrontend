import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Select, MenuItem, Checkbox, FormControl, InputLabel, ListItemText, OutlinedInput, FormHelperText } from '@mui/material';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [visibleSections, setVisibleSections] = useState(['characters', 'numbers', 'highestAlphabet']);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "ABCD123"; // Replace with your actual roll number
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const parsedInput = JSON.parse(input);
      if (!Array.isArray(parsedInput.data)) {
        throw new Error("Invalid input: 'data' must be an array");
      }
      const res = await axios.post('https://bajaj-oi7f.onrender.com/bfhl', parsedInput);
      setResponse(res.data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Invalid JSON or API error');
    }
  };

  const handleSectionChange = (event) => {
    const {
      target: { value },
    } = event;
    setVisibleSections(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        BFHL Challenge
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Input JSON"
          multiline
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON (e.g., {"data": ["A","1","B","2"]})'
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
      {error && <Typography color="error">{error}</Typography>}

      {response && (
        <div>
          <Typography variant="h5" gutterBottom>
            Response:
          </Typography>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Visible Sections</InputLabel>
            <Select
              multiple
              value={visibleSections}
              onChange={handleSectionChange}
              input={<OutlinedInput label="Visible Sections" />}
              renderValue={(selected) => selected.join(', ')}
            >
              <MenuItem value="characters">
                <Checkbox checked={visibleSections.includes('characters')} />
                <ListItemText primary="Characters" />
              </MenuItem>
              <MenuItem value="numbers">
                <Checkbox checked={visibleSections.includes('numbers')} />
                <ListItemText primary="Numbers" />
              </MenuItem>
              <MenuItem value="highestAlphabet">
                <Checkbox checked={visibleSections.includes('highestAlphabet')} />
                <ListItemText primary="Highest Alphabet" />
              </MenuItem>
            </Select>
            <FormHelperText>Select sections to display</FormHelperText>
          </FormControl>

          {visibleSections.includes('characters') && (
            <div>
              <Typography variant="h6">Characters:</Typography>
              <Typography>{response.alphabets.join(', ')}</Typography>
            </div>
          )}
          {visibleSections.includes('numbers') && (
            <div>
              <Typography variant="h6">Numbers:</Typography>
              <Typography>{response.numbers.join(', ')}</Typography>
            </div>
          )}
          {visibleSections.includes('highestAlphabet') && (
            <div>
              <Typography variant="h6">Highest Alphabet:</Typography>
              <Typography>{response.highest_alphabet.join(', ')}</Typography>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}

export default App;
