import React, { useState, useEffect } from "react";
import Loader from '../components/Loader/Loader';
import BookCard from '../components/BookCard/BookCard';
import axios from "axios";

const AllBooks = () => {
  const [Data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
        const response = await axios.get("https://novel-nest-g2ny.onrender.com/api/v1/get-all-books");
        setData(response.data.data); // Correctly update the state with fetched data
        console.log(response);
    };
    
    fetch();
  }, []);

  return (
    <div className='bg-zinc-900 h-auto px-12 py-8'>
      <h4 className="text-3xl text-yellow-100">All Books</h4>
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
  )
}

export default AllBooks