import React from 'react';
import { Type, Flex, Box } from 'blockstack-ui';

import Layout from './layout';
import MessageComponent from "../message";
import Poop from '../poop';
import Message from '../../models/Message';
import { Button } from '../button';
import { appUrl } from '../../common/utils';

const Messages = ({ messages }) => {
  const _messages = messages.map((attrs) => new Message(attrs));
  return _messages.map((message) => (
    <MessageComponent key={message._id} message={message} email />
  ));
};

export default ({ user, messages }) => (
    <Layout>
      <Flex>
        <Box width={1}>
          <Box textAlign="center">
            <Type.p color="purple" display="block">
              Hey @{user.username}, here&apos;s the best recent <Poop />from Banter!
            </Type.p>
          </Box>
          <Flex>
            <Box
              width={1}
              border="1px solid rgb(230, 236, 240)"
              my={[4, 6]}
              mx="auto"
              maxWidth={600}
              bg="white"
              borderRadius={2}
              boxShadow="card"
            >
              <Messages messages={messages} />
            </Box>
          </Flex>
          <Box textAlign="center">
            <Button
              my={4}
              is="a"
              href={appUrl()}
              display="inline-block"
              style={{ cursor: 'pointer' }}
            >
              Go to Banter
                </Button>
          </Box>
        </Box>
      </Flex>
    </Layout>
  );
