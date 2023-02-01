import { Domains } from "./constants";

export const getIntercomTicketId = (url) => {
    if (url.split(`//app.${Domains.Intercom}/a/inbox/`).length < 2) {
        return '';
    }
    const ids = url.split('/conversation/')?.[1];
    const conversationID = ids?.split('/')?.[0];
    return conversationID;
}