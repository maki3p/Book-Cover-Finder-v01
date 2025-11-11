import React, { useState } from 'react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

const ImageSpinner: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
        <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const DownloadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent other card interactions
    setIsDownloading(true);
    try {
      // Fetch the image as a blob to bypass potential CORS issues with direct download links
      const response = await fetch(book.coverImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // Sanitize the title to create a safe filename
      const filename = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cover.jpg`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Could not download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCopied) return;

    try {
      await navigator.clipboard.writeText(book.coverImageUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy URL to clipboard:', err);
      alert('Could not copy URL. Your browser might not support this feature or permissions may be denied.');
    }
  };


  return (
    <div className="group flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        {!imageLoaded && <ImageSpinner />}
        <img
          src={book.coverImageUrl}
          alt={`Cover of ${book.title}`}
          className={`object-cover w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x600.png?text=No+Cover+Found`;
          }}
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-wait transition-colors w-full justify-center sm:w-auto"
                    aria-label={`Download cover for ${book.title}`}
                >
                    {isDownloading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <DownloadIcon />
                    )}
                    <span className="text-sm font-medium">{isDownloading ? 'Downloading...' : 'Download'}</span>
                </button>
                 <button
                    onClick={handleCopyUrl}
                    disabled={isCopied}
                    className={`flex items-center gap-2 text-white px-4 py-2 rounded-full transition-colors w-full justify-center sm:w-auto ${
                        isCopied
                            ? 'bg-green-600 cursor-default'
                            : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Copy image URL for ${book.title}`}
                >
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                    <span className="text-sm font-medium">{isCopied ? 'Copied!' : 'Copy URL'}</span>
                </button>
            </div>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-bold text-white truncate group-hover:text-indigo-400 transition-colors" title={book.title}>{book.title}</h3>
        <p className="text-sm text-gray-400 mt-1 truncate" title={book.authors.join(', ')}>{book.authors.join(', ')}</p>
      </div>
    </div>
  );
};

export default BookCard;