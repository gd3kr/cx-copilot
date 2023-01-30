import React, { useEffect, useState } from 'react';
import { setClientIdInStorage } from '../utils/util';


const Onboarding = (props) => {

  const { setClientId } = props;

  const [id, setId] = useState(null);

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Onboarding</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Enter your client ID.</p>
        </div>
        <form className="mt-5 sm:flex sm:items-center">
          <div className="w-full sm:max-w-xs">
            <label htmlFor="clientId" className="sr-only">
              ClientID
            </label>
            <input
              type="clientId"
              name="clientId"
              id="clientId"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={event => setId(event.currentTarget.value)}
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