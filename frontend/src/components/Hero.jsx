import Button from "./Button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[85vh] bg-black text-white px-6">

      <h1 className="text-6xl font-bold text-center leading-tight">
        Version Control
        <br />
        <span className="text-green-500">
          Made Simple 🚀
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-center text-xl text-gray-400">
        ApnaGit helps developers manage repositories,
        track commits, push changes and collaborate
        effortlessly using your own Git Version Control
        System.
      </p>

      <div className="flex gap-5 mt-10">
        <Link to="/register">
          <Button>Get Started</Button>
        </Link>

        <Link to="/login">
          <Button variant="secondary">
            Login
          </Button>
        </Link>
      </div>

    </section>
  );
}

export default Hero;