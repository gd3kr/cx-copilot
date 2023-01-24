import logo from './logo.svg';
import './App.css';
import {useFrontContext} from "./providers/frontContextProvider";
import {Accordion, AccordionSection, PluginFooter, PluginHeader, PluginLayout} from "@frontapp/ui-kit";
import {useEffect, useState} from "react";

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

const SingleConversationAutoResponse = () => {
   const context = useFrontContext();
  const [open, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
        const url = 'YOUR_URL';
        const httpResponse = fetch(url, {
            method: 'POST',
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify({
                conversation_id: context.conversation.id,
                use_cached: true,
                cx_platform: 'front',
                clientId: 3,
            })
        }).then((res) => res.json().then((parsed) => {
            context.createDraft({
          content: {
              body: parsed.completion,
              type: 'text'
          },
          replyOptions: {
              type: 'replyAll', // Or 'replyAll'
              originalMessageId: messages[0].id,
          }
        })
        }));
  }, [context.conversation.id])
    useEffect(() => {

    }, [messages])
   return <div className="App-sidebar-body">
    <Accordion>
        <AccordionSection isOpen={open} onSectionToggled={setIsOpen} id={1} title={'Summary'}>
            summary goes here
        </AccordionSection>
        <AccordionSection id={2} title={'Citations'}>
            citations go here
        </AccordionSection>
    </Accordion>
   </div>
}
export default App;
