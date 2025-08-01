// src/pages/ManageCategories.tsx
import { useEffect, useState } from "react";
import {
  ref as dbRef,
  set,
  get,
  remove,
  update,
  child,
} from "firebase/database";
import { database } from "@/Services/Firebase.config.js";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "../components/ui/card";

const ManageCategories = () => {
  const [categories, setCategories] = useState<Record<string, any>>({});
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const snap = await get(
      child(dbRef(database), "CVC/GeneralMaster/Product Group")
    );
    if (snap.exists()) setCategories(snap.val() || {});
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!categoryName.trim()) return toast.error("Enter a valid category name");
    setLoading(true);

    try {
      if (editId) {
        // Edit category
        await update(
          dbRef(database, `CVC/GeneralMaster/Product Group/${editId}`),
          {
            generalName: categoryName,
          }
        );
        toast.success("Category updated!");
      } else {
        // Create new category
        const newId = Date.now().toString();
        await set(dbRef(database, `CVC/GeneralMaster/Product Group/${newId}`), {
          id: newId,
          generalName: categoryName,
          genType: "Product Group",
          generalCode: 0,
          companyID: "CVC",
        });
        toast.success("Category created!");
      }
      setCategoryName("");
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string, name: string) => {
    setEditId(id);
    setCategoryName(name);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirm) return;
    try {
      await remove(dbRef(database, `CVC/GeneralMaster/Product Group/${id}`));
      toast.success("Category deleted!");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

      <div className="flex gap-2 mb-4">
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
        />
        <Button onClick={handleSave} disabled={loading}>
          {editId ? "Update" : "Add"}
        </Button>
        {editId && (
          <Button
            variant="ghost"
            onClick={() => {
              setEditId(null);
              setCategoryName("");
            }}
          >
            Cancel
          </Button>
        )}
      </div>

      <div className="grid gap-2">
        {Object.entries(categories).map(([id, cat]) => (
          <Card key={id} className="p-3 flex justify-between items-center">
            <span className="text-gray-800">{cat.generalName}</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleEdit(id, cat.generalName)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageCategories;
