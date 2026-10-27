import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditProductPage = () => {
  const { productId } = useParams();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStokeQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await ApiService.getAllCategory();
        setCategories(categoriesData.categories);
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al obtener categorías: " + error
        );
      }
    };

    const fetchProductById = async () => {
      if (productId) {
        setIsEditing(true);
        try {
          const productData = await ApiService.getProductById(productId);
          if (productData.status === 200) {
            const product = productData.product;
            setName(product.name);
            setSku(product.sku);
            setPrice(product.price);
            setStokeQuantity(product.stockQuantity);
            setCategoryId(product.categoryId);
            setDescription(product.description);
            setImageUrl(`/${product.imageUrl}`);
          } else {
            showMessage(productData.message);
          }
        } catch (error) {
          showMessage(
            error.response?.data?.message ||
              "Error al obtener el producto: " + error
          );
        }
      }
    };

    fetchCategories();
    if (productId) fetchProductById();
  }, [productId]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("price", price);
    formData.append("stockQuantity", stockQuantity);
    formData.append("categoryId", categoryId);
    formData.append("description", description);
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      if (isEditing) {
        formData.append("productId", productId);
        await ApiService.updateProduct(formData);
        showMessage("Producto actualizado exitosamente");
      } else {
        await ApiService.addProduct(formData);
        showMessage("Producto guardado exitosamente 🤩");
      }
      navigate("/product");
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Error al guardar el producto: " + error
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {message && (
          <div className="mb-6 text-center">
            <p className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow-sm text-sm font-medium">
              {message}
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 space-y-8">
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            {isEditing ? "Editar Producto" : "Agregar Producto"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Producto
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código / SKU
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad en stock
              </label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStokeQuantity(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen del Producto
              </label>

              {/* Stylized button to upload image */}
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-block bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition duration-200"
              >
                Seleccionar archivo
              </label>

              {/* Hidden input */}
              <input
                id="image-upload"
                type="file"
                onChange={handleImageChange}
                className="hidden"
              />

             {/* Name of the selected file */}
              {imageFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Archivo seleccionado:{" "}
                  <span className="font-medium">{imageFile.name}</span>
                </p>
              )}

              {/* Image preview */}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="preview"
                  className="mt-4 h-48 w-full object-contain border border-gray-300 rounded-lg"
                />
              )}
            </div>

            {/* Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow transition duration-300"
              >
                {isEditing ? "Actualizar Producto" : "Agregar Producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddEditProductPage;
