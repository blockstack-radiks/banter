import React from 'react';
import { Type, Flex, Box } from 'blockstack-ui';

import MessageComponent from "../message";
import Message from '../../models/Message';
import Layout from './layout';
import { Button } from '../button';

export default ({ message, mention }) => {
  const _message = new Message(message);

  return (
    <Layout>
      <Flex>
        <Box width={1}>
          <Box textAlign="center">
            <Type.p color="purple" display="block">
              Hey @{mention.username}, you&apos;ve been mentioned!
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
              <MessageComponent message={_message} mt={4} email />
            </Box>
          </Flex>
          <Box textAlign="center">
            <Button
              my={4}
              is="a"
              href={`${process.env.RADIKS_API_SERVER}/messages/${message._id}`}
              display="inline-block"
              style={{ cursor: 'pointer' }}
            >
              View this message in Banter
            </Button>
          </Box>
        </Box>
      </Flex>
    </Layout>
  );
};
