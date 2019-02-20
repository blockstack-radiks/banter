import React from 'react';
import { Flex, Box, } from 'blockstack-ui';
import { Central, } from 'radiks';

import Type from '../styled/typography';
import Input from '../styled/input';
import Checkbox from '../components/checkbox';
import Button from '../styled/button';

class Settings extends React.Component {
  state = {
    notifyMentioned: false,
    sendUpdates: false,
    updateFrequency: 'daily',
    email: '',
  }

  async componentDidMount() {
    NProgress.start();
    const value = await Central.get('UserSettings');
    if (value) {
      this.setState(value);
    }
    NProgress.done();
  }

  updateNotifyMentioned = (event) => {
    this.setState({ notifyMentioned: event.target.checked, });
  }

  updateSendUpdates = (event) => {
    this.setState({ sendUpdates: event.target.checked, });
  }

  updateFrequencyChanged = (event) => {
    this.setState({ updateFrequency: event.target.value, });
  }

  updateEmail = (event) => {
    this.setState({ email: event.target.value, });
  }

  saveData = async () => {
    NProgress.start();
    const value = this.state;
    const key = 'UserSettings';

    await Central.save(key, value);
    NProgress.done();
  }

  render() {
    const {
      notifyMentioned, sendUpdates, updateFrequency, email,
    } = this.state;
    return (
      <Flex>
        <Box width={[1, 1 / 2,]} mx="auto" background="white" p={4} my={2}>
          <Type.h2 mt={0}>Settings</Type.h2>
          <Type.h3 mt={0}>Notifications</Type.h3>

          <Type.strong>Email Address</Type.strong>
          <Input
            placeholder="Your Email"
            mt={2}
            onChange={this.updateEmail}
            value={email}
          />
          <Checkbox mt={3} onChange={this.updateNotifyMentioned} checked={notifyMentioned}>
            Notify me when I'm mentioned
          </Checkbox>
          <Checkbox mt={3} onChange={this.updateSendUpdates} checked={sendUpdates}>
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
        </Box>
      </Flex>
    );
  }
}

export default Settings;
