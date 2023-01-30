import React, { useEffect, useState } from 'react';
import Summary from './summary';
import Citations from './citations';
import Feedback from './feedback';
import '../styles/globals.css'

const TicketData = (props) => {
  const {
    clientId,
    ticketId,
    completionIdx,
    completionsLength,
    completion,
    setNextCompletionIdx,
  } = props;

  return (
    <>

      <Summary summary={completion.summary}/>
      <Citations citationsStr={completion.citations || '[]'}/>

      <Feedback
        clientId={clientId}
        ticketId={ticketId}
        completionIdx={completionIdx}
        completionsLength={completionsLength}
        completion={completion}
        version={1} // hardcoded version number
        setNextCompletionIdx={setNextCompletionIdx}/>

      <div className="flex space-x-2 justify-center">
        <h2 className="completions-index-header mb-0" id="headingCompletionsIndex">
          {completionIdx+1}/{completionsLength}
        </h2>
        <div>
          <button type="button" onClick={setNextCompletionIdx} className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
            Next Suggestion
          </button>
        </div>
      </div>

    </>
  )

}

export default TicketData