import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productData = await ApiService.getAllProducts();

        if (productData.status === 200) {
          setTotalPages(Math.ceil(productData.products.length / itemsPerPage));

          setProducts(
            productData.products.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al obtener productos: " + error
        );
      }
    };

    getProducts();
  }, [currentPage]);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("¿Está seguro de que desea eliminar este producto?")) {
      try {
        await ApiService.deleteProduct(productId);
        showMessage("Producto eliminado exitosamente");
        window.location.reload();
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al eliminar un producto: " + error
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
          <h1 className="text-3xl font-semibold text-gray-800">📦 Productos</h1>
          <button
            onClick={() => navigate("/add-product")}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none transition-all duration-300 ease-in-out"
          >
            Agregar Producto
          </button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between transition-transform transform hover:scale-105 duration-300"
                style={{ maxWidth: "250px", minHeight: "350px" }} // Limit size
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-32 w-full object-cover rounded-lg mb-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm truncate">
                    Código: {product.sku}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Precio:{" "}
                    <span className="font-semibold">
                      S/{product.price.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Cantidad: {product.stockQuantity}
                  </p>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => navigate(`/edit-product/${product.id}`)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-all duration-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all duration-300"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No hay productos disponibles.
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  );
};

export default ProductPage;
