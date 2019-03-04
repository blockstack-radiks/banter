import React, { useState } from 'react';
import { Box } from 'blockstack-ui';
import CloseIcon from 'mdi-react/CloseIcon';
import { Backdrop, Overlay, Provider } from 'reakit';
import theme from 'reakit-theme-default';
import { Hover } from 'react-powerplug';

const CloseButton = ({ ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Box
        position="absolute"
        cursor={hovered ? 'pointer' : 'unset'}
        opacity={hovered ? 1 : 0.6}
        zIndex={20}
        right="20px"
        top="20px"
        color="purple"
        {...rest}
        {...bind}
      >
        <CloseIcon />
      </Box>
    )}
  </Hover>
);

const ModalWrapper = ({ children, onDismiss, persistDismiss = false, initial = false, bg, ...rest }) => {
  const [hasDismissed, setHasDismissed] = useState(false);
  const handleDismissed = () => {
    setHasDismissed(true);
    if (!persistDismiss) {
      setTimeout(() => setHasDismissed(false), 300);
    }
  };
  return (
    <Provider theme={theme}>
      <Overlay.Container
        initialState={{
          visible: initial,
        }}
      >
        {(overlay) => {
          const handleDismiss = () => {
            if (onDismiss && typeof onDismiss === 'function') {
              onDismiss();
            }
            handleDismissed();
            overlay.hide();
          };
          return (
            <Box
              width={1}
              minHeight="100vh"
              position="fixed"
              top="0"
              left="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={99999}
              style={{
                pointerEvents: overlay.visible ? 'unset' : 'none',
              }}
            >
              <Backdrop fade use={Overlay.Hide} {...overlay} hide={handleDismiss} />
              <Overlay
                fade
                {...overlay}
                transform="none"
                top="unset"
                left="unset"
                background="transparent"
                boxShadow="none"
                padding={0}
                hide={handleDismiss}
              >
                <Box boxShadow="card" maxWidth={550} borderRadius={6} p={4} bg={bg || 'white'} {...rest}>
                  <CloseButton color={bg === 'purple' ? 'white' : undefined} onClick={handleDismiss} />
                  {typeof children === 'function'
                    ? children({
                        visible: overlay.visible,
                        show: overlay.show,
                        hide: handleDismiss,
                        hasDismissed,
                      })
                    : children}
                </Box>
              </Overlay>
            </Box>
          );
        }}
      </Overlay.Container>
    </Provider>
  );
};

export default ModalWrapper;
