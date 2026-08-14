export interface Destination {
  address: string;
  start_date: number;
  end_date: number;
  nickname: string;
  show_navigation: boolean;
}

export interface Order {
  _id: string;
  status: number;
  order_number: string;
  manager: string;
  driver: string;
  version: string;
  type: string;
  destinations: Destination[];
  start_date: number;
  end_date: number;
  is_today: boolean;
  status_string: string;
  status_class: string;
  driver_thumbnail: string | null;
}