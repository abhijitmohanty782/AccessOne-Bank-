import React from 'react';
const CategoryCard = ({ href, icon, title, description, bgColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${bgColor} flex flex-col justify-between h-full`}
  >
    <div>
      <div className={`text-4xl mb-4`}>{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
    <div className={`mt-4 text-right font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
      Shop Now &rarr;
    </div>
  </a>
);

const Shop = () => {
  const categories = [
    {
      href: "https://www.myntra.com",
      icon: "👗",
      title: "Fashion",
      description: "Latest trends in clothing, shoes, and accessories.",
      bgColor: "bg-pink-100",
    },
    {
      href: "https://www.flipkart.com",
      icon: "💻",
      title: "Electronics",
      description: "Find the best deals on gadgets, phones, and appliances.",
      bgColor: "bg-blue-100",
    },
    {
      href: "https://www.bigbasket.com",
      icon: "🥦",
      title: "Grocery",
      description: "Fresh produce and daily essentials delivered to your door.",
      bgColor: "bg-green-100",
    },
    {
      href: "https://www.amazon.in",
      icon: "📦",
      title: "All in One",
      description: "The everything store. Shop from millions of items.",
      bgColor: "bg-yellow-100",
    },
    {
      href: "https://www.blinkit.com",
      icon: "⚡️",
      title: "Quick Commerce",
      description: "Superfast delivery for your immediate needs.",
      bgColor: "bg-purple-100",
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-5xl mx-auto text-center">
        <div className="mb-8">
            <span className="text-5xl">🛒</span>
            <h1 className="text-4xl font-extrabold text-gray-800 mt-4">Shop & Order</h1>
            <p className="text-lg text-gray-500 mt-2">
                Shop for products and services directly from your banking app.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;


