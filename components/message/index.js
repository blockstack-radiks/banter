import React from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';
import Link from 'next/link';
import { Hover } from 'react-powerplug';
import { Avatar } from '../avatar';

const Username = ({ hoverable, ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Type
        is="a"
        mt={0}
        fontWeight={600}
        color="purple"
        style={{ textDecoration: hoverable && hovered ? 'underline' : 'none' }}
        {...rest}
        {...bind}
      />
    )}
  </Hover>
);

const TimeAgo = ({ ...rest }) => <Type fontSize={0} {...rest} />;

const ConditionalLink = ({ condition, children, ...rest }) =>
  condition ? children : <Link {...rest}>{children}</Link>;
const Meta = ({ createdBy, username, timeago, id, ...rest }) => (
  <Flex pb={1} alignItems="flex-end" justifyContent="space-between" color="gray" {...rest}>
    <ConditionalLink
      condition={createdBy}
      href={{
        pathname: '/user',
        query: {
          username,
        },
      }}
      as={`/[::]${username}`}
      passHref
    >
      <Username hoverable={!createdBy}>{username}</Username>
    </ConditionalLink>
    <TimeAgo>
      <Link
        href={{
          pathname: '/message',
          query: {
            id,
          },
        }}
        as={`/messages/${id}`}
        passHref
      >
        <Type.a fontSize={0} color="gray" style={{ textDecoration: 'none' }}>
          {timeago}
        </Type.a>
      </Link>
    </TimeAgo>
  </Flex>
);

const MessageContent = ({ content, ...rest }) => (
  <Type {...rest} color="gray">
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
      {content}
    </Linkify>
  </Type>
);

const Details = ({ ...rest }) => <Box ml={3} width={7 / 8} {...rest} />;

const Container = ({ ...rest }) => (
  <Flex px={3} py={3} alignItems="center" borderTop="1px solid rgb(230, 236, 240)" {...rest} />
);

const Message = ({ message, createdBy }) => (
  <Container>
    <Avatar username={message.attrs.createdBy} />
    <Details>
      <Meta createdBy={createdBy} username={message.attrs.createdBy} timeago={message.ago()} id={message._id} />
      <MessageContent content={message.attrs.content} />
    </Details>
  </Container>
);

export default Message;
