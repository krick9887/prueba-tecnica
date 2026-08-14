export interface Order {
  id: string | number;
  name?: string;
  customerName?: string;
  description?: string;
  price?: number;
  total?: number;
  status?: string;
  date?: string;
  image?: string; 
  [key: string]: any;
}