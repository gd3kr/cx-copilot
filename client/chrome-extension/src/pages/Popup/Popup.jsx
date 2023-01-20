import React, {useEffect, useState} from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState([]);
    useEffect(() => {
        const func = () => {
            setIsLoading(true);
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: "inject"}, function (response) {
                    console.log(response);
                    setSummary(response.summary)
                    setIsLoading(false)
                });
            });
        }

        func();
    }, [])

  return (
    <div className="App">
      <header className="App-header">
          {isLoading ? "Loading...": summary}
      </header>
    </div>
  );
};

export default Popup;
