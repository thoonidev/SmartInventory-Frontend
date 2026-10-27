import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const ReturnToSupplierPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productId, setProductId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await ApiService.getAllProducts();
        setProducts(productData.products || productData);
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al obtener productos: " + error.message
        );
      }
    };

    const fetchSuppliers = async () => {
      try {
        const supplierData = await ApiService.getAllSuppliers();
        setSuppliers(supplierData.suppliers || supplierData);
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al obtener proveedores: " + error.message
        );
      }
    };

    fetchProducts();
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId || !quantity || !supplierId) {
      showMessage("Por favor, rellene todos los campos obligatorios");
      return;
    }

    setLoading(true);

    const body = {
      productId,
      quantity: parseInt(quantity),
      description,
      note,
      supplierId,
    };

    try {
      const response = await ApiService.returnToSupplier(body);
      showMessage(response.message || "Producto devuelto con éxito");
      resetForm();
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Error al devolver producto: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductId("");
    setSupplierId("");
    setQuantity("");
    setDescription("");
    setNote("");
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {message && (
          <div className="mb-6 text-center">
            <p className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded shadow-sm text-sm font-medium">
              {message}
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 space-y-8">
          <h1 className="text-3xl font-semibold text-gray-800 text-center">
            Devolución a Proveedor
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Product */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Producto
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="">Seleccione un producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proveedor
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="">Seleccione un proveedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nota
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            {/* Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center justify-center px-6 py-2.5 text-white font-medium text-sm rounded shadow-md transition duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                {loading ? "Procesando..." : "Devolver producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ReturnToSupplierPage;
