"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { JobCard } from "@/components/discovery/JobCard";
import { SwipeActions } from "@/components/discovery/SwipeActions";
import { JobDetailsModal } from "@/components/discovery/JobDetailsModal";
import { MatchScore } from "@/components/discovery/MatchScore";
import { AnimatedTags } from "@/components/discovery/AnimatedTags";
import { JobFilters, FilterState } from "@/components/discovery/JobFilters";
import { DatabaseJob } from "@/lib/resumeApi";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DiscoveryPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<DatabaseJob[]>([]);
  const [swipedJobs, setSwipedJobs] = useState<{ job: DatabaseJob; direction: "left" | "right" }[]>([]);
  const [matches, setMatches] = useState<DatabaseJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<DatabaseJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    remote: [],
    type: [],
    level: [],
    location: ""
  });

  // Load matches from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("swipehire-matches");
        if (saved) {
            setMatches(JSON.parse(saved));
        }
    }
  }, []);

  // Load ranked jobs from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
        const rankedJobs = localStorage.getItem("ranked-jobs");
        if (rankedJobs) {
            setJobs(JSON.parse(rankedJobs));
        } else {
            // If no jobs/resume, redirect to profile to force upload
            router.push("/profile");
        }
    }
  }, [router]);

  // Filter jobs based on location and tags
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [jobs, filters]);

  const currentJob = filteredJobs[0];
  // Use the score from the API (converted to percentage)
  const matchScore = currentJob ? Math.round(currentJob.score * 100) : 0;

  // Save matches to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
        localStorage.setItem("swipehire-matches", JSON.stringify(matches));
    }
  }, [matches]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === "Escape") setIsModalOpen(false);
        return;
      }

      if (!currentJob) return;

      switch (e.key) {
        case "ArrowLeft":
          handleSwipe("left");
          break;
        case "ArrowRight":
          handleSwipe("right");
          break;
        case "ArrowUp":
          handleViewDetails();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentJob, isModalOpen]);

  const handleSwipe = useCallback((direction: "left" | "right") => {
    if (!currentJob) return;

    if (direction === "right") {
      // 1. Trigger right swipe animation
      setExitDirection("right");

      // 2. Save to matches
      setMatches((prev) => {
        if (prev.some(j => j.id === currentJob.id)) return prev;
        return [...prev, currentJob];
      });

      // 3. Remove from job list after animation
      setTimeout(() => {
        setSwipedJobs((prev) => [...prev, { job: currentJob, direction }]);
        setJobs((prev) => prev.filter((j) => j.id !== currentJob.id));
        setExitDirection(null);
      }, 300); // Match exit transition duration (0.3s)
      return;
    }

    // Left swipe dismisses the job
    setExitDirection(direction);

    setTimeout(() => {
      setSwipedJobs((prev) => [...prev, { job: currentJob, direction }]);
      setJobs((prev) => prev.filter((j) => j.id !== currentJob.id));
      setExitDirection(null);
    }, 300); // Match exit transition duration
  }, [currentJob]);

  const handleUndo = useCallback(() => {
    const lastSwiped = swipedJobs[swipedJobs.length - 1];
    if (!lastSwiped) return;

    setSwipedJobs((prev) => prev.slice(0, -1));
    setJobs((prev) => [lastSwiped.job, ...prev]);

    if (lastSwiped.direction === "right") {
      setMatches((prev) => prev.filter((j) => j.id !== lastSwiped.job.id));
    }
  }, [swipedJobs]);

  const handleViewDetails = useCallback(() => {
    if (!currentJob) return;
    setSelectedJob(currentJob);
    setIsModalOpen(true);
  }, [currentJob]);

  // Called when user clicks "Apply" in the modal - saves job and moves to next
  const handleApplyFromModal = useCallback(() => {
    if (!selectedJob) return;

    // Save to matches
    setMatches((prev) => {
      if (prev.some(j => j.id === selectedJob.id)) return prev;
      return [...prev, selectedJob];
    });

    // Remove from job list with animation
    setExitDirection("right");
    setTimeout(() => {
      setSwipedJobs((prev) => [...prev, { job: selectedJob, direction: "right" }]);
      setJobs((prev) => prev.filter((j) => j.id !== selectedJob.id));
      setExitDirection(null);
      setIsModalOpen(false);
      setSelectedJob(null);
    }, 50);
  }, [selectedJob]);

  // Called when user clicks "Pass" in the modal - dismisses job
  const handlePassFromModal = useCallback(() => {
    if (!selectedJob) return;

    // Remove from job list with animation
    setExitDirection("left");
    setTimeout(() => {
      setSwipedJobs((prev) => [...prev, { job: selectedJob, direction: "left" }]);
      setJobs((prev) => prev.filter((j) => j.id !== selectedJob.id));
      setExitDirection(null);
      setIsModalOpen(false);
      setSelectedJob(null);
    }, 50);
  }, [selectedJob]);

  // No jobs loaded - prompt to upload resume
  if (jobs.length === 0 && (typeof window !== 'undefined' && !localStorage.getItem("ranked-jobs"))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">No Jobs Yet</h2>
          <p className="text-muted-foreground mb-6">
            Upload your resume to get personalized job recommendations based on your skills and experience.
          </p>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => router.push("/profile")}
          >
            Upload Resume
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Panel */}
          <div className="lg:col-span-2 space-y-3 order-2 lg:order-1">
            {currentJob && (
              <>
                <MatchScore score={matchScore} />
                <AnimatedTags tags={currentJob.tags} />
              </>
            )}
          </div>

          {/* Center Panel - Swipe Cards */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative min-h-[620px] flex flex-col items-center justify-start pt-2">
              {filteredJobs.length > 0 ? (
                <>
                  <div className="relative w-full max-w-md h-[480px]">
                    <AnimatePresence mode="popLayout">
                      {currentJob && (
                        <JobCard
                          key={currentJob.id}
                          job={currentJob}
                          exitDirection={exitDirection}
                          onSwipe={handleSwipe}
                          onViewDetails={handleViewDetails}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  <SwipeActions
                    onSwipeLeft={() => handleSwipe("left")}
                    onSwipeRight={() => handleSwipe("right")}
                    onViewDetails={handleViewDetails}
                  />

                  <p className="text-xs text-muted-foreground mt-2">
                    {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} remaining
                  </p>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Briefcase className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No more jobs</h3>
                  <p className="text-muted-foreground">
                    {jobs.length === 0
                      ? "You've swiped through all available jobs!"
                      : "Try adjusting your filters to see more jobs."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Filters */}
          <div className="lg:col-span-3 order-3">
            {/* Match Counter */}
            <div className="mt-4 bg-success/10 rounded-2xl p-4 border border-success/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Your Matches</span>
                <span className="text-2xl font-bold text-success">{matches.length}</span>
              </div>
            </div>
              <div className="mt-4">
                <JobFilters filters={filters} onFiltersChange={setFilters} />
              </div>
            
            
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyFromModal}
        onPass={handlePassFromModal}
      />
    </div>
    </ProtectedRoute>
  );
}
