import React, { useEffect, useState } from 'react';
import ApiClient from '../utils/client';
import '../styles/globals.css'

const Feedback = (props) => {
  const {
    clientId,
    ticketId,
    completionIdx,
    completion,
    version,
  } = props;

  const API = new ApiClient();

  const rateCompletion = async (rating) => {
    await API.post('/completions/rate', {
      client_id: clientId,
      ticket_id: ticketId,
      pipeline_id: completionIdx+1,   // pipeline_id starts at 1 not 0
      version: version,
      rating: rating,
      completion: completion.text,
    });
  };

  return (
    <div className="flex space-x-2 justify-center">
      <div className="mt-2 max-w-xl text-sm text-gray-500">
        Did we answer the ticket?
      </div>
      <div>
        <button type="button" onClick={() => rateCompletion(1)} className="inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out">
          Yes
        </button>
        <button type="button" onClick={() => rateCompletion(0)} className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out">
          No
        </button>
      </div>
    </div>
  )

}

export default Feedback