"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import ResumeUploader from "./components/ResumeUploader";
import { UploadResumeResponse } from "@/lib/resumeApi";
import { useState } from "react";
import { Check } from "lucide-react";

function ProfilePageContent() {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedUser, setUploadedUser] = useState<UploadResumeResponse | null>(null);

  const handleUploadComplete = (response: UploadResumeResponse) => {
    setUploadSuccess(true);
    setUploadedUser(response);
    console.log("Resume uploaded successfully:", response);
  };

  if (uploadSuccess && uploadedUser) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Resume Uploaded!</h1>
          <p className="text-lg text-muted-foreground">
            Welcome, <span className="font-semibold">{uploadedUser.name}</span>
          </p>
          <p className="text-muted-foreground">
            Your resume has been saved to your profile.
          </p>
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