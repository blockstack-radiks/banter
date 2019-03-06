import React, { useState } from 'react';
import { Type, Box } from 'blockstack-ui';
import Link from 'next/link';
import { Central } from 'radiks';
import { useConnect } from 'redux-bundler-hook';

import Input from '../../styled/input';
import { Button, SecondaryButton } from '../button';
import { USER_SETTINGS, defaultUserSettings } from '../../common/constants';
import Modal from './wrapper';

const Content = ({ hide, newUser, hasDismissed, visible, show }) => {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  if (newUser && !visible && !hasDismissed) {
    show();
  }
  const submit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    NProgress.start();
    setSaving(true);
    const key = USER_SETTINGS;
    const data = {
      ...defaultUserSettings,
      email,
    };
    try {
      await Central.save(key, data);
    } catch (error) {
      console.error(error);
    }
    hide();
    NProgress.done();
    setSaving(false);
  };

  return (
    <>
      <Type mb={0} is="h3" color="purple">
        Welcome to Banter!
      </Type>
      <Type lineHeight={1.8} my={4}>
        Banter is a super-social place for friends. You might miss out if Banter can&apos;t send you notifications...
        don&apos;t worry, you can always remove your email or limit notifications in the{' '}
        <Link href="/settings" passHref>
          <Type.a color="purple" fontWeight="bold" style={{ textDecoration: 'none' }}>
            Settings
          </Type.a>
        </Link>{' '}
        tab.
      </Type>

      <Box pt={3} is="form" onSubmit={submit}>
        <Type color="purple" fontWeight="bold" fontSize={1}>
          Email Address
        </Type>
        <Input placeholder="Your Email" mt={2} onChange={(e) => setEmail(e.target.value)} type="email" value={email} />

        <Box pt={4} textAlign="center">
          <SecondaryButton display="inline-block" mr={3} onClick={hide}>
            Skip
          </SecondaryButton>
          <Button mt={4} display="inline-block" disabled={email === '' || saving} onClick={submit}>
            {saving ? 'Saving..' : 'Save Email'}
          </Button>
        </Box>
      </Box>
    </>
  );
};

const NewSignInModal = () => {
  const { user } = useConnect('selectUser');

  const newUser = user && user.createdAt && user.createdAt === user.updatedAt;

  return <Modal persistDismiss>{(props) => <Content newUser={newUser} {...props} />}</Modal>;
};

export default NewSignInModal;
