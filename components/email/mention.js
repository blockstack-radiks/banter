import React from 'react';
import { Type } from 'blockstack-ui';
import Message from '../../models/Message';
import Layout from './layout';
import { Block, Message as MessageComponent, Header, Footer } from './shared';
import Poop from '../poop';

export default ({ message, mention: user }) => {
  const _message = new Message(message);

  return (
    <Layout hiddenText={_message.attrs.content}>
      <Header user={user} title="You've been mentioned." />
      <Block pb={4}>
        <Type color="purple">Someone is talking <Poop /> about you on Banter!</Type>
      </Block>
      <MessageComponent message={_message} isLast />
      <Footer />
    </Layout>
  );
};
