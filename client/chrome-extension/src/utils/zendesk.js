import { Domains } from "./constants";

export const getZenDeskTicketId = (url) => {
    if (url.split(`.${Domains.ZenDesk}/agent/tickets/`).length < 2) {
        return '';
    }
    const ids = url.split('/tickets/')?.[1];
    const ticketId = ids?.split('/')?.[0];
    return ticketId;
}