import React, { useState, useContext } from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';
import DownvoteEmptyIcon from 'mdi-react/EmoticonPoopOutlineIcon';
import DownvoteFilledIcon from 'mdi-react/EmoticonPoopIcon';
import { Hover, Active } from 'react-powerplug';
import Link from 'next/link';
import Vote from '../../models/Vote';
import { AppContext } from '../../common/context/app-context';
import { Avatar } from '../avatar';
import { MessageContent as StyledMessageContent } from './styled';

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
const Meta = ({ createdBy, username, timeago, id, email, ...rest }) => (
  <Flex pb={1} alignItems="flex-end" justifyContent="space-between" color="gray" {...rest}>
    {email ? (
      <>
        <Type
          is="a"
          mt={0}
          href={`${process.env.RADIKS_API_SERVER}/[::]${username}`}
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
          condition={ createdBy }
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
              return `${process.env.RADIKS_API_SERVER}/[::]${href.slice(1)}`;
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

const Container = ({ ...rest }) => (
  <Flex px={3} py={3} alignItems="flex-start" borderTop="1px solid rgb(230, 236, 240)" {...rest} />
);

const IconButton = ({ active, ...rest }) => (
  <Active>
    {({ active: pressed, bind: pressedBind }) => (
      <Hover>
        {({ hovered, bind }) => (
          <Box
            opacity={active ? '1' : hovered ? 0.75 : 0.5}
            cursor={hovered ? 'pointer' : 'unset'}
            transform={pressed ? 'translateY(2px)' : 'none'}
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

const FooterUI = ({ messageId, hasVoted, votes }) => {
  const [voted, setVoted] = useState(hasVoted);
  const [count, setCount] = useState(votes);
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

  const Icon = voted ? DownvoteFilledIcon : DownvoteEmptyIcon;
  return (
    <Flex style={{ userSelect: 'none' }} pt={2} color="purple">
      <IconButton active={voted} onClick={toggleVote}>
        <Icon size={20} />
      </IconButton>
      <Box pl={1}>
        <Type fontSize={0} fontWeight="bold">
          {count}
        </Type>
      </Box>
    </Flex>
  );
};

const Message = ({ message, createdBy, email }) => (
  <Container>
    <Avatar username={message.attrs.createdBy} />
    <Details>
      <Meta createdBy={createdBy} username={message.attrs.createdBy} timeago={message.ago()} id={message._id} email={email} />
      <MessageContent content={message.attrs.content} email={email} />
      {!email && (
        <FooterUI messageId={message._id} hasVoted={message.attrs.hasVoted} votes={message.attrs.votes} />
      )}
    </Details>
  </Container>
);

export default Message;
