import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to stores dashboard
  // Middleware will handle authentication and redirect to /login if needed
  redirect('/stores');
}
