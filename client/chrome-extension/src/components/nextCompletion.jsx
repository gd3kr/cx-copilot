import React, { useEffect, useState } from 'react';
import '../styles/globals.css'

const NextCompletion = (props) => {
  const {
    completionIdx,
    completionsLength,
    setNextCompletionIdx,
  } = props;

  return (
    <div className="flex space-x-2 justify-center py-4">
    <span className="text-base font-semibold leading-7">{completionIdx+1}/{completionsLength}</span>
    <div>
        <button
					type="button"
					onClick={setNextCompletionIdx}
					className="inline-flex items-center rounded-md border border-transparent bg-blue-600 uppercase px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					>
					Next Suggestion
        </button>
    </div>
    </div>
  )

}

export default NextCompletion