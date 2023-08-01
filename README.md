# Chatbot CLI

Welcome to the Chatbot CLI, an interactive chatbot that leverages the OpenAI API to provide responses and even generate images based on user input.

## Features

- **Chat with a Bot**: Engage in conversation with a chatbot, with the ability to store conversation history.
- **Generate Images**: Describe and specify the size of an image to generate it through OpenAI.
- **User Commands**: Utilize various commands to enhance the user experience, including clear chat history, regenerate responses, and more.
- **Customizable**: Change your name or set a conversation context.

## Requirements

- Node.js
- OpenAI account

## Dependencies

- `openai`` for interacting with the OpenAI API.
- `readline-sync`` for reading user input.
- `colors`` for console text formatting.

## Setup

1. Clone the repository:

```bash
git clone https://github.com/milukove/chatbot-cli.git
```

2. Navigate to the directory:

```bash
cd chatbot-cli
```

3. Install the dependencies:

```
npm install
```

or

```
yarn install
```

4. Set up OpenAI credentials in ./config/open-ai.js.

5. Run the program:

```bash
node index.js
```

## Commands

Upon launching the program, the chatbot will welcome you and ask for your name. You can either provide your name or leave it blank to continue as an anonymous user. Additionally, you have the option to provide some context for the conversation.

The chatbot will then prompt you to type your messages. You can interact with the chatbot using regular messages, and you can also use special commands to perform specific actions:

- **/clear**: Clear chat history.
- **/image**: Generate an image based on user description.
- **/help**: Show available commands.
- **/name**: Change user name.
- **/regenerate**: Regenerate assistant response.
- **/exit**: Exit the program.

## License

This project is open-source and available under the MIT License.

## Contributing

If you would like to contribute to this project, please fork the repository, make your changes, and submit a pull request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Author

@milukove
