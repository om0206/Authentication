import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Auth<span className="text-indigo-600">App</span>
            </h1>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            Dashboard
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Welcome back, {user?.name}
          </h2>

          <p className="mt-2 text-gray-500">
            Manage your account and security settings.
          </p>
        </div>

        {/* Profile + Security */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Profile Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              
              {/* Avatar */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-600">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user?.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <h4 className="text-sm font-semibold text-gray-900">
                Account Information
              </h4>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Name
                  </span>

                  <span className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Email
                  </span>

                  <span className="max-w-[220px] truncate text-sm font-medium text-gray-900">
                    {user?.email}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Login Provider
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                    {user?.provider || "local"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Email Status
                  </span>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                🔐
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Security
                </h3>

                <p className="text-sm text-gray-500">
                  Keep your account secure
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h4 className="font-medium text-gray-900">
                Password
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                Update your password regularly to keep your account secure.
              </p>

              <Link
                to="/change-password"
                className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Change Password
              </Link>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                ✓
              </div>

              <div>
                <p className="text-sm font-semibold text-green-800">
                  Account Protected
                </p>

                <p className="text-xs text-green-700">
                  Your authentication session is active.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-indigo-900">
                You're all set!
              </h3>

              <p className="mt-1 text-sm text-indigo-700">
                Your account is successfully authenticated and ready to use.
              </p>
            </div>

            <span className="w-fit rounded-full bg-white px-4 py-2 text-xs font-semibold text-indigo-600 shadow-sm">
              ✓ Authenticated
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;