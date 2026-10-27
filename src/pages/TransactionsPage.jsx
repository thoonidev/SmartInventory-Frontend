import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../component/PaginationComponent";
import {
  transactionTypeLabels,
  transactionStatusLabels,
} from "../constants/translations";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [valueToSearch, setValueToSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const transactionData = await ApiService.getAllTransactions(
          valueToSearch
        );
        if (transactionData.status === 200) {
          setTotalPages(
            Math.ceil(transactionData.transactions.length / itemsPerPage)
          );
          setTransactions(
            transactionData.transactions.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
        }
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al obtener transacciones: " + error
        );
      }
    };

    getTransactions();
  }, [currentPage, valueToSearch]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setValueToSearch(filter);
  };

  const navigateToTransactionDetailsPage = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {message && (
            <div className="mb-6 text-center">
            <p className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded shadow-sm text-sm font-medium">
              {message}
            </p>
          </div>
          )}

          <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <h1 className="text-3xl font-semibold text-gray-800">
            🗂️ Trasacciones
            </h1>

            <div className="flex w-full md:w-auto gap-3 items-center">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Buscar ID, Tipo, Estado..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-700 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                />
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 select-none pointer-events-none text-lg">
                  🔍
                </span>
              </div>
              <button
                onClick={handleSearch}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition"
              >
                Buscar
              </button>
            </div>
          </div>

          {transactions.length > 0 ? (
            <div className="overflow-x-auto rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "TIPO",
                      "ESTADO",
                      "PRECIO TOTAL (S/.)",
                      "TOTAL PRODUCTOS",
                      "FECHA",
                      "ACCIONES",
                    ].map((header) => (
                      <th
                        key={header}
                        className="whitespace-nowrap px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                        {transactionTypeLabels[transaction.transactionType] ||
                          transaction.transactionType}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
                            transaction.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : transaction.status === "PROCESSING"
                              ? "bg-orange-100 text-orange-800"
                              : transaction.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {transactionStatusLabels[transaction.status] ||
                            transaction.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-800">
                        S/ {transaction.totalPrice.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                        {transaction.totalProducts}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          onClick={() =>
                            navigateToTransactionDetailsPage(transaction.id)
                          }
                          className="rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-10 text-center text-gray-500 text-lg font-medium">
              No hay transacciones disponibles.
            </p>
          )}

          <div className="mt-10 flex justify-center">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionsPage;
