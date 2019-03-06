import React from 'react';
import { Type, Flex, Box } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';
import Message from '../../models/Message';
import Layout from './layout';
import { appUrl } from '../../common/utils';
import { Block, Message as MessageComponent, Header, Footer } from './shared';

{
  /*<Type.a color="purple" href={`${appUrl()}/messages/${_message._id}`}>*/
}
{
  /*View this message on Banter*/
}
{
  /*</Type.a>*/
}
export default ({ message, mention: user }) => {
  const _message = new Message(message);

  return (
    <Layout hiddenText={_message.attrs.content}>
      <Header user={user} title="You've been mentioned." />
      <Block pb={4}>
        <Type color="purple">Someone is talking about you on Banter!</Type>
      </Block>
      <MessageComponent message={_message} isLast />
      <Footer />
    </Layout>
  );
};
