const HELPSCOUT_DOMAIN = "helpscout.net"
const INTERCOM_DOMAIN = "intercom.com"
const ZENDESK_DOMAIN = "zendesk.com"

const INTERCOM_REPLY_TEXTBOX_CLASSNAME = "intercom-interblocks-align-left embercom-prosemirror-composer-block-selected"
const HELPSCOUT_REPLY_BUTTON_CLASSNAME = "navReply"
const HELPSCOUT_REPLY_TEXTBOX_CLASSNAME = "redactor_redactor redactor_editor"

async function scrapeTicketData(currentURL) {
    console.log("Hello from CX Copilot", currentURL)

    const platform = getCXPlatformName(currentURL);

    if (platform == 'not_supported') {
        return;
    }

    let ticketID = '';

    if (platform == 'helpscout') {
        ticketID = scrapeHelpscout(currentURL);
        const response = await insertReply(currentURL, ticketID, platform);
        return response
    }

    if (platform == 'intercom') {
        ticketID = scrapeIntercom(currentURL);
    }
}

// // Listen for Tab Updated
// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         if (request.message === 'TabUpdated') {
//             let currentURL = request.url;
//             scrapeTicketData(currentURL);
//         }
//     });

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request)
        if (request.type == 'inject') {
            scrapeTicketData(document.location.href).then((res) => sendResponse(res))
        }

        return true;
    }
);

async function insertReply(currentURL, conversationID, platform) {
    const url = 'YOUR_BE_URL';
    const httpResponse = await fetch(url, {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
            conversation_id: new Number(conversationID),
            use_cached: true,
            cx_platform: platform
        })
    });
    const responseBody = await httpResponse.json()

    // Clicks the "Reply" button so that reply textbox becomes visible
    document.getElementById(HELPSCOUT_REPLY_BUTTON_CLASSNAME).click();

    // Timeout 0.5 seconds because the reply textbox ("redactor_redactor redactor_editor")
    // DOM element isn't visibile right away. We have to wait for the Click action to complete
    // and the DOM element to become visible
    setTimeout(() => {
        let response = responseBody.completion
        injectHelpscoutReply(response.trim())
    }, 500)

    return responseBody;
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

function scrapeIntercom(url) {
    // URL example: https://app.intercom.com/a/inbox/g4tvre/inbox/admin/67375/conversation/3624?view=List

    // check if intercom URL is a conversation page
    if (url.split("//app.intercom.com/a/inbox/").length < 2) {
        return '';
    }

    // ids = 3624?view=List
    let ids = url.split('/conversation/')[1];

    // conversationID = 2199011258
    let conversationID = ids.split('?')[0];

    // threadID = 891142
    // let threadID = ids.split('/')[1].split('?folderId=')[0]

    // folderID = 39835
    // let folderID = ids.split('/')[1].split('?folderId=')[1]

    console.log("Intercom conversation ID: ", conversationID)

    return conversationID
}


function scrapeHelpscout(url) {
    // URL example: https://secure.helpscout.net/conversation/2199011258/891142?folderId=39835

    // check if helpscout URL is a conversation page
    if (url.split("//secure.helpscout.net/conversation").length < 2) {
        return '';
    }

    // ids = 2110021258/88342?folderId=3894767
    let ids = url.split('/conversation/')[1];

    // conversationID = 2199011258
    let conversationID = ids.split('/')[0];

    // threadID = 891142
    // let threadID = ids.split('/')[1].split('?folderId=')[0]

    // folderID = 39835
    // let folderID = ids.split('/')[1].split('?folderId=')[1]

    console.log("Helpscout ConversationID: ", conversationID)

    return conversationID
}

function injectHelpscoutReply(reply) {
    document.getElementsByClassName(HELPSCOUT_REPLY_TEXTBOX_CLASSNAME)[0].innerText = reply
}
// [...document.getElementsByClassName("intercom-interblocks-align-left embercom-prosemirror-composer-block-selected")][0].innerText = "yo"
