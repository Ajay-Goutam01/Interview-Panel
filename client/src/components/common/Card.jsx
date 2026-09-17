const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={[
        "rounded-2xl",
        "border border-gray-200",
        "bg-white",
        "shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
