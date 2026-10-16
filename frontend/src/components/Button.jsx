function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) {
  const baseClasses =
    "px-5 py-2 rounded-lg font-medium transition-all duration-300";

  const variants = {
    primary:
      "bg-green-500 hover:bg-green-600 text-white",

    secondary:
      "border border-green-500 text-green-500 hover:bg-green-500 hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;