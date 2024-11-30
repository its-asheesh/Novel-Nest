import React from 'react';
import Hero from '../components/Home/Hero';
import NewlyAdded from '../components/Home/NewlyAdded';
const Home = () => {
  return (
    <div className='bg-zinc-900 text-white px-10 py-12'>
      <Hero />
      <NewlyAdded />
    </div>
  )
}

export default Home