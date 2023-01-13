function getIDsandInsertReply(currentURL) {
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

        insertReply(conversationID);
    }
}

// Listen for Tab Updated
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === 'TabUpdated') {
            let currentURL = request.url;
            getIDsandInsertReply(currentURL);
        }
    });

getIDsandInsertReply(window.location.toString());

async function insertReply(conversationID) {
    const url = 'YOUR SERVER URL';
    const httpResponse = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
            conversation_id: new Number(conversationID),
            use_cached: true
        }) // body data type must match "Content-Type" header
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
