import { Link } from "react-router-dom";
import Button from "./Button";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-green-500"
        >
          🚀 ApnaGit
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex gap-8 text-gray-300">
          <a href="#features" className="hover:text-green-500 transition">
            Features
          </a>

          <a href="#about" className="hover:text-green-500 transition">
            About
          </a>

          <a href="#contact" className="hover:text-green-500 transition">
            Contact
          </a>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link to="/login">
            <Button>Login</Button>
          </Link>

          <Link to="/register">
            <Button variant="secondary">
              Register
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;