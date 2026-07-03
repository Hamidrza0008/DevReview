"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft,
  GitBranch,
  ExternalLink,
  Heart,
  MessageSquare,
  Bookmark,
  Code2,
  Eye,
  Star,
  CheckCircle2,
  Edit3,
  Trash2
} from 'lucide-react';
import { getProjectById } from '@/services/getProjectByIdApi';
import { deleteProject } from '@/services/editProjectApi'; // Assumed delete API import path

// SKELETON LOADING COMPONENT FOR BETTER UX
function ProjectSkeleton() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen animate-pulse py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-4 w-28 bg-slate-200 rounded-md mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start mb-10">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="aspect-video bg-slate-200 rounded-2xl"></div>
          </div>
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="space-y-3">
              <div className="h-8 bg-slate-200 rounded-lg w-3/4"></div>
              <div className="h-14 bg-slate-200 rounded-xl w-full flex items-center p-3"></div>
              <div className="h-4 bg-slate-200 rounded-md w-full"></div>
              <div className="h-4 bg-slate-200 rounded-md w-5/6"></div>
            </div>
            <div className="h-10 bg-slate-200 rounded-xl w-full pt-4"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-32 bg-slate-200 rounded-2xl p-6"></div>
            <div className="h-24 bg-slate-200 rounded-2xl p-6"></div>
          </div>
          <div className="lg:col-span-4">
            <div className="h-48 bg-slate-200 rounded-2xl p-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SingleProject() {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [project, setProject] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  const [currentLoggedInUserId, setCurrentLoggedInUserId] = useState(user?._id);

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getProject(id);
    }
  }, [id]);

  const getProject = async (projectId) => {
    try {
      const res = await getProjectById(projectId);
      if (res && res.project) {
        setProject(res.project);
        if (res.project.owner?._id) {
          setOwnerId(res.project.owner._id.toString());
        }
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project permanently?"
    );

    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      const response = await deleteProject(id);

      if (response && response.success) {
        alert("Project deleted successfully!");
        router.push("/projects/my");
      } else {
        alert("Deletion sequence failed. Please verify configurations.");
      }
    } catch (error) {
      console.error("Error executing project deletion:", error);
      alert("Error dropping project trace.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditRedirect = () => {
    router.push(`/projects/${id}/edit`);
  }

  const dummyGallery = [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
  ];

  const dummyReviews = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Senior Full Stack Engineer",
      avatar: "https://i.pravatar.cc/150?img=47",
      rating: 5,
      comment: "The overall user interface architecture is extremely clean. The dynamic component load times feel instantaneous.",
      time: "2 days ago"
    }
  ];

  const dummySimilar = [
    {
      id: "s1",
      title: "Linear Native UI kit",
      description: "A highly reusable client system strictly following premier SaaS design frameworks.",
      techStack: ["React", "Tailwind CSS"],
      likes: 312
    }
  ];

  if (!project) {
    return <ProjectSkeleton />;
  }

  const isThumbnailValid = project.thumbnail && project.thumbnail.trim() !== "";

  // Conditional Auth Control Check Logic
  const showManagementActions = ownerId && currentLoggedInUserId && ownerId === currentLoggedInUserId;

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#111827] antialiased selection:bg-[#2563EB]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* TOP INTERACTION ACTION BAR */}
        <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-4">
          {/* BACK TO EXPLORE NAVIGATOR */}
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => router.push("/explore")}
            className="inline-flex items-center space-x-2 text-xs md:text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </motion.button>

          {/* PRIVILEGED MANAGEMENT GATEWAY (Shown only if ownerId === currentLoggedInUserId) */}
          {showManagementActions && (
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEditRedirect}
                className="inline-flex items-center space-x-1.5 bg-[#FFFFFF] border border-[#E5E7EB] text-[#2563EB] font-bold text-xs py-2 px-3.5 rounded-xl shadow-2xs hover:bg-[#2563EB]/5 hover:border-[#2563EB]/30 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Project</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center space-x-1.5 bg-red-50 border border-red-100 text-red-600 font-bold text-xs py-2 px-3.5 rounded-xl shadow-2xs hover:bg-red-100/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? "Deleting..." : "Delete"}</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* HERO SECTION CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start mb-10">

          {/* PRIMARY MEDIA RUNWAY */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs relative aspect-video group">
              {isThumbnailValid ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2563EB]/15 via-[#3882F6]/5 to-[#F8FAFC] flex flex-col items-center justify-center p-6">
                  <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center text-[#2563EB] shadow-2xs mb-2">
                    <Code2 className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold text-[#3882F6]">
                    Repository Source Template
                  </span>
                </div>
              )}

              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold bg-[#FFFFFF]/90 backdrop-blur-xs text-[#111827] border border-[#E5E7EB] px-3 py-1 rounded-md shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Verified Architecture</span>
                </span>
              </div>
            </div>
          </div>

          {/* IDENTITY PACK & TELEMETRY */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] leading-tight">
                {project.title}
              </h1>

              {/* USER PROFILE CARD */}
              <div className="flex items-center space-x-3 p-3 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl shadow-2xs">
                <img
                  src={project.owner?.profileImage || "https://i.pravatar.cc/150?img=12"}
                  alt={project.owner?.username}
                  className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#111827] tracking-tight">
                    {project.owner?.username || 'Anonymous Developer'}
                  </h4>
                  <p className="text-xs text-[#6B7280] font-medium">Project Contributor</p>
                </div>
              </div>

              <p className="text-xs md:text-sm text-[#6B7280] leading-relaxed line-clamp-3">
                {project.description}
              </p>

              {/* HIGH LEVEL METRICS SUMMARY */}
              <div className="flex items-center space-x-4 pt-2 text-xs font-semibold text-[#6B7280]">
                <span className="flex items-center space-x-1">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="text-[#111827]">{project.likes || 0} Ecosystem Likes</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-[#111827]">{project.reviews || 0} Peer Reviews</span>
                </span>
              </div>
            </div>

            {/* ACTION PIPELINE ROW */}
            <div className="space-y-2 pt-4 border-t border-[#E5E7EB]">
              <div className="grid grid-cols-2 gap-2">
                <motion.a
                  whileHover={{ scale: 1.01, backgroundColor: '#3882F6' }}
                  whileTap={{ scale: 0.99 }}
                  href={project.liveUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 bg-[#2563EB] text-[#FFFFFF] font-medium text-xs md:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4 stroke-[2.2]" />
                  <span>Launch Application</span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.01, bg: '#F8FAFC' }}
                  whileTap={{ scale: 0.99 }}
                  href={project.githubUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] hover:text-[#2563EB] font-medium text-xs md:text-sm py-2.5 px-4 rounded-xl shadow-2xs transition-all"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>View Repository</span>
                </motion.a>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center justify-center space-x-2 text-xs md:text-sm font-semibold py-2 rounded-xl border transition-all shadow-2xs ${liked
                      ? 'bg-rose-50/60 text-rose-600 border-rose-200'
                      : 'bg-[#FFFFFF] text-[#6B7280] border-[#E5E7EB] hover:text-rose-500 hover:border-rose-200'
                    }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 stroke-rose-600' : ''}`} />
                  <span>{liked ? 'Endorsed' : 'Endorse Project'}</span>
                </button>

                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`flex items-center justify-center space-x-2 text-xs md:text-sm font-semibold py-2 rounded-xl border transition-all shadow-2xs ${bookmarked
                      ? 'bg-blue-50/60 text-[#2563EB] border-blue-200'
                      : 'bg-[#FFFFFF] text-[#6B7280] border-[#E5E7EB] hover:text-[#2563EB] hover:border-blue-200'
                    }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-[#2563EB] stroke-[#2563EB]' : ''}`} />
                  <span>{bookmarked ? 'Saved' : 'Save to Board'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* WORKSPACE CONTENT GRID BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start mb-12">

          {/* PRIMARY DETAILED READOUTS */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">

            {/* ABOUT THE PROJECT ARTIFACT */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 md:p-6 shadow-2xs">
              <h3 className="text-base font-bold text-[#111827] tracking-tight mb-3">About Project</h3>
              <p className="text-xs md:text-sm text-[#6B7280] leading-relaxed">
                {project.description}
                <br /><br />
                Constructed meticulously to fulfill multi-tenant distribution layers, this environment scales dynamically on low tier infrastructures.
              </p>
            </div>

            {/* DYNAMIC COMPREHENSIVE TECHNOLOGY TILES */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 md:p-6 shadow-2xs">
              <h3 className="text-base font-bold text-[#111827] tracking-tight mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech, index) => (
                  <span
                    key={index}
                    className="text-xs font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/15 px-3 py-1 rounded-md cursor-default select-none transition-colors duration-150 hover:bg-[#22C55E]/15 shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* EXPANDED SYSTEM CAPTURE GALLERY */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#111827] tracking-tight">System Captures</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {dummyGallery.map((img, i) => (
                  <div key={i} className="border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs aspect-video bg-[#FFFFFF] group relative cursor-pointer">
                    <img
                      src={img}
                      alt={`Workspace capture ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SYSTEM TELEMETRY AND INDEX ARTIFACTS */}
          <div className="lg:col-span-4 space-y-6">

            {/* COMPREHENSIVE ENGINE CORE STATISTICS */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 md:p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-[#111827] tracking-tight border-b border-[#E5E7EB] pb-2">Analytics Workspace</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                  <div className="flex items-center justify-between text-[#6B7280] mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Likes</span>
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  </div>
                  <p className="text-base font-bold text-[#111827]">{liked ? (project.likes || 0) + 1 : (project.likes || 0)}</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                  <div className="flex items-center justify-between text-[#6B7280] mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Reviews</span>
                    <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  <p className="text-base font-bold text-[#111827]">{project.reviews || 0}</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                  <div className="flex items-center justify-between text-[#6B7280] mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Views</span>
                    <Eye className="w-3.5 h-3.5 text-[#3882F6]" />
                  </div>
                  <p className="text-base font-bold text-[#111827]">1,402</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                  <div className="flex items-center justify-between text-[#6B7280] mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Bookmarks</span>
                    <Bookmark className="w-3.5 h-3.5 text-[#2563EB]" />
                  </div>
                  <p className="text-base font-bold text-[#111827]">{bookmarked ? 43 : 42}</p>
                </div>
              </div>

              {/* STABLE METADATA LOGS */}
              <div className="pt-2 text-[11px] font-medium text-[#6B7280] space-y-1.5 border-t border-[#E5E7EB]">
                <div className="flex justify-between">
                  <span>Distribution Manifest</span>
                  <span className="text-[#111827] font-semibold">Stable package v1.0.4</span>
                </div>
                <div className="flex justify-between">
                  <span>Indexed Sequence</span>
                  <span className="text-[#111827] font-semibold">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FEEDBACK ENGINE / PEER REVIEWS BLOCK */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 md:p-6 shadow-2xs mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-6 border-b border-[#E5E7EB] gap-4">
            <div>
              <h3 className="text-base font-bold text-[#111827] tracking-tight">Peer Feedback Logs</h3>
              <p className="text-xs text-[#6B7280]">Technical analysis submitted by verified workspace nodes.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-[#2563EB] hover:bg-[#3882F6] text-[#FFFFFF] font-semibold text-xs py-2 px-4 rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
            >
              Write Review
            </motion.button>
          </div>

          <div className="space-y-6">
            {dummyReviews.map((review) => (
              <div key={review.id} className="flex items-start space-x-3.5 pb-6 border-b border-[#E5E7EB] last:border-0 last:pb-0">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#E5E7EB] shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div>
                      <h5 className="text-xs font-bold text-[#111827] tracking-tight inline-block mr-2">{review.name}</h5>
                      <span className="text-[10px] font-medium text-[#6B7280]">{review.role}</span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="flex items-center text-amber-500">
                        {[...Array(review.rating)].map((_, index) => (
                          <Star key={index} className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium text-[#6B7280]">{review.time}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RELATED MATRIX SUBMISSIONS / SIMILAR PROJECTS */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#111827] tracking-tight">Related Core Matrices</h3>
            <p className="text-xs text-[#6B7280]">Explore alternative architecture alignments built in similar vectors.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dummySimilar.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3, boxShadow: '0 10px 15px -3px rgba(17, 24, 39, 0.04)' }}
                className="p-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl flex flex-col justify-between shadow-3xs group cursor-pointer transition-colors hover:border-[#3882F6]/30"
              >
                <div className="space-y-1.5">
                  <h4 className="text-xs md:text-sm font-bold text-[#111827] tracking-tight group-hover:text-[#2563EB] transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#E5E7EB] text-[10px] font-semibold">
                  <div className="flex space-x-1">
                    {item.techStack.map((tech, i) => (
                      <span key={i} className="bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/15 px-1.5 py-0.5 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center space-x-1 text-[#6B7280]">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span className="text-[#111827]">{item.likes}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}