
<p align='center'>
    <img src="https://github.com/keita-sama/spud.js/blob/dev-test/assets/spud%20logo.png?raw=true" width='70%'>
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

## Usage
To get started, make sure you have the necessary boilerplate for your discord bot. Then, within either an `InteractionCreate` or `MessageCreate` event, pass the corresponding object into the `PaginationBuilder` constructor.

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
                components: new ActionRowBuilder()
                    .setComponents(
                        new ButtonBuilder()
                            .setCustomId('page_one_button')
                            .setLabel('First page!')
                            .setStyle(ButtonStyle.Primary)
                    )
            }
        ]);
    
    await pagination.send();
})
```

This is all that's needed for an extremely basic pagination setup. There are various options you can adjust i.e additonal buttons, custom buttons, filters, collector options and more to fine tune exactly how you want it to operate.
<br><br>
Check your intellisense or browse the documentation to see all available options and join our discord server for any questions!

## Acknowledgements

### [Duro](https://github.com/DuroCodes), [Aljoberg](https://github.com/Aljoberg), [GoodBoyNeon](https://github.com/GoodBoyNeon) and [yuyulbm](https://github.com/yuyulbm).