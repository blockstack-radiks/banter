import React, { useEffect, useState, useContext } from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import NProgress from 'nprogress';
import { getConfig } from 'radiks';

import { AppContext } from '../common/context/app-context';
import Input from '../styled/input';
import Message from '../models/Message';
import MessageComponent from './message';
import { Button } from './button';
import { Login } from './login';
import { fetchMessages } from '../common/lib/api';
import Vote from '../models/Vote';

const Compose = ({ handleSubmit, value, handleValueChange, disabled, ...rest }) => (
  <Box p={4} {...rest}>
    <Flex justifyContent="space-between">
      <Box is="form" flexGrow={1} onSubmit={handleSubmit}>
        <Input
          type="text"
          width={1}
          placeholder="What do you have to say?"
          value={value}
          onChange={(evt) => handleValueChange(evt.target.value)}
        />
      </Box>
      <Button disabled={disabled} ml={2} onClick={handleSubmit}>
        Submit
      </Button>
    </Flex>
  </Box>
);

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
  const hasMoreMessages = newMessages.length !== 0;
  return {
    hasMoreMessages,
    _messages: newmessages,
  };
};

const TopArea = () => {
  const { isLoggedIn, user } = useContext(AppContext);
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (content === '') {
      return null;
    }
    NProgress.start();
    const message = new Message({
      content,
      createdBy: user._id,
    });
    try {
      await message.save();
      setContent('');
      NProgress.done();
    } catch (error) {
      console.log(error);
      NProgress.done();
    }
    return true;
  };

  return !isLoggedIn ? (
    <Login px={4} handleLogin={login} />
  ) : (
    <Compose
      handleSubmit={handleSubmit}
      handleValueChange={setContent}
      value={content}
      disabled={content === '' || !user}
    />
  );
};

const Messages = ({ messages, createdBy }) => messages.map((message) => <MessageComponent key={message._id} createdBy={!!createdBy} message={message} />);

const Feed = ({ hideCompose, messages, rawMessages, createdBy, ...rest }) => {
  const [liveMessages, setLiveMessages] = useState(rawMessages.map((m) => new Message(m)));
  const [loading, setLoading] = useState(false);
  const [viewingAll, setViewingAll] = useState(false);

  const newMessageListener = (message) => {
    if (liveMessages.find((m) => m._id === message._id)) {
      return null;
    }
    return setLiveMessages([...new Set([message, ...liveMessages])]);
  };

  const subscribe = () => Message.addStreamListener(newMessageListener);
  const unsubscribe = () => Message.removeStreamListener(newMessageListener);

  useEffect(() => {
    subscribe();
    return unsubscribe;
  });

  const newVoteListener = (vote) => {
    console.log('new vote', vote);
    let foundMessage = false;
    liveMessages.forEach((message, index) => {
      if (message.attrs._id === vote.attrs.messageId) {
        console.log('vote in the feed');
        message.attrs.votes += 1;
        liveMessages[index] = message;
        foundMessage = true;
      }
    });
    if (foundMessage) {
      setLiveMessages([...new Set([...liveMessages])]);
    }
  };

  const subscribeVotes = () => Vote.addStreamListener(newVoteListener);
  const unsubscribeVotes = () => Vote.removeStreamListener(newVoteListener);

  useEffect(() => {
    subscribeVotes();
    return unsubscribeVotes;
  }, []);

  const loadMoreMessages = () => {
    NProgress.start();
    setLoading(true);
    fetchMoreMessages(liveMessages, createdBy).then(({ hasMoreMessages, _messages }) => {
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
      my={[2, 4]}
      mx={[2, 'auto']}
      maxWidth={600}
      bg="white"
      borderRadius={2}
      boxShadow="card"
      {...rest}
    >
      {hideCompose ? null : <TopArea />}
      <Messages messages={liveMessages} createdBy={createdBy} />
      <Flex borderTop="1px solid rgb(230, 236, 240)" alignItems="center" justifyContent="center" p={4}>
        {viewingAll ? (
          <Type color="purple" fontWeight="bold">
            You&apos;ve reached the end of the line!
          </Type>
        ) : (
          <Button onClick={onLoadMoreClick}>{loading ? 'Loading...' : 'Load more'}</Button>
        )}
      </Flex>
    </Box>
  );
};

export default Feed;
