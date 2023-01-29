import { Platforms, Domains } from "./constants"
import { getHelpScoutTicketId } from "./helpscout";


export const setClientIdInStorage = (clientId) => {
  chrome.storage.local.set({
    'client_id': clientId,
  })
}


export const getPlatformFromUrl = (url) => {
  if (url.split(Domains.HelpScout).length > 1) {
    return Platforms.HelpScout;
  } else if (url.split(Domains.Intercom).length > 1) {
    return Platforms.Intercom;
  } else if (url.split(Domains.ZenDesk).length > 1) {
    return Platforms.ZenDesk;
  } else return Platforms.Unknown;
}


export const getTicketIdFromPlatformAndUrl = (platform, url) => {
  if (platform == Platforms.HelpScout) {
    return getHelpScoutTicketId(url);
  } else return null;
}