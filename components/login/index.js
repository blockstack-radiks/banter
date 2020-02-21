import React, { useState } from 'react';
import { Box, Flex, Type } from 'blockstack-ui';
import { useConnect as useBlockstackConnect } from '@blockstack/connect';
import { useConnect } from 'redux-bundler-hook';
import { Button } from '../button';

const Login = ({ checkForState, ...rest }) => {
  const args = ['selectUserLoading', 'doLogin'];
  if (checkForState) {
    args.push('selectCookieUsername');
  }
  const { userLoading, cookieUsername } = useConnect(...args);

  if (checkForState && cookieUsername) {
    return null;
  }

  const { doOpenAuth } = useBlockstackConnect();

  return (
    <Flex alignItems="center" justifyContent="space-between" py={3} px={3} textAlign="center" {...rest}>
      {userLoading ? (
        <Box>
          <Type color="#574b90" fontWeight={500}>
            Signing In...
          </Type>
        </Box>
      ) : (
        <>
          <Box />
          <Box>
            <Button
              minWidth={120}
              onClick={() => {
                doOpenAuth();
              }}
            >
              Get Started
            </Button>
          </Box>
        </>
      )}
    </Flex>
  );
};

export { Login };
