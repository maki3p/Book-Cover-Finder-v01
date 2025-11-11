import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { findBookCovers } from './services/geminiService';
import { Book, SearchType } from './types';

const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [searchType, setSearchType] = useState<SearchType>(SearchType.TitleAuthor);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (searchType === SearchType.TitleAuthor && !title.trim()) {
      setError("Please enter a title to search.");
      return;
    }
    if (searchType === SearchType.ISBN && !isbn.trim()) {
      setError("Please enter an ISBN to search.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setBooks([]);

    try {
      const results = await findBookCovers({ title, author, isbn, searchType });
      setBooks(results);
      if (results.length === 0) {
        setError("No books found for your query. Try a different search.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [title, author, isbn, searchType]);
  
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error && !books.length) {
      return <ErrorMessage message={error} />;
    }

    if (hasSearched && books.length === 0 && !error) {
      // This state is now handled inside the search logic by setting an error message
      return null;
    }
    
    if (books.length > 0) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {books.map((book, index) => (
            <BookCard key={`${book.title}-${index}`} book={book} />
          ))}
        </div>
      );
    }

    if (!hasSearched) {
        return (
            <div className="text-center py-20">
                <p className="text-xl text-gray-400">Ready to find some books?</p>
                <p className="text-gray-500">Use the search bar above to find books by title/author or ISBN.</p>
            </div>
        );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header />
        <div className="mt-8 mb-12">
          <SearchBar
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            isbn={isbn}
            setIsbn={setIsbn}
            searchType={searchType}
            setSearchType={setSearchType}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
