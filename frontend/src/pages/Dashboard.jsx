import DashboardNavbar from "../components/DashboardNavbar";

function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-5xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-3">
          Welcome to your ApnaGit Dashboard 🚀
        </p>
      </div>
    </div>
  );
}

export default Dashboard;