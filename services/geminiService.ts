import { Book, SearchType } from '../types';

interface OpenLibraryDoc {
  title: string;
  author_name?: string[];
  cover_i?: number;
}

interface OpenLibraryResponse {
  docs: OpenLibraryDoc[];
  numFound: number;
}

interface FindBookCoversParams {
    title?: string;
    author?: string;
    isbn?: string;
    searchType: SearchType;
}

const API_BASE_URL = 'https://openlibrary.org/search.json';
const COVER_BASE_URL = 'https://covers.openlibrary.org/b/id';

export const findBookCovers = async ({ title, author, isbn, searchType }: FindBookCoversParams): Promise<Book[]> => {
  const params = new URLSearchParams({
    limit: '24', // Fetch more results initially to filter down to ones with covers
  });

  if (searchType === SearchType.TitleAuthor) {
    if (title) params.set('title', title);
    if (author) params.set('author', author);
  } else if (searchType === SearchType.ISBN) {
    if (isbn) params.set('isbn', isbn);
  }

  const url = `${API_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open Library API request failed: ${response.statusText}`);
    }
    const data: OpenLibraryResponse = await response.json();

    const books: Book[] = data.docs
      .filter(doc => doc.cover_i && doc.title && doc.author_name) // Ensure we have the essential data to display a card
      .map(doc => ({
        title: doc.title,
        authors: doc.author_name || ['Unknown Author'],
        coverImageUrl: `${COVER_BASE_URL}/${doc.cover_i}-L.jpg`,
      }))
      .slice(0, 12); // Limit to 12 results for a clean UI

    return books;

  } catch (error) {
    console.error("Error fetching from Open Library:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to find book covers: ${error.message}`);
    }
    throw new Error("An unknown error occurred while finding book covers.");
  }
};
