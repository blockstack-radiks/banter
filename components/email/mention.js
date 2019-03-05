import React from 'react';
import { Type, Flex, Box } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';

// import MessageComponent from "../message";
import Message from '../../models/Message';
import Layout from './layout';
// import { Button } from '../button';
import { appUrl } from '../../common/utils';

export default ({ message, mention }) => {
  const _message = new Message(message);

  return (
    <Layout hiddenText={_message.attrs.content}>
      <Flex>
        <Box width={1}>
          <Type.p display="block">
            Hey 
            {' '}
            <Type.a color="purple" href={`${appUrl()}/[::]${mention.username}`}>
              @{mention.username}
            </Type.a>
            , you&apos;ve been mentioned on
            {' '}
            <Type.a color="purple" href={appUrl()}>Banter</Type.a>
            !
          </Type.p>

          <Type.p display="block">
            <Type.a color="purple" href={appUrl(`[::]${_message.attrs.createdBy}`)}>
              {_message.attrs.createdBy}
            </Type.a>
            {' '}said:
          </Type.p>

          <Type.p display="block">
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
              {_message.attrs.content}
            </Linkify>
          </Type.p>

          <Type.p display="block">
            <Type.a color="purple" href={`${appUrl()}/messages/${_message._id}`}>
              View this message on Banter
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
};
