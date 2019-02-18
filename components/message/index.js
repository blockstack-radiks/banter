import React from 'react';
import { Flex, Box } from 'rebass';

import Text from '../../styled/typography';
import Avatar from '../avatar';

const Message = ({ message }) => (
  <Flex mt={3}>
    <Box width={1 / 8}>
      <Avatar src={`/api/avatar/${message.attrs.createdBy}`} size={50} />
    </Box>
    <Box width={7 / 8}>
      <Text.p mt={0} mb={1}>
        {message.attrs.createdBy}
        {' '}
        says:
      </Text.p>
      <Text.em>{message.attrs.content}</Text.em>
      <Text.small display="block" mt={1}>{message.ago()}</Text.small>
    </Box>
  </Flex>
);

export default Message;
