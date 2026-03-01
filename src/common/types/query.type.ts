export type Query = {
  searchString: string;
  page?: number;
};

// Navigation action types
export type NavigationAction = `action:${string}`;
export type PaginationAction = 
  | 'action:prev-page' 
  | 'action:next-page' 
  | 'action:new-search'
  | 'action:show-all';

export type SoundSelection = `${string}||${string}`;
