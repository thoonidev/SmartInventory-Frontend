import React from "react";
import { Link } from "react-router-dom";
import ApiService from "../service/ApiService";

const logout = () => {
  ApiService.logout();
};

const Sidebar = () => {
  const isAuth = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();

  return (
    <div className="w-64 h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 shadow-lg">
      <h1 className="text-1xl font-extrabold mb-8 text-center tracking-wide text-green-400">
        💻 SMART-INVENTORY
      </h1>
      <ul className="space-y-3">
        {isAuth && (
          <li>
            <Link
              to="/dashboard"
              className="block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
            >
            ➫ Dashboard
            </Link>
          </li>
        )}

        {isAuth && (
          <li>
            <Link
              to="/transaction"
              className="block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
            >
            ➫ Transacciones
            </Link>
          </li>
        )}

        {isAdmin && (
          <>
            <li>
              <Link
                to="/category"
                className="block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
              >
              ➫ Categorías
              </Link>
            </li>
            <li>
              <Link
                to="/product"
                className="block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
              >
              ➫ Productos
              </Link>
            </li>
            <li>
              <Link
                to="/supplier"
                className="block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
              >
              ➫ Proveedores
              </Link>
            </li>
          </>
        )}

        {isAuth && (
          <>
            <li>
              <Link
                to="/purchase"
                className="block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
              >
              ➫ Compras
              </Link>
            </li>
            <li>
              <Link
                to="/sell"
                className="block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
              >
              ➫ Ventas
              </Link>
            </li>
            <li>
              <Link
                to="/return-to-supplier"
                className="block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
              >
              ➫ Devoluciones
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="block px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition-colors"
              >
              ➫ Perfil
              </Link>
            </li>
            <li className="pt-4 border-t border-gray-700">
              <Link
                to="/login"
                onClick={logout}
                className="block px-4 py-2 rounded text-red-400 hover:text-white hover:bg-red-600 transition-colors"
              >
                🚪 Cerrar Sesión
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
