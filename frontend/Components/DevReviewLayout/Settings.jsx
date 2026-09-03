"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Loader2, Shield, Sliders } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { changePassword, updateProfile } from "@/services/authApis";

const tabs = [
  { id: "profile", label: "Profile Settings", icon: Sliders },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export default function Settings() {
  const { user, fetchUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState({ username: "", portfolioUrl: "" });
  const [preferences, setPreferences] = useState({ reviewAlerts: true, weeklyDigest: true });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    if (!user) return;
    setProfile({ username: user.username || "", portfolioUrl: user.portfolioUrl || "" });
    setPreferences({
      reviewAlerts: user.notificationPreferences?.reviewAlerts ?? true,
      weeklyDigest: user.notificationPreferences?.weeklyDigest ?? true,
    });
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const saveProfile = async () => {
    setSaving(true);
    const res = await updateProfile({ username: profile.username.trim(), portfolioUrl: profile.portfolioUrl.trim() });
    if (res?.success) { await fetchUser(); showMessage("success", "Profile settings saved."); }
    else showMessage("error", res?.message || "Could not save profile settings.");
    setSaving(false);
  };

  const savePreferences = async () => {
    setSaving(true);
    const res = await updateProfile({ notificationPreferences: preferences });
    if (res?.success) { await fetchUser(); showMessage("success", "Notification preferences saved."); }
    else showMessage("error", res?.message || "Could not save notification preferences.");
    setSaving(false);
  };

  const savePassword = async () => {
    if (passwords.newPassword.length < 6) return showMessage("error", "New password must be at least 6 characters.");
    if (passwords.newPassword !== passwords.confirmPassword) return showMessage("error", "New passwords do not match.");
    setSaving(true);
    const res = await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
    if (res?.success) {
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showMessage("success", "Password updated successfully.");
    } else showMessage("error", res?.message || "Could not update password.");
    setSaving(false);
  };

  if (loading || !user) {
    return <SettingsSkeleton />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 sm:p-8 bg-page min-h-screen text-ink">
      <div className="mb-8"><h1 className="text-3xl font-bold tracking-tight">Settings</h1><p className="text-muted">Manage your profile, notifications, and account security.</p></div>
      <div className="bg-surface border border-line rounded-2xl max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-4">
        <nav className="border-r border-line p-4 space-y-1 bg-page/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setMessage(null); }} className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg flex items-center gap-2 transition-all ${activeTab === tab.id ? "bg-surface text-accent border border-line shadow-sm" : "text-muted hover:text-ink"}`}><Icon className="w-4 h-4" />{tab.label}</button>;
          })}
        </nav>

        <div className="p-6 md:col-span-3 space-y-6">
          {activeTab === "profile" && <>
            <h2 className="font-bold text-lg pb-3 border-b border-line">Public Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Developer Handle<input value={profile.username} onChange={(e) => setProfile((value) => ({ ...value, username: e.target.value }))} className="mt-2 w-full bg-page border border-line px-3 py-2.5 rounded-lg text-sm text-ink normal-case font-normal focus:outline-none focus:border-accent" /></label>
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Portfolio URL<input value={profile.portfolioUrl} onChange={(e) => setProfile((value) => ({ ...value, portfolioUrl: e.target.value }))} placeholder="https://yourportfolio.dev" className="mt-2 w-full bg-page border border-line px-3 py-2.5 rounded-lg text-sm text-ink normal-case font-normal focus:outline-none focus:border-accent" /></label>
            </div>
            <SaveButton saving={saving} onClick={saveProfile} label="Save Profile" />
          </>}

          {activeTab === "notifications" && <>
            <h2 className="font-bold text-lg pb-3 border-b border-line">Notification Preferences</h2>
            <PreferenceToggle title="Review alerts" description="Show notifications when someone reviews one of your projects." checked={preferences.reviewAlerts} onChange={(checked) => setPreferences((value) => ({ ...value, reviewAlerts: checked }))} />
            <PreferenceToggle title="Weekly digest" description="Receive a weekly summary of relevant community activity." checked={preferences.weeklyDigest} onChange={(checked) => setPreferences((value) => ({ ...value, weeklyDigest: checked }))} />
            <SaveButton saving={saving} onClick={savePreferences} label="Save Preferences" />
          </>}

          {activeTab === "security" && <>
            <h2 className="font-bold text-lg pb-3 border-b border-line">Account Security</h2>
            {user?.authProvider === "google" ? <div className="bg-page border border-line rounded-xl p-5"><p className="font-bold text-sm">Managed by Google</p><p className="text-xs text-muted mt-1">This account uses Google sign-in. Manage its password from your Google account.</p></div> : <>
              <div className="space-y-4">
                <PasswordField label="Current password" value={passwords.currentPassword} onChange={(value) => setPasswords((item) => ({ ...item, currentPassword: value }))} />
                <PasswordField label="New password" value={passwords.newPassword} onChange={(value) => setPasswords((item) => ({ ...item, newPassword: value }))} />
                <PasswordField label="Confirm new password" value={passwords.confirmPassword} onChange={(value) => setPasswords((item) => ({ ...item, confirmPassword: value }))} />
              </div>
              <SaveButton saving={saving} onClick={savePassword} label="Update Password" />
            </>}
          </>}

          {message && <p className={`text-xs font-semibold flex items-center gap-2 ${message.type === "success" ? "text-ok" : "text-danger"}`}><CheckCircle2 className="w-4 h-4" />{message.text}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function SaveButton({ saving, onClick, label }) {
  return <div className="pt-4 border-t border-line flex justify-end"><button type="button" disabled={saving} onClick={onClick} className="bg-accent text-accent-ink px-5 py-2.5 rounded-lg text-xs font-bold disabled:opacity-60 flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />}{label}</button></div>;
}

function PreferenceToggle({ title, description, checked, onChange }) {
  return <label className="flex justify-between items-start gap-4 bg-page border border-line rounded-xl p-4 cursor-pointer"><span><span className="block font-semibold text-sm">{title}</span><span className="block text-xs text-muted mt-1">{description}</span></span><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 mt-1 accent-accent" /></label>;
}

function PasswordField({ label, value, onChange }) {
  return <label className="block text-xs font-bold text-muted uppercase tracking-wider">{label}<input type="password" value={value} onChange={(e) => onChange(e.target.value)} autoComplete="new-password" className="mt-2 w-full bg-page border border-line px-3 py-2.5 rounded-lg text-sm text-ink normal-case font-normal focus:outline-none focus:border-accent" /></label>;
}

function SettingsSkeleton() {
  return (
    <div className="p-4 sm:p-8 bg-page min-h-screen text-ink animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 bg-line/60 rounded-lg mb-2" />
        <div className="h-4 w-80 bg-line/40 rounded-md" />
      </div>
      <div className="bg-surface border border-line rounded-2xl max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-4">
        <div className="border-r border-line p-4 space-y-3 bg-page/50">
          <div className="h-9 w-full bg-line/40 rounded-lg" />
          <div className="h-9 w-full bg-line/30 rounded-lg" />
          <div className="h-9 w-full bg-line/30 rounded-lg" />
        </div>
        <div className="p-6 md:col-span-3 space-y-6">
          <div className="h-6 w-36 bg-line/50 rounded-md pb-3 border-b border-line" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-line/40 rounded" />
              <div className="h-10 w-full bg-page border border-line rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-line/40 rounded" />
              <div className="h-10 w-full bg-page border border-line rounded-lg" />
            </div>
          </div>
          <div className="pt-4 border-t border-line flex justify-end">
            <div className="h-9 w-28 bg-line/50 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

