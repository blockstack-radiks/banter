import React from 'react';
import { Flex, Box, Type } from 'blockstack-ui';

import { Logo } from '../nav';

export default () => (
  <Flex px={4} py={2} alignItems="center" is="nav" bg="pink">
    <Box width={1}>
      <Type is="h1" m={0} fontSize="28px" display="inline-block">
        <Type is="a" href="https://banter.pub" color='purple' textDecoration="none">
          <Logo />
          <Type ml={2}>
            Banter
          </Type>
        </Type>
      </Type>
    </Box>
  </Flex>
);
