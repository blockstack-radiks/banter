import React from 'react';
import { Flex, Box } from 'blockstack-ui';
import Type from '../styled/typography';
import Poop from './poop';

const Footer = () => (
  <Flex>
    <Box width={1}>
      <Type.p textAlign="center" color="#574b90">
        Banter, a place for
        {' '}
        <Poop />
      </Type.p>
    </Box>
  </Flex>
);

export default Footer;
