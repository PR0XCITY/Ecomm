import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { productService } from "../../services/productService";
import type { ProductLifecycle } from "../../services/productService";
import { TableSkeleton } from "../../components/SkeletonLoader";

export const AdminProducts: React.FC = () => {
  const { addToast, reloadCatalog } = useApp();

  const [products, setProducts] = useState<ProductLifecycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Editor Form modal state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    title: "",
    category: "Playing Cards" as any,
    price: 1500,
    description: "",
    detailedDescription: "",
    image: "",
    tag: "Keepsake",
    stock: 50,
    status: "Draft" as any,
    scheduledDate: "",
    seoTitle: "",
    seoDesc: "",
    specName: "",
    specValue: "",
    specifications: [] as { name: string; value: string }[],
    variantName: "",
    variantOptions: "",
    variants: [] as { name: string; options: string[] }[],
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts(true);
      setProducts(data);
    } catch {
      addToast("Failed to fetch product catalog.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await productService.duplicateProduct(id);
      addToast("Product duplicated successfully.");
      await loadProducts();
      await reloadCatalog();
    } catch {
      addToast("Failed to duplicate product.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(id);
      addToast("Product deleted successfully.");
      await loadProducts();
      await reloadCatalog();
    } catch {
      addToast("Failed to delete product.", "error");
    }
  };

  const handleOpenAdd = () => {
    setEditingProductId(null);
    setForm({
      title: "",
      category: "Playing Cards",
      price: 1500,
      description: "",
      detailedDescription: "",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFkCBKghdr-EtT29gkp7qdNHHB63sM-uBw3PZTpg3aFEXckZV0mZ7Znu_HTVn29S30skNQcDPhgxDLg8yYQlZLtl6rylngTnInIl68cwTRE6y6i2j4PY_ba_xXXF8vIz8Z3Zg4U_UjJWhHQm--jWmRly-h2tS2ZfvsVe5QRRaJ6O-gPMwT9_E602Fu1QBp7fm7sgYNVBFOlMZ_ZofnZ7c-ReyA0R70R5orPwJ0R9yi8IxSBWHtbjsKYhWM0Xep4wGkk7jzIkaD",
      tag: "Keepsake",
      stock: 50,
      status: "Draft",
      scheduledDate: "",
      seoTitle: "",
      seoDesc: "",
      specName: "",
      specValue: "",
      specifications: [],
      variantName: "",
      variantOptions: "",
      variants: [],
    });
    setEditorOpen(true);
  };

  const handleOpenEdit = async (prod: ProductLifecycle) => {
    setEditingProductId(prod.id);
    setForm({
      title: prod.title,
      category: prod.category,
      price: prod.price,
      description: prod.description,
      detailedDescription: prod.detailedDescription || "",
      image: prod.image,
      tag: prod.tag,
      stock: prod.stock,
      status: prod.status || "Published",
      scheduledDate: prod.scheduledDate || "",
      seoTitle: prod.seo?.title || "",
      seoDesc: prod.seo?.description || "",
      specName: "",
      specValue: "",
      specifications: prod.specifications || [],
      variantName: "",
      variantOptions: "",
      variants: prod.variants || [],
    });
    setEditorOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      addToast("Please input all required fields.", "error");
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      price: form.price,
      description: form.description.trim(),
      detailedDescription: form.detailedDescription.trim(),
      image: form.image,
      tag: form.tag,
      stock: form.stock,
      status: form.status,
      scheduledDate: form.scheduledDate,
      aesthetics: ["Minimal" as any], // standard default
      seo: { title: form.seoTitle.trim(), description: form.seoDesc.trim() },
      specifications: form.specifications,
      variants: form.variants,
    };

    try {
      if (editingProductId) {
        await productService.updateProduct(editingProductId, payload);
        addToast("Product updated successfully.");
      } else {
        await productService.createProduct(payload);
        addToast("Product created successfully.");
      }
      setEditorOpen(false);
      await loadProducts();
      await reloadCatalog();
    } catch (err: any) {
      addToast(err.message || "Failed to save product.", "error");
    }
  };

  // Add Spec to list helper
  const handleAddSpec = () => {
    if (!form.specName.trim() || !form.specValue.trim()) return;
    setForm({
      ...form,
      specifications: [...form.specifications, { name: form.specName.trim(), value: form.specValue.trim() }],
      specName: "",
      specValue: "",
    });
  };

  const handleRemoveSpec = (idx: number) => {
    setForm({
      ...form,
      specifications: form.specifications.filter((_, i) => i !== idx),
    });
  };

  // Add Variant to list helper
  const handleAddVariant = () => {
    if (!form.variantName.trim() || !form.variantOptions.trim()) return;
    const options = form.variantOptions.split(",").map((o) => o.trim()).filter((o) => o);
    setForm({
      ...form,
      variants: [...form.variants, { name: form.variantName.trim(), options }],
      variantName: "",
      variantOptions: "",
    });
  };

  const handleRemoveVariant = (idx: number) => {
    setForm({
      ...form,
      variants: form.variants.filter((_, i) => i !== idx),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-secondary/15 text-primary";
      case "Draft":
        return "bg-surface-container-high text-on-surface-variant";
      case "Scheduled":
        return "bg-secondary-container text-on-secondary-container";
      case "Archived":
        return "bg-error-container text-on-error-container";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="font-headline-md text-2xl text-on-surface">Products Catalog</h2>
          <p className="text-xs text-on-surface-variant mt-1">Publish, schedule, and configure variants.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-primary text-on-primary hover:bg-primary-container px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border-none"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Product
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-grow max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-outline rounded-lg bg-surface-lowest text-xs w-full"
          />
        </div>
      </div>

      {/* Catalog Listing Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/50 text-on-surface-variant font-semibold uppercase tracking-wider">
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4">Lifecycle Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-xs">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-surface-container-low/30">
                    <td className="p-4 font-semibold text-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-surface-container rounded overflow-hidden shrink-0">
                          <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="hover:underline cursor-pointer" onClick={() => handleOpenEdit(prod)}>
                          {prod.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-on-surface-variant">{prod.category}</td>
                    <td className="p-4 font-semibold text-on-surface">₹{prod.price.toLocaleString()}</td>
                    <td className={`p-4 text-center font-bold ${prod.stock <= 20 ? "text-error" : "text-on-surface"}`}>
                      {prod.stock} units
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(prod.status)}`}>
                        {prod.status || "Published"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 text-[16px]">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 hover:bg-surface-container text-on-surface-variant hover:text-primary rounded cursor-pointer border-none bg-transparent"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDuplicate(prod.id)}
                          className="p-1.5 hover:bg-surface-container text-on-surface-variant hover:text-secondary rounded cursor-pointer border-none bg-transparent"
                          title="Duplicate"
                        >
                          <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          className="p-1.5 hover:bg-surface-container text-on-surface-variant hover:text-error rounded cursor-pointer border-none bg-transparent"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                      No products match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCT EDITOR SLIDE-OVER MODAL */}
      {editorOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-surface w-full max-w-2xl h-screen overflow-y-auto p-8 shadow-2xl border-l border-outline-variant/30 flex flex-col justify-between text-xs">
            <div>
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-6">
                <h3 className="font-headline-sm text-lg text-primary">
                  {editingProductId ? "Modify Catalog Product" : "Create Catalog Product"}
                </h3>
                <button
                  onClick={() => setEditorOpen(false)}
                  className="p-1.5 hover:bg-surface-container rounded-full text-on-surface border-none bg-transparent cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                {/* General Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Traditional Wax Stamp Set"
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    >
                      <option value="Playing Cards">Playing Cards</option>
                      <option value="Wedding Stationery">Wedding Stationery</option>
                      <option value="Badges">Badges</option>
                      <option value="Tic-Tac-Toe sheets">Tic-Tac-Toe sheets</option>
                      <option value="Favors">Favors</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Price (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Initial Stock *</label>
                    <input
                      type="number"
                      required
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Image URL *</label>
                    <input
                      type="text"
                      required
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Brief Description *</label>
                    <input
                      type="text"
                      required
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Brief summary..."
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Detailed description</label>
                    <textarea
                      rows={3}
                      value={form.detailedDescription}
                      onChange={(e) => setForm({ ...form, detailedDescription: e.target.value })}
                      placeholder="Expanded specification..."
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    />
                  </div>
                </div>

                {/* Lifecycle Status & Scheduled Delivery */}
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Lifecycle Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  {form.status === "Scheduled" && (
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Publish Date</label>
                      <input
                        type="datetime-local"
                        required
                        value={form.scheduledDate}
                        onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                        className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Variants Editor */}
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-4">
                  <h4 className="font-bold text-primary uppercase tracking-wide">Product Variants</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Name (e.g., Color)"
                      value={form.variantName}
                      onChange={(e) => setForm({ ...form, variantName: e.target.value })}
                      className="flex-grow p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Options (comma separated, e.g. Gold, Silver)"
                      value={form.variantOptions}
                      onChange={(e) => setForm({ ...form, variantOptions: e.target.value })}
                      className="flex-grow p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="bg-secondary text-on-secondary px-4 rounded-lg font-bold hover:opacity-90 cursor-pointer border-none"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {form.variants.map((v, idx) => (
                      <span key={idx} className="bg-surface border border-outline px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold text-[10px]">
                        <span>{v.name}: {v.options.join("/")}</span>
                        <span onClick={() => handleRemoveVariant(idx)} className="material-symbols-outlined text-[12px] text-error cursor-pointer">close</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specifications Editor */}
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-4">
                  <h4 className="font-bold text-primary uppercase tracking-wide">Technical Specifications</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Feature Name (e.g. Paper Weight)"
                      value={form.specName}
                      onChange={(e) => setForm({ ...form, specName: e.target.value })}
                      className="flex-grow p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Feature Value (e.g. 350 GSM)"
                      value={form.specValue}
                      onChange={(e) => setForm({ ...form, specValue: e.target.value })}
                      className="flex-grow p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="bg-secondary text-on-secondary px-4 rounded-lg font-bold hover:opacity-90 cursor-pointer border-none"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {form.specifications.map((s, idx) => (
                      <span key={idx} className="bg-surface border border-outline px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold text-[10px]">
                        <span>{s.name}: {s.value}</span>
                        <span onClick={() => handleRemoveSpec(idx)} className="material-symbols-outlined text-[12px] text-error cursor-pointer">close</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* SEO Metadata */}
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 space-y-3">
                  <h4 className="font-bold text-primary uppercase tracking-wide">Search Engine Optimization (SEO)</h4>
                  <div>
                    <label className="block text-[10px] text-on-surface-variant uppercase mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={form.seoTitle}
                      onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                      placeholder="If blank, default product title is displayed"
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-on-surface-variant uppercase mb-1">Meta Description</label>
                    <input
                      type="text"
                      value={form.seoDesc}
                      onChange={(e) => setForm({ ...form, seoDesc: e.target.value })}
                      placeholder="Summarize metadata..."
                      className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/30 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditorOpen(false)}
                    className="border border-outline px-5 py-2.5 rounded-lg font-semibold hover:bg-surface-container cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-on-primary px-8 py-2.5 rounded-lg font-bold hover:bg-primary-container cursor-pointer border-none"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
