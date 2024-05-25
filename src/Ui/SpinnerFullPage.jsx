const SpinnerFullPage = () => {
  return (
    <div className=" bg-slate-50  w-full fixed inset-0 backdrop-blur-sm flex h-screen items-center justify-center">
      <div className="flex items-center">
        <div className="w-[20px] h-[20px] bg-primary rounded-full mx-1 animate-[leap_1s_ease-in-out_infinite,colorChange_2s_ease-in-out_infinite]  "></div>
        <div className="w-[20px] h-[20px] bg-primary rounded-full mx-1 animate-[leap_1s_ease-in-out_infinite,colorChange_2s_ease-in-out_infinite] animation-delay-200"></div>
        <div className="w-[20px] h-[20px] bg-primary rounded-full mx-1 animate-[leap_1s_ease-in-out_infinite,colorChange_2s_ease-in-out_infinite]  animation-delay-400"></div>
      </div>
    </div>
  );
};

export default SpinnerFullPage;
