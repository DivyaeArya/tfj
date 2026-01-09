"use client";
import React from "react";

type Props = { parsed: any };

export default function ParsedProfileView({ parsed }: Props) {
  if (!parsed) return null;
  const display = parsed;

  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Parsed Profile
        </h2>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
          Auto-extracted
        </span>
      </div>

      {/* Basic Info + Education */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Basic Information
          </h3>
          <div className="space-y-2 text-sm text-slate-700">
            <InfoRow label="Name" value={display.info_dict?.full_name} />
            <InfoRow label="Email" value={display.info_dict?.email} />
            <InfoRow label="Phone" value={display.info_dict?.phone} />
            <InfoRow label="Location" value={display.info_dict?.location} />
            <InfoRow label="Roll No" value={display.info_dict?.roll_no} />
          </div>
        </div>

        {/* Education */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Education & Scores
          </h3>
          <div className="space-y-2 text-sm text-slate-700">
            <InfoRow label="College" value={display.job_dict?.college} />
            <InfoRow label="Branch" value={display.job_dict?.branch} />
            <InfoRow
              label="Graduation Year"
              value={display.job_dict?.year_of_graduation}
            />
            <InfoRow label="CGPA" value={display.job_dict?.cgpa} />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Links
        </h3>
        <div className="space-y-2 text-sm">
          <LinkRow label="GitHub" href={display.job_dict?.github} />
          <LinkRow label="LinkedIn" href={display.job_dict?.linkedin} />
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Tech Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {(display.job_dict?.tech_stack || []).map((t: string) => (
            <span
              key={t}
              className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Experiences */}
      <Section title="Experiences">
        {(display.job_dict?.experiences || []).map((e: any, i: number) => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div className="font-medium text-slate-900">
                {e.position}
                {e.company && (
                  <span className="text-slate-500"> @ {e.company}</span>
                )}
              </div>
              <span className="text-xs text-slate-500">{e.duration}</span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{e.description}</p>
          </Card>
        ))}
      </Section>

      {/* Projects */}
      <Section title="Projects">
        {(display.job_dict?.projects || []).map((p: any, i: number) => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div className="font-medium text-slate-900">{p.name}</div>
              <span className="text-xs text-slate-500">{p.duration}</span>
            </div>
            <p className="mt-2 text-sm text-slate-700">{p.description}</p>
          </Card>
        ))}
      </Section>

      {/* Positions */}
      <Section title="Positions of Responsibility">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {(display.job_dict?.positions_of_responsibility || []).map(
            (q: string, i: number) => (
              <li key={i}>{q}</li>
            )
          )}
        </ul>
      </Section>

      {/* Courses */}
      <Section title="Key Courses">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {(display.job_dict?.key_courses_taken || []).map(
            (q: string, i: number) => (
              <li key={i}>{q}</li>
            )
          )}
        </ul>
      </Section>

      {/* Raw JSON */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-900 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
          Raw JSON
        </h3>
        <pre className="max-h-64 overflow-auto text-xs text-slate-100">
          {JSON.stringify(display, null, 2)}
        </pre>
      </div>
    </section>
  );
}

/* ---------- Small UI helpers (no logic) ---------- */

function InfoRow({ label, value }: { label: string; value?: any }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">
        {value ?? "—"}
      </span>
    </div>
  );
}

function LinkRow({ label, href }: { label: string; href?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-indigo-600 hover:underline"
        >
          {href}
        </a>
      ) : (
        <span className="text-slate-400">—</span>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      {children}
    </div>
  );
}
