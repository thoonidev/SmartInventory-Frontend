import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DashboardPage = () => {
  const [message, setMessage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionResponse = await ApiService.getAllTransactions();
        if (transactionResponse.status === 200) {
          setTransactionData(
            transformTransactionData(
              transactionResponse.transactions,
              selectedMonth,
              selectedYear
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
    fetchData();
  }, [selectedMonth, selectedYear]);

  const transformTransactionData = (transactions, month, year) => {
    const dailyData = {};
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      dailyData[day] = { day, count: 0, quantity: 0, amount: 0 };
    }
    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      if (date.getMonth() + 1 === month && date.getFullYear() === year) {
        const d = date.getDate();
        dailyData[d].count += 1;
        dailyData[d].quantity += transaction.totalProducts;
        dailyData[d].amount += transaction.totalPrice;
      }
    });
    return Object.values(dailyData);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
    value: i + 1,
  }));
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  const totalCount = transactionData.reduce((acc, cur) => acc + cur.count, 0);
  const totalQuantity = transactionData.reduce(
    (acc, cur) => acc + cur.quantity,
    0
  );
  const totalAmount = transactionData.reduce((acc, cur) => acc + cur.amount, 0);

  const pieData = [
    { name: "Transacciones", value: totalCount },
    { name: "Productos", value: totalQuantity },
    { name: "Importe", value: totalAmount },
  ].filter((item) => item.value > 0);

  const COLORS = ["#14b8a6", "#6366f1", "#f59e0b"];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        {message && (
          <div className="mb-6 text-center">
            <p className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded shadow-sm text-sm font-medium">
              {message}
            </p>
          </div>
        )}

        {/* Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            ["Mes", selectedMonth, setSelectedMonth, months],
            ["Año", selectedYear, setSelectedYear, years],
          ].map(([label, value, setValue, options], idx) => (
            <div
              key={idx}
              className="flex flex-col bg-white p-4 rounded-xl shadow"
            >
              <label className="mb-1 text-sm font-semibold text-zinc-600">{`Seleccionar ${label}`}</label>
              <select
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-zinc-800"
              >
                {options.map((opt, i) => (
                  <option key={i} value={opt.value ?? opt}>
                    {opt.label ?? opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Transacciones",
              value: totalCount,
              color: "text-teal-500",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3h18v18H3z" strokeWidth={2} />
                </svg>
              ),
            },
            {
              title: "Productos",
              value: totalQuantity,
              color: "text-indigo-500",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                </svg>
              ),
            },
            {
              title: "Importe Total",
              value: `S/${totalAmount.toFixed(2)}`,
              color: "text-yellow-500",
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 1v22M17 5H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7"
                    strokeWidth={2}
                  />
                </svg>
              ),
            },
          ].map(({ title, value, icon, color }) => (
            <div
              key={title}
              className="bg-white shadow-md hover:shadow-lg rounded-xl p-5 flex flex-col gap-2 transition transform hover:-translate-y-1"
            >
              <div className={`flex items-center gap-2 ${color}`}>
                {icon}
                <span className="text-sm font-medium uppercase tracking-wide text-zinc-600">
                  {title}
                </span>
              </div>
              <p className="text-3xl font-bold text-zinc-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Graphics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-zinc-800 mb-4 border-b pb-2">
              Transacciones Diarias
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "count") return [`${value} Transacciones`];
                    if (name === "quantity") return [`${value} Productos`];
                    if (name === "amount") return [`S/${value} Importe`];
                    return value;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  name="Transacciones"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-zinc-800 mb-4 border-b pb-2">
              Comparación Diaria
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "count") return [`${value} Transacciones`];
                    if (name === "quantity") return [`${value} Productos`];
                    if (name === "amount") return [`S/${value} Importe`];
                    return value;
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#14b8a6" name="Transacciones" />
                <Bar dataKey="quantity" fill="#6366f1" name="Productos" />
                <Bar dataKey="amount" fill="#f59e0b" name="Importe" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-zinc-800 mb-4 border-b pb-2">
              Distribución Total
            </h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#f3f4f6"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-zinc-500 mt-20">
                No hay datos para mostrar.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
