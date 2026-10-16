import { useNavigate } from "react-router-dom";

function DashboardNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-green-500">
        🚀 ApnaGit
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white font-semibold transition"
      >
        Logout
      </button>
    </nav>
  );
}

export default DashboardNavbar;