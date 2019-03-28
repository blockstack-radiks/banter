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
    messages: PropTypes.array,
  }

  static defaultProps = {
    messages: [],
  }

  state = {
    currentUser: null,
  }

  static async getInitialProps() {
  }

  async componentDidMount() {
  }

  login = () => {
  }

  logout = () => {
  }

  render() {
    const { currentUser } = this.state;
    return (
      <>
        <Flex>
          <Box width={[1, 3 / 4]} mx="auto">
            <Text.h1 textAlign="center">
              Banter
            </Text.h1>
            {currentUser ? (
              <>
                <Text.small textAlign="center" display="block">
                  Logged in as
                  {' '}
                  {currentUser.username}
                  {'. '}
                  <a href="javascript:void(0)" onClick={this.logout}>Log Out</a>
                </Text.small>
                <Feed messages={this.props.messages} />
              </>
            ) : (
              <>
                <Text.p textAlign="center">
                  Log in with Blockstack to get started.
                </Text.p>

                <Button mt={3} onClick={this.login} mx="auto" style={{ display: 'block' }}>
                  Log In
                </Button>
              </>
            )}
          </Box>
        </Flex>
      </>
    );
  }
}

export default Home;
