import React, {useEffect, useState} from 'react';
import './Popup.css';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, DarkTheme, useStyletron} from 'baseui';
import {
  HeadingXSmall, 
  ParagraphMedium,
} from "baseui/typography";
import { Block } from "baseui/block";
import ApiClient from '../../utils/client';
import { MessageRequestTypes, StorageVariables } from '../../utils/constants';
import { getPlatformFromUrl, getTicketIdFromPlatformAndUrl } from '../../utils/util';
import Onboarding from '../../components/onboardingForm';
import TicketData from '../../components/ticketData';


const Popup = () => {
  const [clientId, setClientId] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completions, setCompletions] = useState([]);
  const [completionIdx, setCompletionIdx] = useState(0);

  const API = new ApiClient();

  const loadCompletions = async () => {
    setIsLoading(true);
    const result = await API.post('/completions', {
      client_id: clientId,
      conversation_id: ticketId,
      use_cached: true,
      cx_platform: platform,
    });
    setCompletions(result.completions);
    setIsLoading(false);
  };

  const triggerInjectCompletion = (idx) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: MessageRequestTypes.InjectCompletion,
        text: completions?.[idx].text,
        platform: platform,
      }, (response) => {});
    });
  }

  // init clientId, ticketId, platform
  useEffect(() => {
    chrome.storage.local.get(StorageVariables.ClientId).then((res) => {
      setClientId(res?.client_id || 1);
    });
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      const url = tabs[0].url;
      const p = getPlatformFromUrl(url);
      setPlatform(p);
      const t = getTicketIdFromPlatformAndUrl(p, url);
      setTicketId(t);
    });
  }, []);

  // load completions once clientId, ticketId, and platform are set
  useEffect((async () => {
    if (!clientId || !ticketId || !platform) return;
    await loadCompletions();
  }), [clientId, ticketId, platform]);

  // reset completionIdx to 0 after new completions load
  useEffect(() => {
    if (completions?.length) {
      triggerInjectCompletion(0);
      setCompletionIdx(0);
    }
  }, [completions]);

  // trigger inject completion when index state changes
  useEffect(() => {
    if (completions?.length) {
      triggerInjectCompletion(completionIdx);
    }
  }, [completionIdx]);

  const setNextCompletionIdx = () => {
    const idx = completionIdx+1 >= completions.length ? 0 : completionIdx+1;
    setCompletionIdx(idx);
  }

  const engine = new Styletron();
  const [, theme] = useStyletron();

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <Block height={"100vw"} display={"flex"} flexDirection={"column"} backgroundColor={theme.colors.backgroundPrimary} alignContent={'center'} justifyContent={'center'}>
          <HeadingXSmall color={theme.colors.primary} alignSelf={'center'}>CX Copilot</HeadingXSmall>
          { clientId ? isLoading ?
            <ParagraphMedium>Loading response for the ticket</ParagraphMedium>
            :
            <TicketData
              clientId={clientId}
              ticketId={ticketId}
              completionIdx={completionIdx}
              completionsLength={completions?.length}
              completion={completions?.[completionIdx]}
              setNextCompletionIdx={setNextCompletionIdx}/>
            :
            <Onboarding setClientId={setClientId}></Onboarding>
          }
        </Block>
      </BaseProvider>
    </StyletronProvider>
  );
};

export default Popup;
