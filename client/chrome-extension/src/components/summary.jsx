import React, { useEffect, useState } from 'react';
import '../styles/globals.css'

const Summary = (props) => {
  const {
    summary,
  } = props;

  return (
    <div class="accordion" id="accordionSummary">
      <div class="accordion-item bg-white border border-gray-200">
        <h2 class="accordion-header mb-0" id="accordionSummaryHeading">
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
          " type="button" data-bs-toggle="collapse" data-bs-target="#collapseSummary" aria-expanded="true"
            aria-controls="collapseSummary">
            Summary
          </button>
        </h2>
        <div id="collapseSummary" class="accordion-collapse collapse show" aria-labelledby="accordionSummaryHeading"
          data-bs-parent="#accordionSummary">
          <div class="accordion-body py-4 px-5">
            {summary}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Summary