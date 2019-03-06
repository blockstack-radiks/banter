import React, { useState, useEffect } from 'react';
import { Type, Box, Flex } from 'blockstack-ui';
import { Hover } from 'react-powerplug';
import debounce from 'lodash/debounce';
import Modal from './wrapper';

const urls = {
  giphySearchUrl: 'https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC',
  giphyTrendingUrl: 'https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC',
};

const loadTrendingGifs = async () => {
  const { giphyTrendingUrl } = urls;
  const res = await fetch(giphyTrendingUrl, {
    method: 'get',
  });
  const { data } = await res.json();
  const trending = data.map((g) => g.images);
  return trending;
};

const searchGifs = async (searchValue) => {
  const { giphySearchUrl } = urls;
  if (searchValue.length < 1) {
    return [];
  }
  const urlWithQuery = `${giphySearchUrl  }&q=${  searchValue.replace(' ', '+')}`;
  const res = await fetch(urlWithQuery, {
    method: 'get',
  });
  const { data } = await res.json();
  const gifs = data.map((g) => g.images);
  return gifs;
};

const GifGrid = ({ images, query, selectGif }) => (
  <Box bg="hsl(204,25%,97%)" borderTop="1px solid hsl(204,25%,85%)" maxHeight="500px" overflow="auto">
    <Box color="purple" fontWeight="bold" p={4}>
      {query ? <>Search Results for &quot;{query}&quot;</> : <>Trending Gifs</>}
    </Box>
    <Box
      px={4}
      pb={4}
      display="grid"
      gridTemplateColumns="repeat(5, 1fr)"
      gridColumnGap="10px"
      gridRowGap="10px"
      flexWrap="wrap"
      justifyContent="space-between"
    >
      {images.map((gif) => (
        <Hover>
          {({ hovered, bind }) => (
            <Flex
              bg={hovered ? 'white' : 'hsl(204,25%,93%)'}
              boxShadow="card"
              borderRadius="4px"
              border="1px solid hsl(204,25%,85%)"
              p={2}
              m={1}
              alignItems="center"
              justifyContent="center"
              cursor={hovered ? 'pointer' : 'unset'}
              transform={hovered ? 'translateY(-5px)' : 'none'}
              transition="0.1s all ease-in-out"
              onClick={() => selectGif(gif)}
              {...bind}
            >
              <Box width="100%" maxWidth="100%" height="auto" flexShrink="0" is="img" src={gif.preview_gif.url} />
            </Flex>
          )}
        </Hover>
      ))}
    </Box>
  </Box>
);

const Content = ({ hide, handleOnSelect, visible, show, isVisible }) => {
  const [state, setState] = useState({
    trending: null,
    query: null,
    results: null,
    loading: false,
  });
  if (!visible && isVisible) {
    show();
  } else if (!isVisible && visible) {
    hide();
  }

  const selectGif = (gif) => {
    handleOnSelect(gif.original.url);
    hide();
  };

  const updateQuery = debounce((query) => {
    setState((s) => ({
      ...s,
      query,
    }));
  }, 400);

  const handleChange = (e) => {
    const query = e.target.value;
    return updateQuery(query);
  };

  useEffect(() => {
    loadTrendingGifs().then((trending) => {
      setState((s) => ({
        ...s,
        trending,
      }));
    });
  }, []);

  useEffect(() => {
    if (state.query) {
      searchGifs(state.query).then((results) => {
        setState((s) => ({
          ...s,
          results,
        }));
      });
    }
  }, [state.query]);

  const images = state.results && state.results.length ? state.results : state.trending;

  return (
    <Box width={1}>
      <Box p={4}>
        <Box>
          <Type mb={0} is="h3" color="purple">
            Add a Gif
          </Type>
        </Box>
        <Box pt={4}>
          <Box
            width="100%"
            display="block"
            is="input"
            p={4}
            onChange={handleChange}
            border="1px solid hsl(204,25%,85%)"
            placeholder="Search Giphy..."
          />
        </Box>
      </Box>

      {images ? (
        <GifGrid selectGif={selectGif} query={state.query} images={images} />
      ) : (
        <Flex width={800} height={200} alignItems="center" fontWeight="bold" color="purple" justifyContent="center">
          Loading Gifs...
        </Flex>
      )}
    </Box>
  );
};

const GiphyModal = ({ handleOnSelect, isVisible, onDismiss }) => {
  return (
    <Modal overflow="hidden" maxWidth={800} p={0} onDismiss={onDismiss}>
      {(props) => <Content {...props} handleOnSelect={handleOnSelect} isVisible={isVisible} />}
    </Modal>
  );
};

export default GiphyModal;
