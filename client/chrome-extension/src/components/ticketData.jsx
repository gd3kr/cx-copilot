import React, { useEffect, useState } from 'react';
import Summary from './summary';
import Citations from './citations';
import '../pages/Popup/Popup.css';
import { ParagraphSmall } from "baseui/typography";
import { Block } from "baseui/block";
import { StyledDivider } from "baseui/divider";
import { Accordion, Panel } from "baseui/accordion";
import { Button } from "baseui/button";
import Feedback from './feedback';
import { useStyletron } from 'baseui';


const TicketData = (props) => {
  const {
    clientId,
    ticketId,
    completionIdx,
    completionsLength,
    completion,
    setNextCompletionIdx,
  } = props;

  const [, theme] = useStyletron();

  return (
    <React.Fragment>

      <Accordion overrides={ { Root: { style: { marginBottom: theme.sizing.scale600 } } } }>
        <Panel title="Summary">
          <Summary summary={completion.summary}/>
        </Panel>
        <Panel title="Citations" overrides={ { PanelContainer: { style: { maxHeight: '200px' } } } }>
          <Citations citationsStr={completion.citations || '[]'}/>
        </Panel>
      </Accordion>

      {/* <StyledDivider $style={{color: theme.colors.primary}}/> */}
      
      <Feedback
        clientId={clientId}
        ticketId={ticketId}
        completionIdx={completionIdx}
        completionsLength={completionsLength}
        completion={completion}
        version={1} // hardcoded version number
        setNextCompletionIdx={setNextCompletionIdx}/>

      <Block>
        <ParagraphSmall>{completionIdx+1}/{completionsLength}</ParagraphSmall>
        <Button onClick={setNextCompletionIdx}>Next Suggestion</Button>
      </Block>

    </React.Fragment>
  )

}

export default TicketData