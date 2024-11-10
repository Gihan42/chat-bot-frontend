import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LoginComponent from '../../component/LoginComponent';
import SingInComponent from '../../component/SingInComponent';
import heroPattern from '../../assest/bgImage.jpg';

export default function LoginPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Helper function to wrap each letter with a span and add animation delay, handling spaces
  const animateText = (text) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="animate-letter"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div
      className="flex items-center justify-start h-screen w-screen rounded-lg pl-48 pt-24"
      style={{
        backgroundImage: `url(${heroPattern})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col items-center rounded-lg bg-gray-200 drop-shadow-xl mr-24">
        <Tabs value={value} onChange={handleChange} aria-label="disabled tabs example" centered>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        {value === 0 && <LoginComponent />}
        {value === 1 && <SingInComponent />}
      </div>

      <div className="flex flex-col items-start justify-start h-auto w-auto">
        <style>
          {`
            @keyframes letterFadeIn {
              0% {
                opacity: 0;
                transform: translateY(10px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-letter {
              display: inline-block;
              opacity: 0;
              animation: letterFadeIn 0.5s forwards;
            }
          `}
        </style>

        <h1 className="text-zinc-50 mb-4">
          {animateText("Chat Bot...")}
        </h1>
        <lable className="text-zinc-50">
          {animateText("Welcome! Log in or Sing in to chat and")}
        </lable>
        <lable className="text-zinc-50">
          {animateText("experience seamless assistance tailored just for you.")}
        </lable>
        <lable className="text-zinc-50">
          {animateText("Let’s get started!")}
        </lable>
        <h5 className="mb-4 mt-4">
          powerd by abc@ pvt.ltd
        </h5>
      </div>
    </div>
  );
}
