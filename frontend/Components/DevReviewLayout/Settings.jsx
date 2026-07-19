"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Bell, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { updateProfile } from '@/services/authApis';

export default function Settings() {
  const { user, fetchUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [handle, setHandle] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      setHandle(user.username || '');
      setPortfolioUrl(user.portfolioUrl || '');
    }
  }, [user]);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateProfile({ username: handle.trim(), portfolioUrl: portfolioUrl.trim() });
      if (res?.success) {
        await fetchUser();
        setSaved(true);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-page min-h-screen space-y-6 animate-pulse">
        <div className="h-10 bg-line rounded w-1/4"></div>
        <div className="h-64 bg-surface rounded-xl"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 bg-page min-h-screen text-ink">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted">Configure notifications, keys, profile parameters, and visualization metrics.</p>
      </div>

      <div className="bg-surface border border-line rounded-xl max-w-4xl overflow-hidden">
        {/* Account settings tab matrix wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="border-r border-line p-4 space-y-1 bg-page/50">
            {[
              { n: "Profile Settings", i: Sliders, active: true },
              { n: "Notifications", i: Bell, active: false },
              { n: "Security Keys", i: Shield, active: false },
            ].map((tab, idx) => (
              <button
                key={idx}
                className={`w-full text-left text-xs font-semibold px-3 py-2.5 rounded-lg flex items-center space-x-2 transition-all ${tab.active ? 'bg-surface text-accent border border-line shadow-sm' : 'text-muted hover:text-ink'}`}
              >
                <tab.i className="w-4 h-4" />
                <span>{tab.n}</span>
              </button>
            ))}
          </div>

          {/* Form parameters content section */}
          <div className="p-6 md:col-span-3 space-y-6">
            <div>
              <h3 className="font-bold text-base mb-4 pb-2 border-b border-line">Public Profile Parameters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Developer Handle</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-page border border-line px-3 py-2 rounded-lg text-sm text-ink focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Portfolio Endpoint</label>
                  <input
                    type="text"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                    className="w-full bg-page border border-line px-3 py-2 rounded-lg text-sm text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base mb-4 pb-2 border-b border-line">Notification Thresholds</h3>
              <div className="space-y-3">
                {[
                  { title: "Review Assertion Triggers", desc: "Instantly alert my workstation when a project score is calculated." },
                  { title: "Weekly Digest Index", desc: "Compile global ecosystem trending metrics into a summary mail." }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-muted">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-accent border-line rounded mt-1 accent-accent" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
              <AnimatePresence>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold text-ok flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSave}
                disabled={isSaving}
                className="bg-accent hover:brightness-110 text-accent-ink px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Save Core Configuration"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
