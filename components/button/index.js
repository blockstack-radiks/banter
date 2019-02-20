import React from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import { Hover } from 'react-powerplug';

const Button = ({ children, disabled, ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Flex
        border="0"
        px={3}
        py={2}
        is="button"
        bg={hovered ? 'purple' : 'pink'}
        color={hovered ? 'white' : 'purple'}
        cursor={hovered ? 'pointer' : 'unset'}
        transition="0.08s all ease-in-out"
        borderRadius="3px"
        alignItems="center"
        justifyContent="center"
        opacity={disabled ? 0.55 : 1}
        style={{
          pointerEvents: disabled ? 'none' : 'unset',
        }}
        {...bind}
        {...rest}
      >
        <Box>
          <Type fontWeight="bold">{children}</Type>
        </Box>
      </Flex>
    )}
  </Hover>
);

export { Button };
