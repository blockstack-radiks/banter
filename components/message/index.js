import React from 'react';
import { Flex, Box, Type, } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';

const Message = ({ message, }) => (
    <Flex px={3} py={3} alignItems="center" style={{ borderTop: '1px solid rgb(230, 236, 240)', }}>
      <Box
        size="42px"
        display="block"
        width="100%"
        background={`#f8a5c2 url(${`/api/avatar/${message.attrs.createdBy}`}) center center no-repeat`}
        borderRadius="100%"
        overflow="hidden"
        style={{
          backgroundSize: 'cover',
        }}
      />
      <Box ml={3} width={7 / 8}>
        <Flex pb={1} alignItems="flex-end" justifyContent="space-between">
          <Type mt={0} fontWeight={600}>
            {message.attrs.createdBy}
          </Type>
          <Type fontSize={0}>{message.ago()}</Type>
        </Flex>
        <Type>
          <Linkify
            options={{
              format: (value) => value,
              formatHref: (href, type) => {
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
        </Type>
      </Box>
    </Flex>
  );

export default Message;
