import { Message as MessageType } from "@/types/message";

interface Props {
  message: MessageType;
  onOptionClick?: (option: string) => void;
}

export default function Message({ message, onOptionClick }: Props) {
  return (
    <div
      className={`my-2 p-3 rounded-md max-w-xs ${
        message.sender === "user"
          ? "bg-blue-100 self-end"
          : "bg-gray-200 self-start"
      }`}
    >
      <p>{message.text}</p>

      {message.options && (
       <div className="mt-2 flex flex-wrap gap-2">
        {message.options.map((option) => (
         <button
         key={option}
         onClick={() => onOptionClick?.(option)}
         className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition">
          {option}
         </button>
        ))}
       </div>
      )}
    </div>
  );
}
