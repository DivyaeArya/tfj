export interface UploadResumeResponse {
  success: boolean;
  uid: string;
  name: string;
  email: string;
}

export interface DatabaseJob {
  id: string;
  title: string;
  company: string;
  tags: string[];
  location: string;
  date_posted: string;
  apply_link: string;
  description_snippet: string;
  score: number;
}

export type InfoDict = Record<string, any>;
export type JobDict = Record<string, any>;

const BACKEND_URL = "http://localhost:8000";

export async function uploadResume(
  file: File,
  token: string
): Promise<UploadResumeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BACKEND_URL}/parse-resume`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.detail || "Failed to upload resume");
  }
  return data;
}

export async function saveProfile(
  jobDict: JobDict,
  token: string
): Promise<{ ranked_jobs: DatabaseJob[] }> {
  const res = await fetch(`${BACKEND_URL}/save-profile`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobDict),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.detail || "Failed to save profile");
  }
  return { ranked_jobs: data.ranked_jobs || [] };
}