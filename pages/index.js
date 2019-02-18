import React from 'react';
import {
  Flex, Box, Button,
} from 'rebass';
import PropTypes from 'prop-types';
import { User, getConfig } from 'radiks';

import Text from '../styled/typography';
import Message from '../models/Message';
import Feed from '../components/feed';

class Home extends React.Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
  }

  state = {
    currentUser: null,
  }

  static async getInitialProps() {
    const messages = await Message.fetchList({
      sort: '-createdAt',
      limit: 10,
    }, { decrypt: false });
    return {
      messages,
    };
  }

  async componentDidMount() {
    const { userSession } = getConfig();
    if (userSession.isUserSignedIn()) {
      const currentUser = userSession.loadUserData();
      await User.createWithCurrentUser();
      this.setState({ currentUser });
    } else if (userSession.isSignInPending()) {
      const currentUser = await userSession.handlePendingSignIn();
      await User.createWithCurrentUser();
      this.setState({ currentUser });
    }
  }

  login = () => {
    const scopes = [
      'store_write',
      'publish_data',
    ];
    const redirect = window.location.origin;
    const manifest = `${window.location.origin}/manifest.json`;
    const { userSession } = getConfig();
    userSession.redirectToSignIn(redirect, manifest, scopes);
  }

  logout = () => {
    const { userSession } = getConfig();
    userSession.signUserOut();
    this.setState({
      currentUser: null,
    });
  }

  render() {
    const { currentUser } = this.state;
    return (
      <>
        <Flex>
          <Box width={[1, 3 / 4]} mx="auto">
            {!currentUser && (
              <>
                <Text.p textAlign="center">
                  Log in with Blockstack to get started.
                </Text.p>

                <Button mt={3} onClick={this.login} mx="auto" style={{ display: 'block' }}>
                  Log In
                </Button>
              </>
            )}
            <Feed messages={this.props.messages} />
          </Box>
        </Flex>
      </>
    );
  }
}

export default Home;
