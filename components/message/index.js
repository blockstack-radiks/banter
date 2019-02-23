import React, { useState, useEffect, useContext } from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';
import DownvoteEmptyIcon from 'mdi-react/EmoticonPoopOutlineIcon';
import DownvoteFilledIcon from 'mdi-react/EmoticonPoopIcon';
import { Hover, Active } from 'react-powerplug';
import Link from 'next/link';

import Vote from '../../models/Vote';
import { AppContext } from '../../common/context/app-context';

const Avatar = ({ username, ...rest }) => (
  <Box
    size="42px"
    display="block"
    width="100%"
    background={`#f8a5c2 url(${`/api/avatar/${username}`}) center center no-repeat`}
    borderRadius="100%"
    overflow="hidden"
    style={{
      backgroundSize: 'cover',
    }}
    {...rest}
  />
);

const Username = ({ ...rest }) => <Type mt={0} fontWeight={600} {...rest} />;

const TimeAgo = ({ ...rest }) => <Type fontSize={0} {...rest} />;

const Meta = ({ username, timeago, id, ...rest }) => (
  <Flex pb={1} alignItems="flex-end" justifyContent="space-between" color="gray" {...rest}>
    <Username>{username}</Username>
    <TimeAgo>
      <Link
        href={{
          pathname: '/message',
          query: {
            id,
          }
        }}
        as={`/messages/${id}`}
        passHref
      >
        <Type.a fontSize={0} color='gray' style={{ textDecoration: 'none' }}>
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

const FooterUI = ({ messageId }) => {
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(0);
  const { user } = useContext(AppContext);

  const toggleVote = async () => {
    if (!voted) {
      setVoted(true);
      setCount((s) => s + 1);
      const vote = new Vote({
        messageId,
        username: user._id,
      });
      await vote.save();
    }
  };

  // const newVoteListener = (vote) => {
  //   console.log(vote);
  //   if ((vote.attrs.messageId === messageId) && (!user || vote.attrs.username !== user._id)) {
  //     setCount((s) => s + 1);
  //   }
  // };

  // const subscribe = () => Vote.addStreamListener(newVoteListener);
  // const unsubscribe = () => Vote.removeStreamListener(newVoteListener);

  const fetchVotes = async () => {
    const votes = await Vote.fetchList({
      messageId
    });
    setCount(votes.length);
    if (user) {
      let hasUser = false;
      votes.forEach((vote) => {
        console.log(vote.attrs.username, user._id);
        if (vote.attrs.username === user._id) {
          hasUser = true;
        }
      });
      setVoted(hasUser);
    }
  };
  useEffect(() => {
    fetchVotes();
  }, [user && user._id]);

  // useEffect(() => {
  //   console.log('subscribing');
  //   subscribe();
  //   return unsubscribe;
  // }, []);

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

const Message = ({ message }) => (
  <Container>
    <Avatar username={message.attrs.createdBy} />
    <Details>
      <Meta username={message.attrs.createdBy} timeago={message.ago()} id={message._id} />
      <MessageContent content={message.attrs.content} />
      <FooterUI messageId={message._id} />
    </Details>
  </Container>
);

export default Message;
