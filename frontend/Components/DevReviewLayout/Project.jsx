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
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { getProjectById } from '@/services/getProjectByIdApi';
import { deleteProject } from '@/services/editProjectApi';
import { toggleLikes } from '@/services/toggleLikesApi';

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
  const [likesCount , setLikesCount] = useState("");

  const [currentLoggedInUserId, setCurrentLoggedInUserId] = useState(user?._id);

  const { id } = useParams();
  const router = useRouter();
  // console.log(id);

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
        setLiked(res.isLiked)
        setLikesCount(res.likesCount)
        // console.log(res)
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

  const handleLikeButton = async() => {
    const res = await toggleLikes(id);
    if(res.success){
      setLiked(res.isLiked);
      setLikesCount(res.likesCount)
    }
  }

  const handleEditRedirect = () => {
    router.push(`/projects/${id}/edit`);
  };

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
  const showManagementActions = ownerId && currentLoggedInUserId && ownerId === currentLoggedInUserId;

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#111827] antialiased selection:bg-[#2563EB]/10 relative">
      {/* GLOW BACKGROUND ELEMENT */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#2563EB]/5 to-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 z-10 relative space-y-6">

        {/* TOP ACTION NAVIGATION BAR */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E5E7EB] pb-5">
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => router.push("/explore")}
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#6B7280] hover:text-[#111827] uppercase tracking-wider transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </motion.button>

          {showManagementActions && (
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.01, y: -0.5 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleEditRedirect}
                className="inline-flex items-center space-x-1.5 bg-[#FFFFFF] border border-[#E5E7EB] text-[#2563EB] font-semibold text-xs py-2 px-3.5 rounded-xl shadow-2xs hover:bg-[#F8FAFC] transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Workspace</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center space-x-1.5 bg-red-50 border border-red-100 text-red-600 font-semibold text-xs py-2 px-3.5 rounded-xl shadow-2xs hover:bg-red-100/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? "Dropping..." : "Delete Project"}</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* MAIN VISUAL LAYOUT ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* LEFT COLUMN: CANVAS BANNER AREA */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-2xs relative aspect-video group flex flex-col justify-between select-none">
              
              {/* Mock Browser Title Bar Layout */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#FFFFFF] border-b border-[#E5E7EB] shrink-0">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E5E7EB] group-hover:bg-rose-400 transition-colors" />
                  <span className="w-2 h-2 rounded-full bg-[#E5E7EB] group-hover:bg-amber-400 transition-colors" />
                  <span className="w-2 h-2 rounded-full bg-[#E5E7EB] group-hover:bg-emerald-400 transition-colors" />
                </div>
                <div className="bg-[#F8FAFC] rounded-md text-[10px] px-4 py-0.5 border border-[#E5E7EB] w-48 text-center text-[#6B7280] font-mono truncate">
                  inspect://architecture-view
                </div>
                <div className="w-4" />
              </div>

              {/* Core Visual Display Canvas */}
              <div className="flex-1 relative overflow-hidden bg-[#F8FAFC] flex items-center justify-center">
                {isThumbnailValid ? (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#2563EB]/5 via-[#3B82F6]/5 to-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center text-[#2563EB] shadow-2xs mb-3">
                      <Code2 className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#6B7280]">
                      System Architecture Canvas
                    </span>
                  </div>
                )}

                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider bg-[#FFFFFF]/95 backdrop-blur-xs text-[#111827] border border-[#E5E7EB] px-2.5 py-1 rounded-lg shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Verified Production</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: QUICK DISPATCH INFORMATION CONTROL */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 md:p-6 shadow-2xs space-y-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#2563EB]/5 border border-[#2563EB]/10 text-[#2563EB] font-semibold text-[10px] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Submission Node</span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#111827] leading-snug">
                  {project.title}
                </h1>
              </div>

              {/* CONTRIBUTOR NODE INFORMATION CARD */}
              <div className="flex items-center space-x-3 p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl shadow-3xs">
                <img
                  src={project.owner?.profileImage || "https://i.pravatar.cc/150?img=12"}
                  alt={project.owner?.username}
                  className="w-9 h-9 rounded-full object-cover border border-[#E5E7EB]"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#111827] truncate">
                    @{project.owner?.username || 'anonymous_node'}
                  </h4>
                  <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Core Maintainer</p>
                </div>
              </div>

              <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">
                {project.description || "No comprehensive documentation description parsed for this repository manifest instance."}
              </p>

              {/* CORE COUNTER QUICK ACTION SUMMARY FOOTER */}
              <div className="flex items-center space-x-4 pt-1 text-[11px] font-semibold text-[#6B7280]">
                <span className="flex items-center space-x-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span className="text-[#111827]">{project.likes || 0} Likes</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span className="text-[#111827]">{project.reviews || 0} Reviews</span>
                </span>
              </div>

              {/* ACTION BUTTON DISPATCH INTEGRATION LINES */}
              <div className="space-y-2 pt-4 border-t border-[#F1F5F9]">
                <div className="grid grid-cols-2 gap-2">
                  <motion.a
                    whileHover={{ scale: 1.01, backgroundColor: '#1D4ED8' }}
                    whileTap={{ scale: 0.99 }}
                    href={project.liveUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-1.5 bg-[#2563EB] text-[#FFFFFF] font-semibold text-xs py-2.5 px-3 rounded-xl shadow-2xs transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch Live</span>
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.01, backgroundColor: '#F8FAFC' }}
                    whileTap={{ scale: 0.99 }}
                    href={project.githubUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-1.5 bg-[#FFFFFF] border border-[#E5E7EB] text-[#111827] hover:text-[#2563EB] font-semibold text-xs py-2.5 px-3 rounded-xl shadow-2xs transition-all"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>Codebase</span>
                  </motion.a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={()=>handleLikeButton(id)}
                    className={`flex items-center justify-center space-x-1.5 text-xs font-semibold py-2 px-3 rounded-xl border transition-all shadow-3xs ${
                      liked
                        ? 'bg-rose-50/60 text-rose-600 border-rose-200'
                        : 'bg-[#FFFFFF] text-[#6B7280] border-[#E5E7EB] hover:text-rose-500 hover:border-rose-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 stroke-rose-600' : ''}`} />
                    <span>{liked ? 'Endorsed' : 'Endorse'}</span>
                  </button>

                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`flex items-center justify-center space-x-1.5 text-xs font-semibold py-2 px-3 rounded-xl border transition-all shadow-3xs ${
                      bookmarked
                        ? 'bg-blue-50/60 text-[#2563EB] border-blue-200'
                        : 'bg-[#FFFFFF] text-[#6B7280] border-[#E5E7EB] hover:text-[#2563EB] hover:border-blue-200'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-[#2563EB] stroke-[#2563EB]' : ''}`} />
                    <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS ARTIFACT WORKSPACE EXPANSION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* PRIMARY TEXT LOG DATA SHIELDS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* COMPREHENSIVE REPO OVERVIEW */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 md:p-6 shadow-2xs space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Project Specifications</h3>
              <p className="text-xs md:text-sm text-[#475569] leading-relaxed font-normal">
                {project.description || "No supplemental manifest documentation trace added."}
                <br /><br />
                Engineered meticulously to scale within complex multi-tenant orchestration bounds. Production environment optimization algorithms remain synchronized directly with code coverage updates.
              </p>
            </div>

            {/* DYNAMIC RENDER TECH TILES */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 md:p-6 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Tech Stack Configurations</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack?.map((tech, index) => (
                  <span
                    key={index}
                    className="text-[10px] font-semibold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 px-2.5 py-1 rounded-md cursor-default select-none shadow-3xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* EXPANDED INTERFACES SYSTEM GALLERY */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">System Captures Canvas</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {dummyGallery.map((img, i) => (
                  <div key={i} className="border border-[#E5E7EB] rounded-xl overflow-hidden shadow-2xs aspect-video bg-[#FFFFFF] group relative cursor-pointer">
                    <img
                      src={img}
                      alt={`System snapshot index ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TELEMETRY ANALYTICS SIDEBAR COMPONENT */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 md:p-6 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Telemetry Workspace</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280] block mb-0.5">Likes</span>
                  <p className="text-base font-bold text-[#111827] tabular-nums">
                    {likesCount}
                  </p>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280] block mb-0.5">Reviews</span>
                  <p className="text-base font-bold text-[#111827] tabular-nums">{project.reviews || 0}</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280] block mb-0.5">Views</span>
                  <p className="text-base font-bold text-[#111827] tabular-nums">1,402</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280] block mb-0.5">Saved</span>
                  <p className="text-base font-bold text-[#111827] tabular-nums">{bookmarked ? 43 : 42}</p>
                </div>
              </div>

              <div className="pt-2.5 text-[11px] font-medium text-[#6B7280] space-y-2 border-t border-[#F1F5F9]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-[#6B7280]" /> Manifest Version</span>
                  <span className="text-[#111827] font-semibold font-mono text-[10px]">stable-v1.0.4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#6B7280]" /> Compiled Date</span>
                  <span className="text-[#111827] font-semibold">
                    {project.createdAt ? new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK SEGMENT DEEP REVIEW PANELS */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 md:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-5 border-b border-[#E5E7EB] gap-4">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Peer Feedback Logs</h3>
              <p className="text-xs text-[#6B7280]">Technical analysis reports submitted by verified workspace developer nodes.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.01, backgroundColor: '#1D4ED8' }}
              whileTap={{ scale: 0.99 }}
              className="bg-[#2563EB] text-[#FFFFFF] font-bold text-xs py-2 px-4 rounded-xl shadow-2xs transition-colors self-start sm:self-auto shrink-0"
            >
              Write Review
            </motion.button>
          </div>

          <div className="space-y-4">
            {dummyReviews.map((review) => (
              <div key={review.id} className="flex items-start space-x-3.5 p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB] shrink-0"
                />
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div>
                      <h5 className="text-xs font-bold text-[#111827] inline-block mr-2 truncate">{review.name}</h5>
                      <span className="text-[10px] font-semibold text-[#6B7280] font-mono">{review.role}</span>
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
                  <p className="text-xs text-[#6B7280] leading-relaxed font-normal">
                    "{review.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RELATED SYSTEM ALIGNMENTS GRID MAP */}
        <div className="space-y-3.5">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">Related Core Matrices</h3>
            <p className="text-xs text-[#6B7280]">Alternative code architectural paths deployed in matching structural vectors.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dummySimilar.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3, borderColor: '#2563EB/30' }}
                className="p-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl flex flex-col justify-between shadow-2xs group cursor-pointer transition-all duration-300"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <ArrowUpRight className="w-3 h-3 text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#F1F5F9] text-[10px] font-semibold">
                  <div className="flex space-x-1">
                    {item.techStack.map((tech, i) => (
                      <span key={i} className="bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] px-2 py-0.5 rounded-md shadow-3xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center space-x-1 text-[#6B7280]">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span className="text-[#111827] tabular-nums">{item.likes}</span>
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