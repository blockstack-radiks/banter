import React from 'react';
import { Flex, Box } from 'blockstack-ui';
import PropTypes from 'prop-types';
import { User } from 'radiks';

import Text from '../styled/typography';
import Input from '../styled/input';
import Message from '../models/Message';
import MessageComponent from './message';
import Button from '../styled/button';

export default class Feed extends React.Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
  }

  state = {
    newMessage: '',
    createdMessageIDs: {},
    messages: [],
    currentUser: null,
  }

  componentWillMount() {
    const rawMessages = this.props.messages;
    const messages = rawMessages.map(messageData => new Message(messageData.attrs));
    this.setState({ messages });
  }

  componentDidMount() {
    this.setState({
      currentUser: User.currentUser(),
    });
    Message.addStreamListener(this.newMessageListener.bind(this));
  }

  newMessageListener(message) {
    const { messages } = this.state;
    if (!this.state.createdMessageIDs[message._id]) {
      // const message = new Message(message);
      messages.unshift(message);
      this.setState({ messages });
    }
  }

  async submit() {
    const { newMessage } = this.state;
    const message = new Message({
      content: newMessage,
      createdBy: this.state.currentUser._id,
    });
    const { messages, createdMessageIDs } = this.state;
    createdMessageIDs[message._id] = true;
    await message.save();
    messages.unshift(message);
    this.setState({ messages, createdMessageIDs, newMessage: '' });
  }

  messages() {
    return this.state.messages.map(message => (
      <MessageComponent key={message._id} message={message} />
    ));
  }

  render() {
    return (
      <Flex>
        <Box width={[1, 1 / 2]} mx="auto" background="white" my={2}>
          <Box width={1}>
            <Box px={4} py={4}>
              <Input
                width={1}
                placeholder="What do you have to say?"
                value={this.state.newMessage}
                onChange={evt => this.setState({ newMessage: evt.target.value })}
              />

              <Button onClick={() => this.submit()} mt={3}>
                Submit
              </Button>
            </Box>
          </Box>

          {this.messages()}

          <Text.p textAlign="center">
            Only showing the most recent
            {' '}
            {this.state.messages.length}
            {' '}
            messages.
          </Text.p>
        </Box>
      </Flex>
    );
  }
}
