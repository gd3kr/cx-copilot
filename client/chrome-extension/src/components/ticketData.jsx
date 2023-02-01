import React, { useEffect, useState } from 'react';
import Summary from './summary';
import Citations from './citations';
import Feedback from './feedback';
import NextCompletion from './nextCompletion';
import '../styles/globals.css'

const TicketData = (props) => {
  const {
    clientId,
    ticketId,
    completionIdx,
    completionsLength,
    completion,
    setNextCompletionIdx,
    setClientId,
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

      <NextCompletion
        completionIdx={completionIdx}
        completionsLength={completionsLength}
        setNextCompletionIdx={setNextCompletionIdx}
        />
    </>
  )

}

export default TicketData