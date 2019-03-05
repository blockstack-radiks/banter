import React from 'react';
import { Type, Flex, Box } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';

import Layout from './layout';
import Message from '../../models/Message';
import { appUrl } from '../../common/utils';

const Messages = ({ messages }) => {
  const _messages = messages.map((attrs) => new Message(attrs));
  return _messages.map((message) => (
    <Type.p display="block">
      <Type.a color="purple" href={`${appUrl()}/[::]${message.attrs.createdBy}`}>
        @{message.attrs.createdBy}
      </Type.a>
      {': '}
      <Linkify
        options={{
          format: (value) => {
            return <Type style={{ wordBreak: 'break-all' }}>{value}</Type>;
          },
          formatHref: (href, type) => {
            if (type === 'mention') {
              return `${appUrl()}/[::]${href.slice(1)}`;
            }
            return href;
          },
          defaultProtocol: 'https',
        }}
      >
        {message.attrs.content}
      </Linkify>
      {' '}[{message.attrs.votes.length} vote{message.attrs.votes.length === 1 ? '' : 's'}]
      {' ['}
      <Type.a color="purple" href={`${appUrl()}/messages/${message._id}`}>
        View
      </Type.a>
      ]
    </Type.p>
  ));
};

export default ({ user, messages }) => (
  <Layout hiddenText='The best recent 💩from Banter.'>
    <Flex>
      <Box width={1}>
        <Type.p display="block">
          Hey 
          {' '}
          <Type.a color="purple" href={`${appUrl()}/[::]${user.username}`}>
            @{user.username}
          </Type.a>
          {' '}
          here&apos;s the best new messages from
          {' '}
          <Type.a color="purple" href={appUrl()}>Banter</Type.a>
          !
        </Type.p>
        <Messages messages={messages} />
        <Type.p display="block">
          <Type.a color="purple" href={appUrl()}>
            Come back to Banter
          </Type.a>
          {' or '}
          <Type.a color="purple" href={`${appUrl()}/settings`}>
            change your notification preferences
          </Type.a>
          .
        </Type.p>
      </Box>
    </Flex>
  </Layout>
);
