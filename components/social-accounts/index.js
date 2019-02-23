import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Type } from 'blockstack-ui';

import { StyleWrapper } from './styled';

const AccountLink = ({ href, children}) => (
  <Type.a
    mr={2}
    color="purple"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </Type.a>
);

const SocialAccounts = ({ profile }) => {
  const accounts = {};
  profile.account.forEach((account) => {
    accounts[account.service] = account;
  });
  return (
    <StyleWrapper>
      {accounts.github && (
        <AccountLink href={`https://github.com/${accounts.github.identifier}`}>
          <FontAwesomeIcon icon={faGithub} />
        </AccountLink>
      )}
      {accounts.twitter && (
        <AccountLink href={`https://twitter.com/${accounts.twitter.identifier}`}>
          <FontAwesomeIcon icon={faTwitter} />
        </AccountLink>
      )}
    </StyleWrapper>
  );
};

export default SocialAccounts;
