import React from 'react';
import { ThemeProvider } from 'styled-components';

import { theme } from '../../common/theme';
import { globalStyles } from '../../common/style';
import Nav from './nav';
import Footer from '../footer';

export default ({ children }) => {
  const GlobalStyles = globalStyles();
  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <GlobalStyles />
        <body>
          <Nav />
          {children}
          <Footer />
        </body>
      </html>
    </ThemeProvider>
  );
};
