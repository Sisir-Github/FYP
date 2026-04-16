import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <span className="text-6xl">🏔️</span>
      <h1 className="text-6xl font-heading font-bold text-primary-500 mt-4">404</h1>
      <p className="text-xl text-gray-500 mt-2 mb-8">
        Oops! This trail doesn't exist.
      </p>
      <Link to="/" className="btn-primary">
        Back to Base Camp
      </Link>
    </div>
  </div>
);

export default NotFound;
