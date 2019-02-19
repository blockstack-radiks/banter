import React from 'react';
import { Flex, Box } from 'blockstack-ui';
import Type from '../styled/typography';

const Footer = () => (
  <Flex>
    <Box width={1}>
      <Type.p textAlign="center" color="#574b90">
        Banter, a place for
        {' '}
        <span role="img" aria-label="poo">💩</span>
      </Type.p>
    </Box>
  </Flex>
);

export default Footer;
