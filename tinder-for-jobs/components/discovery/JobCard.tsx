import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { MapPin, Clock, Building2, Tag, ExternalLink, X, Check } from "lucide-react";
import { DatabaseJob } from "@/lib/resumeApi";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: DatabaseJob;
  exitDirection: "left" | "right" | null;
  onSwipe: (direction: "left" | "right") => void;
  onViewDetails: () => void;
}

export function JobCard({ job, exitDirection, onSwipe, onViewDetails }: JobCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe("right");
    } else if (info.offset.x < -threshold) {
      onSwipe("left");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return dateString;
    }
  };

  // Calculate exit animation based on exitDirection or drag position
  const getExitX = () => {
    if (exitDirection === "right") return 300;
    if (exitDirection === "left") return -300;
    // Fallback to drag-based direction
    return x.get() > 0 ? 300 : -300;
  };

  const getExitRotate = () => {
    if (exitDirection === "right") return 20;
    if (exitDirection === "left") return -20;
    return x.get() > 0 ? 20 : -20;
  };

  return (
    <motion.div
      className="absolute w-full cursor-grab active:cursor-grabbing"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      whileDrag={{ scale: 1.02 }}
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{
        x: getExitX(),
        opacity: 0,
        rotate: getExitRotate(),
        transition: { duration: 0.3 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className="bg-card  rounded-2xl p-6 swipe-card-shadow border border-border cursor-pointer"
        onClick={onViewDetails}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground truncate">{job.title}</h2>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{job.company}</span>
            </div>
          </div>
          {/* Match Score Badge */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-success/10 border-2 border-success flex items-center justify-center">
              <span className="text-sm font-bold text-success">
                {!isNaN(job.score) ? Math.round(job.score * 100) : '-'}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">Match</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-5 mb-5">
          {(job.tags ?? []).slice(0, 4).map((tag) => (
            <Badge key={tag} variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {(job.tags ?? []).length > 4 && (
            <Badge variant="outline" className="bg-muted text-muted-foreground">
              +{(job.tags ?? []).length - 4}
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-3 mt-10 mb-5">
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatDate(job.date_posted)}</span>
          </div>
        </div>

        {/* Description Preview */}
        <div
          className="text-muted-foreground text-base line-clamp-3 mb-5"
          dangerouslySetInnerHTML={{
            __html: (job.description_snippet || "").replace(/<[^>]*>/g, '').substring(0, 200) + '...'
          }}
        />

        {/* Apply Link Hint */}
        <div className="flex items-center justify-center gap-2 text-xs text-primary">
          <ExternalLink className="w-3 h-3" />
          <span>Tap for details • Swipe right to save</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-colors font-medium"
            onClick={(e) => { e.stopPropagation(); onSwipe("left"); }}
          >
            <X className="w-5 h-5" />
            Pass
          </button>

          <button
            className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors font-medium"
            onClick={(e) => { e.stopPropagation(); onSwipe("right"); }}
          >
            <Check className="w-5 h-5" />
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
}
