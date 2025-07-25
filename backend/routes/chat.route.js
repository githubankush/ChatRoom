import express from "express";
import {
  createChat,
  fetchUserChats,
  fetchMessages,
  sendMessage,
} from "../controllers/chat.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js"
import multer from "multer";

const router = express.Router();

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit
router.post("/create", authMiddleware, createChat);
router.get("/", authMiddleware, fetchUserChats);
router.get("/:chatId/messages", authMiddleware, fetchMessages);
router.post("/:chatId/message", authMiddleware, upload.single("media"), sendMessage);
export default router;
