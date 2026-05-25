import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { mediaService } from "../../services/mediaService";
import type { MediaAsset } from "../../services/mediaService";

export const AdminMedia: React.FC = () => {
  const { addToast } = useApp();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  // Upload State
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    url: "",
    folder: "stationery",
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const data = await mediaService.getAssets();
      setAssets(data);
    } catch {
      addToast("Failed to fetch asset library.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name.trim() || !uploadForm.url.trim()) return;

    try {
      await mediaService.uploadAsset(
        uploadForm.name.trim(),
        uploadForm.url.trim(),
        uploadForm.folder
      );
      addToast("Asset uploaded successfully.");
      setUploadOpen(false);
      setUploadForm({ name: "", url: "", folder: "stationery" });
      await loadAssets();
    } catch {
      addToast("Failed to upload asset.", "error");
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!window.confirm("Delete this asset permanently?")) return;
    try {
      await mediaService.deleteAsset(id);
      addToast("Asset deleted.");
      setPreviewAsset(null);
      await loadAssets();
    } catch {
      addToast("Failed to delete asset.", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} assets permanently?`)) return;

    try {
      await mediaService.deleteBulkAssets(selectedIds);
      addToast(`${selectedIds.length} assets deleted.`);
      setSelectedIds([]);
      await loadAssets();
    } catch {
      addToast("Failed to bulk delete assets.", "error");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filtered = assets.filter((asset) => {
    const matchSearch = asset.name.toLowerCase().includes(search.toLowerCase());
    const matchFolder = selectedFolder === "all" || asset.folder === selectedFolder;
    return matchSearch && matchFolder;
  });

  const folders = ["all", "stationery", "playing_cards", "accessories"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="font-headline-md text-2xl text-on-surface">Media Asset Library</h2>
          <p className="text-xs text-on-surface-variant mt-1">Organize product pictures, monograms, and mock files.</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-error-container text-error hover:bg-error/15 px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer border-none"
            >
              Bulk Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setUploadOpen(true)}
            className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border-none"
          >
            <span className="material-symbols-outlined text-[16px]">upload_file</span>
            Upload File
          </button>
        </div>
      </div>

      {/* Directory Filter & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
        {/* Folders Tabs */}
        <div className="flex gap-2">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-4 py-1.5 rounded-full capitalize font-semibold cursor-pointer border-none ${
                selectedFolder === f
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-outline rounded-lg bg-surface-lowest text-xs w-full"
          />
        </div>
      </div>

      {/* Assets Grid & Info Panel */}
      {isLoading ? (
        <p className="text-center py-6 text-on-surface-variant">Scanning folders...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start text-xs text-left">
          {/* Main Assets Grid (Col 3) */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 min-h-[40vh]">
            {filtered.map((asset) => {
              const isChecked = selectedIds.includes(asset.id);
              return (
                <div
                  key={asset.id}
                  className={`group relative rounded-lg border overflow-hidden cursor-pointer select-none transition-all duration-300 aspect-square flex flex-col justify-between ${
                    isChecked ? "border-primary ring-2 ring-primary-fixed shadow-sm" : "border-outline-variant/30 hover:border-primary/20"
                  }`}
                  onClick={() => setPreviewAsset(asset)}
                >
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between p-2 items-start pointer-events-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(asset.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-primary w-4 h-4 pointer-events-auto cursor-pointer"
                    />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-surface/90 border-t border-outline-variant/20 p-2 font-mono text-[9px] truncate text-primary font-bold">
                    {asset.name}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-12 text-on-surface-variant italic">No media assets in directory matching criteria.</div>
            )}
          </div>

          {/* Asset Preview Info Panel (Col 1) */}
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-label-md text-xs font-bold uppercase tracking-wider text-primary">
              File Inspector
            </h3>
            {previewAsset ? (
              <div className="space-y-4">
                <div className="aspect-square bg-surface border border-outline-variant/20 rounded overflow-hidden">
                  <img src={previewAsset.url} alt={previewAsset.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-xs space-y-2 text-on-surface-variant">
                  <p className="font-bold text-on-surface truncate">Name: {previewAsset.name}</p>
                  <p>Folder: <span className="font-semibold uppercase font-mono">{previewAsset.folder}</span></p>
                  <p>Weight: {previewAsset.size}</p>
                  <p>Scale: {previewAsset.dimensions} px</p>
                  <p>Added: {previewAsset.createdAt}</p>
                </div>
                <div className="pt-2 border-t border-outline-variant/20 flex gap-2">
                  <button
                    onClick={() => handleDeleteAsset(previewAsset.id)}
                    className="w-full bg-error-container text-error hover:bg-error/15 py-2 rounded font-bold cursor-pointer transition-colors border-none"
                  >
                    Delete Asset
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center py-12 text-on-surface-variant italic leading-relaxed">
                Click any asset card to inspect scale parameters.
              </p>
            )}
          </div>
        </div>
      )}

      {/* UPLOAD SIMULATOR MODAL */}
      {uploadOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-surface w-full max-w-sm rounded-xl p-6 shadow-2xl border border-outline-variant/30 relative text-xs text-left">
            <button
              onClick={() => setUploadOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-2 cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-sm text-primary mb-4">Upload Media Asset</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. envelope-wax-gold.jpg"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Source URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Folder Destination</label>
                <select
                  value={uploadForm.folder}
                  onChange={(e) => setUploadForm({ ...uploadForm, folder: e.target.value })}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                >
                  <option value="stationery">Stationery</option>
                  <option value="playing_cards">Playing Cards</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary-container cursor-pointer border-none"
              >
                Start Upload Simulation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
