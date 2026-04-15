const BASE_URL = import.meta.env.VITE_API_URL;

// 🔹 Chat / Proposal
export const generateTextOnly = async (prompt) => {
  const res = await fetch(`${BASE_URL}/generate-text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  return await res.json();
};

// 🔹 Replace Content — sends FormData so files are extracted server-side
export const replaceContentAPI = async (content, reference, instructions, contentFile, referenceFile) => {
  const formData = new FormData();
  formData.append("content", content || "");
  formData.append("reference", reference || "");
  formData.append("instructions", instructions || "");

  if (contentFile) formData.append("content_file", contentFile);
  if (referenceFile) formData.append("reference_file", referenceFile);

  const res = await fetch(`${BASE_URL}/replace`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
};

// 🔹 Report Generator
export const generateReportAPI = async (file, structure) => {
  const formData = new FormData();
  if (file) formData.append("file", file);
  formData.append("structure", structure);

  const res = await fetch(`${BASE_URL}/generate-report`, {
    method: "POST",
    body: formData,
  });

  return await res.json();
};

// 🔹 Export
export const exportFile = async (content, type) => {
  const res = await fetch(`${BASE_URL}/export/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  return await res.blob();
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

const PROJECTS_KEY = "docusmith_projects";

export const saveProject = (title, content, isPublic = false) => {
  const existing = getProjects();
  const project = {
    id: Date.now(),
    title: title || "Untitled Project",
    content,
    preview: content.slice(0, 100),
    date: new Date().toLocaleString(),
    isPublic,
  };
  existing.unshift(project);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(existing));
  return project;
};

export const getProjects = () => {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
  } catch {
    return [];
  }
};

export const getPublicProjects = () => {
  return getProjects().filter((p) => p.isPublic);
};