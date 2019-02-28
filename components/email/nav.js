import React from 'react';
import { Flex, Box, Type } from 'blockstack-ui';

import { Logo } from '../nav';
import { appUrl } from '../../common/utils';

export default () => (
  <Flex px={4} py={2} alignItems="center" width={1} bg="pink">
    <Box width={1}>
      <Type is="h1" m={0} fontSize="28px" display="inline-block">
        <Type is="a" href={appUrl()} color='purple' textDecoration="none">
          <Logo />
          <Type ml={2}>
            Banter
          </Type>
        </Type>
      </Type>
    </Box>
  </Flex>
);
