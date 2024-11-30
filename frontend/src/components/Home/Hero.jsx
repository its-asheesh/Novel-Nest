import React from 'react';
import { Link } from 'react-router-dom';  // Importing Link from react-router-dom

const Hero = () => {
  return (
    <div className="h-[75vh] flex flex-col md:flex-row items-center justify-center bg-zinc-900 relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-900/70 to-transparent z-0"></div>

      <div className="w-full mb-12 lg:w-3/6 flex flex-col items-center lg:items-start justify-center z-10">
        <h1 className="text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left">
          Discover Your Next Great Read
        </h1>
        <p className="mt-4 text-xl text-zinc-300 text-center lg:text-left">
          Uncover captivating stories, enriching knowledge, and endless inspiration in our curated collection of books
        </p>
        <div className="mt-8">
          <Link to="/all-books" className="text-yellow-200 text-xl lg:text-2xl font-semibold border border-yellow-100 px-10 py-3 hover:bg-zinc-800 rounded-full">
            Discover Books
          </Link>
        </div>
      </div>

      <div className="w-full lg:w-3/6 h-auto lg:h-[100%] flex items-center justify-center relative z-10">
        {/* Image with blended edges */}
        <img
          src="/hero.png"  // Use the correct path to the image (assuming it's in the public folder)
          alt="hero"
          className="max-w-full max-h-full object-contain rounded-3xl"
          style={{
            filter: 'blur(0px)', // You can adjust this filter value if needed
            borderRadius: '30px',
            mixBlendMode: 'soft-light', // Makes image blend better with background
            opacity: 0.95,
          }}
        />
      </div>
    </div>
  );
};

export default Hero;
