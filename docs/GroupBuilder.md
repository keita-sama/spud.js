
[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number

[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object

[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

[EmbedBuilder]: https://discord.js.org/docs/#/docs/discord.js/main/class/EmbedBuilder

[Builder]: ./Builder.md

## GroupBuilder

`GroupBuilder` *extends* [`Builder`][Builder]

GroupBuilder is essentially a mixture of Pagination and MenuBuilder.
The `Menu` lets you choose the group and you have `Pagination` to page through the contents of the group.

### Constructor
```js
new GroupBuilder(message)
```

### Methods

#### trashBin([bin]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| bin | [Boolean] | Determines wheter this group instance has a trashbin |

returns `GroupBuilder`

---
#### fastSkip([fastSkip]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| fastSkip | [Boolean] | Determines whether this group instance can skip to the first and last page. |

returns `GroupBuilder`

---
#### setGroups([embeds]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| embeds | [GroupOptions] | Groups that this group instance is initialized with. |

returns `GroupBuilder`

---
#### send()
Handles the interaction

returns `void`

---
