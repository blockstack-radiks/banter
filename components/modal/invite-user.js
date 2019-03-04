import React, { useEffect, useState } from 'react';
import { Box, Type, Flex } from 'blockstack-ui';

import { useConnect } from 'redux-bundler-hook';
import { User } from 'radiks';
import Modal from './wrapper';
import { Button } from '../button';
import { sendInviteEmails } from '../../common/lib/api';
import AtIcon from 'mdi-react/AtIcon';

const Content = ({ visible, hide, hasDismissed, show }) => {
  const { lastMentions, lastMessage } = useConnect('selectLastMentions', 'selectLastMessage');
  const [usersToInvite, setUsersToInvite] = useState([]);
  const [userEmails, setUserEmails] = useState({});

  const checkToInvite = async () => {
    if (lastMentions.length === 0 && usersToInvite === [] && userEmails === []) {
      return;
    }
    if (lastMentions.length === 0) {
      if (userEmails !== []) {
        setUserEmails([]);
      }
      if (usersToInvite) {
        setUsersToInvite([]);
      }
      return;
    }
    const usernames = lastMentions.map((m) => m.slice(1));
    const users = await User.fetchList(
      {
        username: usernames.join(','),
      },
      { decrypt: false }
    );
    const _usersToInvite = usernames.filter(
      (username) => users.findIndex((user) => user.attrs.username === username) === -1
    );

    const newEmails = {};
    _usersToInvite.forEach((username) => {
      newEmails[username] = '';
    });
    setUserEmails(newEmails);
    setUsersToInvite(_usersToInvite);
  };

  useEffect(() => {
    checkToInvite();
  }, [lastMentions, visible]);

  const hasUsersToInvite = !hasDismissed && usersToInvite && usersToInvite.length > 0;

  if (hasUsersToInvite && !visible) {
    show();
  } else if (!hasUsersToInvite && visible) {
  }

  const emailInputs = usersToInvite.map((username, i, arr) => (
    <Flex
      bg="white"
      p={4}
      key={username}
      borderBottom={i !== arr.length - 1 ? '1px solid rgb(230, 236, 240)' : 'unset'}
      flexDirection="column"
    >
      <Flex alignItems="center" width={1} pb={2}>
        <Box pr="2px" color="purple" opacity={0.5}>
          <AtIcon size={20} style={{ display: 'block' }} />
        </Box>
        <Type is="label" htmlFor={username} pb="2px" color="purple" fontWeight="bold">
          {username}
        </Type>
      </Flex>
      <Box flexGrow={1}>
        <Box
          is="input"
          display="block"
          width={1}
          p={2}
          name={username}
          id={username}
          border="1px solid hsl(204,25%,80%)"
          value={userEmails[username] || ''}
          onChange={(evt) => {
            const text = evt.target.value;
            setUserEmails((oldState) => ({
              ...oldState,
              [username]: text,
            }));
          }}
          placeholder={`Email of @${username}`}
          type="email"
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
  };

  return (
    <Box textAlign="center">
      <Type color="white" m={0} is="h2" maxWidth="60%" lineHeight={1.4}>
        You mentioned people who haven&apos;t used Banter!
      </Type>

      <Type color="white" mt={4} lineHeight={1.6} maxWidth="80%">
        Would you like to invite them via email? Otherwise, they probably won't ever see your message.
      </Type>

      <form onSubmit={sendInvites}>
        <Box
          maxHeight="300px"
          overflow="auto"
          borderRadius="4px"
          mt={5}
          mb={3}
          border="1px solid rgb(230, 236, 240)"
          boxShadow="card"
        >
          {emailInputs}
        </Box>

        <Box mt={6}>
          <Button invert mx="auto">
            Send Invites
          </Button>
        </Box>
      </form>
    </Box>
  );
};

const InviteUserModal = () => {
  const { doClearLastData } = useConnect('doClearLastData');
  return (
    <Modal bg="purple" onDismiss={() => setTimeout(() => doClearLastData(), 150)}>
      {(props) => <Content {...props} />}
    </Modal>
  );
};

export default InviteUserModal;
