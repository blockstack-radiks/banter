import React, { useState } from 'react';
import { Box, Flex, Type } from 'blockstack-ui';
import { useConnect as useBlockstackConnect } from '@blockstack/connect';
import { useConnect } from 'redux-bundler-hook';
import { Button } from '../button';


const Login = ({ checkForState, action = 'Get Started', ...rest }) => {
  const args = ['selectUserLoading', 'doLogin'];
  if (checkForState) {
    args.push('selectCookieUsername');
  }
  const { userLoading, doLogin, cookieUsername } = useConnect(...args);
  const [loading, setLoading] = useState(false);

  if (checkForState && cookieUsername) {
    return null;
  }

  const { doOpenAuth } = useBlockstackConnect();

  return (
    <Flex alignItems="center" justifyContent="space-between" py={3} px={3} textAlign="center" {...rest}>
      {!loading && userLoading ? (
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
              {loading ? 'Loading...' : 'Get Started'}
            </Button>
          </Box>
        </>
      )}
    </Flex>
  );
};

export { Login };
