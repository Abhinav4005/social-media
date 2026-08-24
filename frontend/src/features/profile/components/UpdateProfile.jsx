import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Check,
  ImagePlus,
  Info,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Save,
  User,
  Sparkles,
  FileText,
} from "lucide-react";
import { getUserProfile, updateUserProfile, generateAIBio } from "../../../api";
import { QUERY_KEYS } from "../../../constant/queryKeys";
import UserAvatar from "../../../components/Common/UserAvatar";
import { useToast } from "../../../context/ToastContext";
import { profileSchema } from "../../../schemas";
import Navbar from "../../../pages/Navbar";
import { BRAND_THEME } from "../../../constant/constant";
import AIUpgradeModal from "../../../components/Common/AIUpgradeModal";

const emptyForm = {
  name: "",
  email: "",
  bio: "",
  about: "",
  location: "",
  password: "",
};

const Field = ({ icon, label, children }) => (
  <label className="block space-y-1.5">
    <span className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
      {icon}
      {label}
    </span>
    {children}
  </label>
);

const inputClass =
  "h-11 w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 px-4 text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/10";

const textareaClass =
  "min-h-24 w-full resize-none rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 px-4 py-3 text-xs sm:text-sm font-medium leading-relaxed text-gray-900 dark:text-gray-100 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/10";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const handleAIBioGenerate = async () => {
    setIsGeneratingBio(true);
    try {
      const res = await generateAIBio({ role: form.name || "Creator", interests: form.bio || "SocialHub user" });
      if (res?.bios?.[0]) {
        setForm((prev) => ({ ...prev, bio: res.bios[0] }));
        showSuccess("AI generated your bio! ✨");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      if (err?.response?.status === 403 || err?.response?.data?.upgradeRequired) {
        setUpgradeMessage(msg);
        setShowUpgradeModal(true);
      } else {
        showError(msg || "Failed to generate bio");
      }
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const { data: user, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.userProfile,
    queryFn: getUserProfile,
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      about: user.about || "",
      location: user.location || "",
      password: "",
    });
  }, [user]);

  const profilePreview = useMemo(() => {
    if (profileImage) return URL.createObjectURL(profileImage);
    return user?.profileImage || "";
  }, [profileImage, user?.profileImage]);

  const coverPreview = useMemo(() => {
    if (coverImage) return URL.createObjectURL(coverImage);
    return user?.coverImage || "";
  }, [coverImage, user?.coverImage]);

  const mutation = useMutation({
    mutationFn: (payload) => updateUserProfile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfile });
      navigate("/profile");
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validation = profileSchema.safeParse({
      name: form.name,
      bio: form.bio,
      about: form.about,
      location: form.location,
      website: form.website,
    });

    if (!validation.success) {
      showError(validation.error.errors[0]?.message || "Invalid profile data");
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });
    if (profileImage) payload.append("profileImage", profileImage);
    if (coverImage) payload.append("coverImage", coverImage);

    mutation.mutate(payload);
  };

  const initials = form.name
    ? form.name
      .split(" ")
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join("")
    : "U";

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-slate-950 px-4 py-8">
          <div className="mx-auto max-w-5xl rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <div className="h-48 rounded-3xl animate-shimmer" />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-20 rounded-2xl animate-shimmer" />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-slate-950 px-4 py-8">
          <div className="mx-auto max-w-xl rounded-3xl border border-rose-100 dark:border-rose-900/50 bg-white dark:bg-slate-900 p-8 text-center shadow-xs">
            <Info className="mx-auto mb-4 h-10 w-10 text-rose-500" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Could not load profile</h1>
            <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">Please refresh and try again.</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-slate-950 px-4 sm:px-6 py-6 transition-colors duration-200">
        <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6">

          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs">
            <div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </button>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Edit Profile</h1>
              <p className="mt-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                Update your public profile information, avatar, cover photo, and location.
              </p>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 text-xs font-bold text-white shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Main Card with Media & Forms */}
          <section className="overflow-hidden rounded-3xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-colors duration-200">
            {/* Cover Photo Banner Header */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <label className="absolute right-4 top-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-black/60 hover:bg-black/80 px-3.5 py-2 text-xs font-bold text-white shadow-md backdrop-blur-md transition-all">
                <ImagePlus className="h-4 w-4 text-indigo-300" />
                Change Cover
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => setCoverImage(event.target.files?.[0] || null)}
                />
              </label>
            </div>

            {/* Content Section: Sidebar Profile Card + Main Form */}
            <div className="p-6 sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[260px_1fr]">

                {/* Left Profile Preview Sidebar */}
                <aside className="space-y-4 lg:border-r lg:border-gray-100 lg:dark:border-slate-800 lg:pr-8">
                  <div className="-mt-16 sm:-mt-20 relative z-10">
                    <div className="relative h-32 w-32 rounded-full border-4 border-white dark:border-slate-900 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
                      <UserAvatar
                        name={form.name || user?.name}
                        profileImage={profilePreview || user?.profileImage}
                        size="2xl"
                        shape="circle"
                        ring="ring-4 ring-white dark:ring-slate-900 shadow-xl"
                      />
                      <label className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-90">
                        <Camera className="h-4.5 w-4.5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => setProfileImage(event.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 truncate">{form.name || "Your Profile"}</h2>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 truncate">{form.email}</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                      Active Profile
                    </div>
                  </div>

                  <div className="rounded-2xl border border-indigo-50 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/30 p-4">
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Profile Tips
                    </p>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-gray-600 dark:text-gray-300">
                      Add a clear profile photo, location, and bio so friends and followers can identify you easily across the platform.
                    </p>
                  </div>
                </aside>

                {/* Right Form Fields */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-gray-900 dark:text-gray-100">Personal Information</h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">Shown publicly on your profile page and posts.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field icon={<User className="h-4 w-4 text-indigo-500" />} label="Full Name">
                      <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Your name" />
                    </Field>

                    <Field icon={<Mail className="h-4 w-4 text-indigo-500" />} label="Email Address">
                      <input name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                    </Field>

                    <Field icon={<MapPin className="h-4 w-4 text-indigo-500" />} label="Location">
                      <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="City, Country" />
                    </Field>

                    <Field icon={<Lock className="h-4 w-4 text-indigo-500" />} label="New Password">
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Leave blank to keep current"
                      />
                    </Field>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300">
                        <FileText className="h-4 w-4 text-indigo-500" />
                        Short Bio (Headline)
                      </label>
                      <button
                        type="button"
                        onClick={handleAIBioGenerate}
                        disabled={isGeneratingBio}
                        className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:to-pink-500/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
                      >
                        {isGeneratingBio ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>AI Auto-Write Bio</span>
                      </button>
                    </div>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      className={textareaClass}
                      placeholder="A short line about yourself or click AI Auto-Write Bio..."
                    />
                  </div>

                  <Field icon={<Info className="h-4 w-4 text-indigo-500" />} label="About Me (Detailed)">
                    <textarea
                      name="about"
                      value={form.about}
                      onChange={handleChange}
                      className="min-h-28 w-full resize-none rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 px-4 py-3 text-xs sm:text-sm font-medium leading-relaxed text-gray-900 dark:text-gray-100 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/10"
                      placeholder="Share your interests, work experience, or what you care about..."
                    />
                  </Field>

                  {mutation.isError && (
                    <div className="rounded-xl border border-rose-100 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/50 px-4 py-3 text-xs font-bold text-rose-600 dark:text-rose-400">
                      Could not save your profile. Please review your details and try again.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </form>

        <AIUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          message={upgradeMessage}
        />
      </main>
    </>
  );
}
