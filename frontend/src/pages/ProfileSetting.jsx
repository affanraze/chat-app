import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfileSettings({ onBack }) {
  const { user, updataAvatar, updateInfo } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [infoError, setInfoError] = useState("");
  const [infoSuccess, setInfoSuccess] = useState("");
  const hasChanges =
    username !== (user?.username || "") || email !== (user?.email || "");
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await updataAvatar(formData);
    } catch {
      setError("Failed to update avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const changeInfo = async () => {
    if (!hasChanges) return;
    setSaving(true);
    setInfoError("");
    setInfoSuccess("");
    try {
      await updateInfo({ username, email });
      setUsername(username);
      setEmail(email);
      setInfoSuccess("Profile updated successfully.");
    } catch {
      setInfoError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-[#0e0f12] text-zinc-200 overflow-y-auto">
      {/* Top Header */}
      <header className="px-8 py-6 border-b border-zinc-800/80 bg-[#121318]/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Profile Settings
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage your public profile and account details
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl w-full mx-auto p-8 space-y-8">
        {/* Profile Picture Section */}
        <section className="bg-[#15161d] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
            Profile Photo
          </label>
          <div className="flex items-center gap-6">
            <div className="relative group">
              {/* Avatar Preview */}
              <div className="w-24 h-24 rounded-full bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center text-2xl font-bold text-indigo-400 overflow-hidden shadow-inner">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{(user?.username || "A")[0].toUpperCase()}</span>
                )}
              </div>

              {/* Upload Trigger Badge */}
              <label
                htmlFor="pfp-upload"
                className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full cursor-pointer shadow-lg transition-transform hover:scale-105 border-2 border-[#15161d]"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h0.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  id="pfp-upload"
                  onChange={handleFileChange}
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-white">
                Upload new avatar
              </h3>
              <p className="text-xs text-zinc-400">
                Recommended: Square PNG or JPG, at least 400x400px.
              </p>
              {uploading && (
                <p className="text-xs text-indigo-400">Uploading...</p>
              )}
              {error && <p className="text-xs text-rose-400">{error}</p>}
              <div className="pt-2 flex gap-3">
                <label
                  htmlFor="pfp-upload"
                  className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition-colors inline-block"
                >
                  Choose File
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Account Details Form */}
        <section className="bg-[#15161d] border border-zinc-800/80 rounded-2xl p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Account Information
            </h2>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Username Field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-xs font-medium text-zinc-300"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <span className="text-sm">@</span>
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full pl-8 pr-4 py-2.5 bg-[#0e0f12] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                This is your unique handle visible to other users.
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-zinc-300"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0e0f12] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
                />
              </div>
            </div>

            {/* Save Button Container */}
            <div className="pt-4 border-t border-zinc-800/80 flex justify-end">
              {infoError && <p className="text-xs text-rose-400 mr-4 self-center">{infoError}</p>}
              {infoSuccess && <p className="text-xs text-emerald-400 mr-4 self-center">{infoSuccess}</p>}
              <button
                onClick={changeInfo}
                type="submit"
                disabled={!hasChanges || saving}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
