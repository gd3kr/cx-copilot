import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import "../styles/globals.css";

const Citations = (props) => {
  const { citations } = props;

  return (
    <div
      className="bg-white
		mt-2
		border border-gray-200 rounded-md shadow-sm divide-y divide-gray-200
    "
    >
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* <div className="mx-auto max-w-4xl divide-y divide-gray-900/10"> */}
        <dl className="divide-y divide-gray-900/10">
          <Disclosure
            as="div"
            key={"citations"}
          >
            {({ open }) => (
              <>
                <dt>
                  <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                    <span className="text-base font-semibold leading-7">
                      Citations
                    </span>
                    <span className="ml-6 flex h-7 items-center">
                      {open ? (
                        <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MinusSmallIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </dt>
                <Disclosure.Panel
                  as="dd"
                  className="mt-2 
				bg-white border border-gray-200 rounded-md shadow-sm divide-y divide-gray-200
				
				"
                >
                  {citations.map((citation, index) => (
                    <Disclosure
                      as="div"
                      key={`accordionCitation${index}`}
                      className="
									p-4
									"
                    >
                      {({ open }) => (
                        <>
                          <dt
						  >
                            <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                              <span className="text-base font-semibold leading-7">
                                {index + 1}{" "}
                                <span
                                  className="text-gray-500 font-normal
								text-sm
								"
                                >
                                  ({citation.score.toFixed(3)})
                                </span>
                              </span>
                              <span className="ml-6 flex h-7 items-center">
                                {open ? (
                                  <PlusSmallIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <MinusSmallIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </dt>
                          <Disclosure.Panel as="dd" className="mt-2">
                            <p className="text-sm leading-5 text-gray-600 mb-2">
                              <strong>Question</strong>
                            </p>
                            <p className="text-sm leading-5 text-gray-600 mb-2">
                              {citation.question}
                            </p>
                            <p className="text-sm leading-5 text-gray-600 mb-2">
                              <strong>Answer</strong>
                            </p>
                            <p className="text-sm leading-5 text-gray-600">
                              {citation.answer}
                            </p>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </dl>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Citations;
