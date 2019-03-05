import React from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';
import { Hover } from 'react-powerplug';
import Link from 'next/link';
import { useConnect } from 'redux-bundler-hook';
import { Avatar } from '../avatar';
import { MessageContent as StyledMessageContent } from './styled';
import { Voting } from './voting';
import {Image} from '../image';
import { appUrl } from '../../common/utils';

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

const TimeAgo = ({ ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Type
        title="Permalink"
        opacity={hovered ? 1 : 0.6}
        cursor={hovered ? 'pointer' : 'unset'}
        color="purple"
        fontSize={0}
        pt={3}
        {...bind}
        {...rest}
      />
    )}
  </Hover>
);

const ConditionalLink = ({ condition, children, ...rest }) =>
  condition ? children : <Link {...rest}>{children}</Link>;

const Meta = ({ createdBy, username, timeago, id, email, ...rest }) => (
  <Flex pb={1} alignItems="flex-end" justifyContent="space-between" color="gray" {...rest}>
    {email ? (
      <>
        <Type
          is="a"
          mt={0}
          href={`${appUrl()}/[::]${username}`}
          fontWeight={600}
          color="purple"
          style={{ textDecoration: 'none' }}
        >
          {username}
        </Type>
      </>
    ) : (
      <>
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
      </>
    )}
  </Flex>
);

const MessageContent = ({ content, email, ...rest }) => (
  <StyledMessageContent {...rest} color="gray">
    <Linkify
      options={{
        format: (value, type) => {
          return <Type style={{ wordBreak: 'break-all' }}>{value}</Type>;
        },
        formatHref: (href, type) => {
          if (type === 'mention') {
            if (email) {
              return `${appUrl()}/[::]${href.slice(1)}`;
            }
            return `/[::]${href.slice(1)}`;
          }
          return href;
        },
        defaultProtocol: 'https',
      }}
    >
      {content}
    </Linkify>
  </StyledMessageContent>
);

const Details = ({ ...rest }) => <Box ml={3} width={7 / 8} {...rest} />;

const Container = ({ single, ...rest }) => (
  <Flex px={3} py={3} alignItems="flex-start" borderTop={single ? 'none' : '1px solid rgb(230, 236, 240)'} {...rest} />
);

const Message = ({ message, single, createdBy, email }) => {
  const { cookieUsername: username } = useConnect('selectCookieUsername');

  return (
    <Container single={single}>
      <Avatar username={message.attrs.createdBy} />
      <Details>
        <Meta createdBy={createdBy} username={message.attrs.createdBy} id={message._id} email={email} />
        <MessageContent content={message.attrs.content} email={email} />
        {message.attrs.imageUrls && message.attrs.imageUrls.length ? (
          <Box py={2}>
            {message.attrs.imageUrls
              .filter((img) => img)
              .map((img) => {
                return <Image src={img} />;
              })}
          </Box>
        ) : null}
        <Box>
          <TimeAgo>
            <Link
              href={{
                pathname: '/message',
                query: {
                  id: message._id,
                },
              }}
              as={`/messages/${message._id}`}
              passHref
            >
              <Type.a fontSize={0} color="gray" style={{ textDecoration: 'none' }}>
                {message.ago()}
              </Type.a>
            </Link>
          </TimeAgo>
        </Box>
      </Details>
      {!email && (
        <Voting
          messageId={message._id}
          hasVoted={message.attrs.votes.find((v) => v && v.username && v.username === username)}
          votes={message.attrs.votes.length}
        />
      )}
    </Container>
  );
};

export default Message;
