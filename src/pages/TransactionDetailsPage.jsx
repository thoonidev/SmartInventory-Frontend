import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";
import {
  transactionTypeLabels,
  transactionStatusLabels,
  userRoleLabels,
} from "../constants/translations";

const TransactionDetailsPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const transactionData = await ApiService.getTransactionById(transactionId);

        if (transactionData.status === 200) {
          setTransaction(transactionData.transaction);
          setStatus(transactionData.transaction.status);
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al obtener una transacción: " + error
        );
      }
    };

    getTransaction();
  }, [transactionId]);

  const handleUpdateStatus = async () => {
    try {
      await ApiService.updateTransactionStatus(transactionId, status);
      navigate("/transaction");
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Error al actualizar una transacción: " + error
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
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {message && (
          <div className="mb-6 text-center">
            <p className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded shadow-sm text-sm font-medium">
              {message}
            </p>
          </div>
        )}

        {transaction && (
          <>
            {/* Transaction information */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
                Información de la transacción
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {transactionTypeLabels[transaction.transactionType] ||
                      transaction.transactionType}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Estado</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {transactionStatusLabels[transaction.status] || transaction.status}
                  </dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                  <dd className="mt-1 text-base text-gray-800">{transaction.description}</dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Nota</dt>
                  <dd className="mt-1 text-base text-gray-800">{transaction.note}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Productos totales</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {transaction.totalProducts}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Precio total</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    S/ {transaction.totalPrice.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Creado en</dt>
                  <dd className="mt-1 text-base text-gray-600">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </dd>
                </div>
                {transaction.updatedAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Actualizado en</dt>
                    <dd className="mt-1 text-base text-gray-600">
                      {new Date(transaction.updatedAt).toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            {/* Product information */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
                Información del producto
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {transaction.product.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Código</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {transaction.product.sku}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Precio</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    S/ {transaction.product.price.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Cantidad</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {transaction.product.stockQuantity}
                  </dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Descripción</dt>
                  <dd className="mt-1 text-base text-gray-800">
                    {transaction.product.description}
                  </dd>
                </div>
                {transaction.product.imageUrl && (
                  <div className="md:col-span-2 flex justify-center mt-4">
                    <img
                      src={`/${transaction.product.imageUrl}`}
                      alt={transaction.product.name}
                      className="w-full max-w-sm rounded-xl shadow-md object-cover"
                    />
                  </div>
                )}
              </dl>
            </section>

            {/* User information */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
                Información del usuario
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {transaction.user.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {transaction.user.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Celular</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {transaction.user.phoneNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rol</dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {userRoleLabels[transaction.user.role] || transaction.user.role}
                  </dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Creado en</dt>
                  <dd className="mt-1 text-base text-gray-600">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Supplier information */}
            {transaction.supplier && (
              <section className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
                  Información del proveedor
                </h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">
                      {transaction.supplier.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Celular</dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">
                      {transaction.supplier.contactInfo}
                    </dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                    <dd className="mt-1 text-base text-gray-800">
                      {transaction.supplier.address}
                    </dd>
                  </div>
                </dl>
              </section>
            )}

            {/* Update status */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
                Actualizar estado
              </h2>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDING">PENDIENTE</option>
                  <option value="PROCESSING">PROCESO</option>
                  <option value="COMPLETED">COMPLETADO</option>
                  <option value="CANCELLED">CANCELADO</option>
                </select>
                <button
                  onClick={handleUpdateStatus}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
                >
                  Actualizar Estado
                </button>
              </div>
              <p className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-lg font-semibold text-sm">
                Estado seleccionado: {transactionStatusLabels[status] || status}
              </p>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default TransactionDetailsPage;
