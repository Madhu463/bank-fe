import React from "react";

const Button = (props) => {
  return (
    <div
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md bg-black cursor-pointer shadow-sm text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
    >
      <button onClick={props.onClick}>{props.title}</button>
    </div>
  );
};

export default Button;