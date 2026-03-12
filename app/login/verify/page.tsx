import { redirect } from 'next/navigation';

// OTP verification is no longer used — redirect to login
export default function VerifyPage() {
  redirect('/login');
}
