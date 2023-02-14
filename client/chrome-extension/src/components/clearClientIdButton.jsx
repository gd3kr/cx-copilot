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
          className="inline-flex items-center rounded-md border border-transparent bg-black uppercase px-3 py-2 text-sm font-small leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            clearClientIdInStorage();
            setClientId(null);
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  <path d="M7.5 1v7h1V1h-1z"/>
  <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
</svg>
        </button>
      </span>
    </div>
  )
}

export default ClearClientIdButton