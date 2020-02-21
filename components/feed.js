import React, { useState, useEffect } from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import { useConnect } from 'redux-bundler-hook';
import DownvoteFilledIcon from 'mdi-react/EmoticonPoopIcon';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Vote from '../models/Vote';
import Message from '../models/Message';
import MessageComponent from './message';
import { Button } from './button';
import { Login } from './login';

const Compose = dynamic(() => import('./compose'), {
  loading: () => (
    <Box p="16px">
      <Box border="1px solid hsl(204,25%,80%)" height="44px" p="12px">
        <Type color="#aaaaaa">Loading...</Type>
      </Box>
    </Box>
  ),
  ssr: false,
});

const TopArea = () => {
  const { cookieUsername } = useConnect('selectCookieUsername');
  return !cookieUsername ? <Login px={4} /> : <Compose />;
};

const Messages = ({ createdBy }) => {
  const { messages, isVisible, newMessageCount } = useConnect(
    'selectMessages',
    'selectIsVisible',
    'selectNewMessageCount'
  );
  return createdBy && !messages.length ? (
    <Flex alignItems="center" justifyContent="center" flexDirection="column" p={4}>
      <Box pb={3} color="purple" opacity={0.1}>
        <DownvoteFilledIcon size={120} />
      </Box>
      <Type color="purple" fontWeight="bold">
        No messages here!
      </Type>
    </Flex>
  ) : (
    <>
      {!isVisible && newMessageCount > 0 ? (
        <Head>
          <title>Banter ({newMessageCount})</title>
        </Head>
      ) : null}
      {messages.map((message) => (
        <MessageComponent key={message._id} createdBy={!!createdBy} message={new Message(message)} />
      ))}
    </>
  );
};

const Feed = ({ hideCompose, createdBy, ...rest }) => {
  const { messages, doFetchMoreMessages, doAddMessage, doUpdateMessageVoteCount } = useConnect(
    'selectMessages',
    'doFetchMoreMessages',
    'doAddMessage',
    'doUpdateMessageVoteCount'
  );
  const [loading, setLoading] = useState(false);
  const [viewingAll, setViewingAll] = useState(false);

  const subscribe = () => {
    Message.addStreamListener(doAddMessage);
    Vote.addStreamListener(doUpdateMessageVoteCount);
  };
  const unsubscribe = () => {
    Message.removeStreamListener(doAddMessage);
    Vote.removeStreamListener(doUpdateMessageVoteCount);
  };

  useEffect(() => {
    subscribe();
    return unsubscribe;
  }, []);

  const loadMoreMessages = () => {
    NProgress.start();
    setLoading(true);
    const fetchMoreMessages = doFetchMoreMessages(createdBy);
    fetchMoreMessages.then((payload) => {
      setLoading(false);
      NProgress.done();
      if (payload && !payload.hasMoreMessages) {
        setViewingAll(true);
      }
    });
  };

  const onLoadMoreClick = () => {
    if (loading) {
      return false;
    }
    return loadMoreMessages();
  };

  return (
    <Box
      border="1px solid rgb(230, 236, 240)"
      mx={[2, 'auto']}
      maxWidth={600}
      bg="white"
      borderRadius={2}
      boxShadow="card"
      {...rest}
    >
      {hideCompose ? null : <TopArea />}
      <Messages createdBy={createdBy} />
      {messages.length >= 10 ? (
        <Flex borderTop="1px solid rgb(230, 236, 240)" alignItems="center" justifyContent="center" p={4}>
          {viewingAll ? (
            <Type color="purple" fontWeight="bold">
              You&apos;ve reached the end of the line!
            </Type>
          ) : (
            <Button onClick={onLoadMoreClick}>{loading ? 'Loading...' : 'More Posts'}</Button>
          )}
        </Flex>
      ) : null}
    </Box>
  );
};

export default Feed;
