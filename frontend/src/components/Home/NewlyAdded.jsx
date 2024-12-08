// NewlyAdded.jsx
import React, { useState, useEffect } from "react";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";
import axios from "axios";

const NewlyAdded = () => {
  const [Data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
        const response = await axios.get("https://novel-nest-g2ny.onrender.com/api/v1/get-recent-books");
        setData(response.data.data); // Correctly update the state with fetched data
        console.log(response);
    };
    
    fetch();
  }, []);

  return (
    <div className="mt-8 px-4">
      <h4 className="text-3xl text-yellow-100">Newly Added Books</h4>
      {!Data && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Data && Data.map((items,i) => (
          <div key={i}><BookCard data={items}/>{" "}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default NewlyAdded;  // Ensure this is the default export
