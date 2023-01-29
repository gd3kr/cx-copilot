import React, { useEffect, useState } from 'react';
import '../pages/Popup/Popup.css';
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { setClientIdInStorage } from '../utils/util';
import { useStyletron } from 'baseui';


const Onboarding = (props) => {

  const { setClientId } = props;

  const [, theme] = useStyletron();

  const [id, setId] = useState(null);

  return (
    <Block padding={theme.sizing.scale200} display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
      <Block display={"flex"} flexDirection={"column"}>
        <FormControl label="Client ID" caption="Please enter client ID provided during onboarding">
          <Input
            id="input-id"
            value={id}
            onChange={event => setId(event.currentTarget.value)}
          />
        </FormControl>
      </Block>
      <Button size={"mini"} onClick={() => {
        setClientId(id)
        setClientIdInStorage(id)
        }}>Submit</Button>
    </Block>
  )
}

export default Onboarding