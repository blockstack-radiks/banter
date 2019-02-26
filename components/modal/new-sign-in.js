import React, { useState } from 'react';
import CloseIcon from 'mdi-react/CloseIcon';
import { Type, Box } from 'blockstack-ui';
import Link from 'next/link';
import { Central } from 'radiks';

import StyledModal from './styled';
import Poop from '../poop';
import Input from '../../styled/input';
import { Button, SecondaryButton } from '../button';
import { USER_SETTINGS, defaultUserSettings } from '../../common/constants';

const NewSignInModal = ({ open }) => {
  const [openState, setInnerIsOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open || !openState) {
    return null;
  }

  const close = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setInnerIsOpen(false);
  };

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
    close();
    NProgress.done();
    setSaving(false);
  };

  return (
    <StyledModal.Modal>
      <StyledModal.Content
        width={[1, 0.65, 0.65, 0.5]}
        p={6}
      >
        <StyledModal.CloseButton dark
          style={{
            position: 'absolute',
            zIndex: 20,
            right: '30px',
            top: '25px'
          }}
          onClick={close}
        >
          <CloseIcon color="#fff" />
        </StyledModal.CloseButton>
        <Type.h3>
          Welcome to Banter!
        </Type.h3>
        <Type my={4}>
          Banter is a super-social place for friends.
          You might miss out if Banter can&apos;t send you notifications... don&apos;t worry,
          you can always remove your email or limit notifications in the
          {' '}
          <Link href="/settings" passHref>
            <Type.a color="purple" fontWeight="bold" style={{ textDecoration: 'none' }}>Settings</Type.a>
          </Link>
          {' '}
          tab.
        </Type>

        <Box is="form" onSubmit={submit}>
          <Type color="purple" fontWeight="bold" fontSize={1}>
            Email Address
          </Type>
          <Input
            // placeholder={loading ? 'Loading...' : 'Your Email'}
            placeholder='Your Email'
            mt={2}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            value={email}
          />

          <Box textAlign="right">
            <SecondaryButton display="inline-block" mr={3} onClick={close}>
              Skip
            </SecondaryButton>
            <Button mt={4} display="inline-block" disabled={saving} onClick={submit}>
              {saving ? 'Saving..' : 'Save Email'}
            </Button>
          </Box>
        </Box>
      </StyledModal.Content>
      <StyledModal.Backdrop onClick={close} />
    </StyledModal.Modal>
  );
};

export default NewSignInModal;
