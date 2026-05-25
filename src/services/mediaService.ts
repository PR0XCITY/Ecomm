import { getLocalData, setLocalData, delay } from "./db";

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  folder: string;
  size: string;
  dimensions: string;
  createdAt: string;
}

export const mediaService = {
  getAssets: async (): Promise<MediaAsset[]> => {
    await delay(300);
    return getLocalData<MediaAsset[]>("ss_media", []);
  },

  uploadAsset: async (
    name: string,
    url: string,
    folder: string,
    size?: string,
    dimensions?: string
  ): Promise<MediaAsset> => {
    await delay(500); // Simulate upload processing delay
    const list = getLocalData<MediaAsset[]>("ss_media", []);

    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      name,
      url,
      folder,
      size: size || "180 KB",
      dimensions: dimensions || "1024x1024",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    list.unshift(newAsset);
    setLocalData("ss_media", list);

    // Audit Log
    const auditLogs = getLocalData<any[]>("ss_audit_logs", []);
    auditLogs.unshift({
      id: `audit-${Date.now()}`,
      action: `Media: Uploaded new asset "${name}" to folder "${folder}"`,
      user: "Admin",
      timestamp: new Date().toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" }),
    });
    setLocalData("ss_audit_logs", auditLogs.slice(0, 100));

    return newAsset;
  },

  deleteAsset: async (id: string): Promise<void> => {
    await delay(300);
    const list = getLocalData<MediaAsset[]>("ss_media", []);
    const filtered = list.filter((m) => m.id !== id);
    setLocalData("ss_media", filtered);
  },

  deleteBulkAssets: async (ids: string[]): Promise<void> => {
    await delay(400);
    const list = getLocalData<MediaAsset[]>("ss_media", []);
    const filtered = list.filter((m) => !ids.includes(m.id));
    setLocalData("ss_media", filtered);
  }
};
