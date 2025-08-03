import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const Error = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/json/Loader.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <div className="w-80 sm:w-100 mx-auto">
      <Lottie animationData={animationData} loop />
    </div>
  );
};

export default Error;
