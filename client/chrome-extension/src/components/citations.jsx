import React, {useEffect, useState} from 'react'
import { Accordion, Panel } from "baseui/accordion"
import { ParagraphMedium } from "baseui/typography"
import { useStyletron} from 'baseui'


const Citations = (props) => {
    const {
      citationsStr
    } = props

    const [, theme] = useStyletron()

    const citations = JSON.parse(citationsStr)

    return (
        <>
            <Accordion>
            {citations.map((citation, idx) => (
                <Panel title={idx}>
                    <ParagraphMedium color={theme.colors.primary}>{citation.score}</ParagraphMedium>
                    <ParagraphMedium color={theme.colors.primary}>{citation.question}</ParagraphMedium>
                    <ParagraphMedium color={theme.colors.primary}>{citation.answer}</ParagraphMedium>
                </Panel>
            ))}
            </Accordion>
        </>
      )
}

export default Citations