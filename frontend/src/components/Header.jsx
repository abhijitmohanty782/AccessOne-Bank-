import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.png";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoverDropdown, setHoverDropdown] = useState(null);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [nestedDropdown, setNestedDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsNavbarOpen(false);
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
    setActiveDropdown(null);
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Items to show in navbar (always visible)
  const navbarItems = [
    {
      name: "Home",
      icon: "🏠",
      path: user ? "/dashboard" : "/",
      dropdown: null,
    },
    {
      name: "Accounts",
      icon: "💳",
      path: "/accounts",
      dropdown: [
        {
          name: "Savings Account",
          path: "/accounts",
          subtext: "High interest savings",
        },
        {
          name: "Salary Account",
          path: "/accounts",
          subtext: "Exclusive benefits",
        },
        {
          name: "Private Banking",
          path: "/accounts",
          subtext: "Premium services",
        },
        {
          name: "3-in-1 Account",
          path: "/accounts",
          subtext: "Save + Trade + Invest",
        },
      ],
    },
  ];

  // Items to show in dropdown menu
  const dropdownItems = [
    {
      name: "YONO Pay",
      icon: "💸",
      path: "/payments",
      dropdown: [
        { name: "Transfer Money", path: "/payments/transfer" },
        { name: "Bill Payments", path: "/payments" },
        { name: "Transaction History", path: "/payments/history/advanced" },
        { name: "Account Overview", path: "/payments/overview" },
        { name: "Account Statement", path: "/payments/statement" },
      ],
    },
    {
      name: "Shop & Order",
      icon: "🛒",
      path: "/shop",
      dropdown: null,
    },
    {
      name: "Investments",
      icon: "📈",
      path: "/investments",
      dropdown: [
        { name: "Mutual Funds", path: "/mutual-funds" },
        { name: "Fixed Deposits", path: "/fixed-deposit" },
        { name: "Recurring Deposits", path: "/investments/recurring-deposits" },
        { name: "Gold Purchase", path: "/investments/gold" },
      ],
    },
    {
      name: "Loans",
      icon: "🏠",
      path: "/loans",
      dropdown: [
        { name: "Personal Loan", path: "/loans/personal" },
        { name: "Home Loan", path: "/loans/home" },
        { name: "Education Loan", path: "/loans/education" },
        { name: "Car Loan", path: "/loans/car" },
      ],
    },
    {
      name: "Cards",
      icon: "💳",
      path: "/cards",
      dropdown: [
        { name: "Credit Cards", path: "/cards" },
        { name: "Debit Cards", path: "/cards" },
        { name: "Apply for Card", path: "/cards/apply" },
        { name: "Card Details", path: "/cards/details" },
        { name: "Block Card", path: "/cards/block" },
      ],
    },
    {
      name: "Insurance",
      icon: "🛡️",
      path: "/insurance",
      dropdown: [
        { name: "Life Insurance", path: "/insurance/life" },
        { name: "General Insurance", path: "/insurance/general" },
      ],
    },
  ];

  // Additional items for authenticated users
  const userDropdownItems = user
    ? [
        {
          name: "Services / Requests",
          icon: "🔧",
          path: "/services",
          dropdown: [
            { name: "Cheque Book Request", path: "/services/cheque-book" },
            { name: "ATM Card Services", path: "/services/atm-card" },
            { name: "Block ATM Card", path: "/services/block-atm" },
            { name: "Set Card Limit", path: "/services/card-limit" },
            { name: "Nominee Update", path: "/services/nominee-update" },
            { name: "Track Requests", path: "/services/track-requests" },
          ],
        },
      ]
    : [];

  const profileItem = user
    ? {
        name: "Profile / Settings",
        icon: "👤",
        path: "/profile/update",
        dropdown: [
          { name: "Manage Accounts", path: "/profile/manage-accounts" },
          { name: "Update Profile", path: "/profile/update" },
          { name: "Change MPIN / Password", path: "/profile/change-password" },
          { name: "Security Settings", path: "/profile/security" },
        ],
      }
    : null;

  const allDropdownItems = [...dropdownItems, ...userDropdownItems];

  if (!user) {
    return (
      <>
        {/* Main Navigation Bar */}
        <header className="bg-nav-dark shadow-lg relative z-50">
          <div className="container mx-auto px-2 sm:px-4">
            <div className="flex justify-between items-center h-16 gap-4">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0"
              >
                <img
                  src={logo}
                  alt="App Logo"
                  className="w-10 sm:w-12 h-auto object-contain rounded-md shadow-sm"
                />

                <h1 className="text-base sm:text-lg md:text-xl font-bold text-white hidden sm:flex items-center">
                  <span>Access</span>
                  <span className="flex items-center">
                    <span>O</span>
                    {/* <span className="text-[10px] sm:text-xs md:text-sm ml-0.5">🏠</span> */}
                    <span>ne</span>
                  </span>
                </h1>
              </Link>

              {/* Left Side - Menu Dropdown */}
              <div className="flex items-center gap-4">
                <div
                  className="relative group"
                  onMouseEnter={() => setShowMainMenu(true)}
                  onMouseLeave={() => setShowMainMenu(false)}
                >
                  <button className="flex items-center space-x-1 px-3 py-2 text-white hover:bg-teal-600 rounded-md transition-all duration-200 text-sm font-medium whitespace-nowrap">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>

                  {/* Grid-style Dropdown Menu */}
                  {showMainMenu && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 w-[600px] max-h-[80vh] overflow-y-auto">
                      <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                      <div className="grid grid-cols-4 gap-3 px-4">
                        {allDropdownItems.map((item) => (
                          <div
                            key={item.name}
                            className="relative group/item"
                            onMouseEnter={() => setNestedDropdown(item.name)}
                            onMouseLeave={() => setNestedDropdown(null)}
                          >
                            {item.dropdown ? (
                              <>
                                <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                                  <div className="text-2xl sm:text-3xl mb-1.5">
                                    {item.icon}
                                  </div>
                                  <div className="text-[10px] sm:text-xs font-medium text-gray-900 text-center leading-tight mb-1">
                                    {item.name}
                                  </div>
                                  <svg
                                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 9l-7 7-7-7"
                                    />
                                  </svg>
                                </div>

                                {/* Nested Dropdown */}
                                {nestedDropdown === item.name && (
                                  <div className="absolute top-0 left-full ml-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                                    <div className="px-3 py-2 font-semibold text-gray-900 border-b border-gray-100 text-sm">
                                      {item.name}
                                    </div>
                                    {item.dropdown.map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        to={subItem.path}
                                        className="block px-4 py-2 hover:bg-teal-50 text-sm text-gray-700 hover:text-teal-600 transition-colors"
                                      >
                                        {subItem.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                to={item.path}
                                className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                              >
                                <div className="text-2xl sm:text-3xl mb-1.5">
                                  {item.icon}
                                </div>
                                <div className="text-[10px] sm:text-xs font-medium text-gray-900 text-center leading-tight">
                                  {item.name}
                                </div>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navbar Items - Home and Accounts */}
                <nav className="hidden lg:flex items-center space-x-1">
                  {navbarItems.map((item) => (
                    <div
                      key={item.name}
                      className="relative group"
                      onMouseEnter={() => setHoverDropdown(item.name)}
                      onMouseLeave={() => setHoverDropdown(null)}
                    >
                      {item.dropdown ? (
                        <>
                          <Link
                            to={item.path}
                            className="flex items-center space-x-1 px-3 py-2 text-white hover:bg-teal-600 rounded-md transition-all duration-200 text-sm font-medium whitespace-nowrap"
                          >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                            <svg
                              className="w-4 h-4 transition-transform group-hover:rotate-180"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </Link>

                          {hoverDropdown === item.name && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50">
                              <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                              {item.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.path}
                                  className="block px-4 py-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 transition-all duration-200"
                                >
                                  <div className="font-semibold text-gray-900 hover:text-teal-600">
                                    {subItem.name}
                                  </div>
                                  {subItem.subtext && (
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      {subItem.subtext}
                                    </div>
                                  )}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          to={item.path}
                          className="flex items-center space-x-1 px-3 py-2 text-white hover:bg-teal-600 rounded-md transition-all duration-200 text-sm font-medium whitespace-nowrap"
                        >
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4 flex-shrink-0 pr-2">
                {/* Search Icon */}
                <button className="text-white hover:text-teal-300 transition-colors p-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* Login Button */}
                <Link
                  to="/login"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-3 sm:px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-xs sm:text-sm shadow-md hover:shadow-lg"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Login</span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleNavbar}
                  className="lg:hidden text-white p-2 hover:bg-teal-600 rounded-md transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Secondary Navigation Bar */}
        <div className="bg-teal-500 border-b border-teal-600">
          <div className="container mx-auto px-2 sm:px-4">
            <div className="flex items-center justify-between h-10 overflow-x-auto">
              <div className="flex items-center space-x-3 sm:space-x-6 min-w-max">
                <Link
                  to="/"
                  className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Personal
                </Link>
                <Link
                  to="/"
                  className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Business
                </Link>
                <Link
                  to="/"
                  className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  NRI
                </Link>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-6 min-w-max">
                <Link
                  to="/"
                  className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  About Us
                </Link>
                <Link
                  to="/"
                  className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Learn
                </Link>
                <Link
                  to="/"
                  className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Help
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isNavbarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              onClick={closeNavbar}
            ></div>
            <div className="fixed top-0 left-0 right-0 bg-white shadow-xl z-50 max-h-screen overflow-y-auto">
              <div className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={logo}
                      alt="App Logo"
                      className="w-10 sm:w-12 h-auto object-contain rounded-md shadow-sm"
                    />

                    <h1 className="text-xl font-bold text-gray-900 flex items-center">
                      <span>Access</span>
                      <span className="flex items-center">
                        <span>O</span>
                        {/* <span className="text-xs ml-0.5">🏠</span> */}
                        <span>ne</span>
                      </span>
                    </h1>
                  </div>
                  <button
                    onClick={closeNavbar}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <nav className="space-y-2">
                  {[...navbarItems, ...allDropdownItems].map((item) => (
                    <div
                      key={item.name}
                      className="border-b border-gray-200 pb-2"
                    >
                      {item.dropdown ? (
                        <>
                          <button
                            onClick={() => toggleDropdown(item.name)}
                            className="w-full text-left flex items-center justify-between py-3 text-gray-900 font-semibold"
                          >
                            <div className="flex items-center gap-4">
                              <span>{item.icon}</span>
                              <span>{item.name}</span>
                            </div>
                            <svg
                              className={`w-5 h-5 transition-transform ${
                                activeDropdown === item.name ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {activeDropdown === item.name && (
                            <div className="ml-6 space-y-2 mt-2 bg-gray-50 rounded-lg p-2">
                              {item.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.path}
                                  onClick={closeNavbar}
                                  className="block py-2 px-3 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={closeNavbar}
                          className="block py-3 text-gray-900 font-semibold"
                        >
                          <div className="flex items-center gap-4">
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Authenticated user header
  return (
    <>
      {/* Main Navigation Bar */}
      <header className="bg-nav-dark shadow-lg relative z-50">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center h-16 gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0"
            >
              <img
                src={logo}
                alt="App Logo"
                className="w-10 sm:w-12 h-auto object-contain rounded-md shadow-sm"
              />

              <h1 className="text-base sm:text-lg md:text-xl font-bold text-white hidden sm:flex items-center">
                <span>Access</span>
                <span className="flex items-center">
                  <span>O</span>
                  {/* <span className="text-[10px] sm:text-xs md:text-sm ml-0.5">🏠</span> */}
                  <span>ne</span>
                </span>
              </h1>
            </Link>

            {/* Left Side - Menu Dropdown and Navbar Items */}
            <div className="flex items-center gap-4">
              {/* Menu Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setShowMainMenu(true)}
                onMouseLeave={() => setShowMainMenu(false)}
              >
                <button className="flex items-center space-x-1 px-3 py-2 text-white hover:bg-teal-600 rounded-md transition-all duration-200 text-sm font-medium whitespace-nowrap">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* Grid-style Dropdown Menu */}
                {showMainMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 w-[600px] max-h-[80vh] overflow-y-auto">
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                    <div className="grid grid-cols-4 gap-3 px-4">
                      {allDropdownItems.map((item) => (
                        <div
                          key={item.name}
                          className="relative group/item"
                          onMouseEnter={() => setNestedDropdown(item.name)}
                          onMouseLeave={() => setNestedDropdown(null)}
                        >
                          {item.dropdown ? (
                            <>
                              <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                                <div className="text-2xl sm:text-3xl mb-1.5">
                                  {item.icon}
                                </div>
                                <div className="text-[10px] sm:text-xs font-medium text-gray-900 text-center leading-tight mb-1">
                                  {item.name}
                                </div>
                                <svg
                                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>

                              {/* Nested Dropdown */}
                              {nestedDropdown === item.name && (
                                <div className="absolute top-0 left-full ml-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                                  <div className="px-3 py-2 font-semibold text-gray-900 border-b border-gray-100 text-sm">
                                    {item.name}
                                  </div>
                                  {item.dropdown.map((subItem) => (
                                    <Link
                                      key={subItem.name}
                                      to={subItem.path}
                                      className="block px-4 py-2 hover:bg-teal-50 text-sm text-gray-700 hover:text-teal-600 transition-colors"
                                    >
                                      {subItem.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <Link
                              to={item.path}
                              className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                            >
                              <div className="text-2xl sm:text-3xl mb-1.5">
                                {item.icon}
                              </div>
                              <div className="text-[10px] sm:text-xs font-medium text-gray-900 text-center leading-tight">
                                {item.name}
                              </div>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navbar Items - Home, Accounts, Profile */}
              <nav className="hidden lg:flex items-center space-x-1">
                {[...navbarItems, profileItem].filter(Boolean).map((item) => (
                  <div
                    key={item.name}
                    className="relative group"
                    onMouseEnter={() => setHoverDropdown(item.name)}
                    onMouseLeave={() => setHoverDropdown(null)}
                  >
                    {item.dropdown ? (
                      <>
                        <Link
                          to={item.path}
                          className="flex items-center space-x-1 px-3 py-2 text-white hover:bg-teal-600 rounded-md transition-all duration-200 text-sm font-medium whitespace-nowrap"
                        >
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                          <svg
                            className="w-4 h-4 transition-transform group-hover:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </Link>

                        {hoverDropdown === item.name && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50">
                            <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.path}
                                className="block px-4 py-3 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 transition-all duration-200"
                              >
                                <div className="font-semibold text-gray-900 hover:text-teal-600">
                                  {subItem.name}
                                </div>
                                {subItem.subtext && (
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {subItem.subtext}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.path}
                        className="flex items-center space-x-1 px-3 py-2 text-white hover:bg-teal-600 rounded-md transition-all duration-200 text-sm font-medium whitespace-nowrap"
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 flex-shrink-0 pr-2">
              {/* Search Icon */}
              <button className="text-white hover:text-teal-300 transition-colors p-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* User Menu */}
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className="text-white hover:text-teal-300 text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-[1.03]"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleNavbar}
                className="lg:hidden text-white p-2 hover:bg-teal-600 rounded-md transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Navigation Bar */}
      <div className="bg-teal-500 border-b border-teal-600">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-10 overflow-x-auto">
            <div className="flex items-center space-x-3 sm:space-x-6 min-w-max">
              <Link
                to="/"
                className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                Personal
              </Link>
              <Link
                to="/"
                className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                Business
              </Link>
              <Link
                to="/"
                className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                NRI
              </Link>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-6 min-w-max">
              <Link
                to="/"
                className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                About Us
              </Link>
              <Link
                to="/"
                className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                Learn
              </Link>
              <Link
                to="/"
                className="text-white hover:text-teal-100 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isNavbarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={closeNavbar}
          ></div>
          <div className="fixed top-0 left-0 right-0 bg-white shadow-xl z-50 max-h-screen overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <img
                    src={logo}
                    alt="App Logo"
                    className="w-10 sm:w-12 h-auto object-contain rounded-md shadow-sm"
                  />

                  <h1 className="text-xl font-bold text-gray-900 flex items-center">
                    <span>Access</span>
                    <span className="flex items-center">
                      <span>O</span>
                      {/* <span className="text-xs ml-0.5">🏠</span> */}
                      <span>ne</span>
                    </span>
                  </h1>
                </div>
                <button
                  onClick={closeNavbar}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <nav className="space-y-2">
                {[...navbarItems, ...allDropdownItems, profileItem]
                  .filter(Boolean)
                  .map((item) => (
                    <div
                      key={item.name}
                      className="border-b border-gray-200 pb-2"
                    >
                      {item.dropdown ? (
                        <>
                          <button
                            onClick={() => toggleDropdown(item.name)}
                            className="w-full text-left flex items-center justify-between py-3 text-gray-900 font-semibold"
                          >
                            <div className="flex items-center gap-4">
                              <span>{item.icon}</span>
                              <span>{item.name}</span>
                            </div>
                            <svg
                              className={`w-5 h-5 transition-transform ${
                                activeDropdown === item.name ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {activeDropdown === item.name && (
                            <div className="ml-6 space-y-2 mt-2 bg-gray-50 rounded-lg p-2">
                              {item.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.path}
                                  onClick={closeNavbar}
                                  className="block py-2 px-3 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={closeNavbar}
                          className="block py-3 text-gray-900 font-semibold"
                        >
                          <div className="flex items-center gap-4">
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-3 text-red-600 font-semibold border-b border-gray-200"
                >
                  🚪 Logout
                </button>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
