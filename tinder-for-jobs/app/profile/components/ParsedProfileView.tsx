"use client";
import React from 'react';

type Props = { parsed: any };

export default function ParsedProfileView({ parsed }: Props) {
  if (!parsed) return null;
  const display = parsed;

  return (
    <section className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="font-semibold mb-4">Parsed Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold">Basic Info</h3>
          <div className="mt-2 text-sm text-slate-700 space-y-1">
            <div><strong>Name:</strong> {display.info_dict?.full_name || '—'}</div>
            <div><strong>Email:</strong> {display.info_dict?.email || '—'}</div>
            <div><strong>Phone:</strong> {display.info_dict?.phone || '—'}</div>
            <div><strong>Location:</strong> {display.info_dict?.location || '—'}</div>
            <div><strong>Roll No:</strong> {display.info_dict?.roll_no || '—'}</div>
          </div>
        </div>

        <div>
          <h3 className="font-bold">Education / Scores</h3>
          <div className="mt-2 text-sm text-slate-700 space-y-1">
            <div><strong>College:</strong> {display.job_dict?.college || '—'}</div>
            <div><strong>Branch:</strong> {display.job_dict?.branch || '—'}</div>
            <div><strong>Year:</strong> {display.job_dict?.year_of_graduation || '—'}</div>
            <div><strong>CGPA:</strong> {display.job_dict?.cgpa ?? '—'}</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold">Links</h3>
        <div className="mt-2 text-sm text-slate-700 space-y-1">
          <div><strong>GitHub:</strong> {display.job_dict?.github ? <a className="text-indigo-600" href={display.job_dict.github} target="_blank" rel="noreferrer">{display.job_dict.github}</a> : '—'}</div>
          <div><strong>LinkedIn:</strong> {display.job_dict?.linkedin ? <a className="text-indigo-600" href={display.job_dict.linkedin} target="_blank" rel="noreferrer">{display.job_dict.linkedin}</a> : '—'}</div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold">Tech Stack</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {(display.job_dict?.tech_stack || []).map((t: string) => (
            <span key={t} className="px-3 py-1 bg-slate-100 rounded-full text-sm">{t}</span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold">Experiences</h3>
        <div className="mt-2 space-y-4">
          {(display.job_dict?.experiences || []).map((e: any, i: number) => (
            <div key={i} className="border p-3 rounded">
              <div className="font-semibold">{e.position} {e.company ? `@ ${e.company}` : ''}</div>
              <div className="text-sm text-slate-500">{e.duration}</div>
              <div className="mt-2 text-sm">{e.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold">Projects</h3>
        <div className="mt-2 space-y-4">
          {(display.job_dict?.projects || []).map((p: any, i: number) => (
            <div key={i} className="border p-3 rounded">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-slate-500">{p.duration}</div>
              <div className="mt-2 text-sm">{p.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-bold">Positions of Responsibility</h3>
        <ul className="list-disc pl-5 mt-2 text-sm">
          {(display.job_dict?.positions_of_responsibility || []).map((q: string, i:number) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-bold">Key Courses</h3>
        <ul className="list-disc pl-5 mt-2 text-sm">
          {(display.job_dict?.key_courses_taken || []).map((q: string, i:number) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-bold">Raw JSON</h3>
        <pre className="mt-2 bg-slate-50 p-3 rounded max-h-64 overflow-auto text-sm">{JSON.stringify(display, null, 2)}</pre>
      </div>
    </section>
  );
}
