import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await ApiService.getAllCategory();
        if (response.status === 200) {
          setCategories(response.categories);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al obtener categorías: " + error
        );
      }
    };
    getCategories();
  }, []);

  const addCategory = async () => {
    if (!categoryName) {
      showMessage("El nombre de la categoría es obligatorio");
      return;
    }
    try {
      await ApiService.createCategory({ name: categoryName });
      showMessage("Categoría creada exitosamente");
      setCategoryName("");
      window.location.reload();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error al crear categoría: " + error
      );
    }
  };

  const editCategory = async () => {
    try {
      await ApiService.updateCategory(editingCategoryId, {
        name: categoryName,
      });
      showMessage("Categoría editada exitosamente");
      setIsEditing(false);
      setCategoryName("");
      window.location.reload();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error al editar categoría: " + error
      );
    }
  };

  const handleEditCategory = (category) => {
    setIsEditing(true);
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("¿Estás seguro que deseas eliminar esta categoría?")) {
      try {
        await ApiService.deleteCategory(categoryId);
        showMessage("Categoría eliminada exitosamente");
        window.location.reload();
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al eliminar categoría: " + error
        );
      }
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      <div className="p-6">
        {message && (
          <div className="mb-6 text-center">
            <p className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded shadow-sm text-sm font-medium">
              {message}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            🗂️ Categorías
          </h1>
          <div className="flex gap-2">
            <input
              value={categoryName}
              type="text"
              placeholder="Nombre de la categoría"
              onChange={(e) => setCategoryName(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
            />

            {!isEditing ? (
              <button
                onClick={addCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none transition duration-300 ease-in-out"
              >
                Agregar
              </button>
            ) : (
              <button
                onClick={editCategory}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange  -600 focus:outline-none transition duration-300 ease-in-out"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        {categories.length > 0 ? (
          <ul className="space-y-4">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between bg-white shadow-lg p-4 rounded-lg hover:shadow-xl transition duration-300"
              >
                <span className="font-medium text-lg text-gray-700">
                  {category.name}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 focus:outline-none transition duration-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 focus:outline-none transition duration-300"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No hay categorías registradas.</p>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
