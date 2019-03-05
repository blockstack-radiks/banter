import React, { useRef, useEffect, useState } from 'react';
import { EditorState } from 'draft-js';
import { Hover } from 'react-powerplug';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import { Box, Flex, Type } from 'blockstack-ui';
import LocationIcon from 'mdi-react/LocationIcon';
import ImageIcon from 'mdi-react/ImageOutlineIcon';
import ImageAddIcon from 'mdi-react/ImageAddIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { Gif } from 'styled-icons/material/Gif';
import { useConnect } from 'redux-bundler-hook';
import NProgress from 'nprogress';
import { rgba } from 'polished';
import { getConfig } from 'radiks';
import { Provider, Tooltip } from 'reakit';
import reakitTheme from 'reakit-theme-default';
import Dropzone from 'react-dropzone';
import StylesWrapper from './styled';
import Message from '../../models/Message';
import { Button } from '../button';
import { useOnClickOutside } from '../../common/hooks';
import { theme } from '../../common/theme';
import { uploadPhoto } from '../../common/lib/api';

import InviteUserModal from '../modal/invite-user';
import GiphyModal from '../modal/giphy';

import { generateImageUrl } from '../../common/utils';

const dropzoneRef = React.createRef();

const mentionPlugin = createMentionPlugin({
  mentionPrefix: '@',
});
const emojiPlugin = createEmojiPlugin();
const { MentionSuggestions } = mentionPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [mentionPlugin, emojiPlugin];

let allUsernames = [];

const IconButton = ({ tooltip, icons, icon, ...rest }) => (
  <Provider theme={reakitTheme}>
    <Hover>
      {({ hovered, bind }) => {
        const Icon = icons && icons.length ? (hovered ? icons[1] : icons[0]) : icon;
        return (
          <Box
            p={2}
            position="relative"
            cursor={hovered ? 'pointer' : 'unset'}
            color="purple"
            border="1px solid"
            borderRadius="100%"
            boxShadow={hovered ? 'card' : 'none'}
            borderColor={hovered ? 'hsl(204,25%,85%)' : 'hsl(204,25%,90%)'}
            transition="0.1s all ease-in-out"
            {...bind}
            {...rest}
          >
            <Icon style={{ display: 'block' }} size={20} />
            {tooltip ? (
              <Tooltip fade slide visible={hovered}>
                <Tooltip.Arrow />
                <Type fontSize={0}>{tooltip}</Type>
              </Tooltip>
            ) : null}
          </Box>
        );
      }}
    </Hover>
  </Provider>
);

const ImageButton = ({ ...rest }) => <IconButton icons={[ImageIcon, ImageAddIcon]} tooltip="Add an Image" {...rest} />;
const GifButton = ({ ...rest }) => <IconButton icon={Gif} tooltip="Add a GIF" {...rest} />;
const LocationButton = ({ ...rest }) => <IconButton icon={LocationIcon} tooltip="Add a Location" {...rest} />;

const EmojiButton = () => (
  <Hover>
    {({ hovered, bind }) => (
      <Box opacity={hovered ? 1 : 0.5} {...bind}>
        <EmojiSelect />
      </Box>
    )}
  </Hover>
);

const BottomTray = ({ setHasImage, open, loading, disabled, handleSubmit, handleGifSelect, ...rest }) => {
  const [showGify, setShowGify] = useState(false);
  return (
    <Flex alignItems="center" pt={2}>
      <Flex {...rest}>
        <ImageButton
          onClick={() => {
            open();
          }}
        />
        <GiphyModal handleOnSelect={handleGifSelect} isVisible={showGify} onDismiss={() => setShowGify(false)} />
        <GifButton onClick={() => setShowGify(true)} ml={2} />
        <LocationButton ml={2} />
      </Flex>
      <Box mr="auto" />
      <Button disabled={loading || disabled} ml={2} onClick={handleSubmit}>
        Post{loading ? 'ing...' : ''}
      </Button>
    </Flex>
  );
};

