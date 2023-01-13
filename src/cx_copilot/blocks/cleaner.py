from bs4 import BeautifulSoup
from email_reply_parser import EmailReplyParser

from ..blocks.tickets import HelpscoutConversationRepository, IntercomConversationRepository


def clean_ticket(ticket_body: str, ticket_provider) -> str:
    if isinstance(ticket_provider, (HelpscoutConversationRepository, IntercomConversationRepository)):
        html_parsed = EmailReplyParser.parse_reply(BeautifulSoup(ticket_body, "html.parser").text)
        return html_parsed

    return ticket_body
