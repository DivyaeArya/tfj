import React from "react";

export const metadata = {
  title: "Grow",
  description: "Growth resources and recommendations",
};

export default function GrowPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Grow</h1>
      <p className="text-gray-600 mb-6">Resources to help you grow your career.</p>

      <section className="grid gap-4">
        <div className="p-4 bg-white rounded-lg shadow border">
          <h2 className="font-medium text-lg">Learning Paths</h2>
          <p className="text-sm text-gray-500 mt-2">Curated paths to skill up for common roles.</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow border">
          <h2 className="font-medium text-lg">Interview Prep</h2>
          <p className="text-sm text-gray-500 mt-2">Practice resources and common questions.</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow border">
          <h2 className="font-medium text-lg">Career Advice</h2>
          <p className="text-sm text-gray-500 mt-2">Articles and tips from industry professionals.</p>
        </div>
      </section>
    </main>
  );
}
