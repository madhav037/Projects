import { BsDot } from "react-icons/bs";
const Loading = () => {
  return (
    <div className="flex justify-center backdrop-blur-3xl absolute z-50 items-center h-[100vh] w-full text-black ">
      <div className=" text-4xl font-bold animate-bounce-slow pt-5 ">L</div>
      <div className=" text-4xl font-bold animate-bounce-medium pt-5 ">o</div>
      <div className=" text-4xl font-bold animate-bounce-fast pt-5 ">a</div>
      <div className=" text-4xl font-bold animate-bounce-slow pt-5 ">d</div>
      <div className=" text-4xl font-bold animate-bounce-medium pt-5 ">i</div>
      <div className=" text-4xl font-bold animate-bounce-fast pt-5 ">n</div>
      <div className=" text-4xl font-bold animate-bounce-slow pt-5 ">g</div>
      <div className=" animate-bounce-medium pt-5 text-2xl">
        <BsDot />
      </div>
      <div className=" animate-bounce-fast pt-5 text-2xl">
        <BsDot />
      </div>
      <div className=" animate-bounce-slow pt-5 text-2xl">
        <BsDot />
      </div>
    </div>
  );
};

export default Loading;
