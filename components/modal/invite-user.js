import React, { useEffect, useState } from 'react';
import { Box, Type, Flex } from 'blockstack-ui';
import { useConnect } from 'redux-bundler-hook';
import { User } from 'radiks';
import AtIcon from 'mdi-react/AtIcon';
import Poop from 'mdi-react/EmoticonPoopIcon';

import Modal from './wrapper';
import { Button } from '../button';
import { sendInviteEmails } from '../../common/lib/api';

const Content = ({ visible, complete, setComplete, hide, hasDismissed, show }) => {
  const { lastMentions, lastMessage, username } = useConnect(
    'selectLastMentions',
    'selectLastMessage',
    'selectUsername'
  );
  const [usersToInvite, setUsersToInvite] = useState([]);
  const [userEmails, setUserEmails] = useState({});

  const checkToInvite = async () => {
    if (lastMentions.length === 0 && usersToInvite === [] && userEmails === []) {
      return;
    }
    if (lastMessage && lastMessage.createdBy !== username) {
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
      (_username) => users.findIndex((user) => user.attrs.username === _username) === -1
    );

    const newEmails = {};
    _usersToInvite.forEach((_username) => {
      newEmails[_username] = '';
    });
    setUserEmails(newEmails);
    setUsersToInvite(_usersToInvite);
  };

  useEffect(() => {
    checkToInvite();
  }, [lastMentions]);

  const hasUsersToInvite = !hasDismissed && usersToInvite && usersToInvite.length > 0;

  if (hasUsersToInvite && !visible) {
    show();
  }

  const emailInputs = usersToInvite.map((_username, i, arr) => (
    <Flex
      bg="white"
      p={4}
      key={_username}
      borderBottom={i !== arr.length - 1 ? '1px solid rgb(230, 236, 240)' : 'unset'}
      flexDirection="column"
    >
      <Flex alignItems="center" width={1} pb={2}>
        <Box pr="2px" color="purple" opacity={0.5}>
          <AtIcon size={20} style={{ display: 'block' }} />
        </Box>
        <Type is="label" htmlFor={_username} pb="2px" color="purple" fontWeight="bold">
          {_username}
        </Type>
      </Flex>
      <Box flexGrow={1}>
        <Box
          is="input"
          display="block"
          width={1}
          p={2}
          name={_username}
          id={_username}
          border="1px solid hsl(204,25%,80%)"
          value={userEmails[_username] || ''}
          onChange={(evt) => {
            const text = evt.target.value;
            setUserEmails((oldState) => ({
              ...oldState,
              [_username]: text,
            }));
          }}
          placeholder={`Email of @${_username}`}
          type="email"
        />
      </Box>
    </Flex>
  ));

  const disabled = !Object.values(userEmails).filter((e) => e !== '').length;

  const sendInvites = async (evt) => {
    if (evt && evt.preventDefault) {
      evt.preventDefault();
    }
    if (disabled) {
      return;
    }
    try {
      const success = await sendInviteEmails({
        lastMessage,
        userEmails,
      });
      if (success) {
        console.log('success', success);
        setComplete(true);
        setUsersToInvite([]);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <Box py={4} textAlign="center">
      {complete ? (
        <Flex
          mt={4}
          mb={4}
          alignItems="center"
          justifyContent="center"
          mx="auto"
          size={180}
          borderRadius="100%"
          opacity={0.15}
          color="purple"
          bg="white"
        >
          <Poop size={160} style={{ display: 'block' }} />
        </Flex>
      ) : null}
      <Box>
        <Type color="white" m={0} is="h2" maxWidth="60%" lineHeight={1.4}>
          {!complete ? <>You mentioned people who haven&apos;t used Banter!</> : <>Success!</>}
        </Type>
      </Box>

      <Box>
        {' '}
        <Type color="white" mt={4} lineHeight={1.6} maxWidth="80%">
          {!complete ? (
            <>Would you like to invite them via email? Otherwise, they probably won&apos;t ever see your message.</>
          ) : (
            <>Your invite(s) have been sent! We&apos;ll let them know that you&apos;re talking about them.</>
          )}
        </Type>
      </Box>

      {!complete ? (
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
            <Button onClick={sendInvites} disabled={disabled} invert mx="auto">
              Send Invites
            </Button>
          </Box>
        </form>
      ) : (
        <Box mt={5}>
          <Button onClick={hide} invert mx="auto">
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
};

const InviteUserModal = () => {
  const { doClearLastData } = useConnect('doClearLastData');
  const [complete, setComplete] = useState(false);

  return (
    <Modal
      bg="purple"
      onDismiss={() =>
        setTimeout(() => {
          doClearLastData();
          setComplete(false);
        }, 150)
      }
    >
      {(props) => <Content complete={complete} setComplete={setComplete} {...props} />}
    </Modal>
  );
};

export default InviteUserModal;
