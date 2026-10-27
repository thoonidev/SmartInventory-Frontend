import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getSuppliers = async () => {
      try {
        const responseData = await ApiService.getAllSuppliers();
        if (responseData.status === 200) {
          setSuppliers(responseData.suppliers);
        } else {
          showMessage(responseData.message);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al obtener proveedores: " + error
        );
      }
    };
    getSuppliers();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")
    ) {
      try {
        await ApiService.deleteSupplier(supplierId);
        showMessage("Proveedor eliminado exitosamente");
        window.location.reload();
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al eliminar proveedor: " + error
        );
      }
    }
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
            🚚 Proveedores
          </h1>
          <button
            onClick={() => navigate("/add-supplier")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Agregar proveedor
          </button>
        </div>

        {suppliers.length > 0 ? (
          <ul className="space-y-4">
            {suppliers.map((supplier) => (
              <li
                key={supplier.id}
                className="flex items-center justify-between bg-white shadow-lg p-4 rounded-lg hover:shadow-xl transition duration-300"
              >
                <span className="font-medium text-lg text-gray-700">
                  {supplier.name}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/edit-supplier/${supplier.id}`)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition duration-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-300"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No hay proveedores registrados.</p>
        )}
      </div>
    </Layout>
  );
};

export default SupplierPage;
