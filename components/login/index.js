import React, { useState } from 'react';
import { Box, Flex, Type } from 'blockstack-ui';
import { useConnect } from 'redux-bundler-hook';
import { Button } from '../button';

const Login = ({ handleLogin, ...rest }) => {
  const { userLoading } = useConnect('selectUserLoading');

  const [loading, setLoading] = useState(false);

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
          <Box>
            <Type color="#574b90" fontWeight={500}>
              Login with Blockstack to get started.
            </Type>
          </Box>
          <Box>
            <Button
              minWidth={120}
              onClick={() => {
                handleLogin();
                setLoading(true);
              }}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </Box>
        </>
      )}
    </Flex>
  );
};

export { Login };
