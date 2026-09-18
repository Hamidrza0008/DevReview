'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, Star, ShieldCheck } from 'lucide-react';
import { getLandingReviews } from '@/services/landingApi';
import SkeletonBox from '@/Components/Skeleton/SkeletonBox';
import Avatar from '@/Components/shared/Avatar';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'text-star' : 'text-line'}>
        ★
      </span>
    );
  }
  return <span className="text-sm tracking-tighter" aria-label={`${rating} out of 5 stars`}>{stars}</span>;
}

function ReviewCard({ review, className = '' }) {
  const userName = review.user?.name || review.user?.username || 'Anonymous';
  const projectName = review.project?.title || 'a project';

  return (
    <div className={`w-full max-w-sm bg-page border border-line rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 flex flex-col gap-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={review.user?.profileImage}
            name={userName}
            size="sm"
          />
          <div>
            <p className="text-sm font-bold text-ink">{userName}</p>
            <p className="text-[11px] text-muted font-medium">reviewed {projectName}</p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      <p className="text-sm text-muted leading-relaxed">
        &ldquo;{review.review}&rdquo;
      </p>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const points = [
    {
      icon: <GitPullRequest className="w-6 h-6" />,
      title: 'Line-by-line feedback',
      desc: 'Reviewers comment on what you actually shipped — real notes on your code and structure, not generic praise.',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Structured ratings',
      desc: 'Every review scores clarity, design, and code quality, so feedback is easy to compare and act on.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Public reputation',
      desc: 'Reviews you give and receive build a visible track record — helpful reviewers get noticed too.',
    },
  ];

  useEffect(() => {
    let cancelled = false;
    async function fetchReviews() {
      const data = await getLandingReviews();
      if (cancelled) return;
      if (data.success && data.reviews) {
        setReviews(data.reviews);
      }
      setLoading(false);
    }
    fetchReviews();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="reviews" className="relative w-full px-6 md:px-12 py-24 bg-surface border-b border-line overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-8"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent-soft border border-accent/20 px-4 py-1.5 rounded-full shadow-sm">
              Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink mt-5 tracking-tight">
              Feedback that actually{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent-2">
                makes you better
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted mt-4 font-medium leading-relaxed">
              No star-rating spam. Reviews on DevReview are written by developers who actually read your code and tell you what to fix.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {points.map((point) => (
              <div key={point.title} className="flex items-start gap-4 p-3 -m-3 rounded-xl hover:bg-surface/80 transition-colors duration-300 group">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-accent-soft text-accent flex items-center justify-center border border-accent/20 group-hover:scale-105 transition-transform duration-300">
                  {point.icon}
                </div>
                <div>
                  <h3 className="font-bold text-ink group-hover:text-accent transition-colors duration-300">{point.title}</h3>
                  <p className="text-sm text-muted mt-1 leading-relaxed">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative flex justify-center"
        >
          {loading && (
            <div className="w-full max-w-sm bg-page border border-line rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-line">
                <SkeletonBox className="w-9 h-9 rounded-full" />
                <div className="space-y-2 flex-1">
                  <SkeletonBox className="h-4 w-24" />
                  <SkeletonBox className="h-3 w-32" />
                </div>
              </div>
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-3/4" />
            </div>
          )}

          {!loading && reviews.length > 0 && (
            <div className="relative w-full max-w-sm">
              {reviews.length >= 3 && (
                <div className="absolute top-4 left-4 right-4 bottom-0 bg-surface border border-line rounded-2xl shadow-sm opacity-40" />
              )}
              {reviews.length >= 2 && (
                <div className="absolute top-2 left-2 right-2 bottom-0 bg-surface border border-line rounded-2xl shadow-sm opacity-60" />
              )}
              <ReviewCard review={reviews[0]} className="relative z-10" />
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <div className="w-full max-w-sm bg-page border border-dashed border-line rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-accent-soft text-accent flex items-center justify-center mx-auto mb-4">
                <Star className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-ink">No reviews yet</p>
              <p className="text-xs text-muted mt-1">Reviews from the community will appear here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
