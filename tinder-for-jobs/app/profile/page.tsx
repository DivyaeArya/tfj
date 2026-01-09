"use client";
import React, { useState } from "react";
import ResumeUploader from "./components/ResumeUploader";
import BioEditor from "./components/BioEditor";
import ParsedProfileView from "./components/ParsedProfileView";

export default function ProfilePage() {
  const [parsed, setParsed] = useState<any>(null);

  return (
    <div className="flex-row items-center  bg-white min-h-screen p-4 font-sans text-slate-900">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <ResumeUploader onParsed={(data) => setParsed(data)} />

      
      {parsed && <BioEditor onChange={() => {}} />}
      {parsed && <ParsedProfileView parsed={parsed} />}
    </div>
  );
}
