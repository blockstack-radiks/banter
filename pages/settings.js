import React from 'react';
import { Flex, Box, Type } from 'blockstack-ui';
import { Central } from 'radiks';
import { Card } from '../components/card';
import Input from '../styled/input';
import Checkbox from '../components/checkbox';
import Button from '../styled/button';

class Settings extends React.Component {
  state = {
    notifyMentioned: true,
    sendUpdates: true,
    updateFrequency: 'daily',
    email: '',
  };

  async componentDidMount() {
    NProgress.start();
    const value = await Central.get('UserSettings');
    if (value) {
      this.setState(value);
    }
    NProgress.done();
  }

  updateNotifyMentioned = (event) => {
    this.setState({ notifyMentioned: event.target.checked });
  };

  updateSendUpdates = (event) => {
    this.setState({ sendUpdates: event.target.checked });
  };

  updateFrequencyChanged = (event) => {
    this.setState({ updateFrequency: event.target.value });
  };

  updateEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  saveData = async () => {
    NProgress.start();
    const value = this.state;
    const key = 'UserSettings';

    await Central.save(key, value);
    NProgress.done();
  };

  render() {
    const { notifyMentioned, sendUpdates, updateFrequency, email } = this.state;
    return (
      <Card width={[1, 1 / 2]} mx="auto" background="white" p={4} my={2}>
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

        <Type color="purple" fontWeight="bold" fontSize={1}>
          Email Address
        </Type>
        <Input placeholder="Your Email" mt={2} onChange={this.updateEmail} value={email} />
        <Checkbox mt={3} onChange={this.updateNotifyMentioned} checked={notifyMentioned} name="notifyMentioned">
          Notify me when I&apos;m mentioned
        </Checkbox>
        <Checkbox mt={3} onChange={this.updateSendUpdates} checked={sendUpdates} name="sendUpdated">
          Send me updates with new posts
          <Type.span ml={2}>
            <select value={updateFrequency} onChange={this.updateFrequencyChanged}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </Type.span>
        </Checkbox>

        <Button mt={3} onClick={this.saveData}>
          Save
        </Button>
      </Card>
    );
  }
}

export default Settings;
