import { PasswordChangeForm } from '@/components/admin/PasswordChangeForm';
import { ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-3xl text-accent-gold mb-8">Account Settings</h1>

      {/* Change Password card */}
      <div className="bg-background-secondary border border-accent-gold/10 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-5 h-5 text-accent-gold" />
          <h2 className="font-serif text-xl text-text-primary">Change Password</h2>
        </div>
        <p className="text-text-muted text-sm mb-6">
          For security, please enter your current password before setting a new one.
          Your new password must meet the requirements below.
        </p>
        <PasswordChangeForm />
      </div>
    </div>
  );
}
