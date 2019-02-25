import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Type } from 'blockstack-ui';
import { Central } from 'radiks';
import { Card } from '../components/card';
import Input from '../styled/input';
import Checkbox from '../components/checkbox';
import { Button } from '../components/button';

const SettingsPage = ({ ...rest }) => {
  const [state, setState] = useState({
    notifyMentioned: true,
    sendUpdates: true,
    updateFrequency: 'daily',
    email: '',
  });

  const [initialLoad, setIntialLoad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    if (!initialLoad) {
      setLoading(true);
      NProgress.start();
      Central.get('UserSettings').then((value) => {
        if (value) {
          setState(value);
        }
        setIntialLoad(true);
        setLoading(false);
        NProgress.done();
      });
    }
  }, []);

  const handleValueChange = (key, value) => {
    setState((s) => ({
      ...s,
      [key]: value,
    }));
    setEdited(true);
  };
  const updateNotifyMentioned = (event) => {
    handleValueChange('notifyMentioned', event.target.checked);
  };

  const updateSendUpdates = (event) => {
    handleValueChange('sendUpdates', event.target.checked);
  };

  const updateFrequencyChanged = (event) => {
    handleValueChange('updateFrequency', event.target.value);
  };

  const updateEmail = (event) => {
    handleValueChange('email', event.target.value);
  };

  const saveData = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!edited) {
      return null;
    }
    NProgress.start();
    const key = 'UserSettings';
    try {
      await Central.save(key, state);
      setSaved(true);
      NProgress.done();
    } catch (error) {
      console.error(error);
      setSaved(false);
      NProgress.done();
    }
    return true;
  };

  const { notifyMentioned, sendUpdates, updateFrequency, email } = state;

  return (
    <>
      <Head>
        <title>Settings - Banter</title>
      </Head>
      <Card width={[1, 1 / 2]} mx="auto" background="white" p={4} my={2} {...rest}>
        <Box pb={4}>
          <Type is="h2" color="purple" mt={0}>
            Settings
          </Type>
        </Box>
        <Box>
          <Type color="purple" is="h3" mt={0}>
            Notifications
          </Type>
        </Box>

        <Box is="form" onSubmit={saveData}>
          <Type color="purple" fontWeight="bold" fontSize={1}>
            Email Address
          </Type>
          <Input
            placeholder={loading ? 'Loading...' : 'Your Email'}
            mt={2}
            onChange={updateEmail}
            type="email"
            value={email}
          />
          <Checkbox mt={3} onChange={updateNotifyMentioned} checked={notifyMentioned} name="notifyMentioned">
            Notify me when I&apos;m mentioned
          </Checkbox>
          <Checkbox mt={3} onChange={updateSendUpdates} checked={sendUpdates} name="sendUpdated">
            Send me updates with new posts
            <Type.span ml={2}>
              <select value={updateFrequency} onChange={updateFrequencyChanged}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="hours">Every few hours</option>
              </select>
            </Type.span>
          </Checkbox>

          <Button mt={3} disabled={!edited} onClick={saveData} type="submit">
            Save{saved ? 'd!' : ''}
          </Button>
        </Box>
      </Card>
    </>
  );
};

export default SettingsPage;
