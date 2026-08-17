import React, { useEffect, useState } from 'react'
import axios from 'axios'
import base_url from '../services/baseApi'

const Landing = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const test=async () => {
      try {
        const res = await axios.get(`${base_url}`);
        setData(res.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    }
    useEffect(()=>{test()},[])
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      
      <p>{data.message}</p>
  
    </div>
  );
};


export default Landing