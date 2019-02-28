import React, { useEffect, useState, useContext } from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import NProgress from 'nprogress';
import { getConfig } from 'radiks';

import dynamic from 'next/dynamic';
import { AppContext } from '../common/context/app-context';
import Message from '../models/Message';
import MessageComponent from './message';
import { Button } from './button';
import { Login } from './login';
import { fetchMessages } from '../common/lib/api';
import Vote from '../models/Vote';

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

const login = () => {
  const scopes = ['store_write', 'publish_data'];
  const redirect = window.location.origin;
  const manifest = `${window.location.origin}/manifest.json`;
  const { userSession } = getConfig();
  userSession.redirectToSignIn(redirect, manifest, scopes);
};

const fetchMoreMessages = async (messages, createdBy) => {
  const lastMessage = messages && messages.length && messages[messages.length - 1];
  const newMessagesAttrs = await fetchMessages({
    lt: lastMessage && lastMessage.attrs.createdAt,
    createdBy,
  });
  const newMessages = newMessagesAttrs.map((attrs) => new Message(attrs));

  const newmessages = messages && messages.concat(newMessages);
  const hasMoreMessages = newMessages.length === 10;
  return {
    hasMoreMessages,
    _messages: newmessages,
  };
};

const TopArea = () => {
  const { isLoggedIn } = useContext(AppContext);

  return !isLoggedIn ? <Login px={4} handleLogin={login} /> : <Compose />;
};

const Messages = ({ messages, votes, createdBy }) =>
  messages.map((message) => (
    <MessageComponent
      votesForThisMessage={votes.filter((v) => v.messageId === message._id)}
      key={message._id}
      createdBy={!!createdBy}
      message={message}
    />
  ));

const Feed = ({ hideCompose, messages, rawMessages, createdBy, ...rest }) => {
  const [liveMessages, setLiveMessages] = useState(rawMessages.map((m) => new Message(m)));
  const [loading, setLoading] = useState(false);
  const [viewingAll, setViewingAll] = useState(false);
  const [liveVotes, setLiveVotes] = useState([]);

  const newMessageListener = (message) => {
    if (liveMessages.find((m) => m._id === message._id)) {
      return null;
    }
    message.attrs.votes = message.attrs.votes || 0;
    return setLiveMessages([...new Set([message, ...liveMessages])]);
  };

  const newVoteListener = (vote) => {
    if (liveVotes.find((v) => v._id === vote._id)) {
      return null;
    }
    return setLiveVotes([...new Set([vote, ...liveVotes])]);
  };

  const subscribe = () => {
    Message.addStreamListener(newMessageListener);
    Vote.addStreamListener(newVoteListener);
  };
  const unsubscribe = () => {
    Message.removeStreamListener(newMessageListener);
    Vote.removeStreamListener(newVoteListener);
  };

  useEffect(() => {
    subscribe();
    return unsubscribe;
  }, []);

  const loadMoreMessages = () => {
    NProgress.start();
    setLoading(true);

    fetchMoreMessages(liveMessages, createdBy).then(({ hasMoreMessages, ...data }) => {
      const _messages = data.messages;
      if (hasMoreMessages) {
        setLiveMessages(_messages);
        setLoading(false);
        NProgress.done();
      } else {
        NProgress.done();
        setLoading(false);
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
      <Messages votes={liveVotes} messages={liveMessages} createdBy={createdBy} />
      {liveMessages.length >= 10 ? (
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
