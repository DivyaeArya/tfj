"use client";
import React, { useState } from "react";

type Props = {
  onParsed: (data: any) => void;
};

export default function ResumeUploader({ onParsed }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file, file.name);
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (json.error) setError(json.error || "Parsing failed");
      else onParsed(json.parsed);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Upload Resume
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload a PDF or DOCX resume. We’ll extract profile details automatically.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* File picker */}
        <label className="flex-1 cursor-pointer">
          <div className="flex items-center justify-between px-4 py-3 border border-dashed border-slate-300 rounded-lg hover:border-indigo-400 transition">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">
                {file ? file.name : "Choose a resume file"}
              </span>
              <span className="text-xs text-slate-400">
                PDF, DOC, or DOCX
              </span>
            </div>
            <span className="text-sm text-indigo-600 font-medium">
              Browse
            </span>
          </div>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        {/* Upload button */}
        <button
          onClick={upload}
          disabled={!file || loading}
          className="h-[52px] px-6 rounded-lg font-medium text-white bg-indigo-600
                     hover:bg-indigo-700 transition
                     disabled:opacity-40 disabled:cursor-not-allowed
                     flex items-center justify-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Parsing…
            </span>
          ) : (
            "Upload & Parse"
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
    </section>
  );
}
