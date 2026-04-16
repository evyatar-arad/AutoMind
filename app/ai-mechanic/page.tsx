"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  User,
  Zap,
  BookOpen,
  History,
  Lightbulb,
  RotateCcw,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useVehicle } from "@/contexts/VehicleContext";
import { mockChatMessages, quickPrompts } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/mockData";
import type { VisualDiagnosis } from "@/lib/diagnoses";
import { formatCurrency } from "@/lib/utils";
import VisualDiagnosticModal from "@/components/ai/VisualDiagnosticModal";

// ─── Markdown renderer ───────────────────────────────────────────────────────

function parseMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? (
        <strong key={j} className="font-semibold text-foreground">
          {part}
        </strong>
      ) : (
        <span key={j}>{part}</span>
      )
    );
    return (
      <p
        key={i}
        className={cn(
          "leading-relaxed",
          line === "" ? "mb-2" : "mb-1 last:mb-0"
        )}
      >
        {rendered}
      </p>
    );
  });
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  isNew = false,
}: {
  message: ChatMessage;
  isNew?: boolean;
}) {
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 12, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn("flex gap-3 mb-4", isAssistant ? "justify-start" : "justify-end")}
    >
      {isAssistant && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shrink-0 mt-1">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm",
          isAssistant
            ? "bg-card border border-border text-foreground rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        )}
      >
        {message.imageUrl && (
          <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.imageUrl}
              alt="Uploaded image"
              className="max-w-full max-h-48 object-contain bg-black/10"
            />
          </div>
        )}

        <div className={cn(isAssistant ? "chat-prose" : "")}>
          {isAssistant ? (
            <div className="space-y-0.5">{parseMarkdown(message.content)}</div>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
        <div
          className={cn(
            "text-xs mt-2 opacity-60",
            isAssistant ? "text-muted-foreground" : "text-primary-foreground"
          )}
        >
          {message.timestamp}
        </div>
      </div>

      {!isAssistant && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary shrink-0 mt-1">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </motion.div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shrink-0">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AIMechanic() {
  const { activeVehicle } = useVehicle();
  const car = activeVehicle.car;

  const welcomeMessages: ChatMessage[] = [
    {
      id: 1,
      role: "assistant",
      content: activeVehicle.chatWelcome,
      timestamp: "10:30",
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    ...welcomeMessages,
    ...mockChatMessages.slice(1),
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Vision diagnostic modal state
  const [diagnosticImage, setDiagnosticImage] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const now = () =>
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const sendMessage = (text: string, imageUrl?: string) => {
    if (!text.trim() && !imageUrl) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: text || "I've uploaded an image for your analysis.",
      timestamp: now(),
      imageUrl,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: imageUrl
          ? `I've received your image and the AI Visual Diagnostic scan results.\n\nBased on your **${car.year} ${car.make} ${car.model}** and the fault identified, I've added the full diagnosis to our conversation. I recommend following the action steps listed and booking a professional inspection when convenient.\n\nWould you like me to find nearby garages available for this type of repair?`
          : `Great question! Based on your **${car.make} ${car.model} ${car.year}** manual and current service data (${car.km.toLocaleString()} km), I've analyzed this issue.\n\nThis is a simulated demo — in the full product, I'd provide a detailed diagnostic response specific to your car's history and the ${car.make} technical documentation.\n\nWould you like me to connect you with a certified garage for a professional inspection?`,
        timestamp: now(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1800);
  };

  // When image is selected → open Visual Diagnostic Modal
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = () => {
      setDiagnosticImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // "Add to Chat" from modal → insert formatted diagnosis message
  const handleAddDiagnosisToChat = (diagnosis: VisualDiagnosis, imageUrl: string) => {
    setDiagnosticImage(null);

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: "I've uploaded a warning light image for AI analysis.",
      timestamp: now(),
      imageUrl,
    };

    const severityEmoji =
      diagnosis.severity === "critical"
        ? "🔴"
        : diagnosis.severity === "high"
        ? "🟠"
        : diagnosis.severity === "moderate"
        ? "🟡"
        : "🟢";

    const aiMsg: ChatMessage = {
      id: Date.now() + 1,
      role: "assistant",
      content: `**Visual AI Diagnostic Result** ${severityEmoji}\n\n**Warning Light:** ${diagnosis.lightName}\n**Fault Code:** ${diagnosis.code} — ${diagnosis.codeDesc}\n**Severity:** ${diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1)}\n\n${diagnosis.description}\n\n**Recommended Actions:**\n${diagnosis.actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}\n\n**Estimated repair cost:** ${formatCurrency(diagnosis.estimatedCost)}\n\nWould you like me to find certified garages that specialize in this type of repair?`,
      timestamp: now(),
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const resetConversation = () => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content: activeVehicle.chatWelcome,
        timestamp: now(),
      },
    ]);
  };

  return (
    <>
      <div className="flex flex-col h-screen max-w-4xl mx-auto">
        {/* Header */}
        <div className="shrink-0 border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  AI Mechanic
                  <Badge variant="success" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </h1>
                <p className="text-xs text-muted-foreground">
                  {car.year} {car.make} {car.model} manual + service history
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs hidden sm:flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Manual Loaded
              </Badge>
              <Badge variant="outline" className="text-xs hidden sm:flex items-center gap-1">
                <History className="h-3 w-3" />
                {activeVehicle.serviceHistory.length} Records
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                title="Reset conversation"
                onClick={resetConversation}
                className="h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isNew={index >= messages.length - 2}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div className="shrink-0 px-6 py-3 border-t border-border bg-background/50">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Lightbulb className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isTyping}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="shrink-0 px-6 py-4 border-t border-border bg-card/50">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0"
              disabled={isTyping}
              onClick={() => imageInputRef.current?.click()}
              title="Scan a warning light with AI Vision"
            >
              <ImagePlus className="h-4 w-4" />
            </Button>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about your ${car.make} ${car.model}…`}
              disabled={isTyping}
              className="flex-1 h-11 text-sm"
            />
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11 shrink-0"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">
            AI responses are for guidance only. Always consult a certified mechanic for safety-critical repairs.
          </p>
        </div>
      </div>

      {/* Visual Diagnostic Modal — rendered outside chat layout */}
      {diagnosticImage && (
        <VisualDiagnosticModal
          imageUrl={diagnosticImage}
          onClose={() => setDiagnosticImage(null)}
          onAddToChat={handleAddDiagnosisToChat}
        />
      )}
    </>
  );
}
