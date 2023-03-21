
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object

[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

[EmbedBuilder]: https://discord.js.org/docs/#/docs/discord.js/main/class/EmbedBuilder

[MenuOption]: ./MenuOption.md

[Builder]: ./Builder.md

## MenuBuilder

`MenuBuilder` *extends* [`Builder`][Builder]

### Constructor
```js
new MenuBuilder(message)
```

### Methods

#### setPlaceholder([placeholder]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| placeholder | [String] | The placeholder text seen |

returns `MenuBuilder`

---
#### setMenuOptions([options]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| options | [Array]<[MenuOption] or [Object]> or  | Options initialized with the Select Menu |

returns `MenuBuilder`

---
#### addMenuOption([option]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| option | [MenuOption] or [Object] | The placeholder text seen |

returns `MenuBuilder`

#### getOptions()
Gets all the options used by this Select Menu

returns [Array]<[MenuOption]>

---
#### send()
Handles the interaction

returns `void`

---
