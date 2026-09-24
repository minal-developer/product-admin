import { redirect } from 'next/navigation';

export default function Home() {
  // Automatically redirect users visiting http://localhost:3000 to /login or /products
  redirect('/login');
}