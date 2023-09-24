const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the chat app server!');
});

app.post('/generate-response', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("prompt :",prompt)

 const client = await axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  }
 })
 const params = {
  prompt,
  max_tokens:1200,
  model:"text-davinci-003",
  temperature:0

 }
 client.post("https://api.openai.com/v1/completions",params).then((result)=>{
  const assistantResponse = result.data.choices[0].text;
  res.json({ result:assistantResponse });
 }).catch((err)=>{
  console.log(err);
 })

 console.log(prompt)
 
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'An error occurred', details: error.message });
}
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// const response = await axios.post(
//   'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions',
//   {
//     prompt,
    
//     max_tokens: 2000, // Adjust this as needed
//   },
//   {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//     },
//   }
// );