import { useEffect, useRef, useState } from 'react';
import './index.css';
import axios from 'axios';

const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 20;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const query = searchInput.current.value;
    if (query) {
      fetchImages(query);
    }
  }, [page]);

  const fetchImages = async (query) => {
    try {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return;
      const result = await axios.get(
        `${API_URL}?query=${trimmedQuery}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`
      );
      setImages(result.data.results);
      setTotalPages(result.data.total_pages);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = searchInput.current.value;
    setPage(1); // Reset page to 1 for a new search
    fetchImages(query);
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    setPage(1); // Reset page to 1 for a new search
    fetchImages(selection);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className='main-container'>
      <div className='container'>
        <h1>Image Search</h1>
        <form className='search-section' onSubmit={handleSubmit}>
          <input 
            type='text' 
            placeholder='Type something to search' 
            className='input-search'
            ref={searchInput}
          />
          <button type='submit' className='search-button'>Search</button>
        </form>
        <div className='btn-group'>
          <button onClick={() => handleSelection('nature')} className='btn'>Nature</button>
          <button onClick={() => handleSelection('birds')} className='btn'>Birds</button>
          <button onClick={() => handleSelection('cats')} className='btn'>Cats</button>
          <button onClick={() => handleSelection('shoes')} className='btn'>Shoes</button>
        </div>
      </div>

      <div className='images'>
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small} 
            alt={image.alt_description}
            className='image'
          />
        ))}
      </div>

      <div className='buttons'>
        {page > 1 && (
          <button onClick={handlePreviousPage} className='pagination-button'>Previous</button>
        )}
        {page < totalPages && (
          <button onClick={handleNextPage} className='pagination-button'>Next</button>
        )}
      </div>
    </div>
  );
}

export default App;
