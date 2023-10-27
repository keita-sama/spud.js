<div align="center">
    <p>
        <img src="https://camo.githubusercontent.com/785f7be94344e6a7f00d24995bc59f69220590a69d40f60270c63477f6748cd6/68747470733a2f2f6d656469612e646973636f72646170702e6e65742f6174746163686d656e74732f3932353634383131393439393230323536302f3932373034333938323437373839373738382f6f75747075742d6f6e6c696e65706e67746f6f6c732e706e67" width="60%" />
    </p>
    <p>
    A pagination-focused package for discord.js
    </p>
</div>
 
### Installation

Setup the enviroment before getting started. Then install the lastest version of `spud.js`

```
npm install spud.js@lastest
```

**Make sure you have `discord.js` `v14.0.0` or newer. To use `v13`, check out [Spud.js v2.1.3](https://www.npmjs.com/package/spud.js/v/2.1.3)**

Then, `require()` or `import` it into your project (depends if you use CommonJS modules or ES Modules):

```js
const spud = require('spud.js');
import spud from 'spud.js';
```

### Quick start

To get started, make sure you have done setting up the basic steps and have some code for your Discord bot. Then in your new message event add the following:

```js
import { PaginationBuilder } from 'spud.js';
import { EmbedBuilder } from 'discord.js';

client.on('messageCreate', async (message) => {
  // Create content to paginate
  const page1 = new EmbedBuilder()
    .setDescription('This is page 1');
  const page2 = new EmbedBuilder()
    .setDescription('This is page 2');

  // Respond if the message's content is 'pagination'
  if (message.content === 'pagination') {
    const pagination = new PaginationBuilder(message)
      .setEmbeds([page1, page2])
      .disableMention(true)
      .fastSkip(true);
 
    // Handle pagination
    await pagination.send();
  }
});
```

***Boom, done.***

For all options check out the documentation and join our discord server if you need assistance!

##### Relevant links: [v14 Documentation](https://github.com/keita-sama/spud.js/tree/main/docs) | [ v13 Documentation](https://spud.js.org/#docs) | [Discord](https://discord.gg/EsfbnxTdej)
