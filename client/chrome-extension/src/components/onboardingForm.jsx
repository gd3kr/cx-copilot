import React, { useEffect, useState } from 'react';
import { setClientIdInStorage } from '../utils/util';
import '../styles/globals.css'

const Onboarding = (props) => {


  const { setClientId } = props;

  const [id, setId] = useState('');

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Onboarding</h3>
        <form className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="clientId" className="text-gray-900 text-sm">
              Enter your client ID
            </label>
            <input
              type="clientId"
              name="clientId"
              id="clientId"
              value={id}
              onKeyDown={(e) => {
                // hacky solution for isolating keys from parent DOM
                if (e.key === 'Backspace') {
                  setId(id.slice(0, -1))
                } else if (e.key === 'Enter') {
                  setClientId(id)
                  setClientIdInStorage(id)
                } 
                // else if meta key is pressed
                else if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.key === 'Tab') {
                  return;
                }
                else {

                setId(id + e.key)
                ; e.preventDefault(); e.stopPropagation(); }}
              }
                // set the value of target

              onKeyUp={(e) => {e.preventDefault(); e.stopPropagation();}}
              
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              
            />
          </div>
          <button
            type="button"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => {
              setClientId(id)
              setClientIdInStorage(id)
            }}
            >
            Save
          </button>
        </form>
      </div>
    </div>
  )

}

export default Onboarding