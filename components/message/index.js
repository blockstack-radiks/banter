import React, { useState, useContext } from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';
import DownvoteFilledIcon from 'mdi-react/EmoticonPoopIcon';
import { Hover, Active } from 'react-powerplug';
import Link from 'next/link';
import Vote from '../../models/Vote';
import { AppContext } from '../../common/context/app-context';
import { Avatar } from '../avatar';
import { MessageContent as StyledMessageContent } from './styled';
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
        format: (value) => value,
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

const IconButton = ({ active, ...rest }) => (
  <Active>
    {({ active: pressed, bind: pressedBind }) => (
      <Hover>
        {({ hovered, bind }) => (
          <Box
            opacity={active ? '1' : hovered ? 0.75 : 0.5}
            cursor={hovered ? 'pointer' : 'unset'}
            transform={pressed ? 'scale(1.3) translateY(2px)' : hovered || active ? 'scale(1.3)' : 'none'}
            transition="0.1s all ease-in-out"
            {...bind}
            {...pressedBind}
            {...rest}
          />
        )}
      </Hover>
    )}
  </Active>
);

const FooterUI = ({ messageId, hasVoted, votes, email, timeago }) => {
  const [voted, setVoted] = useState(hasVoted);
  const [count, setCount] = useState(votes || 0);
  const { user } = useContext(AppContext);

  if (votes > count) {
    // a new vote was found in real-time
    setCount(votes);
  }

  const toggleVote = async () => {
    if (!voted && user) {
      setVoted(true);
      setCount((s) => s + 1);
      const vote = new Vote({
        messageId,
        username: user._id,
      });
      await vote.save();
    }
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      position="relative"
      style={{ userSelect: 'none' }}
      size={40}
      borderRadius="100%"
      bg={`rgba(0,0,0,0.0${voted ? 0 : 5})`}
      flexShrink={0}
      color={voted ? '#A84E6D' : 'purple'}
      ml={3}
    >
      <IconButton active={voted} onClick={toggleVote}>
        <DownvoteFilledIcon size={20} />
      </IconButton>
      <Box position="absolute" right="2px" top="-5px" pl={1}>
        <Type fontSize={0} fontWeight="bold">
          {count}
        </Type>
      </Box>
    </Flex>
  );
};

const Message = ({ message, votesForThisMessage, single, createdBy, email }) => (
  <Container single={single}>
    <Avatar username={message.attrs.createdBy} />
    <Details>
      <Meta createdBy={createdBy} username={message.attrs.createdBy} id={message._id} email={email} />
      <MessageContent content={message.attrs.content} email={email} />
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
      <FooterUI
        messageId={message._id}
        hasVoted={message.attrs.hasVoted}
        votes={votesForThisMessage.length || message.attrs.votes}
      />
    )}
  </Container>
);

export default Message;
