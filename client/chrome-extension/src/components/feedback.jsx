import React, { useEffect, useState } from 'react';
import ApiClient from '../utils/client';
import '../styles/globals.css'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';

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
    <div className="flex space-x-2 justify-center py-4">
      <span className="text-base font-semibold leading-7">Did we answer the ticket?</span>
      <span className="isolate inline-flex rounded-md shadow-sm">
        <button
          type="button"
          className="inline-flex items-center rounded-l-md border border-transparent bg-green-500 uppercase px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => rateCompletion(1)}>
          <CheckIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-r-md border border-transparent bg-red-600 uppercase px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => rateCompletion(0)}>
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </span>
    </div>
  )

}

export default Feedback