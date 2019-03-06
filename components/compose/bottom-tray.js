import React from 'react';
import { Box, Flex } from 'blockstack-ui';
// import { Provider, Tooltip } from 'reakit';
// import reakitTheme from 'reakit-theme-default';
// import LocationIcon from 'mdi-react/LocationIcon';
// import ImageIcon from 'mdi-react/ImageOutlineIcon';
// import ImageAddIcon from 'mdi-react/ImageAddIcon';
// import { Gif } from 'styled-icons/material/Gif';
// import { Hover } from 'react-powerplug';
import { Button } from '../button';

// const getIcon = (icons, hovered, icon) => {
//   if (icons && icons.length) {
//     if (hovered) return icons[1];
//     return icons[0];
//   }
//   return icon;
// };

// const getCursor = (disabled, hovered) => {
//   if (disabled) return 'not-allowed';
//   if (hovered) return 'pointer';
//   return 'unset';
// };

// const IconButton = ({ tooltip, disabled, icons, icon, ...rest }) => (
//   <Provider theme={reakitTheme}>
//     <Hover>
//       {({ hovered, bind }) => {
        
//         const Icon = getIcon(icons, hovered, icon);
//         return (
//           <Box
//             p={2}
//             position="relative"
//             cursor={getCursor(disabled, hovered)}
//             color="purple"
//             border="1px solid"
//             borderRadius="100%"
//             boxShadow={hovered ? 'card' : 'none'}
//             borderColor={hovered ? 'hsl(204,25%,85%)' : 'hsl(204,25%,90%)'}
//             transition="0.1s all ease-in-out"
//             {...bind}
//             {...rest}
//           >
//             <Icon style={{ display: 'block' }} size={20} />
//             {tooltip ? (
//               <Tooltip fade slide visible={hovered}>
//                 <Tooltip.Arrow />
//                 <Type fontSize={0}>{tooltip}</Type>
//               </Tooltip>
//             ) : null}
//           </Box>
//         );
//       }}
//     </Hover>
//   </Provider>
// );

// const ImageButton = ({ disabled, ...rest }) => (
//   <IconButton
//     icons={[ImageIcon, ImageAddIcon]}
//     tooltip={disabled ? 'Upload in Progress' : 'Add an Image'}
//     disabled={disabled}
//     {...rest}
//   />
// );
// const GifButton = ({ ...rest }) => <IconButton icon={Gif} tooltip="Add a GIF" {...rest} />;
// const LocationButton = ({ ...rest }) => <IconButton icon={LocationIcon} tooltip="Add a Location" {...rest} />;

const BottomTray = ({
  setHasImage,
  open,
  loading,
  disabled,
  handleSubmit,
  handleGifSelect,
  isSavingImages,
  currentContentCount,
  maxLength,
  ...rest
}) => {
  // const [showGify, setShowGify] = useState(false);
  return (
    <Flex alignItems="center" pt={2}>
      <Flex {...rest}>
        {/* <ImageButton */}
        {/* onClick={() => { */}
        {/*! isSavingImages && open(); */}
        {/* }} */}
        {/* disabled={isSavingImages} */}
        {/* /> */}
        {/* <GiphyModal handleOnSelect={handleGifSelect} isVisible={showGify} onDismiss={() => setShowGify(false)} /> */}
        {/* <GifButton onClick={() => setShowGify(true)} ml={2} /> */}
        {/* <LocationButton ml={2} /> */}
      </Flex>
      <Box mr="auto" />
      {currentContentCount >= maxLength * 0.9 ? (
        <Box
          color={currentContentCount === maxLength ? 'red' : 'purple'}
          opacity={currentContentCount === maxLength ? 1 : 0.5}
          fontWeight={currentContentCount === maxLength ? 'bold' : '500'}
          fontSize={1}
        >
          {currentContentCount}/240
        </Box>
      ) : null}
      <Button disabled={loading || isSavingImages || disabled} ml={2} onClick={handleSubmit}>
        {isSavingImages ? <>Uploading...</> : <>Post{loading ? 'ing...' : ''}</>}
      </Button>
    </Flex>
  );
};

export { BottomTray };
