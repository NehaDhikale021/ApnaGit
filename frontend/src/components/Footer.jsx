import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-gray-800 bg-black text-gray-400"
    >
      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left */}
        <div>
          <h2 className="text-2xl font-bold text-green-500">
            🚀 ApnaGit
          </h2>

          <p className="mt-2 text-sm">
            Your own Version Control System built with React, Node.js and MongoDB.
          </p>
        </div>

        {/* Center */}
        <div className="flex gap-6">
          <a href="#features" className="hover:text-green-500">
            Features
          </a>

          <Link to="/login" className="hover:text-green-500">
            Login
          </Link>

          <Link to="/register" className="hover:text-green-500">
            Register
          </Link>
        </div>

        {/* Right */}
        <div className="text-sm">
          © 2026 ApnaGit. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;