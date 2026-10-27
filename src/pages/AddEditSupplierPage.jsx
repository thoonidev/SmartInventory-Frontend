import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditSupplierPage = () => {
  const { supplierId } = useParams();
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (supplierId) {
      setIsEditing(true);

      const fetchSupplier = async () => {
        try {
          const supplierData = await ApiService.getSupplierById(supplierId);
          if (supplierData.status === 200) {
            setName(supplierData.supplier.name);
            setContactInfo(supplierData.supplier.contactInfo);
            setAddress(supplierData.supplier.address);
          }
        } catch (error) {
          showMessage(
            error.response?.data?.message ||
              "Error al obtener un proveedor por Id: " + error
          );
        }
      };
      fetchSupplier();
    }
  }, [supplierId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supplierData = { name, contactInfo, address };

    try {
      if (isEditing) {
        await ApiService.updateSupplier(supplierId, supplierData);
        showMessage("Proveedor editado exitosamente");
        navigate("/supplier");
      } else {
        await ApiService.addSupplier(supplierData);
        showMessage("Proveedor añadido con éxito");
        navigate("/supplier");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error al guardar proveedor: " + error
      );
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
            {isEditing ? "Editar Proveedor" : "Agregar Proveedor"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Supplier Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Proveedor
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Ingrese el nombre del proveedor"
              />
            </div>

            {/* Cell Phone / Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Celular / Contacto
              </label>
              <input
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                required
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Número de contacto"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Dirección del proveedor"
              />
            </div>

           {/* Button */}
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white font-medium text-sm leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300"
              >
                {isEditing ? "Guardar Cambios" : "Agregar Proveedor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddEditSupplierPage;
