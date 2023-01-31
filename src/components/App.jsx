import { useState, useEffect } from 'react';
import { Searchbar } from './SearchBar/SearchBar';
import { fetchImages } from './Api/fetch';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import React from 'react';

export const App = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [pageNr, setPageNr] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState('');
  const [modalAlt, setModalAlt] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    const inputForSearch = event.target.elements.inputForSearch;
    if (inputForSearch.value.trim() === '') {
      setIsLoading(false);
      return;
    }
    const response = await fetchImages(inputForSearch.value, 1);
    setImages(response);
    setIsLoading(false);
    setCurrentSearch(inputForSearch.value);
    setPageNr(2);
  };

  const handleClickMore = async () => {
    setIsLoading(true);
    const response = await fetchImages(currentSearch, pageNr);
    setImages([...images, ...response]);
    setIsLoading(false);
    setPageNr(pageNr + 1);
  };

  const handleImageClick = event => {
    setModalOpen(true);
    setModalAlt(event.target.alt);
    setModalImg(event.target.name);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalImg('');
    setModalAlt('');
  };

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        handleModalClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (pageNr > 1) window.scrollTo({ top: 900 * pageNr, behavior: 'smooth' });
  }, [pageNr]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: '16px',
        paddingBottom: '24px',
      }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <Searchbar onSubmit={handleSubmit} />
          <ImageGallery onImageClick={handleImageClick} images={images} />
          {images.length > 0 ? <Button onClick={handleClickMore} /> : null}
        </React.Fragment>
      )}
      {modalOpen ? (
        <Modal src={modalImg} alt={modalAlt} handleClose={handleModalClose} />
      ) : null}
    </div>
  );
};
