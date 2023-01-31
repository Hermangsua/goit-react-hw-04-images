import axios from 'axios';

axios.defaults.baseURL = `https://pixabay.com/api`;

export const fetchImages = async (inputValue, pageNr) => {
  const response = await axios.get(
    `/?q=${inputValue}&page=${pageNr}&key=32404222-937c1bf72b6be116ae047f8a7&image_type=photo&orientation=horizontal&per_page=12`
  );
  return response.data.hits.map(image => {
    return {
      id: image.id,
      webformatURL: image.webformatURL,
      largeImageURL: image.largeImageURL,
      tags: image.tags,
    };
  });
};
