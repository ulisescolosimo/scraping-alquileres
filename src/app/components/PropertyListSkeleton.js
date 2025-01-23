const PropertyListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse"
      >
        <div className="w-full h-64 bg-gray-300"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
          <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export default PropertyListSkeleton;
