# Spud.js
 A pagination focused package for discord.js
 
 <img src="https://media.discordapp.net/attachments/825656508464758809/1047775617413820426/unknown.png" width="40%" height="20%">
 
## Quick Start
 
### Installation
```
npm install spud.js
```
and then import it into your project:
```js
const Spud = require('spud.js');
```
### How to use:

To get started, make sure you have some code for your discord bot. Then in your `messageCreate` event add the following:
```js
client.on('messageCreate', async (message) => {
  // Create content to paginate
  const page1 = new EmbedBuilder().setDescription('This is page 1');
  const page2 = new EmbedBuilder().setDescription('This is page 2');

  if (message.content === 'pagination') {
    const pagination = new Spud.PaginationBuilder(message)
      .setEmbeds([page1, page2])
      .disableMention()
      .fastSkip();
 
    // Handle pagination
    await pagination.send()
  }
})
```
Boom, done.

For all options check out the documentation and join our discord server if you need assistance!

(⚠ CURRENT DOCS ARE NOT READY!! Join the Discord;)
##### Relevant links: [Documentation](https://spud.js.org/#docs) | [Discord Server](https://discord.gg/EsfbnxTdej)
