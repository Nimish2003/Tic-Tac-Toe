import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import image from "../assets/images/page_1.png";

const Home = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation function

  return (
    <div className="w-full min-h-screen bg-page-1 bg-cover flex">
      <div className="w-screen flex">
        <div className="flex items-center ml-[680px] mt-auto mb-32 gap-10">
       
          <button
            onClick={() => navigate("/register")} 
            className="flex w-40 h-14 bg-gradient-to-r from-orange-700 to-pink-500 text-white font-semibold text-xl rounded-full whitespace-nowrap items-center justify-center"
          >
            Register
          </button>

          
          <button
            onClick={() => navigate("/login")} 
            className="flex w-40 h-14 bg-gradient-to-r from-orange-700 to-pink-500 text-white font-semibold text-xl rounded-full whitespace-nowrap items-center justify-center"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
