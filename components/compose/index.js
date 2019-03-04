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
import StylesWrapper from './styled';
import Message from '../../models/Message';
import { Button } from '../button';
import { useOnClickOutside } from '../../common/hooks';
import { theme } from '../../common/theme';
import { Provider, Tooltip } from 'reakit';
import reakitTheme from 'reakit-theme-default';
import Dropzone from 'react-dropzone';

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

const BottomTray = ({ setHasImage, open, loading, disabled, handleSubmit, ...rest }) => (
  <Flex alignItems="center" pt={2}>
    <Flex {...rest}>
      <ImageButton
        onClick={() => {
          open();
        }}
      />
      <GifButton ml={2} />
      <LocationButton ml={2} />
    </Flex>
    <Box mr="auto" />
    <Button disabled={loading || disabled} ml={2} onClick={handleSubmit}>
      Post{loading ? 'ing...' : ''}
    </Button>
  </Flex>
);

const Compose = ({ pluginProps, ...rest }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [focused, setFocused] = useState(true);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleClearFile = () => {
    setPreview(null);
    setFile(null);
  };

  const fetchUsernames = async () => {
    const response = await fetch('/api/usernames');
    const usernames = await response.json();
    allUsernames = usernames.map((username) => ({
      name: username,
      link: `/[::]${username}`,
      avatar: `/api/avatar/${username}`,
    }));
    setSuggestions(allUsernames);
  };

  useEffect(() => {
    fetchUsernames();
  }, []);

  const editor = useRef(null);
  const editorWrapper = useRef(null);

  const onChange = (state) => {
    setEditorState(state);
  };

  const onSearchChange = ({ value }) => {
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

  const onDrop = async (acceptedFiles, rejectedFiles) => {
    const fileReader = new FileReader();

    fileReader.addEventListener(
      'load',
      () => {
        setPreview(fileReader.result);
      },
      false
    );

    await Promise.all(
      acceptedFiles.map(async (file) => {
        fileReader.readAsDataURL(file);
        return {
          ...file,
        };
      })
    );

    setFile(acceptedFiles[0]);
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
                          suggestions={suggestions}
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
                {file ? (
                  <Box p={3} border="1px solid" borderTop="0" borderColor={'hsl(204,25%,90%)'} bg="hsl(204,25%,97%)">
                    <Flex
                      alignItems="center"
                      key={file.name}
                      borderRadius="3px"
                      size={100}
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
                              onClick={handleClearFile}
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
                  </Box>
                ) : null}
              </Box>
            </Flex>

            {focused || hasContent ? (
              <BottomTray
                open={() => dropzoneRef.current.open()}
                disabled={disabled}
                handleSubmit={handleSubmit}
                loading={loading}
              />
            ) : null}
          </Box>
        </div>
      )}
    </Dropzone>
  );
};

export default Compose;
