const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function test() {
  try {
    const form = new FormData();
    form.append('title', 'CRUD Test Blog');
    form.append('description', 'Testing full CRUD ops');
    // just dummy token for admin since we just want to see the error output 
    const res = await axios.post('http://localhost:5050/api/blogs', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: 'Bearer fake'
      }
    });
    console.log("Success:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("Backend Error Response:");
      console.error(err.response.data);
    } else {
      console.error("Request Failed:");
      console.error(err.message);
    }
  }
}
test();
