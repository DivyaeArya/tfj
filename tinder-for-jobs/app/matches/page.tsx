"use client";

import { useState, useEffect } from "react";
import { Job } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Briefcase, X, ExternalLink, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Job[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("swipehire-matches");
        let loadedMatches: Job[] = [];
        
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    loadedMatches = parsed;
                }
            } catch (e) {
                console.error("Failed to parse saved matches", e);
            }
        }
        
        if (loadedMatches.length > 0) {
            setMatches(loadedMatches);
        } else {
             // Fallback to mock data for demo purposes
             console.log("Loading mock matches...");
             setMatches(MOCK_MATCHES);
        }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && matches.length > 0) {
        localStorage.setItem("swipehire-matches", JSON.stringify(matches));
    }
  }, [matches]);

  const handleRemoveMatch = (jobId: string) => {
    setMatches((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleClearAll = () => {
    setMatches([]);
    localStorage.removeItem("swipehire-matches");
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Matches</h1>
            <p className="text-muted-foreground mt-1">
              Jobs you're interested in applying to
            </p>
          </div>
          {matches.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {matches.map((job, index) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors group"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveMatch(job.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                      {job.type}
                    </Badge>
                    <Badge variant="outline" className="bg-success/10 text-success text-xs">
                      {job.remote}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <DollarSign className="w-3.5 h-3.5 text-success" />
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Apply Button */}
                  <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Quick Apply
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No matches yet</h2>
            <p className="text-muted-foreground mb-6">
              Start swiping right on jobs you're interested in!
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/discovery">Discover Jobs</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}

const MOCK_MATCHES: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "TechFlow",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TF",
    type: "full-time",
    level: "senior",
    remote: "remote",
    location: "San Francisco, CA",
    salary: "$140k - $180k",
    description: "Join our dynamic team building next-gen interfaces...",
    requirements: ["React", "TypeScript", "3+ years exp"],
    postedDate: "2024-03-20",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: "2",
    title: "Product Designer",
    company: "Creative Minds",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=CM",
    type: "contract",
    level: "mid",
    remote: "hybrid",
    location: "New York, NY",
    salary: "$90k - $120k",
    description: "Design beautiful and functional user experiences...",
    requirements: ["Figma", "UI/UX", "Prototyping"],
    postedDate: "2024-03-18",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    skills: ["Figma", "UI/UX", "Prototyping", "Design Systems"],
  },
  {
    id: "3",
    title: "Backend Developer",
    company: "DataScale",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=DS",
    type: "full-time",
    level: "mid",
    remote: "onsite",
    location: "Austin, TX",
    salary: "$130k - $160k",
    description: "Build scalable backend systems...",
    requirements: ["Node.js", "SQL", "Cloud"],
    postedDate: "2024-03-15",
    coordinates: { lat: 30.2672, lng: -97.7431 },
    skills: ["Node.js", "PostgreSQL", "Redis", "Docker", "AWS"],
  },
];
