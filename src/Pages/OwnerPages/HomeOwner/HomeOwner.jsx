import React, { useCallback } from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function HomeOwner() {
  const baseURL = import.meta.env.VITE_Base_URL;
  const { userInfo } = useSelector((state) => state.user || {});
  const [gems, setGems] = useState([]);


  const fetchMyGems = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseURL}/gems/user/${userInfo._id}`
      );
      setGems(response.data);
    } catch (error) {
      console.error("Error fetching gems:", error);
    }
  })
  
  useEffect(() => {
    fetchMyGems();
  }, [fetchMyGems]);
  

  return (
    <div>
      {gems.map((gem) => (
        <div key={gem._id}>
          <h4>{gem.name}</h4>
          <p>Total Visits: {gem.visitsCount}</p>
        </div>
      ))}
    </div>
  );
}
