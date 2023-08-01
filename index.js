import openai from "./config/open-ai.js";
import readlineSync from "readline-sync";
import colors from "colors";

// chat commands
const COMMAND = {
  CLEAR: "/clear", // clear chat history
  IMAGE: "/image", // generate image
  HELP: "/help", // show available commands
  NAME: "/name", // change user name
  REGENERATE: "/regenerate", // regenerate assistant response
  EXIT: "/exit", // exit the program
};

// store conversation history
const chatHistory = [];

// function to generate image in response to IMAGE command
const generateImage = async () => {
  try {
    // Get user input for image description
    const userImagePrompt = readlineSync.question(
      colors.yellow(`Describe the image content: `)
    );

    // Get user input for image size
    const userImageInput = readlineSync.question(
      colors.yellow(
        `Select image size\nType "1" for 256x256px\n"2" for 512x512px\n"3" for 1024x1024px\n${colors.italic(
          "(Note that larger image costs more and takes more time to generate)"
        )}\nType your choice: `
      )
    );

    // Set user input to variable
    let userImageSelection = userImageInput;

    // Validate user input
    while (
      userImageSelection !== "1" &&
      userImageSelection !== "2" &&
      userImageSelection !== "3" &&
      userImageSelection !== "stop"
    ) {
      const userImageSize = readlineSync.question(
        colors.yellow(`Type your choice, or "stop" to cancel:`)
      );
      userImageSelection = userImageSize;
    }

    // Set image size based on user input
    let imageSize = "256x256";
    switch (userImageSelection) {
      case "1":
        imageSize = "256x256";
        break;
      case "2":
        imageSize = "512x512";
        break;
      case "3":
        imageSize = "1024x1024";
        break;
      // cancel image generation
      case "stop":
        console.log(colors.green("Bot: ") + "Image generation canceled");
        return;
      default:
        imageSize = "256x256";
    }

    // call the API with user input
    const imageCompletion = await openai.createImage({
      prompt: userImagePrompt,
      n: 1,
      size: imageSize,
    });

    // Get image URL
    const image_url = imageCompletion.data.data[0].url;

    // Print image URL
    console.log(colors.green("Bot: ") + "Image is ready! URL: " + image_url);
  } catch (error) {
    // Print error message
    throw Error(error.message);
  }
};

// function to generate message in response to user input
const generateMessage = async (prompt) => {
  try {
    // Construct messages by iterating over the history
    const messages = chatHistory.map(([role, content]) => ({
      role,
      content,
    }));

    if (messages.length > 0) {
      // Add separator
      messages.push({ role: "system", content: "" });
    }

    // Add latest user input
    messages.push({ role: "user", content: prompt });

    // Call the API with user input & history
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    // Get completion text/content
    const completionText = completion.data.choices[0].message.content;
    console.log(colors.green("Bot: ") + completionText);

    // Update history with user input and assistant response
    chatHistory.push(["user", prompt]);
    chatHistory.push(["assistant", completionText]);
  } catch (error) {
    // Print error message
    throw Error(error.message);
  }
};

// function to show available commands
const showCommandsHelp = () => {
  console.log(colors.bold.green("Bot: ") + "Here is a list of commands:");
  console.log(colors.bold("/image") + " - Generate an image");
  console.log(colors.bold("/help") + " - Show this help message");
  console.log(colors.bold("/name") + " - Change your name");
  console.log(colors.bold("/regenerate") + " - Regenerate assistant response");
  console.log(colors.bold("/exit") + " - Exit the program");
};

// function to clear chat history
const clearMessageHistory = () => {
  // Clear chat history
  chatHistory.length = 0;
  // Print message
  console.log(colors.bold.green("Bot: ") + "Chat history cleared");
};

async function main() {
  // Print welcome message
  console.log(colors.bold.green("Welcome to the Chatbot Program!"));
  console.log(colors.bold.green("You can start chatting with the bot."));
  console.log(colors.bold.green("Type `/help` to see available commands."));

  // Get user name
  let userName = readlineSync.question(
    colors.green("Type your name to begin (or press `enter` to skip): ")
  );

  // Get conversation context
  const context = readlineSync.question(
    colors.green(
      "Describe the context of the conversation (or press `enter` to skip): "
    )
  );

  // Add context to chat history
  if (context && context.length > 0) {
    chatHistory.push(["system", context]);
  }

  while (true) {
    // Get user input
    const userInput = readlineSync.question(
      colors.yellow(`${userName || "User"}: `)
    );

    try {
      // Check for chat commands
      switch (userInput.toLowerCase()) {
        case COMMAND.IMAGE:
          await generateImage();
          break;
        case COMMAND.EXIT:
          console.log(colors.green("Bot: Good bye!"));
          return;
        case COMMAND.NAME:
          userName = readlineSync.question(
            colors.green(
              "Type your new name (press `enter` to leave as it was): "
            )
          );
          break;
        case COMMAND.HELP:
          showCommandsHelp();
          break;
        case COMMAND.CLEAR:
          clearMessageHistory();
          break;
        case COMMAND.REGENERATE:
          chatHistory.pop();
          const lastUserMessage = chatHistory[chatHistory.length - 1][1];
          chatHistory.pop();
          await generateMessage(lastUserMessage);
          break;
        default:
          await generateMessage(userInput);
          break;
      }
    } catch (error) {
      // Print error message
      console.error(colors.red(error.message));
    }
  }
}

main();
