import axios from 'axios';

async function test() {
  try {
    const res = await axios.post('http://localhost:8000/api/auth/register', {
      name: "Daffa Client",
      email: "daffalucky140304@gmail.com",
      password: "password123",
      role: "CLIENT"
    });
    console.log("SUCCESS:", res.data);
  } catch (err) {
    console.log("ERROR:", err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
  }
}

test();
