export default function Button({ children, onClick, type = "button", color = "blue", className = "" }) {
    const baseStyle = "p-3 rounded-md text-white cursor-pointer hover:opacity-90 transition";
    const colorStyle = {
      blue: "bg-blue-500 hover:bg-blue-600",
      green: "bg-green-500 hover:bg-green-600",
      gray: "bg-gray-500 text-gray-800 hover:bg-gray-600"
    }[color];
  
    return (
      <button type={type} onClick={onClick} className={`${baseStyle} ${colorStyle} ${className}`}>
        {children}
      </button>
    );
  }  