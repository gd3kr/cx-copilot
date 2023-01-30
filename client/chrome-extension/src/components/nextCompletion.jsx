import React, { useEffect, useState } from 'react';
import '../styles/globals.css'

const NextCompletion = (props) => {
  const {
    completionIdx,
    completionsLength,
    setNextCompletionIdx,
  } = props;

  return (
    <div className="flex space-x-2 justify-center">
    <span className="text-base font-semibold leading-7">{completionIdx+1}/{completionsLength}</span>
    <div>
        <button type="button" onClick={setNextCompletionIdx} className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
        Next Suggestion
        </button>
    </div>
    </div>
  )

}

export default NextCompletion