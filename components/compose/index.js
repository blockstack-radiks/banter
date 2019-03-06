import React, { useRef, useEffect, useState } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Hover } from 'react-powerplug';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import { Box, Flex, Type } from 'blockstack-ui';
import CloseIcon from 'mdi-react/CloseIcon';
import { useConnect } from 'redux-bundler-hook';
import NProgress from 'nprogress';
import { rgba } from 'polished';
import { getConfig } from 'radiks';
import { Provider, Tooltip } from 'reakit';
import reakitTheme from 'reakit-theme-default';
import Dropzone from 'react-dropzone';
import StylesWrapper from './styled';
import Message from '../../models/Message';
import { BottomTray } from './bottom-tray';

import { useOnClickOutside } from '../../common/hooks';
import { theme } from '../../common/theme';
import { uploadPhoto } from '../../common/lib/api';

import InviteUserModal from '../modal/invite-user';
// import GiphyModal from '../modal/giphy';

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

const EmojiButton = () => (
  <Hover>
    {({ hovered, bind }) => (
      <Box opacity={hovered ? 1 : 0.5} {...bind}>
        <EmojiSelect />
      </Box>
    )}
  </Hover>
);

const FilePreview = ({ preview, index, handleClearFiles }) => (
  <Flex
    alignItems="center"
    borderRadius="3px"
    size={100}
    key={index}
    bg="hsl(204,25%,94%)"
    position="relative"
    border="1px solid hsl(204,25%,85%)"
    mr={2}
    overflow="hidden"
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

const FilePreviews = ({ images, gifUrl, handleClearFiles }) => {
  if (Object.keys(images).length === 0 && !gifUrl) {
    return null;
  }
  const _previews = Object.keys(images).map((index) => (
    <FilePreview
      preview={images[index].preview}
      index={index}
      handleClearFiles={() => handleClearFiles(index)}
      key={index}
    />
  ));
  return (
    <Flex flexWrap="wrap" p={3} border="1px solid" borderTop="0" borderColor="hsl(204,25%,90%)" bg="hsl(204,25%,97%)">
      {_previews}
      {gifUrl && <FilePreview preview={gifUrl} handleClearFiles={() => handleClearFiles('gif')} />}
    </Flex>
  );
};

const Compose = ({ pluginProps, ...rest }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gifUrl, setGifUrl] = useState(null);
  const [images, setImages] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');
  const [blockstackProfiles, setBlockstackProfiles] = useState([]);
  const [isSavingImages, setIsSavingImages] = useState(false);

  const handleClearFiles = (key) => {
    if (key === 'gif') {
      setGifUrl(null);
      return;
    }
    const _images = { ...images };
    delete _images[key];
    setImages(_images);
  };

  const maxLength = 240;

  const fetchUsernames = async () => {
    const response = await fetch('/api/usernames');
    const usernames = await response.json();
    allUsernames = usernames.map((username) => ({
      id: username,
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
        id: user.fullyQualifiedName,
        name: user.fullyQualifiedName,
        link: `/[::]${user.fullyQualifiedName}`,
        avatar: generateImageUrl(user.fullyQualifiedName, 80),
      }))
    );
  };

  useEffect(() => {
    fetchBlockstackAccounts();
  }, [query]);

  const editor = useRef(null);
  const editorWrapper = useRef(null);

  const currentContent = editorState.getCurrentContent().getPlainText('');
  const currentContentCount = editorState.getCurrentContent().getPlainText('').length;

  const onChange = (state) => {
    const newContentText = state.getCurrentContent().getPlainText('');
    const newContentTextCount = newContentText.length;
    const newContentIsTooLong = newContentTextCount > maxLength;
    if (newContentIsTooLong) {
      const truncatedTextContent = newContentText.substring(0, maxLength);
      const truncatedEditorState = EditorState.createWithContent(ContentState.createFromText(truncatedTextContent));
      setEditorState(truncatedEditorState);
    } else {
      setEditorState(state);
    }
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

  const hasContent = gifUrl || Object.keys(images).length || currentContent !== '';

  const disabled = !user || !hasContent;

  useOnClickOutside(editorWrapper, () => setFocused(false));

  const handleSubmit = async (e) => {
    const content = editorState.getCurrentContent().getPlainText('');
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!hasContent) {
      return null;
    }
    NProgress.start();
    setLoading(true);
    let imageUrls = Object.keys(images).map((key) => {
      const { url, dimensions } = images[key];
      if (!url) {
        return false;
      }
      return {
        url,
        dimensions,
      };
    });
    imageUrls = imageUrls.filter(Boolean); // aka 'compact'
    if (gifUrl) {
      imageUrls.push({
        url: gifUrl,
      });
    }
    const message = new Message({
      content,
      votes: [],
      createdBy: user._id,
    });
    if (imageUrls.length > 0) {
      message.update({
        imageUrls,
      });
    }
    try {
      await message.save();
      setEditorState(EditorState.createEmpty());
      setImages({});
      setGifUrl(null);
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

    const imageKeys = Object.keys(images);
    const lastIndex = imageKeys[imageKeys.length - 1] || 0;

    setIsSavingImages(true);
    NProgress.start();

    const uploadImages = acceptedFiles.map((file, index) => {
      return new Promise(async (resolve) => {
        try {
          const imgixUrl = await uploadImage(file);
          setImages((_images) => {
            if (_images[lastIndex + index]) {
              return {
                ..._images,
                [lastIndex + index]: {
                  ..._images[lastIndex + index],
                  url: imgixUrl,
                },
              };
            }
            return _images;
          });
          resolve(imgixUrl);
        } catch (error) {
          console.error(error);
          resolve(null);
        }
      });
    });

    const getPreviews = acceptedFiles.map(async (file, index) => {
      return new Promise(async (resolve) => {
        try {
          const fileReader = new FileReader();
          fileReader.addEventListener('load', async () => {
            const image = new Image();
            image.src = fileReader.result;

            image.onload = function getSize() {
              const { height, width } = this;

              setImages((_images) => ({
                ..._images,
                [lastIndex + index]: {
                  ..._images[lastIndex + index],
                  preview: fileReader.result,
                  dimensions: {
                    width,
                    height,
                  },
                },
              }));
              resolve(true);
            };
          });
          fileReader.readAsDataURL(file);
        } catch (error) {
          console.error(error);
          resolve(null);
        }
      });
    });

    await Promise.all(getPreviews);
    await Promise.all(uploadImages);

    setIsSavingImages(false);
    NProgress.done();
  };

  const getUniqueSuggestions = () => {
    const flags = {};
    let allSuggestions = suggestions.concat(blockstackProfiles);
    allSuggestions = allSuggestions.filter((suggestion) => {
      if (flags[suggestion.name]) {
        return false;
      }
      flags[suggestion.name] = true;
      return true;
    });
    return allSuggestions;
  };

  return (
    <Dropzone disabled accept="image/*" ref={dropzoneRef} onDrop={onDrop}>
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
            <div style={{ width: '100%', flexGrow: 1 }} ref={editorWrapper}>
              <Flex justifyContent="space-between">
                <Box position="relative" is="form" flexGrow={1} onSubmit={handleSubmit}>
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
                          suggestions={getUniqueSuggestions()}
                          onAddMention={onAddMention}
                        />
                        <EmojiSuggestions />
                      </div>
                    </Box>
                    <Flex position="absolute" top="2px" zIndex={999} right="8px">
                      <EmojiButton />
                    </Flex>
                    <input {...getInputProps()} />
                  </StylesWrapper>
                  <FilePreviews images={images} gifUrl={gifUrl} handleClearFiles={handleClearFiles} />
                </Box>
              </Flex>

              {focused || hasContent ? (
                <BottomTray
                  open={() => dropzoneRef.current.open()}
                  disabled={disabled}
                  handleSubmit={handleSubmit}
                  loading={loading}
                  isSavingImages={isSavingImages}
                  handleGifSelect={(url) => setGifUrl(url)}
                  currentContentCount={currentContentCount}
                  maxLength={maxLength}
                />
              ) : null}
            </div>
          </Box>
        </div>
      )}
    </Dropzone>
  );
};

export default Compose;
