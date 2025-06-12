import { GoogleGenAI } from "@google/genai";

async function getAPIKey() {
    const apiKeyObject = await chrome.storage.local.get(['geminiApiKey']);
    let apiKey = apiKeyObject["geminiApiKey"] || '';
    // apiKey = apiKey["geminiApiKey"];
    return apiKey;
}

async function generateText(question, extract) {
  const apiKey = await getAPIKey();

  const ai = new GoogleGenAI({ apiKey: apiKey });

  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: [
      {
        role: "user",
        parts: [{ text: `You will answer the question at the very bottom of the message that is written under Q1-Q4. Each new line under the question is a new possible answer. Do not be afraid not answer 'Not in the Story'. The next message will be the extract and the following messages will be the questions. Reply to the extract by saying "I have acknowledged the extract and will use it for the next questions." Please provide ONLY the answer from the possibile answers word for word and nothing else, do you understand?` }],
      },
      {
        role: "model",
        parts: [{ text: "Yes, I understand. I will read the extract you provide and will use it to answer your questions. I will provide ONLY the answer and nothing else." }],
      },
      {
        role: "user",
        parts: [{ text: extract }],
      },
      {
        role: "model",
        parts: [{ text: "I have read and understood the extract and will use it to answer your questions." }],
      },
    ],
  });

  const response = await chat.sendMessage({
    message: question,
  });
  return response.text;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "generate") {
    generateText(message.prompt, message.extract).then(response => {
      sendResponse({ result: response });
    });
    // Return true to indicate you want to send a response asynchronously
    return true;
  }
});