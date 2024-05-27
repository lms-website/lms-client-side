import React from "react";
import Button from "../components/Button";

const PageNotFound = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex max-w-full w-[700px] flex-col text-center items-center gap-7 ">
        <div className="w-full">
          <div className=" w-full md:h-[400px] bg-center bg-no-repeat bg-none md:bg-[url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')]">
            <h1 className="font-Arvo text-[70px] ">404</h1>
          </div>
          <h3 className="font-Arvo text-[30px]">Look like you're lost</h3>
          <p className="text-sm">the page you are looking for not avaible!</p>
        </div>
        <Button to="/" type="primary-outline">
          Go to home
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;
