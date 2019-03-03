import React, { useEffect, useState } from 'react';
import { Box, Type, Flex } from 'blockstack-ui';
import CloseIcon from 'mdi-react/CloseIcon';
import { Backdrop, Overlay, Provider } from 'reakit';
import theme from 'reakit-theme-default';
import { useConnect } from 'redux-bundler-hook';
import { User } from 'radiks';
import StyledModal from './styled';
import Input from '../../styled/input';
import { Button } from '../button';
import { sendInviteEmails } from '../../common/lib/api';

const InviteUserModal = () => {
  const { lastMentions, lastMessage } = useConnect('selectLastMentions', 'selectLastMessage');
  const [usersToInvite, setUsersToInvite] = useState([]);
  const [userEmails, setUserEmails] = useState({});
  const [isHidden, setIsHidden] = useState(true);

  const checkToInvite = async () => {
    const usernames = lastMentions.map((m) => m.slice(1));
    const users = await User.fetchList({
      username: usernames.join(','),
    }, { decrypt: false });
    const _usersToInvite = usernames.filter((username) => users.findIndex((user) => user.attrs.username === username) === -1);
    console.log(_usersToInvite);
    const newEmails = {};
    _usersToInvite.forEach((username) => {
      newEmails[username] = '';
    });
    setUserEmails(newEmails);
    setUsersToInvite(_usersToInvite);
  };

  useEffect(() => {
    checkToInvite();
  }, [lastMentions]);

  if (usersToInvite.length === 0) {
    return null;
  } else if (isHidden) {
    setIsHidden(false);
  }

  const emailInputs = usersToInvite.map((username) => (
    <Flex mt={4} key={username}>
      <Box width={1 / 2}>
        <Type mt={2}>@{username}</Type>
      </Box>
      <Box width={1 / 2}>
        <Input
          value={userEmails[username] || ''}
          onChange={(evt) => {
            const text = evt.target.value;
            setUserEmails((oldState) => ({
              ...oldState,
              [username]: text,
            }));
          }}
          placeholder={`Email of @${username}`}
          type='email'
        />
      </Box>
    </Flex>
  ));

  const sendInvites = async (evt) => {
    if (evt && evt.preventDefault) {
      evt.preventDefault();
    }
    sendInviteEmails({
      lastMessage,
      userEmails,
    });

    setUsersToInvite([]);
    setIsHidden(true);
  };

  return (
    <Provider theme={theme}>
      <Overlay.Container initialState={{ visible: true }}>
        {(overlay) => {
          const handleDismiss = () => {
            setUsersToInvite([]);
            setIsHidden(true);
            overlay.hide();
          };
          if (!isHidden && !overlay.visible) {
            overlay.show();
          }
          if (isHidden && overlay.visible) {
            overlay.hide();
          }
          return (
            <Box
              width={1}
              minHeight="100vh"
              position="fixed"
              zIndex={99999}
              style={{
                pointerEvents: overlay.visible ? 'unset' : 'none',
              }}
            >
              <Backdrop fade use={Overlay.Hide} {...overlay} hide={handleDismiss} />
              <Overlay visible fade slide {...overlay} hide={handleDismiss}>
                <Box maxWidth={600} p={4}>
                  <StyledModal.CloseButton
                    dark
                    style={{
                      position: 'absolute',
                      zIndex: 20,
                      right: '30px',
                      top: '25px',
                    }}
                    onClick={handleDismiss}
                  >
                    <CloseIcon color="#fff" />
                  </StyledModal.CloseButton>
                  <Type mb={0} is="h3" color="purple">
                    You mentioned people who haven&apos;t used Banter!
                  </Type>

                  <Type mt={3}>
                    Would you like to invite them?
                  </Type>

                  <form onSubmit={sendInvites}>
                    {emailInputs}

                    <Button mt={4}>
                      Send Invites
                    </Button>
                  </form>
                </Box>
              </Overlay>
            </Box>
          );
        }}
      </Overlay.Container>
    </Provider>
  );
};

export default InviteUserModal;
