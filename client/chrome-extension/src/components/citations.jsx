import React, {useEffect, useState} from 'react'
import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import '../styles/globals.css'


const Citations = (props) => {
	const {
		citations
	} = props

	return (
		<div className="bg-white">
		  <div className="mx-auto max-w-7xl px-6 py-4 sm:py-32 lg:py-40 lg:px-8">
			<div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
			  <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">

				<Disclosure as="div" key={"citations"} className="pt-6">
					{({ open }) => (
						<>
							<dt>
								<Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
								<span className="text-base font-semibold leading-7">Citations</span>
								<span className="ml-6 flex h-7 items-center">
									{open ? (
									<PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
									) : (
									<MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
									)}
								</span>
								</Disclosure.Button>
							</dt>
							<Disclosure.Panel as="dd" className="mt-2 pr-12">
								{citations.map((citation, index) => (
									<Disclosure as="div" key={`accordionCitation${index}`} className="pt-6">
									{({ open }) => (
										<>
										<dt>
											<Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
											<span className="text-base font-semibold leading-7">{index+1} ({citation.score})</span>
											<span className="ml-6 flex h-7 items-center">
												{open ? (
												<PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
												) : (
												<MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
												)}
											</span>
											</Disclosure.Button>
										</dt>
										<Disclosure.Panel as="dd" className="mt-2 pr-12">
											<p className="text-base leading-7 text-gray-600"><strong>Question</strong></p>
											<p className="text-base leading-7 text-gray-600">{citation.question}</p>
											<p className="text-base leading-7 text-gray-600"><strong>Answer</strong></p>
											<p className="text-base leading-7 text-gray-600">{citation.answer}</p>
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
			</div>
		  </div>
		</div>
	  )
}

export default Citations