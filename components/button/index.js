import React from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import { Hover } from 'react-powerplug';

const getBg = (hovered, invert, secondary) => {
  if (hovered) {
    if (invert) return 'white';
    if (secondary) return 'pink';
    return 'purple';
  }
  return 'pink';
};

const getColor = (hovered, invert) => {
  if (hovered) {
    if (invert) return 'purple';
    return 'white';
  }
  return 'purple';
};

const Button = ({ children, disabled, secondary, invert, ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Flex
        border="0"
        px={3}
        py={2}
        is="button"
        bg={getBg(hovered, invert, secondary)}
        color={getColor(hovered, invert)}
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

const SecondaryButton = ({ children, disabled, ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Flex
        border="0"
        px={3}
        py={2}
        is="button"
        bg={hovered ? 'purple' : 'gray.mid'}
        color="white"
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

export { Button, SecondaryButton };
