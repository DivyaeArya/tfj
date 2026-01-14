import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MapPin, ExternalLink, Building2, Clock, Check, X, Briefcase, Globe } from "lucide-react";
import { DatabaseJob } from "@/lib/resumeApi";
import { motion, AnimatePresence } from "framer-motion";

interface JobDetailsModalProps {
  job: DatabaseJob | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onPass: () => void;
}

export function JobDetailsModal({ job, isOpen, onClose, onApply, onPass }: JobDetailsModalProps) {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Clean HTML description
  const cleanDescription = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/\n/g, '\n\n').trim();
  };

  if (!job) return null;

  const score = job.score && !isNaN(job.score) 
    ? Math.round(job.score * 100)
    : 0;

  // Determine score color
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-500 border-emerald-500 bg-emerald-500/10";
    if (s >= 60) return "text-blue-500 border-blue-500 bg-blue-500/10";
    return "text-amber-500 border-amber-500 bg-amber-500/10";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content - Slide Up Animation */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full h-[95vh] sm:h-[90vh] bg-background rounded-t-[20px] sm:rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-w-7xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Floating */}
            <div className="absolute top-4 right-4 z-50">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

             {/* --- LEFT COLUMN: Key Info & Actions --- */}
            <div className="w-full md:w-[400px] shrink-0 bg-slate-50 dark:bg-slate-900/50 border-r border-border flex flex-col h-full overflow-y-auto">
              <div className="p-8 flex flex-col items-center text-center">
                {/* Logo Placeholder */}
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-border flex items-center justify-center mb-5">
                  <Building2 className="w-10 h-10 text-slate-400" />
                </div>

                <h2 className="text-2xl font-bold text-foreground leading-tight mb-2">
                  {job.title}
                </h2>
                <div className="flex items-center gap-2 text-primary font-medium mb-6">
                  <Globe className="w-4 h-4" />
                  {job.company}
                </div>

                {/* Match Score */}
                <div className={`flex flex-col items-center justify-center p-4 rounded-xl border border-dashed mb-6 w-full ${getScoreColor(score)}`}>
                  <span className="text-4xl font-extrabold tracking-tight">{score}%</span>
                  <span className="text-xs font-medium uppercase tracking-widest opacity-80 mt-1">Match Score</span>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 w-full gap-3 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border shadow-sm">
                    <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase text-muted-foreground font-semibold">Location</p>
                      <p className="text-sm font-medium">{job.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border shadow-sm">
                    <div className="p-2 rounded-md bg-purple-500/10 text-purple-500">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase text-muted-foreground font-semibold">Posted</p>
                      <p className="text-sm font-medium">{formatDate(job.date_posted)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto w-full space-y-3">
                  <Button
                    className="w-full h-12 text-base font-semibold shadow-lg shadow-blue-500/10"
                    onClick={() => window.open(job.apply_link || "#", '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-12 hover:bg-destructive hover:text-white border-destructive/20 text-destructive font-medium" onClick={onPass}>
                      <X className="w-4 h-4 mr-2" />
                      Pass
                    </Button>
                    <Button variant="outline" className="h-12 hover:bg-emerald-500 hover:text-white border-emerald-500/20 text-emerald-600 font-medium" onClick={onApply}>
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: Description & Details --- */}
            <div className="flex-1 min-w-0 bg-background flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-border bg-background z-10 w-full pr-16 sticky top-0">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Job Description
                </h3>
              </div>

              <ScrollArea className="flex-1 p-6 md:p-8">
                <div className="max-w-3xl space-y-8 pb-10">
                  {/* Tags */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Skills & Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {(job.tags ?? []).map(tag => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1 text-xs sm:text-sm font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">About the Role</h4>
                    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                      {cleanDescription(job.description_snippet || "")}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
