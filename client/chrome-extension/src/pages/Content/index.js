const HELPSCOUT_DOMAIN = "helpscout.net"
const INTERCOM_DOMAIN = "intercom.com"
const ZENDESK_DOMAIN = "zendesk.com"

function scrapeTicketData(currentURL) {
    console.log("Hello from CX Copilot", currentURL)

    // https://secure.helpscout.net/conversation/2199011258/891142?folderId=39835
    if (currentURL.split("//secure.helpscout.net/conversation").length > 1) {
        // 2110021258/88342?folderId=3894767
        let ids = currentURL.split('/conversation/')[1];

        // 2199011258
        let conversationID = ids.split('/')[0]

        // // 891142
        // let threadID = ids.split('/')[1].split('?folderId=')[0]

        // // 39835
        // let folderID = ids.split('/')[1].split('?folderId=')[1]

        console.log("conversationID ", conversationID)
        // console.log("threadID ", threadID)
        // console.log("folderID ", folderID)

        insertReply(currentURL, conversationID);
    }
}

// Listen for Tab Updated
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === 'TabUpdated') {
            let currentURL = request.url;
            scrapeTicketData(currentURL);
        }
    });

scrapeTicketData(window.location.toString());

async function insertReply(currentURL, conversationID) {
    const url = 'YOUR SERVER URL';

    const cxPlatform = getCXPlatformName(currentURL);
    console.log("CX platform", cxPlatform)
    const httpResponse = await fetch(url, {
        method: 'POST', 
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
            conversation_id: new Number(conversationID),
            use_cached: true,
            cx_platform: cxPlatform
        })
    });
    const responseBody = await httpResponse.json()

    // Clicks the "Reply" button so that reply textbox becomes visible
    document.getElementById('navReply').click();

    // Timeout 0.5 seconds because the reply textbox ("redactor_redactor redactor_editor")
    // DOM element isn't visibile right away. We have to wait for the Click action to complete
    // and the DOM element to become visible
    setTimeout(() => {
        let response = responseBody.completion
        document.getElementsByClassName("redactor_redactor redactor_editor")[0].innerText = response.trim()
    }, 500)
}

function getCXPlatformName(url){
    if (url.split(HELPSCOUT_DOMAIN).length > 1) {
        return 'helpscout'
    }

    if (url.split(INTERCOM_DOMAIN).length > 1) {
        return 'intercom'
    }

    if (url.split(ZENDESK_DOMAIN).length > 1) {
        return 'zendesk'
    }
    
    return 'not_supported'
}

// [...document.getElementsByClassName("intercom-interblocks-align-left embercom-prosemirror-composer-block-selected")][0].innerText = "yo"