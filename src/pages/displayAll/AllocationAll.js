import React, { useState, useEffect } from "react";
import AllocationTable from "../../components/AllocationTable";
import { fetchAllData } from "../../api/api"; // Import the function
import "../../styles/displayall.css";

const AllocationAll = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  useEffect(() => {
    const loadAllocations = async () => {
      try {
        const response = await fetchAllData("allocation");
        setAllocations(response);
      } catch (error) {
        console.error("Error fetching allocations:", error);
      } finally {
        setLoading(false); 
      }
    };
    loadAllocations();
  }, []);

  return (
    <div className="all-page">
      <h2>Allocation Details</h2>
      {loading ? (
        <p className="loading-message">Loading Data...</p>
      ) : (
        <AllocationTable data={allocations} />
      )}
    </div>
  );
};

export default AllocationAll;
