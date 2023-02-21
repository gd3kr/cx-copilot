import React, { useCallback, useEffect, useState } from "react";
import ApiClient from "../../utils/client";
import { MessageRequestTypes, StorageVariables,
  Platforms } from "../../utils/constants";
import {
  getPlatformFromUrl,
  getTicketIdFromPlatformAndUrl,
  getClientIdFromStorage,
} from "../../utils/util";
import Onboarding from "../../components/onboardingForm";
import TicketData from "../../components/ticketData";
import Heading from "../../components/heading";
import Loading from "../../components/loading";
import "../../styles/globals.css";
import ClearClientIdButton from "../../components/clearClientIdButton";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";


const Popup = (props) => {
  const [clientId, setClientId] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completions, setCompletions] = useState([]);
  const [completionIdx, setCompletionIdx] = useState(0);

  const API = new ApiClient();

  const loadCompletions = async () => {
    setIsLoading(true);
    const result = await API.post("/completions", {
      client_id: clientId,
      conversation_id: ticketId,
      use_cached: true,
      cx_platform: platform,
    });
    setCompletions(result.completions);
    setIsLoading(false);
  };

  const triggerInjectCompletion = (idx) => {
    props.injectCompletion(platform, completions?.[idx].text)
    return;

  };

  // init clientId, ticketId, platform
  useEffect(async () => {
    const clientIdFromStorage = await getClientIdFromStorage();
    setClientId(clientIdFromStorage);
    const p = getPlatformFromUrl(props.url);
    setPlatform(p);
    const t = getTicketIdFromPlatformAndUrl(p, props.url);
    setTicketId(t);
  }, []);

  // load completions once clientId, ticketId, and platform are set
  useEffect(async () => {
    if (!clientId || !ticketId || !platform) return;
    await loadCompletions();
  }, [clientId, ticketId, platform]);

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

  const setNextCompletionIdx = useCallback(
    (subtract) => {
      setCompletionIdx((completionIdx) => {
        if (subtract === undefined || !subtract) subtract = false;
        const idx =
          (completionIdx + (subtract ? -1 : 1) + completions.length) %
          completions.length;
        return idx;
      });
    },
    [completions]
  );

  const onChromeMessage = useCallback(
    (command) => {
      if (completions.length == 0) {
        return;
      }
      const previous = command == "previous_command";
      setNextCompletionIdx(previous);
    },
    [completions]
  );
  // chrome.commands.onCommand.addListener(onChromeMessage);s


  return (
    <>
      {clientId ? (
        isLoading ? (
          <>
            <div
              className="
          flex
          justify-center
          items-center
          mt-10
          animate-spin
          "
          
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fillRule="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
              </svg>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 bg-white rounded-lg shadow-lg max-w-[400px] w-[300px] h-full
             ">
              <div className="flex justify-between items-center">
                <Heading />
                <ClearClientIdButton setClientId={setClientId} />
              </div>
              <TicketData
                clientId={clientId}
                ticketId={ticketId}
                completionIdx={completionIdx}
                completionsLength={completions?.length}
                completion={completions?.[completionIdx]}
                setNextCompletionIdx={setNextCompletionIdx}
              />
            </div>
          </>
        )
      ) : (
        <>
          <Heading />
          <Onboarding setClientId={setClientId}></Onboarding>
        </>
      )}
    </>
  );
};

export default Popup;
