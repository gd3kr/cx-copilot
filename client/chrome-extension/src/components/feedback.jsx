import React, { useEffect, useState } from 'react';
import ApiClient from '../utils/client';
import '../pages/Popup/Popup.css';
import { ParagraphSmall } from "baseui/typography";
import { Block } from "baseui/block";
import { Check, Delete } from "baseui/icon";
import { useStyletron } from 'baseui';


const Feedback = (props) => {
  const {
    clientId,
    ticketId,
    completionIdx,
    completionsLength,
    completion,
    setNextCompletionIdx,
  } = props;

  const [, theme] = useStyletron();

  const API = new ApiClient();

  const rateCompletion = async (rating) => {
    await API.post('/completions/rate', {
      client_id: clientId,
      ticket_id: ticketId,
      pipeline_id: completionIdx+1,   // pipeline_id starts at 1 not 0
      version: version,
      rating: rating,
      completion: completion.text,
    });
  };


  return (
    <Block padding={theme.sizing.scale600} height={"100vw"} display={"flex"} flexDirection={"row"} backgroundColor={theme.colors.backgroundPrimary} alignItems={'center'} justifyContent={'space-between'}>
      <ParagraphSmall>Did we answer the ticket?</ParagraphSmall>
      <Check onClick={() => rateCompletion(1)} size={30} style={{
        color: theme.colors.primary,
        cursor: "pointer",
        }}/>
      <Delete onClick={() => rateCompletion(0)} size={30} style={{
        color: theme.colors.primary,
        cursor: "pointer",
        }}/>
    </Block>
  )

}

export default Feedback