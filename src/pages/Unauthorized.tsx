// src/pages/Unauthorized.tsx
const Unauthorized = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold text-red-600">🚫 Unauthorized</h1>
        <p className="mt-4 text-lg text-gray-700">
          You do not have permission to access this page.
        </p>
      </div>
    );
  };
  
  export default Unauthorized;
  