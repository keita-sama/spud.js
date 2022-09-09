
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number

[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object

[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

[EmbedBuilder]: https://discord.js.org/docs/#/docs/discord.js/main/class/EmbedBuilder

## MenuOption

Represents a menu option
```
{
    label,
    description,
    value,
    embed?,
    default?,
    emoji?
}
```
### Constructor
```js
new MenuOption()
```

### Methods

#### setLabel([label]())

*This method automatically sets a value for this option

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| label | [String] | Text used for the label |

returns `MenuOption`

---
#### setDescription([description]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| description | [String] | Text used for the description |

returns `MenuOption`

---
#### setEmbed([embed]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| embed | [Embed] | Embed used by this option |

returns `MenuOption`

---
#### setDefault([def]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| def | [Boolean] | Determines whether this is the default option |

returns `MenuOption`

---

#### setValue([value]())

*Typically this method doesn't need to be used, unless you have options with conflicting names!

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| value | [EmbedBuilder] | Value used by collectors |

returns `MenuOption`

---

#### setEmoji([emoji]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| emoji | [String] | Emoji used by this option |

returns `MenuOption`

---