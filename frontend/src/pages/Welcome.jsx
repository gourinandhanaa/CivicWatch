import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-blue-800 tracking-tight">
          🚨 CivicWatch
        </h1>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          A Community Issue Tracker
        </h2>
        <p className="max-w-2xl text-lg text-gray-600 mb-10">
          Report and track local issues like potholes, garbage problems, and more.
          Help make your neighborhood safer, cleaner, and better — one report at a time.
        </p>

        {/* Auth Box */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
          <h3 className="text-xl font-semibold mb-6">Get Started</h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Link
              to="/login"
              className="flex-1 text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex-1 text-center px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Register
            </Link>
          </div>
          <p className="text-xs text-gray-400 text-center">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Key Features
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center">
              <div className="text-4xl mb-4">🔑</div>
              <h4 className="text-xl font-semibold mb-2">Role-Based Access</h4>
              <p className="text-gray-600">
                Secure dashboards for both citizens and admins with access control.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="text-xl font-semibold mb-2">Easy Reporting</h4>
              <p className="text-gray-600">
                Submit reports with images and location — fast and intuitive.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h4 className="text-xl font-semibold mb-2">Real-Time Tracking</h4>
              <p className="text-gray-600">
                Track updates on your issues and follow community progress live.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
