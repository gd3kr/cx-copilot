import React, {useEffect, useState} from 'react'
import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import '../styles/globals.css'


const Citations = (props) => {
	const {
		citationsStr
	} = props

	const citations = JSON.parse(citationsStr)

	return (
		<div className="bg-white">
		  <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40 lg:px-8">
			<div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
			  <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">

				<Disclosure as="div" key={"citations"} className="pt-6">
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
				</Disclosure>
			  </dl>
			</div>
		  </div>
		</div>
	  )

	return (
    <div className="accordion" id="accordionCitations">
      <div className="accordion-item bg-white border border-gray-200">
        <h2 className="accordion-header mb-0" id="accordionCitationsHeading">
          <button className="
            accordion-button
            relative
            flex
            items-center
            w-full
            py-4
            px-5
            text-base text-gray-800 text-left
            bg-white
            border-0
            rounded-none
            transition
            focus:outline-none
          " type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true"
            aria-controls="collapseOne">
            Citations
          </button>
        </h2>
        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="accordionCitationsHeading"
          data-bs-parent="#accordionCitations">
          <div className="accordion-body py-4 px-5">
            {
			citations.map((citation, index) => (
				<div className="accordion" id={`accordionCitation${index}`}>
					<div className="accordion-item bg-white border border-gray-200">
						<h2 className="accordion-header mb-0" id={`accordionCitationHeading${index}`}>
							<button className="
								accordion-button
								relative
								flex
								items-center
								w-full
								py-4
								px-5
								text-base text-gray-800 text-left
								bg-white
								border-0
								rounded-none
								transition
								focus:outline-none
							" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseCitation${index}`} aria-expanded="true"
								aria-controls={`collapseCitation${index}`}>
								{index+1} ({citation.score})
							</button>
						</h2>
						<div id={`collapseCitation${index}`} className="accordion-collapse collapse show" aria-labelledby={`accordionCitationHeading${index}`}
							data-bs-parent={`#accordionCitation${index}`}>
							<div className="accordion-body py-4 px-5"><strong>Question</strong></div>
							<div className="accordion-body py-4 px-5">{citation.question}</div>
							<div className="accordion-body py-4 px-5"><strong>Answer</strong></div>
							<div className="accordion-body py-4 px-5">{citation.answer}</div>
						</div>
					</div>
				</div>))
			}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Citations