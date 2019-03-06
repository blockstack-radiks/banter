import React from 'react';
import { Box } from 'blockstack-ui';
import Message from '../models/Message';
import { Login } from '../components/login';
import MessageComponent from '../components/message';

class MessagePage extends React.Component {
  static async getInitialProps({ query }) {
    const { id } = query;
    const message = await Message.findById(id, { decrypt: false });
    return { id, messageAttrs: message.attrs };
  }

  render() {
    const { messageAttrs } = this.props;
    const message = new Message(messageAttrs);

    return (
      <Box
        border="1px solid rgb(230, 236, 240)"
        my={[4, 6]}
        mx={[2, 'auto']}
        maxWidth={600}
        bg="white"
        borderRadius={2}
        boxShadow="card"
      >
        <Login px={4} checkForState action="join the conversation" />
        <MessageComponent message={message} />
      </Box>
    );
  }
}

export default MessagePage;
