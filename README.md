<h1 align='center'>Spud.js</h1>

prolly spud.js banner + those weird embedded links stuff. ill do that later

<h3 align='center'>Pagination focused library for Discord.js</h3>

## Quick Start

### Installation
```
npm i spud.js@latest
```
and then import into your project
```ts
const { PaginationBuilder } = require('spud.js');
// --- OR ---
import { PaginationBuilder } from 'spud.js';
```

### How to use?
To get started, make sure you have the necessary boilerplate for your discord bot. 
<br>
Then in either a `InteractionCreate` or `MessageCreate` event, pass the respective object into the `PaginationBuilder` constructor.

```js
const { PaginationBuilder } = require('spud.js');

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;   
    // ...

    const pagination = new PaginationBuilder(interaction)
        .setPages([
            {
                embed: new EmbedBuilder()
                    .setTitle('My first page.')
                    .setDescription('With a cool description'),
            }
        ]);
    
    await pagination.send();
})
```

This is all that's needed for an extremely basic pagination setup. There are many various options you can adjust i.e additonal buttons, custom buttons, filters, collector options and more.
<br><br>
To see all available options, check your intellisense or browse the documentation