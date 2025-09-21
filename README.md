
# VarshGpt 2.0: The All-in-One AI Assistant

![VarshGpt 2.0 Hero Image](https://placehold.co/1200x600/0f172a/38bdf8?text=VarshGpt%202.0)

**VarshGpt 2.0** is a next-generation, browser-based AI chat application that brings the power of multiple leading AI models into a single, intuitive interface. Designed for productivity, research, and creativity, it features specialized modes for a wide range of tasks—from coding and document analysis to image generation and autonomous task execution.



### ▶️ Live Demo & Video



Click the thumbnail below to watch a video demonstration of VarshGpt 2.0 in action.

[![VarshGpt 2.0 Video Demo](https://placehold.co/800x450/0f172a/38bdf8?text=Click%20to%20Play%20Demo)](https://youtu.be/JVSMGj52h8U)

## ✨ Features at a Glance

VarshGpt 2.0 is packed with a wide array of advanced features, putting it on par with leading AI platforms.

### 🧠 Core AI & Intelligence
*   **🤖 Multi-Model Support**: Seamlessly switch between **Google Gemini**, **OpenAI GPT-4o**, and **DeepSeek** within any chat.
*   **🎯 Specialized AI Modes**: The AI adapts its expertise for the task at hand:
    *   **Aptitude**: Expert help with logical reasoning and math problems.
    *   **Coding**: A coding partner for writing, debugging, and optimizing code.
    *   **Document**: Summarize and answer questions about uploaded files.
    *   **Image**: Generate high-quality images from text prompts.
    *   **Search**: Get up-to-date answers from the web with cited sources.
    *   **Agent**: An autonomous mode to plan and execute complex, multi-step tasks.
*   **👤 Personalization**: A "User Profile" feature allows the AI to remember your preferences and tailor its responses to your expertise level.

### 📂 Multimodal Capabilities
*   **📎 Advanced File Handling**:
    *   **Batch Uploads**: Attach multiple documents, code files, and images to a single prompt.
    *   **Cross-File Analysis**: Ask the AI to compare, summarize, and synthesize information from all uploaded files at once.
    *   **Wide File Support**: Handles `.py`, `.js`, `.pdf`, `.docx`, `.csv`, `.json`, `.png`, `.jpg`, and many more.
*   **🎙️ Full Voice Interaction**:
    *   **Voice Input (Speech-to-Text)**: Speak your prompts directly using the microphone.
    *   **Spoken Responses (Text-to-Speech)**: Listen to the AI's answers in a natural male voice, with a convenient toggle to turn it on or off.

### 🎨 User Experience & Interface
*   **✨ Modern, Animated UI**: A sleek interface with a beautiful animated gradient background in dark mode.
*   **💾 Persistent Memory**: Chat history is automatically saved to your browser, so you can pick up right where you left off.
*   **↔️ Collapsible Sidebar**: Hide the chat history sidebar for a focused, full-screen conversation view.
*   **🌗 Light & Dark Modes**: A robust and persistent theme system that remembers your choice.
*   **📝 Rich Content Display**: Features syntax-highlighted code blocks, inline image generation, and clickable source links.
*   **⚠️ Graceful Error Handling**: Displays clear, helpful error messages with actionable links for common API issues.

---

## 📸 Screenshots

| Light Mode Interface | Dark Mode with Code |
| :---: | :---: |
| ![Light Mode Screenshot](https://github.com/VarsshanCoder/VarshGpt-2.0/blob/main/Demo/Screenshot%202025-09-21%20193300.png) | ![Dark Mode Screenshot](https://github.com/VarsshanCoder/VarshGpt-2.0/blob/main/Demo/Screenshot%202025-09-21%20193225.png)

---

## 🧠 How It Works

VarshGpt 2.0 is a client-side application that runs entirely in your browser. It leverages modern web technologies to provide a seamless experience:
*   The UI is built with **React** and **TypeScript**, styled with **Tailwind CSS**.
*   It communicates directly with the APIs of **Google Gemini**, **OpenAI**, and **DeepSeek**.
*   **Browser APIs** like `SpeechRecognition`, `SpeechSynthesis`, and `LocalStorage` are used for voice interaction and persistent memory.
*   The application is designed as a set of static files (`.html`, `.tsx`) and can be hosted on any static web hosting service.

---

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript
*   **Styling**: Tailwind CSS
*   **AI APIs**: Google Gemini API, OpenAI API, DeepSeek API
*   **Browser APIs**: Web Speech API (SpeechRecognition & SpeechSynthesis), LocalStorage

---

## 🚀 Getting Started (Local Development)

This project is a static web application and does not require a complex build process.

### Prerequisites
*   A modern web browser.
*   A local web server to serve the files. The easiest way is to use `serve` via `npx`.

### Setup & Running the App

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/varshgpt-2.0.git
    cd varshgpt-2.0
    ```

2.  **Set up your Google Gemini API Key:**
    For core functionality like Gemini chat, search, and image generation to work, you must have a Google Gemini API Key.
    *   The application expects the Gemini key to be available in a non-version-controlled file. **The recommended way to provide this is to use the in-app settings modal.**
    *   **Note on `process.env`**: The code contains references to `process.env.API_KEY`. These are placeholders for a bundled environment. For this static setup, **you must use the in-app settings modal to configure your keys.**

3.  **Serve the application:**
    The simplest way to run the app locally is with the `serve` package.
    ```sh
    npx serve
    ```
    The application will be running on a local port (e.g., `http://localhost:3000`).

---

## ⚙️ Configuration & Usage

For OpenAI and DeepSeek models to work, you must configure your API keys in the app.

1.  Click the **"API Keys"** button in the sidebar (settings icon).
2.  Enter your keys for **OpenAI** and **DeepSeek**. These are stored securely in your browser's session storage and are cleared when you close the tab.
3.  **(Optional)** Add custom API endpoints if you are using a proxy server to avoid browser CORS issues. This is often required for calling the OpenAI/DeepSeek APIs directly from the browser.
4.  **Personalize your experience** by filling out the "User Profile" textarea to get tailored AI responses.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
