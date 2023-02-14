import logo from './logo.svg';
import './App.css';
import {useFrontContext} from "./providers/frontContextProvider";
import {Accordion, AccordionSection, PluginFooter, PluginHeader, PluginLayout, Skeleton} from "@frontapp/ui-kit";
import {useEffect, useState} from "react";
import {useHotkeys} from "react-hotkeys-hook";

function App() {
  const context = useFrontContext();
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  if (!context)
    return (
      <div className="App">
        <p>Waiting to connect to the Front context.</p>
      </div>
    )

  switch(context.type) {
    case 'noConversation':
      return (
        <div className="App">
          <p>No conversation selected. Select a conversation to use this plugin.</p>
        </div>
      );
    case 'singleConversation':
      return (

          <div className="App-sidebar">
          <PluginLayout >
          <PluginHeader>
              CX-Copilot
          </PluginHeader>
              <SingleConversationAutoResponse />
            </PluginLayout>
              </div>
      );
    case 'multiConversations':
      return (
        <div className="App">
          <p>Multiple conversations selected. Select only one conversation to use this plugin.</p>
        </div>
      );
    default:
      console.error(`Unsupported context type: ${context.type}`);
      break;
  };
}
const url = 'https://support-bef.onrender.com';
console.log(url);
const SingleConversationAutoResponse = () => {
   const context = useFrontContext();
  const [open, setIsOpen] = useState(true);
  const [pipelineResponse, setPipelineResponse] = useState(null);
  const [responseLoading, setResponseLoading] = useState(false)
  const [messages, setMessages] = useState([]);
  useHotkeys('ctrl+s', () => {
      fetch(`${url}/index_conversation`, {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
                conversation_id: context.conversation.id,
                clientId: 3,
            })
        })
  }, [context])

    useEffect(() => {
        context.listMessages().then((res) => setMessages(res.results))
    }, [context])


  useEffect(() => {
      if (context.conversation.id == null) {
          return;
      }

      setResponseLoading(true);
        const httpResponse = fetch(`${url}/get_auto_response`, {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
                conversation_id: context.conversation.id,
                use_cached: false,
                platform: 'front',
                client_id: 3,
            })
        }).then((res) => res.json().then((parsed) => {
            setPipelineResponse(parsed);

            context.listMessages().then((res) =>             context.createDraft({
          content: {
              body: parsed.completion,
              type: 'text'
          },
          replyOptions: {
              type: 'replyAll', // Or 'replyAll'
              originalMessageId: res.results[0].id,
          }
        }))

        })).finally(() => setResponseLoading(false));
  }, [context.conversation.id])
    useEffect(() => {

    }, [messages])
   return <div className="App-sidebar-body">
       {responseLoading? <Skeleton variant={"dark"}/>:
    <Accordion>
        <AccordionSection isOpen={open} onSectionToggled={setIsOpen} id={1} title={'Summary'}>
            {pipelineResponse?.summary}
        </AccordionSection>
        <AccordionSection id={2} title={'Citations'}>
            {pipelineResponse?.citations}
        </AccordionSection>
    </Accordion>}
   </div>
}
export default App;
