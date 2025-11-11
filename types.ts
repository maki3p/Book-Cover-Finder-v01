export interface Book {
  title: string;
  authors: string[];
  coverImageUrl: string;
}

export enum SearchType {
  TitleAuthor = 'title_author',
  ISBN = 'isbn',
}
