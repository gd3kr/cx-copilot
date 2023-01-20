import React, {useEffect, useState} from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import {LightTheme, BaseProvider, styled, DarkTheme, useStyletron} from 'baseui';
import {HeadingMedium, HeadingSmall, HeadingXSmall, ParagraphMedium} from "baseui/typography";
import {DIVIDER} from "baseui/table-semantic";
import {Block} from "baseui/block";
import {StyledDivider} from "baseui/divider";
import {Accordion, Panel} from "baseui/accordion";
import {ProgressBar} from "baseui/progress-bar";
import {LoadingSpinner} from "baseui/button/styled-components";

const PopupContent = (props) => {
    const {isLoading, summary, citations} = props;

    const [,theme] = useStyletron()

    console.log(isLoading)
    console.log(summary)


  return (
      <Block width={"100%"} height={"100vw"} display={"flex"} flexDirection={"column"} backgroundColor={theme.colors.backgroundPrimary} alignContent={'center'} justifyContent={'center'}>
      <HeadingXSmall color={theme.colors.primary}>
          CX Copilot
      </HeadingXSmall>
          {isLoading ? <ParagraphMedium>Loading response for the ticket</ParagraphMedium>:
          <Accordion>
              <Panel title="Summary"><ParagraphMedium color={theme.colors.primary}>{summary}</ParagraphMedium></Panel>
                  <Panel overrides={{
                    PanelContainer: {
                        style: {
                            maxHeight: '400px',
                        }
                    }
                  }} title="Citations"><ParagraphMedium>{citations}</ParagraphMedium></Panel>
            </Accordion>}
          <StyledDivider />
      </Block>
  );

}

const Popup = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [summary, setSummary] = useState([]);
    const [citations, setCitations] = useState([]);

     useEffect(() => {
        const func = () => {
            setIsLoading(true);
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "inject"}, function (response) {
                    setIsLoading(false)
                    setSummary(response.summary)
                    setCitations(response.citations)
                });
            });
        }

        func();
    }, [])
    const engine = new Styletron();
     const [, theme] = useStyletron();

  return (
      <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <PopupContent isLoading={isLoading} summary={summary} citations={citations}/>
      </BaseProvider>
        </StyletronProvider>
  );
};

export default Popup;
