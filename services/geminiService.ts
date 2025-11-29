import { Book, SearchType } from '../types';
import { GoogleGenAI } from "@google/genai";

interface OpenLibraryDoc {
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
}

interface OpenLibraryResponse {
  docs: OpenLibraryDoc[];
  numFound: number;
}

interface FindBookCoversParams {
    title?: string;
    author?: string;
    isbn?: string;
    subject?: string;
    searchType: SearchType;
}

const API_BASE_URL = 'https://openlibrary.org/search.json';
const COVER_BASE_URL = 'https://covers.openlibrary.org/b/id';

export const findBookCovers = async ({ title, author, isbn, subject, searchType }: FindBookCoversParams): Promise<Book[]> => {
  const params = new URLSearchParams({
    limit: '24', // Fetch more results initially to filter down to ones with covers
  });

  if (searchType === SearchType.TitleAuthor) {
    if (title) params.set('title', title);
    if (author) params.set('author', author);
  } else if (searchType === SearchType.Author) {
    if (author) params.set('author', author);
  } else if (searchType === SearchType.ISBN) {
    if (isbn) params.set('isbn', isbn);
  } else if (searchType === SearchType.Subject) {
    if (subject) params.set('subject', subject);
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
        firstPublishYear: doc.first_publish_year,
        subjects: doc.subject ? doc.subject.slice(0, 40) : [], // Fetch more subjects for the details popup
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

export const getBookPlot = async (title: string, author: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a compelling and concise plot summary (max 120 words) for the book "${title}" by ${author}. Do not include major spoilers.`,
    });
    return response.text || "No plot summary available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not retrieve plot summary at this time. Please try again later.";
  }
};