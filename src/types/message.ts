export interface Message {
  sender: "user" | "bot";
  text: string;
  options?: string[];
}
