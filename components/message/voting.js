import React, { useState } from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import DownvoteFilledIcon from 'mdi-react/EmoticonPoopIcon';
import Vote from '../../models/Vote';
import { useConnect } from 'redux-bundler-hook';
import { Hover, Active } from 'react-powerplug';

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

const Voting = ({ messageId, hasVoted, votes }) => {
  const [voted, setVoted] = useState(hasVoted);
  const [count, setCount] = useState(votes);
  const { user } = useConnect('selectUser');

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

export { Voting };
