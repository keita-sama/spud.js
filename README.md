# Spud.js
 A pagination focused package for discord.js
 
 <img src="https://camo.githubusercontent.com/785f7be94344e6a7f00d24995bc59f69220590a69d40f60270c63477f6748cd6/68747470733a2f2f6d656469612e646973636f72646170702e6e65742f6174746163686d656e74732f3932353634383131393439393230323536302f3932373034333938323437373839373738382f6f75747075742d6f6e6c696e65706e67746f6f6c732e706e67" width="40%" height="20%">
 
## Quick Start
 
### Installation
```
npm install spud.js@3.0.0-dev
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
  const page1 = new MessageEmbed().setDescription('This is page 1');
  const page2 = new MessageEmbed().setDescription('This is page 2');

  if (message.content === 'pagination') {
    const pagination = new PaginationBuilder(message)
      .setEmbeds([page1, page2])
      .disableMention(true)
      .fastSkip(true);
 
    // Handle pagination
    await pagination.send()
  }
})
```
Boom, done.

For all options check out the documentation and join our discord server if you need assistance!

##### Relevant links: [Documentation](./docs) | [Discord Server]()
