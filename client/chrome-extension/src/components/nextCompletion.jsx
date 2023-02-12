import React, { useEffect, useState } from "react";
import "../styles/globals.css";

const NextCompletion = (props) => {
  const { completionIdx, completionsLength, setNextCompletionIdx } = props;

  return (
    <div
      className="flex
      justify-center
      items-center
    "
    >
      <svg
      className="cursor-pointer
      fill-gray-400
      "
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="currentColor"
        viewBox="0 0 16 16"
        onClick={() => setNextCompletionIdx(true)}
      >
        <path
          d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
        />
      </svg>
      <span className="text-base font-semibold leading-7">
        {completionIdx + 1}/{completionsLength}
      </span>
      <svg
            className="cursor-pointer 
            
      fill-gray-400"

        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="currentColor"
        viewBox="0 0 16 16"
        onClick={() => setNextCompletionIdx(false)}
      >
        <path
          d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
        />
      </svg>
      {/* <div>
        <button
					type="button"
					onClick={()=>
            setNextCompletionIdx(true)
          }
					className="inline-flex items-center rounded-md border border-transparent bg-blue-600 uppercase px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
					Next Suggestion
        </button>
    </div> */}
    </div>
  );
};

export default NextCompletion;
