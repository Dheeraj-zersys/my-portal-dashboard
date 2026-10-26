export default function AuthLayout({ compact = false, children }) {
  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-end pr-12 bg-gray-900">
      {/* Background Gas Station Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/gas-station.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Auth Card */}
      <div
        className={`relative w-full ${
          compact ? "max-w-sm p-6" : "max-w-md p-10"
        } bg-white rounded-md mr-10 mb-2 shadow-xl`}
      >
        {children}
      </div>
    </div>
  );
}
