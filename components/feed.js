import React from 'react';
import { Flex, Box } from 'blockstack-ui';
import PropTypes from 'prop-types';
import { User, getConfig } from 'radiks';
import VisibilitySensor from 'react-visibility-sensor';

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
    isLoadingMore: false,
    hasMoreMessages: true,
  }

  componentWillMount() {
    const rawMessages = this.props.messages;
    const messages = rawMessages.map(messageData => new Message(messageData.attrs));
    this.setState({ messages });
  }

  async componentDidMount() {
    const { userSession } = getConfig();
    if (userSession.isUserSignedIn()) {
      const currentUser = await User.currentUser();
      console.log('existing user', currentUser);
      this.setState({ currentUser });
    } else if (userSession.isSignInPending()) {
      await userSession.handlePendingSignIn();
      const currentUser = await User.createWithCurrentUser();
      console.log('new user', currentUser);
      this.setState({ currentUser });
    }
    Message.addStreamListener(this.newMessageListener.bind(this));
  }

  login = () => {
    const scopes = [
      'store_write',
      'publish_data',
    ];
    const redirect = window.location.origin;
    const manifest = `${window.location.origin}/manifest.json`;
    const { userSession } = getConfig();
    userSession.redirectToSignIn(redirect, manifest, scopes);
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

  loadMoreMessages() {
    let { messages } = this.state;
    this.setState({
      isLoadingMore: true,
    }, async () => {
      const lastMessage = messages[messages.length - 1];
      const newMessages = await Message.fetchList({
        createdAt: {
          $lt: lastMessage.attrs.createdAt,
        },
        limit: 10,
        sort: '-createdAt',
      }, { decrypt: false });
      messages = messages.concat(newMessages);
      const hasMoreMessages = newMessages.length !== 0;
      this.setState({
        isLoadingMore: false,
        hasMoreMessages,
        messages,
      });
    });
  }

  render() {
    const { currentUser, isLoadingMore, hasMoreMessages } = this.state;
    return (
      <Flex>
        <Box width={[1, 1 / 2]} mx="auto" background="white" my={2}>
          <Box width={1}>
            <Box px={4} py={4}>
              {currentUser ? (
                <>
                  <Input
                    width={1}
                    placeholder="What do you have to say?"
                    value={this.state.newMessage}
                    onChange={evt => this.setState({ newMessage: evt.target.value })}
                  />

                  <Button onClick={() => this.submit()} mt={3}>
                    Submit
                  </Button>
                </>
              ) : (
                <>
                  <Text.p textAlign="center">
                    Log in with Blockstack to get started.
                  </Text.p>

                  <Button mt={3} onClick={this.login} mx="auto" style={{ display: 'block' }}>
                    Log In
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {this.messages()}

          {isLoadingMore ? (
            <Text.p textAlign="center">
              Fetching older messages...
            </Text.p>
          ) : (
            <>
              {hasMoreMessages ? (
                <VisibilitySensor onChange={() => this.loadMoreMessages()}>
                  <Text.p textAlign="center">
                    Only showing the most recent
                    {' '}
                    {this.state.messages.length}
                    {' '}
                    messages.
                  </Text.p>
                </VisibilitySensor>
              ) : (
                <Text.p textAlign="center">
                  No more messages to show!
                </Text.p>
              )}
            </>
          )}
        </Box>
      </Flex>
    );
  }
}
