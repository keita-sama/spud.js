
<p align='center'>
    <img src="assets/spud logo.png" width='70%'>
    <h3 align='center'>Pagination focused library for Discord.js</h3>
</p>

<p align='center'>
<a href='https://discord.gg/EsfbnxTdej'><img src='https://img.shields.io/discord/925648118530314280?color=5865F2&logo=discord&logoColor=white'></a>
<a href=''><img src='https://img.shields.io/npm/d18m/spud.js'></a>
</p>

# Quick Start

## Installation
```
npm i spud.js@latest
```
and then import into your project
```ts
const { PaginationBuilder } = require('spud.js');
// --- OR ---
import { PaginationBuilder } from 'spud.js';
```

## How to use?
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