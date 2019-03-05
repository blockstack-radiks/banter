import React, { useState, useEffect } from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import Streamer from 'radiks/lib/streamer';

const OfflineIndicator = () => {
  const [online, setOnline] = useState(true);

  if (typeof document === 'undefined') {
    return null;
  }

  useEffect(() => {
    const socket = Streamer.init();
    socket.onclose = () => {
      setOnline(false);
    };
  }, []);

  if (online) { 
    return null;
  }

  const { href } = document.location;

  return (
    <Flex
      mb={3}
      mx="auto"
      maxWidth={600} 
      width={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Box width={1} bg="purple" px={4} py={3} borderRadius={2}>
        <Type fontWeight={500} color="white">
          Banter has been updated!
          {' '}
          <Type is="a" href={href} color="white">Refresh the page</Type>
          {' '}
          to make sure things work properly.
        </Type>
      </Box>
    </Flex>
    // <Flex my={3} p={3} width={1}>
    //   <Type>You're offline!</Type>
    // </Flex>
  );
};

export default OfflineIndicator;
