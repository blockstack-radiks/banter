import React from 'react';
import { Flex, Box } from 'blockstack-ui';
import Type from '../styled/typography';
import { appUrl } from '../common/utils';

const Footer = ({ email }) => (
  <Flex>
    <Box width={1}>
      <Type.p textAlign="center" color="purple">
        Banter, a place for
        {' '}
        <span role="img" aria-label="poo">💩</span>
      </Type.p>
      {email && (
        <Type.p textAlign="center" color="purple" mt={3}>
          You can change your notification prerences on the
          {' '}
          <Type.a href={`${appUrl()}/settings`}>settings page</Type.a>
          .
        </Type.p>
      )}
    </Box>
  </Flex>
);

export default Footer;
