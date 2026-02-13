export type CollectionType = 'trips' | 'events' | 'todos' | 'wishlist';

export type BaseDoc = {
  id: string;
  participants: string[];
  memo: string;
  createdAt: string;
};

export type Trip = BaseDoc & {
  fromDate: string;
  toDate: string;
  location: string;
};

export type Event = BaseDoc & {
  date: string;
  fromTime: string;
  toTime?: string;
  location: string;
};

export type Todo = BaseDoc & {
  date: string;
  location: string;
  completed: boolean;
};

export type Wishlist = BaseDoc & {
  completed: boolean;
};

export type ItemRecord = Trip | Event | Todo | Wishlist;
