"use client";

import { useState, useEffect, useRef } from "react";
import { Message } from "@/types/message";
import MessageComponent from "./Message";
import { modalitiesList, responses } from "@/utils/responses";
import { modalitiesData } from "@/utils/modalitiesData";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Bem-vindo ao ChatBot Furioso! O que você gostaria de saber?",
      options: [
        "Modalidades",
        "Atletas",
        "Patrocinadores",
        "Loja",
        "Fundadores",
        "Contato",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedModality, setSelectedModality] = useState<string | null>(null);
  const [menuStack, setMenuStack] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const userMessage: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    const lowerText = text.toLowerCase();

    const loadingMessage: Message = { sender: "bot", text: "..." };
    setMessages((prev) => [...prev, loadingMessage]);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setMessages((prev) => prev.filter((msg) => msg.text !== "..."));

    // ✅ Corrigido: Atletas do menu principal
    const isAtletasFromMainMenu =
      lowerText === "atletas" &&
      (!selectedModality || menuStack.length === 0 || messages.at(-2)?.text?.includes("o que você gostaria de saber?"));

    if (isAtletasFromMainMenu) {
      setSelectedModality(null);
      const botReply: Message = {
        sender: "bot",
        text: responses["todos os atletas"], // novo nome da key
      };
      setMessages((prev) => [...prev, botReply]);
      return;
    }

    if (lowerText === "voltar") {
      if (menuStack.length > 0) {
        const previousMenu = menuStack[menuStack.length - 1];
        setMenuStack((prev) => prev.slice(0, -1));

        if (previousMenu === "modalidades") {
          showModalitiesMenu();
        } else {
          const botReply: Message = {
            sender: "bot",
            text: `O que você gostaria de saber sobre ${previousMenu}?`,
            options: ["Atletas", "Conquistas", "Próximas datas", "Voltar"],
          };
          setSelectedModality(previousMenu);
          setMessages((prev) => [...prev, botReply]);
        }
        return;
      } else {
        showInitialMenu();
        return;
      }
    }

    if (lowerText === "modalidades") {
      setSelectedModality(null);
      setMenuStack([]);
      showModalitiesMenu();
      return;
    }

    if (modalitiesList.includes(text)) {
      setSelectedModality(text);
      setMenuStack((prev) => [...prev, "modalidades"]);
      const botReply: Message = {
        sender: "bot",
        text: `O que você gostaria de saber sobre ${text}?`,
        options: ["Atletas", "Conquistas", "Próximas datas", "Voltar"],
      };
      setMessages((prev) => [...prev, botReply]);
      return;
    }

    if (selectedModality && ["atletas", "conquistas", "próximas datas"].includes(lowerText)) {
      const modalityInfo = modalitiesData[selectedModality];

      if (modalityInfo) {
        const replyText =
          lowerText === "atletas"
            ? modalityInfo.atletas
            : lowerText === "conquistas"
            ? modalityInfo.conquistas
            : modalityInfo.proximasDatas;

        const botReply: Message = {
          sender: "bot",
          text: replyText,
          options: ["Voltar"],
        };
        setMessages((prev) => [...prev, botReply]);
        setMenuStack((prev) => [...prev, selectedModality]);
      } else {
        const botReply: Message = {
          sender: "bot",
          text: `Informações não disponíveis para ${selectedModality}.`,
        };
        setMessages((prev) => [...prev, botReply]);
      }

      setSelectedModality(null);
      return;
    }

    const botReplyText =
      responses[lowerText] || "Desculpe, não entendi. Selecione uma das opções disponíveis.";

    const botReply: Message = {
      sender: "bot",
      text: botReplyText,
    };

    setMessages((prev) => [...prev, botReply]);
  };

  const showModalitiesMenu = () => {
    const botReply: Message = {
      sender: "bot",
      text: "Selecione uma modalidade:",
      options: [...modalitiesList, "Voltar"],
    };
    setMessages((prev) => [...prev, botReply]);
  };

  const showInitialMenu = () => {
    const botReply: Message = {
      sender: "bot",
      text: "Bem-vindo ao ChatBot Furioso! O que você gostaria de saber?",
      options: [
        "Modalidades",
        "Atletas",
        "Patrocinadores",
        "Loja",
        "Fundadores",
        "Contato",
      ],
    };
    setMessages((prev) => [...prev, botReply]);
  };

  const handleInputSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-lg mx-auto p-4 border rounded shadow">
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <MessageComponent
            key={idx}
            message={msg}
            onOptionClick={(option) => sendMessage(option)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleInputSend()}
          placeholder="Digite sua mensagem"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleInputSend}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
