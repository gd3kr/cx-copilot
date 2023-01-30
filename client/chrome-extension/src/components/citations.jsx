import React, {useEffect, useState} from 'react'
import '../styles/globals.css'


const Citations = (props) => {
	const {
		citationsStr
	} = props

	const citations = JSON.parse(citationsStr)

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