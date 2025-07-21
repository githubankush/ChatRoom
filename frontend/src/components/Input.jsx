const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1 font-medium">{label}</label>
    <input
      className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  </div>
);

export default Input;