const FilePreview = ({ file, preview, handleClearFiles }) => (
  <Flex
    alignItems="center"
    borderRadius="3px"
    size={100}
    key={file.name}
    bg="hsl(204,25%,94%)"
    position="relative"
    border="1px solid hsl(204,25%,85%)"
  >
    <Hover>
      {({ hovered, bind }) => (
        <Provider theme={reakitTheme}>
          <Flex
            ml="auto"
            color="white"
            size={24}
            alignItems="center"
            justifyContent="center"
            position="absolute"
            top="4px"
            right="4px"
            zIndex={99}
            borderRadius="100%"
            bg="purple"
            cursor={hovered ? 'pointer' : 'unset'}
            onClick={handleClearFiles}
            {...bind}
          >
            <Box position="relative">
              <CloseIcon size={20} />
              <Tooltip fade slide visible={hovered}>
                <Tooltip.Arrow />
                <Type fontSize={0}>Remove</Type>
              </Tooltip>
            </Box>
          </Flex>
        </Provider>
      )}
    </Hover>
    {preview && (
      <Box
        position="absolute"
        width="100%"
        display="block"
        maxWidth="100%"
        left={0}
        is="img"
        src={preview}
        style={{ objectFit: 'cover' }}
      />
    )}
  </Flex>
);

const FilePreviews = ({ files, previews, handleClearFiles }) => {
  if (files.length === 0) {
    return null;
  }
  const _previews = files.map((file, index) => <FilePreview file={file} preview={previews[index]} handleClearFiles={handleClearFiles} /> );
  return (
    <Box p={3} border="1px solid" borderTop="0" borderColor="hsl(204,25%,90%)" bg="hsl(204,25%,97%)">
      {_previews}
    </Box>
  );
};

