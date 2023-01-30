import React, {useEffect, useState} from 'react'
import '../styles/globals.css'


const Citations = (props) => {
	const {
		citationsStr
	} = props

	const citations = JSON.parse(citationsStr)

	return (
    <div class="accordion" id="accordionExample">
      <div class="accordion-item bg-white border border-gray-200">
        <h2 class="accordion-header mb-0" id="headingOne">
          <button class="
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
        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
          data-bs-parent="#accordionExample">
          <div class="accordion-body py-4 px-5">
            {
							citations.map((citation, index) => (
								<div class="accordion" id="accordionExample">
									<div class="accordion-item bg-white border border-gray-200">
										<h2 class="accordion-header mb-0" id="headingOne">
											<button class="
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
										<div id={`collapseCitation${index}`} class="accordion-collapse collapse show" aria-labelledby="headingOne"
											data-bs-parent="#accordionExample">
											<h4 class="question-header mb-0" id={`question${index}`}>Question</h4>
											<div class="accordion-body py-4 px-5">{citation.question}</div>
											<h4 class="answer-header mb-0" id={`answer${index}`}>Answer</h4>
											<div class="accordion-body py-4 px-5">{citation.answer}</div>
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