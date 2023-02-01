import React, { useEffect, useState } from 'react';
import '../styles/globals.css'
import { clearClientIdInStorage } from '../utils/util';

const ClearClientIdButton = (props) => {
  const {
    setClientId,
  } = props;

  return (
    <div className="flex space-x-2 justify-center py-4">
      <span className="isolate inline-flex rounded-md shadow-sm">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-500 uppercase px-3 py-2 text-sm font-small leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            clearClientIdInStorage();
            setClientId(null);
          }}>
          Clear Client ID
        </button>
      </span>
    </div>
  )
}

export default ClearClientIdButton