export interface Book {
  title: string;
  authors: string[];
  coverImageUrl: string;
  firstPublishYear?: number;
  subjects: string[];
}

export enum SearchType {
  TitleAuthor = 'title_author',
  Author = 'author',
  ISBN = 'isbn',
  Subject = 'subject',
}