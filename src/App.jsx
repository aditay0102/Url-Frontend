import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

const App = () => {
  const [fullUrl, setFullUrl] = useState('');
  const [urlList, setUrlList] = useState();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Optional: Fetch existing URLs on component mount
  useEffect(() => {
    axios.get(`${apiUrl}/Short`) // Adjust this path to match your backend route
      .then((res)=>{
        console.log(res.data.shortUrls  )
        setUrlList(res.data.shortUrls)
        
      })
      .catch(err => console.error('Error fetching URLs:', err));
  }, [urlList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/shortUrls`, { fullUrl : fullUrl }); 
      const newUrl = res.data; // { fullUrl, shortUrl, clicks }
      console.log(res.data);
      setUrlList(prev => [...prev, newUrl]);
      setFullUrl('');
    } catch (error) {
      console.error('Shortening failed:', error);
    }
  };

  return (
    <div className="container">
      <h1>Url Shortener</h1>

      <form id="urlForm" onSubmit={handleSubmit}>
        <label htmlFor="fullUrl">Enter the Url</label>
        <input
          type="url"
          name="fullUrl"
          id="fullUrl"
          required
          value={fullUrl}
          onChange={(e) => setFullUrl(e.target.value)}
        />
        <button type="submit">Shrink</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Full Url</th>
            <th>Short Url</th>
            <th>Clicks</th>
          </tr>
        </thead>
        <tbody id="urlTableBody">
        {Array.isArray(urlList) && urlList.map((url, index) => (
          <tr key={index}>
            <td>{url.full}</td>
            <td>
            <a href={`${apiUrl}/${url.short}`} target="_blank" rel="noopener noreferrer">
              {url.short}
            </a>
            </td>
            <td>{url.clicks}</td>
          </tr>
  ))}
  
        </tbody>
      </table>
    </div>
  );
};

export default App;
