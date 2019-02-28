import React from 'react';
import { Flex, Box } from 'blockstack-ui';
import Type from '../styled/typography';
import Poop from './poop';
import { appUrl } from '../common/utils';

const Footer = ({ email }) => (
  <Flex>
    <Box width={1}>
      <Type.p textAlign="center" color="purple">
        Banter, a place for
        {' '}
        <Poop />
      </Type.p>
      {email && (
        <Type.p textAlign="center" color="purple" mt={3}>
          You can change your notification preferences on the
          {' '}
          <Type.a href={`${appUrl()}/settings`}>settings page</Type.a>
          .
        </Type.p>
      )}
    </Box>
  </Flex>
);

export default Footer;
