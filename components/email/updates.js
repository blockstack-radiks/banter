import React from 'react';
import Layout from './layout';
import Message from '../../models/Message';
import { Block, Message as MessageComponent, Header, Footer } from './shared';
import Poop from '../poop';

const Messages = ({ messages }) => {
  const _messages = messages.map((attrs) => new Message(attrs));
  return (
    <Block py={4}>
      {_messages.map((message, i) => (
        <MessageComponent isLast={i === _messages.length - 1} message={message} key={message._id} />
      ))}
    </Block>
  );
};

export default ({ user, messages }) => (
  <Layout hiddenText="Here's a digest of recent top posts on Banter.">
    <Header
      user={user}
      title={
        <>
          Some recent <Poop />.
        </>
      }
    />
    <Messages messages={messages} />
    <Footer />
  </Layout>
);
