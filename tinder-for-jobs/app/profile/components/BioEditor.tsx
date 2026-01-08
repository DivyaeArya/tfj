"use client";
import React, { useEffect, useState } from 'react';

type Props = {
  value?: string;
  onChange?: (v: string) => void;
};

export default function BioEditor({ value = '', onChange }: Props) {
  const [bio, setBio] = useState<string>(value || '');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('profile_bio') || '';
      if (!value) setBio(stored);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('profile_bio', bio);
    } catch {}
    onChange?.(bio);
  }, [bio, onChange]);

  return (
    <section className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="font-semibold mb-2">Bio</h2>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Add a short bio..."
        className="w-full border rounded-md p-2 min-h-[96px]"
      />
    </section>
  );
}
