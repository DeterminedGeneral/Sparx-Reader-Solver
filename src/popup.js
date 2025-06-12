import { GoogleGenAI } from "@google/genai";

document.addEventListener('DOMContentLoaded', () => {
  // Save button handler
  document.getElementById('saveKeyBtn').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value.trim();

    if (!apiKey) {
      alert('Please enter an API key!');
      return;
    }

    chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
      alert('API Key saved!');
      console.log(apiKey);
    });
  });

  document.getElementById('testKeyBtn').addEventListener('click', async() => {

    const apiKeyObject = await chrome.storage.local.get(['geminiApiKey']);
    let apiKey = apiKeyObject["geminiApiKey"] || '';
    console.log(apiKey);
    // apiKey = apiKey["geminiApiKey"];
    // console.log(apiKey);

    if (!apiKey) {
      alert('No API key found!');
      return;
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "Say something along the lines that the API Key provided works",
      });
      alert(response.text);
    } catch (err) {
      alert("An error has occured with generating a reply from Gemini. Please check the API Key you provided is correct!");
      alert(`The Error that Occured: ${err}`);
    }
  });
});