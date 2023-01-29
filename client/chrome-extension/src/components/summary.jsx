import React, { useEffect, useState } from 'react';
import '../pages/Popup/Popup.css';
import { ParagraphMedium } from "baseui/typography";
import { useStyletron } from 'baseui';


const Summary = (props) => {
  const {
    summary,
  } = props;

  const [, theme] = useStyletron();

  return (
    <ParagraphMedium color={theme.colors.primary}>{summary}</ParagraphMedium>
  )

}

export default Summary