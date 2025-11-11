import React from 'react';
import { SearchType } from '../types';

interface SearchBarProps {
  title: string;
  setTitle: (title: string) => void;
  author: string;
  setAuthor: (author: string) => void;
  isbn: string;
  setIsbn: (isbn: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const LoadingSpinnerIcon = () => (
    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const SearchBar: React.FC<SearchBarProps> = ({
  title,
  setTitle,
  author,
  setAuthor,
  isbn,
  setIsbn,
  searchType,
  setSearchType,
  onSearch,
  isLoading,
}) => {

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      onSearch();
    }
  };

  const isSearchDisabled = isLoading || (searchType === SearchType.TitleAuthor && !title.trim()) || (searchType === SearchType.ISBN && !isbn.trim());

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-lg">
        <div className="flex items-center border-b border-gray-700 pb-3 mb-4">
          <h2 className="text-sm font-medium text-gray-400 mr-4">Search by:</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchType(SearchType.TitleAuthor)}
              className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                searchType === SearchType.TitleAuthor ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Title / Author
            </button>
            <button
              onClick={() => setSearchType(SearchType.ISBN)}
              className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                searchType === SearchType.ISBN ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ISBN
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-grow">
            {searchType === SearchType.TitleAuthor ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Book Title (e.g., The Hobbit)"
                  className="w-full flex-grow bg-gray-900/50 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-3 transition-colors"
                  disabled={isLoading}
                  aria-label="Book Title"
                />
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Author (optional)"
                  className="w-full sm:w-2/5 bg-gray-900/50 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-3 transition-colors"
                  disabled={isLoading}
                  aria-label="Author"
                />
              </div>
            ) : (
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ISBN (e.g., 9780345391803)"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-4 py-3 transition-colors"
                disabled={isLoading}
                aria-label="ISBN"
              />
            )}
          </div>
          <button
            onClick={onSearch}
            disabled={isSearchDisabled}
            className="flex-shrink-0 flex items-center justify-center bg-indigo-600 text-white rounded-md w-12 h-12 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Search"
          >
            {isLoading ? <LoadingSpinnerIcon /> : <SearchIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
