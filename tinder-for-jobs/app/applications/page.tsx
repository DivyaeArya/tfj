"use client";

import React, { useEffect, useState } from "react";

type Status = "accepted" | "pending" | "rejected";

type Application = {
  id: string;
  title: string;
  company: string;
  logo?: string;
  status: Status;
  appliedAt: string; // ISO date
  location?: string;
  salary?: string;
};

const STATUS_CLASSES: Record<Status, string> = {
  accepted: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("applications");
      if (raw) {
        setApplications(JSON.parse(raw));
        return;
      }
    } catch (e) {
      // ignore and use sample
    }

    setApplications(SAMPLE_APPLICATIONS);
  }, []);

  if (!applications) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Applications</h1>
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-black">Applications</h1>

      {applications.length === 0 ? (
        <div className="p-12 bg-white rounded-lg shadow text-center text-gray-600">
          No applications yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-4 bg-white rounded-lg shadow border flex items-start gap-4"
            >
              <img
                src={app.logo || "/favicon.ico"}
                alt={app.company}
                className="w-16 h-16 rounded-md object-cover border"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{app.title}</h2>
                    <p className="text-sm text-gray-600">{app.company} · {app.location}</p>
                    {app.salary && (
                      <div className="text-sm text-blue-600 font-semibold mt-1">{app.salary}</div>
                    )}
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_CLASSES[app.status]}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500 mt-2">Applied {formatDate(app.appliedAt)}</span>
                  </div>
                </div>

                {app?.logo && false}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return iso;
  }
}

const SAMPLE_APPLICATIONS: Application[] = [
  {
    id: "a1",
    title: "Frontend Engineer",
    company: "BrightApps",
    logo: "/company-logos/brightapps.png",
    status: "pending",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    location: "Remote",
    salary: "$90k - $120k",
  },
  {
    id: "a2",
    title: "Backend Engineer",
    company: "DataMill",
    logo: "/company-logos/datamill.png",
    status: "accepted",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    location: "New York, NY",
    salary: "$120k - $150k",
  },
  {
    id: "a3",
    title: "Product Designer",
    company: "FlowWorks",
    logo: "/company-logos/flowworks.png",
    status: "rejected",
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    location: "San Francisco, CA",
  },
];
