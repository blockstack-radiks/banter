import React from 'react';
import { Box } from 'rebass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat } from '@fortawesome/free-solid-svg-icons';
import { getConfig } from 'radiks';

import Text from '../../styled/typography';

import { Container } from './styled';

class Nav extends React.Component {
  state = {
    currentUser: null,
  }

  componentWillMount() {
    const { userSession } = getConfig();
    if (userSession.isUserSignedIn()) {
      const currentUser = userSession.loadUserData();
      this.setState({
        currentUser,
      });
    }
  }

  logout = () => {
    const { userSession } = getConfig();
    userSession.signUserOut();
    window.location = '/';
  }

  render() {
    const { messages } = this.props;
    const { currentUser } = this.state;
    return (
      <nav>
        <Container>
          <Box width={1 / 4}>
            <Text.h1 mt="9px" ml={4} fontSize="28px" color="#574b90" display="inline-block">
              <FontAwesomeIcon icon={faCat} />
              <Text.span ml={3}>Banter</Text.span>
            </Text.h1>
            {/* <Text.span display="inline-block" ml={4} color="#574b90" fontWeight="500" style={{ position: 'relative', top: '-4px' }}>
              A place for
              {' '}
              <span role="img" aria-label="poo">💩</span>
            </Text.span> */}
          </Box>
          <Box ml="auto" mr={4}>
            {currentUser && (
              <Text.span color="#574b90" mt="14px" fontWeight="500" display="inline-block">
                {currentUser.username}
                <Text.a href="javascript:void(0)" ml={2} onClick={this.logout}>
                  Log Out
                </Text.a>
              </Text.span>
            )}
          </Box>
        </Container>
      </nav>
    );
  }
}

export default Nav;
