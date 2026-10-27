import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { userRoleLabels } from "../constants/translations";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await ApiService.getLoggedInUsesInfo();
        setUser(userInfo);
      } catch (error) {
        showMessage(
          error.response?.data?.message ||
            "Error al obtener información del usuario: " + error
        );
      }
    };
    fetchUserInfo();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {message && (
          <div className="mb-6 text-center">
            <p className="inline-block bg-red-100 text-red-700 px-5 py-3 rounded-md shadow-sm text-sm font-semibold">
              {message}
            </p>
          </div>
        )}

        {user && (
          <section className="bg-white rounded-2xl shadow-lg p-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
              ¡Hola, {user.name}! <span aria-label="celebration" role="img">🎉</span>
            </h1>

            <dl className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <dt className="text-gray-500 font-medium mb-1 sm:mb-0">Nombre:</dt>
                <dd className="text-gray-900 font-semibold">{user.name}</dd>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between">
                <dt className="text-gray-500 font-medium mb-1 sm:mb-0">Email:</dt>
                <dd className="text-gray-900 font-semibold">{user.email}</dd>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between">
                <dt className="text-gray-500 font-medium mb-1 sm:mb-0">Celular:</dt>
                <dd className="text-gray-900 font-semibold">{user.phoneNumber}</dd>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between">
                <dt className="text-gray-500 font-medium mb-1 sm:mb-0">Rol:</dt>
                <dd className="text-gray-900 font-semibold">
                  {userRoleLabels[user.role] || user.role}
                </dd>
              </div>
            </dl>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
