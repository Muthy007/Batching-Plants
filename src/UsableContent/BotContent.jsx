import React, { useState } from "react";
import { Grid, Box, Button, Typography, TextField } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import BusinessIcon from "@mui/icons-material/Business";
import { Icon } from "@iconify/react";

const BotContent = () => {
  const [homeOpen, setHomeOpen] = useState(true);
  const [convoOpen, setConvoOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleHomeOpen = () => {
    setHomeOpen(true);
    setConvoOpen(false);
  };

  const handleConvoOpen = () => {
    setConvoOpen(true);
    setHomeOpen(false);
  };

  const handleSendMessage = (customMessage = null) => {
    const messageToSend = customMessage || inputMessage.trim();
    if (messageToSend !== "") {
      const userMessage = {
        sender: "user",
        message: messageToSend,
        loading: false,
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInputMessage(""); 
      simulateBotResponse();
    }
  };

  const simulateBotResponse = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "bot",
        message: "I'm here to help! What can I assist you with?",
        loading: true,
      },
    ]);

    setTimeout(() => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastBotMessageIndex = updatedMessages.findIndex(
          (msg) => msg.sender === "bot" && msg.loading === true
        );
        if (lastBotMessageIndex !== -1) {
          updatedMessages[lastBotMessageIndex] = {
            ...updatedMessages[lastBotMessageIndex],
            loading: false,
          };
        }
        return updatedMessages;
      });
    }, 1500);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#333", color: "white", borderRadius: "10px", overflow: "hidden" }}>
      {homeOpen ? (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 3 }}>
          <Box sx={{ width: 48, height: 48, bgcolor: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", mb: 2 }}>
            <BusinessIcon />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="h4" fontWeight="bold">Schwing ERP</Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 4 }}>We are here to help you!</Typography>
          
          <Button 
            onClick={handleConvoOpen}
            sx={{ 
                bgcolor: "#555", color: "white", p: 2, borderRadius: 2, display: "flex", justifyContent: "flex-start", gap: 2, 
                textTransform: "none", "&:hover": { bgcolor: "#666" } 
            }}
          >
            <Icon icon="gg:bot" width="40" />
            <Typography variant="h6">Chat with us now</Typography>
          </Button>
          <Box sx={{ mt: "auto", pt: 2, textAlign: "center", opacity: 0.5, fontSize: "0.75rem" }}>Driven by Schwing</Box>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 2, bgcolor: "rgba(255,255,255,0.1)", fontWeight: "bold" }}>Conversation</Box>
            <Box sx={{ flexGrow: 1, bgcolor: "#000", p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
                {messages.map((msg, i) => (
                    <Box key={i} sx={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", maxWidth: "80%", bgcolor: msg.sender === "user" ? "#1a73e8" : "#333", p: 1.5, borderRadius: 2 }}>
                        {msg.loading ? "..." : msg.message}
                    </Box>
                ))}
            </Box>
            <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                <TextField 
                    fullWidth size="small" placeholder="Type a message..." 
                    value={inputMessage} onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    sx={{ bgcolor: "#F0F0F0", borderRadius: 1 }}
                />
                <Button variant="contained" onClick={() => handleSendMessage()} sx={{ minWidth: 0, p: 1, borderRadius: "50%" }}>
                    <Icon icon="ic:round-send" width="24" />
                </Button>
            </Box>
        </Box>
      )}

      {/* Footer Nav */}
      <Box sx={{ display: "flex", borderTop: "1px solid #444", bgcolor: "#222" }}>
        <Button 
            fullWidth onClick={handleHomeOpen}
            sx={{ flexDirection: "column", py: 1, color: homeOpen ? "#fff" : "#888", borderBottom: homeOpen ? "4px solid #fff" : "none" }}
        >
            <HomeIcon /><Typography variant="caption">Home</Typography>
        </Button>
        <Button 
            fullWidth onClick={handleConvoOpen}
            sx={{ flexDirection: "column", py: 1, color: convoOpen ? "#fff" : "#888", borderBottom: convoOpen ? "4px solid #fff" : "none" }}
        >
            <MessageIcon /><Typography variant="caption">Conversation</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default BotContent;
