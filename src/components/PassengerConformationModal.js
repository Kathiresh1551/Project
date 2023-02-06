import React, { useState } from "react";
import { Button, Header, Modal, Image } from "semantic-ui-react";

class conformationModal extends React.Component {
    constructor() {
        super();
        this.state = {
            open: true
        }
    }
    
    render = () => {
        const { open } = this.state;
        return (
            <>
                <Modal
                    onClose={() => this.setState((prevState) => ({ open: !prevState}))}
                    // onOpen={() => setOpen(true)}
                    open={open}
                >
              <Modal.Header>Select a Photo</Modal.Header>
              <Modal.Content image>
                <Image size='medium' src='/images/avatar/large/rachel.png' wrapped />
                <Modal.Description>
                  <Header>Default Profile Image</Header>
                  <p>
                    We've found the following gravatar image associated with your e-mail
                    address.
                  </p>
                  <p>Is it okay to use this photo?</p>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button color='black' onClick={() => this.setState((prevState) => ({ open: !prevState}))}>
                  Nope
                </Button>
                <Button
                  content="Yep, that's me"
                  labelPosition='right'
                  icon='checkmark'
                  onClick={() => this.setState((prevState) => ({ open: !prevState}))}
                  positive
                />
              </Modal.Actions>
            </Modal>
            </>
          )
    }
}
export default conformationModal;