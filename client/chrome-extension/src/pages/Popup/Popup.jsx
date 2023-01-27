import React, {useEffect, useState} from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import {LightTheme, BaseProvider, styled, DarkTheme, useStyletron} from 'baseui';
import {
    HeadingMedium,
    HeadingSmall,
    HeadingXSmall,
    LabelSmall,
    ParagraphMedium,
    ParagraphSmall
} from "baseui/typography";
import {DIVIDER} from "baseui/table-semantic";
import {Block} from "baseui/block";
import {StyledDivider} from "baseui/divider";
import {Accordion, Panel} from "baseui/accordion";
import {ProgressBar} from "baseui/progress-bar";
import {LoadingSpinner} from "baseui/button/styled-components";
import {Button} from "baseui/button";
import {Checkmark} from "baseui/checkbox/styled-components";
import {Check, Delete} from "baseui/icon";
import {FormControl} from "baseui/form-control";
import {Input} from "baseui/input";
import {toaster, ToasterContainer} from "baseui/toast";
import {PLACEMENT} from "baseui/badge";


const PopupContent = (props) => {
    // const {ticketId, completion, pipelineId, version} = props
    const {isLoading, completions} = props;

    const [clientId, setClientId] = useState(null);
    const [inputClientId, setInputClientId] = useState(null);
    const [,theme] = useStyletron()

    const [completionIdx, setCompletionIdx] = useState(0);

    useEffect(() => {
        chrome.storage.local.get('client_id').then((res) => {
            setClientId(res.client_id)
        });
    }, []);

    const changeCompletionsIdx = () => {
        const idx = completionIdx+1 >= completions.length ? 0 : completionIdx+1;
        setCompletionIdx(idx);
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { type: "switch_completion", completion: completions[idx]?.text }, () => {});
        });
    }

     const rateCompletion = async (rating) => {
        const url = 'YOUR_URL';
        fetch(url, {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
                client_id: clientId,
                ticket_id: ticketId,
                pipeline_id: completionIdx+1,   // pipeline_id starts at 1 not 0
                version: version,
                rating: rating,
                completion: completions[completionIdx].text,
            })
        })
    };

    const setClientIDCallback = (clientId) => {
        setClientId(clientId)
        chrome.storage.local.set({
            'client_id': clientId,
        })
    }

    return (
        <Block height={"100vw"} display={"flex"} flexDirection={"column"} backgroundColor={theme.colors.backgroundPrimary} alignContent={'center'} justifyContent={'center'}>
            <HeadingXSmall color={theme.colors.primary} alignSelf={'center'}>CX Copilot</HeadingXSmall>
            { clientId ? isLoading ?
                <ParagraphMedium>Loading response for the ticket</ParagraphMedium>
                :
                <React.Fragment>
                    <Accordion overrides={{
                        Root: {
                            style: {
                                marginBottom: theme.sizing.scale600,
                            }
                        }
                    }}>
                    <Panel title="Summary"><ParagraphMedium color={theme.colors.primary}>{completions[completionIdx]?.summary}</ParagraphMedium></Panel>
                    <Panel overrides={{
                        PanelContainer: {
                            style: {
                                maxHeight: '200px',
                            }
                        }
                    }}
                    title="Citations">
                        <ParagraphMedium $style={{overflow: 'hidden'}}>
                            {completions[completionIdx]?.citations}
                        </ParagraphMedium>
                        </Panel>
                    </Accordion>
                    <StyledDivider $style={{color: theme.colors.primary}}/>
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
                    <Block>
                        <ParagraphSmall>{completionIdx+1}/{completions.length}</ParagraphSmall>
                        <Button onClick={changeCompletionsIdx}>Next Suggestion</Button>
                    </Block>
                </React.Fragment>
                :
                <Block padding={theme.sizing.scale200} display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
                    <Block display={"flex"} flexDirection={"column"}>
                        <FormControl label="Client ID" caption="Please enter clientID provided during onboarding">
                            <Input
                                id="input-id"
                                value={inputClientId}
                                onChange={event => setInputClientId(event.currentTarget.value)}
                            />
                        </FormControl>
                    </Block>
                    <Button size={"mini"} onClick={() => setClientIDCallback(inputClientId)}>Submit</Button>
                </Block>
            }
        </Block>
    );

}

const Popup = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [completions, setCompletions] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {type: "get_completions"}, (response) => {
                setIsLoading(false);
                setCompletions(response.completions);
            });
        });
    }, []);
    const engine = new Styletron();
    const [, theme] = useStyletron();

    return (
    <StyletronProvider value={engine}>
        <BaseProvider theme={DarkTheme}>
        <PopupContent
            completions={completions}
            isLoading={isLoading}
            />
        </BaseProvider>
    </StyletronProvider>
    );
};

export default Popup;
