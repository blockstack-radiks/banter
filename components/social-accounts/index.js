import React from 'react';
import TwitterIcon from 'mdi-react/TwitterIcon';
import GithubCircleIcon from 'mdi-react/GithubCircleIcon';
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
          <GithubCircleIcon />
        </AccountLink>
      )}
      {accounts.twitter && (
        <AccountLink href={`https://twitter.com/${accounts.twitter.identifier}`}>
          <TwitterIcon />
        </AccountLink>
      )}
    </StyleWrapper>
  );
};

export default SocialAccounts;
