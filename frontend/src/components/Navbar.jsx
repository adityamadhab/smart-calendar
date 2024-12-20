import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { CalendarIcon, PlusIcon } from '@heroicons/react/24/outline';

function Navbar({ user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center">
                  <CalendarIcon className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">Smart Calendar</span>
                </Link>
                {user && (
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      to="/"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Calendar
                    </Link>
                    <Link
                      to="/events"
                      className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      All Events
                    </Link>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {user ? (
                  <>
                    <Link
                      to="/event/new"
                      className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      New Event
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="ml-4 text-gray-600 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-x-4">
                    <Link
                      to="/login"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar; 