import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../features/auth/hooks/useAuth";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { logout, loading } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/dashboard" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 font-bold text-white">
            AI
          </div>

          <span className="hidden text-lg font-bold text-gray-900 sm:block">
            InterviewAI
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || "User"}
            </p>

            <p className="max-w-48 truncate text-xs text-gray-500">
              {user?.email || ""}
            </p>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
