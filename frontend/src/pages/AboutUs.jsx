import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-zinc-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="mb-4">
          Welcome to our platform! We are dedicated to providing an excellent selection of books for readers of all kinds. Whether you’re looking for the latest bestseller, timeless classics, or educational materials, we have something for everyone.
        </p>
        <p className="mb-4">
          Our mission is to make reading accessible and enjoyable for everyone. We believe in the power of books to inspire, educate, and entertain.
        </p>
        <p className="mb-4">
          Our platform offers:
          <ul className="list-disc list-inside">
            <li>A vast collection of books from various genres</li>
            <li>Easy navigation to find your favorite books</li>
            <li>Secure and seamless ordering experience</li>
            <li>Friendly customer support</li>
          </ul>
        </p>
        <p className="mb-4">
          Thank you for choosing us as your go-to source for books. We hope you have a wonderful experience exploring and enjoying our collection.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
