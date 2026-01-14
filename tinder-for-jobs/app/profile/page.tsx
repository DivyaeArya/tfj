"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import ResumeUploader from "./components/ResumeUploader";
import ParsedProfileView from "./components/ParsedProfileView";
import { UploadResumeResponse, fetchUserProfile } from "@/lib/resumeApi";
import { useState } from "react";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

function ProfilePageContent() {
  const { user, getIdToken } = useAuth();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedUser, setUploadedUser] = useState<UploadResumeResponse | null>(null);

  // Fetch user profile from server
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["user-profile", user?.uid],
    queryFn: async () => {
      const token = await getIdToken();
      if (!token) throw new Error("Not authenticated");
      return fetchUserProfile(token);
    },
    enabled: !!user,
  });

  const handleUploadComplete = (response: UploadResumeResponse) => {
    setUploadSuccess(true);
    setUploadedUser(response);
    console.log("Resume uploaded successfully:", response);
  };

  if (uploadSuccess && uploadedUser) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="mb-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Resume Uploaded!</h1>
            <p className="text-lg text-muted-foreground">
              Welcome, <span className="font-semibold">{uploadedUser.name || userProfile?.name}</span>
            </p>
            <p className="text-muted-foreground">
              Your resume has been parsed and saved to your profile.
            </p>
          </div>

          {/* Parsed Profile View */}
          {userProfile && <ParsedProfileView parsed={userProfile} />}
        </div>
      </div>
    );
  }

  // Show profile data if user already has one
  if (userProfile && (userProfile.job_dict || userProfile.info_dict)) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground text-lg">
              Welcome back, <span className="font-semibold">{userProfile.name || "User"}</span>
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Your Profile
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's your parsed resume data.
            </p>
          </div>

          <ParsedProfileView parsed={userProfile} />

          <div className="flex justify-center">
            <button
              onClick={() => setUploadSuccess(false)}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Upload New Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Upload Your Resume
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your resume to get started.
          </p>
        </div>

        <ResumeUploader onUploadComplete={handleUploadComplete} />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}