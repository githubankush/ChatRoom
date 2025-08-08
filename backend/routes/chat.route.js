import express from "express";
import {
  createChat,
  fetchUserChats,
  fetchMessages,
  sendMessage,
  markMessageAsSeen,
  searchGroupChats, // 👈 Add this
} from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/create", authMiddleware, upload.single("avatar"), createChat);
router.get("/", authMiddleware, fetchUserChats);
router.get("/search", authMiddleware, searchGroupChats); // 👈 New route
router.get("/:chatId/messages", authMiddleware, fetchMessages);
router.post("/:chatId/message", authMiddleware, upload.single("media"), sendMessage);
router.put("/:chatId/seen", authMiddleware, markMessageAsSeen);

export default router;
