import React from 'react';
import { Flex, Box } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';

import Text from '../../styled/typography';
import Avatar from '../avatar';

const Message = ({ message }) => (
  <Flex px={4} py={3} style={{ borderTop: '1px solid rgb(230, 236, 240)' }}>
    <Box width={1 / 8} pr={3}>
      <Avatar src={`/api/avatar/${message.attrs.createdBy}`} size="100%" />
    </Box>
    <Box width={7 / 8}>
      <Text.p mt={0} mb={1}>
        {message.attrs.createdBy}
        {' '}
        says:
      </Text.p>
      <Text.em>
        <Linkify
          options={{
            format: (value, type) => {
              console.log(value, type);
              return value;
            },
            formatHref: (href, type) => {
              console.log('href', href, type);
              if (type === 'mention') {
                return `/users${href}`;
              }
              return href;
            },
            defaultProtocol: 'https',
          }}
        >
          {message.attrs.content}
        </Linkify>
      </Text.em>
      <Text.small display="block" mt={1}>{message.ago()}</Text.small>
    </Box>
  </Flex>
);

export default Message;
