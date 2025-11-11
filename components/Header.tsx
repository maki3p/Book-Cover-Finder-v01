import React from 'react';

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const Header: React.FC = () => {
  return (
    <header className="py-6 text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
            <BookIcon />
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Book Cover Finder
            </h1>
        </div>
        <p className="text-lg text-gray-400">Discover book covers from the Open Library</p>
    </header>
  );
};

export default Header;
