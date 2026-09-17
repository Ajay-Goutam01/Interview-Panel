const VARIANTS = {
  primary: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-200",
  secondary:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
};

const SIZES = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-3.5 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  const variantClass = VARIANTS[variant] ?? VARIANTS.primary;
  const sizeClass = SIZES[size] ?? SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-lg font-semibold",
        "outline-none transition",
        "focus:ring-2 focus:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClass,
        sizeClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}

      {children}
    </button>
  );
};

export default Button;
