import { Domains } from "./constants";

export const getHelpScoutTicketId = (url) => {
    if (url.split(`//secure.${Domains.HelpScout}/conversation`).length < 2) {
        return '';
    }
    const ids = url.split('/conversation/')?.[1];
    const conversationID = ids?.split('/')?.[0];
    return conversationID;
}