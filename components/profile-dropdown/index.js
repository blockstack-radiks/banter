import React from 'react';
import { Box, Flex, Type } from 'blockstack-ui';
import { Hover } from 'react-powerplug';
import Link from 'next/link';
import { useConnect } from 'redux-bundler-hook';
import { Popover } from 'reakit';
import SettingsIcon from 'mdi-react/SettingsIcon';
import ProfileIcon from 'mdi-react/AccountCircleIcon';
import LogoutIcon from 'mdi-react/LogoutIcon';
import { Avatar } from '../avatar';

const DropdownItem = ({ children, icon: Icon, href, as, passHref, ...rest }) => {
  const WrapperComponent = href ? Link : Box;
  const wrapperProps = {};
  if (href) {
    wrapperProps.prefetch = true;
    wrapperProps.passHref = true;
  }
  return (
    <Hover>
      {({ hovered, bind }) => (
        <WrapperComponent href={href} as={as} {...wrapperProps}>
          <Flex
            py={2}
            width={1}
            color="purple"
            is={href ? 'a' : Box}
            opacity={hovered ? 1 : 0.75}
            style={{
              textDecoration: 'none',
            }}
            cursor={hovered ? 'pointer' : 'unset'}
            textAlign="left"
            alignItems="center"
            fontWeight={500}
            {...bind}
            {...rest}
          >
            {Icon ? (
              <Box pr={1} mr={1}>
                <Icon style={{ display: 'block' }} size={18} />
              </Box>
            ) : null}
            {children}
          </Flex>
        </WrapperComponent>
      )}
    </Hover>
  );
};
const DropdownItems = () => {
  const { cookieUsername: username, profile, doLogout } = useConnect(
    'selectCookieUsername',
    'selectProfile',
    'doLogout'
  );

  return (
    <Box minWidth={130} textAlign="left">
      <Box textAlign="left" pb={3} mb={2} borderBottom="1px solid rgb(230,236,240)">
        <Type
          style={{
            whiteSpace: 'nowrap',
          }}
          color="purple"
          transition="0.1s all ease-in-out"
          fontWeight={600}
        >
          {(profile && profile.name) || username}
        </Type>

        <Type
          style={{
            whiteSpace: 'nowrap',
          }}
          color="purple"
          transition="0.1s all ease-in-out"
          fontSize={0}
          pt={2}
        >
          @{username}
        </Type>
      </Box>
      <DropdownItem
        href={{
          pathname: '/user',
          query: {
            username,
          },
        }}
        as={`/[::]${username}`}
        passHref
        icon={ProfileIcon}
      >
        Profile
      </DropdownItem>
      <DropdownItem icon={SettingsIcon} href="/settings">
        Settings
      </DropdownItem>
      <DropdownItem icon={LogoutIcon} onClick={doLogout}>
        Log out
      </DropdownItem>
    </Box>
  );
};

const UserItem = ({ popover }) => {
  const { cookieUsername: username } = useConnect('selectCookieUsername');

  return (
    <Hover>
      {({ hovered, bind }) => (
        <Box
          is={Popover.Toggle}
          {...popover}
          style={{
            outline: 'none',
            position: 'relative',
            zIndex: 9999,
          }}
        >
          <Flex alignItems="center" cursor={hovered ? 'pointer' : 'unset'} {...bind}>
            <Box position="relative">
              <Box
                title="Your Profile"
                size={31}
                display="block"
                border="2px solid"
                borderColor={hovered || popover.visible ? 'white' : 'transparent'}
                transition="0.1s all ease-in-out"
                borderRadius="100%"
                position="relative"
              >
                <Avatar size={27} username={username} />
                <Popover placement="bottom-end" fade slide expand hideOnClickOutside {...popover}>
                  <Popover.Arrow />
                  <DropdownItems />
                </Popover>
              </Box>
            </Box>
          </Flex>
        </Box>
      )}
    </Hover>
  );
};

const ProfileDropdown = () => {
  const { cookieUsername: username } = useConnect('selectCookieUsername');

  return username ? (
    <Popover.Container
      style={{
        outline: 'none',
      }}
    >
      {(popover) => <UserItem popover={popover} />}
    </Popover.Container>
  ) : null;
};

export { ProfileDropdown };