const Compose = ({ pluginProps, ...rest }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [focused, setFocused] = useState(true);
  const [loading, setLoading] = useState(false);
  const [gifUrl, setGifUrl] = useState(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');
  const [blockstackProfiles, setBlockstackProfiles] = useState([]);

  const handleClearFiles = () => {
    setPreviews([]);
    setFiles([]);
  };

  const fetchUsernames = async () => {
    const response = await fetch('/api/usernames');
    const usernames = await response.json();
    allUsernames = usernames.map((username) => ({
      name: username,
      link: `/[::]${username}`,
      avatar: generateImageUrl(username, 80),
    }));
    setSuggestions(allUsernames);
  };

  useEffect(() => {
    fetchUsernames();
  }, []);

  const fetchBlockstackAccounts = async () => {
    const url = `https://core.blockstack.org/v1/search?query=${query}`;
    const response = await fetch(url);
    const { results } = await response.json();
    if (!results) return;
    setBlockstackProfiles(
      results.map((user) => ({
        name: user.fullyQualifiedName,
        link: `/[::]${user.fullyQualifiedName}`,
        avatar: `https://banter-pub.imgix.net/banana.png`,
      }))
    );
  };

  useEffect(() => {
    setBlockstackProfiles([]);
    fetchBlockstackAccounts();
  }, [query]);

  const editor = useRef(null);
  const editorWrapper = useRef(null);

  const onChange = (state) => {
    setEditorState(state);
  };

  const onSearchChange = ({ value }) => {
    setQuery(value);
    setSuggestions(defaultSuggestionsFilter(value, allUsernames));
  };

  const onAddMention = () => {
    // get the mention object selected
  };

  const focus = () => {
    setFocused(true);
    editor.current.focus();
  };

  const { user } = useConnect('selectUser');

  const currentContent = editorState.getCurrentContent().getPlainText();

  // const hasContent = currentContent !== '';
  const hasContent = true;
  const disabled = !user || currentContent === '';

  useOnClickOutside(editorWrapper, () => setFocused(false));

  const handleSubmit = async (e) => {
    const content = editorState.getCurrentContent().getPlainText();
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (content === '') {
      return null;
    }
    NProgress.start();
    setLoading(true);
    const message = new Message({
      content,
      votes: [],
      createdBy: user._id,
    });
    try {
      await message.save();
      setEditorState(EditorState.createEmpty());
      NProgress.done();
      setLoading(false);
      setFocused(false);
    } catch (error) {
      console.log(error);
      NProgress.done();
      setLoading(false);
      setFocused(false);
    }
    return true;
  };

  const onDrop = async (acceptedFiles) => {
    const { userSession } = getConfig();

    const uploadImage = async (photo) => {
      const now = new Date().getTime();
      const name = `photos/${userSession.loadUserData().username}/${now}-${photo.name}`;
      const url = await userSession.putFile(name, photo, { encrypt: false, contentType: photo.type });
      const imgixUrl = await uploadPhoto(url, name);
      return imgixUrl;
    };

    const uploadImages = acceptedFiles.map((file) => {
      return new Promise(async (resolve) => {
        try {
          const imgixUrl = await uploadImage(file);
          resolve(imgixUrl);
        } catch (error) {
          console.error(error);
          resolve(null);
        }
      });
    });

    const getPreviews = acceptedFiles.map((file) => {
      return new Promise(async (resolve) => {
        try {
          const fileReader = new FileReader();
          fileReader.addEventListener('load', () => resolve(fileReader.result));
          fileReader.readAsDataURL(file);
        } catch (error) {
          console.error(error);
          resolve(null);
        }
      });
    });

    const _previews = await Promise.all(getPreviews);
    setPreviews(_previews);
    setFiles(acceptedFiles);

    const imgixUrls = await Promise.all(uploadImages);
    console.log(imgixUrls);
  };

  return (
    <Dropzone accept="image/*" ref={dropzoneRef} onDrop={onDrop}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps({
            onClick: (evt) => evt.preventDefault(),
            style: {
              outline: 'none',
            },
          })}
        >
          <InviteUserModal />

          <Box p={4} position="relative" {...rest}>
            <Flex
              style={{ pointerEvents: 'none' }}
              transition="0.1s all ease-in-out"
              position="absolute"
              opacity={isDragActive ? 1 : 0}
              width="100%"
              height="100%"
              left={0}
              top={0}
              bg="white"
              zIndex={999}
              p={4}
            >
              <Flex border="5px dashed hsl(204,25%,90%)" flexGrow={1} alignItems="center" justifyContent="center">
                <Type fontWeight="bold" color="purple">
                  Drag your image here.
                </Type>
              </Flex>
            </Flex>
            <Flex justifyContent="space-between">
              <Box position="relative" is="form" flexGrow={1} onSubmit={handleSubmit}>
                <div style={{ width: '100%', flexGrow: 1 }} ref={editorWrapper}>
                  <StylesWrapper>
                    <Box
                      p={3}
                      position="relative"
                      zIndex={99}
                      border="1px solid"
                      borderColor={focused ? 'pink' : 'hsl(204,25%,90%)'}
                      boxShadow={focused ? `${rgba(theme.colors.pink, 0.14)} 0px 0px 0px 4px` : 'none'}
                      transition="0.1s all ease-in-out"
                      onClick={focus}
                    >
                      <div
                        className="editor" // eslint-disable-line
                      >
                        <Editor
                          placeholder="What's on your mind?"
                          editorState={editorState}
                          onChange={onChange}
                          plugins={plugins}
                          ref={editor}
                        />
                        <MentionSuggestions
                          onSearchChange={onSearchChange}
                          suggestions={suggestions.concat(blockstackProfiles)}
                          onAddMention={onAddMention}
                        />
                        <EmojiSuggestions />
                      </div>
                    </Box>
                    <Flex position="absolute" top="2px" right="8px">
                      <EmojiButton />
                    </Flex>
                    <input {...getInputProps()} />
                  </StylesWrapper>
                </div>
                <FilePreviews files={files} previews={previews} handleClearFiles={handleClearFiles} />
              </Box>
            </Flex>

            {focused || hasContent ? (
              <BottomTray
                open={() => dropzoneRef.current.open()}
                disabled={disabled}
                handleSubmit={handleSubmit}
                loading={loading}
                handleGifSelect={(url) => setGifUrl(url)}
              />
            ) : null}
          </Box>
        </div>
      )}
    </Dropzone>
  );
};

export default Compose;
