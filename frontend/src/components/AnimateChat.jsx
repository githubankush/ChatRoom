import React,{useEffect, useState} from 'react';
import Lottie from "lottie-react";
import Loader from "../components/Loader";

const AnimateChat = () => {
    const [animationData, setAnimationData] = useState(null);
    useEffect(() => {
    fetch("https://lottie.host/d8cff2ba-24e8-4bf0-b0f6-15e513fb5eac/ZYKKw8DPwT.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  if (!animationData) return <div className="text-center text-white"><Loader /></div>
   
  return (
    <div className="w-54 sm:w-64 mx-auto ">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};
export default AnimateChat;