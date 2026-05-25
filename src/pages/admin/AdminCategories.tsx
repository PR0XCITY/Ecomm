import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { getLocalData, setLocalData, delay } from "../../services/db";

export interface CategoryNode {
  id: string;
  name: string;
  parentId: string | null; // Null means parent level category
  image: string;
  description: string;
}

const defaultCategories: CategoryNode[] = [
  { id: "cat-1", name: "Wedding Stationery", parentId: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBx4_9aBVTmSw53V26dxzt4BnvNDcpMoH235RrDgOTlZYYkWITHFmjtB7xLO7rqRx3c29CTZFM3E2q98OEpHC0KtrFlOgo3FP5CGxoaYIA34WLRWNnYaRA4xa2osgbcsdY9-LEEdkekNokNQjNoVt4aQ0cXbQ1vUN73wfN34rTiMLA_t1EDfzNakv2liVwXjQohaPwhLZx2lgpVKpVH9yaYbkPCVXvKm5OaZTECZNgsmjN_U9MKyu_t9V87fVRyC2xQtd1DDRV-", description: "Bespoke wax stamps and copperplate envelopes." },
  { id: "cat-2", name: "Playing Cards", parentId: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm2ft6JhqPGH94byzSmBwoBrEncSQajELtSNlBXClBzAeX1b76e12e3DOhs-B6L8zGa9WFVew5OwNhuSRKrHjE_G1hCYYxgPPHuLJyYgbaEdjimOxlBmY1IWFicHYhvDbMQ2qRn2xcJZNRqEjK-NJApds5settB-fxVa8DHhI1qrdCD_1gmncv6uDLIcSi9FNUM5X95anHV0DwA_jcuUu1kR-1i8s722FYcC3aAzMfdwV_X6EZKgWxtJZXi-B4ekVDHf41iU6l", description: "Bespoke monogram gold-foil decks." },
  { id: "cat-3", name: "Badges", parentId: null, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO", description: "Henna party and groom badges." },
  { id: "cat-4", name: "Letterpress Suites", parentId: "cat-1", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBx4_9aBVTmSw53V26dxzt4BnvNDcpMoH235RrDgOTlZYYkWITHFmjtB7xLO7rqRx3c29CTZFM3E2q98OEpHC0KtrFlOgo3FP5CGxoaYIA34WLRWNnYaRA4xa2osgbcsdY9-LEEdkekNokNQjNoVt4aQ0cXbQ1vUN73wfN34rTiMLA_t1EDfzNakv2liVwXjQohaPwhLZx2lgpVKpVH9yaYbkPCVXvKm5OaZTECZNgsmjN_U9MKyu_t9V87fVRyC2xQtd1DDRV-", description: "Bespoke cotton pressed invites." }
];

export const AdminCategories: React.FC = () => {
  const { addToast } = useApp();
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    parentId: "" as string,
    image: "",
    description: "",
  });

  const loadCategories = async () => {
    setIsLoading(true);
    await delay(300);
    setCategories(getLocalData<CategoryNode[]>("ss_categories", defaultCategories));
    setIsLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      name: "",
      parentId: "null",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBx4_9aBVTmSw53V26dxzt4BnvNDcpMoH235RrDgOTlZYYkWITHFmjtB7xLO7rqRx3c29CTZFM3E2q98OEpHC0KtrFlOgo3FP5CGxoaYIA34WLRWNnYaRA4xa2osgbcsdY9-LEEdkekNokNQjNoVt4aQ0cXbQ1vUN73wfN34rTiMLA_t1EDfzNakv2liVwXjQohaPwhLZx2lgpVKpVH9yaYbkPCVXvKm5OaZTECZNgsmjN_U9MKyu_t9V87fVRyC2xQtd1DDRV-",
      description: "",
    });
    setFormOpen(true);
  };

  const handleOpenEdit = (cat: CategoryNode) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      parentId: cat.parentId || "null",
      image: cat.image,
      description: cat.description,
    });
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this category? Subcategories will be orphaned.")) return;
    setIsLoading(true);
    await delay(300);
    const list = getLocalData<CategoryNode[]>("ss_categories", defaultCategories);
    const filtered = list.filter((c) => c.id !== id);
    setLocalData("ss_categories", filtered);
    addToast("Category deleted.");
    await loadCategories();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setIsLoading(true);
    await delay(300);

    const list = getLocalData<CategoryNode[]>("ss_categories", defaultCategories);
    const parentVal = form.parentId === "null" ? null : form.parentId;

    if (editingId) {
      // Edit
      const updated = list.map((c) =>
        c.id === editingId
          ? {
              ...c,
              name: form.name.trim(),
              parentId: parentVal,
              image: form.image.trim(),
              description: form.description.trim(),
            }
          : c
      );
      setLocalData("ss_categories", updated);
      addToast("Category updated.");
    } else {
      // Add
      const newCat: CategoryNode = {
        id: `cat-${Date.now()}`,
        name: form.name.trim(),
        parentId: parentVal,
        image: form.image.trim(),
        description: form.description.trim(),
      };
      list.push(newCat);
      setLocalData("ss_categories", list);
      addToast("Category created.");
    }

    setFormOpen(false);
    await loadCategories();
  };

  // Get parent categories for nested options mapping
  const parentCategories = categories.filter((c) => c.parentId === null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="font-headline-md text-2xl text-on-surface">Categories Organizer</h2>
          <p className="text-xs text-on-surface-variant mt-1">Configure nested hierarchical catalog categories.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border-none"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-surface-container-high rounded w-1/4" />
          <div className="h-40 bg-surface-container-high rounded w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const parent = categories.find((c) => c.id === cat.parentId);
            return (
              <div
                key={cat.id}
                className="border border-outline-variant/30 rounded-xl bg-surface-container-lowest overflow-hidden flex flex-col justify-between shadow-sm"
              >
                <div className="aspect-[2/1] bg-surface-container overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex-grow text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-primary">{cat.name}</h3>
                      {parent && (
                        <span className="bg-primary-fixed-dim/20 text-[10px] text-on-primary-fixed-variant font-bold px-2 py-0.5 rounded">
                          Child of: {parent.name}
                        </span>
                      )}
                    </div>
                    <p className="text-on-surface-variant mt-2 leading-relaxed">{cat.description || "No description provided."}</p>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-3 border-t border-outline-variant/10 font-bold">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer border-none bg-transparent"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-error hover:underline flex items-center gap-0.5 cursor-pointer border-none bg-transparent"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-surface w-full max-w-md rounded-xl p-8 shadow-2xl border border-outline-variant/30 relative text-xs text-left">
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-2 cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-sm text-primary mb-6">
              {editingId ? "Edit Category Details" : "Create New Category"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Letterpress Suites"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Parent Category</label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                >
                  <option value="null">None (Parent Category)</option>
                  {parentCategories
                    .filter((c) => c.id !== editingId) // Prevent circular parenting
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief summary..."
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="border border-outline px-4 py-2 rounded-lg font-semibold hover:bg-surface-container cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:bg-primary-container cursor-pointer border-none"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
