[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number

[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object

[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

[BaseBuilder]: ./BaseBuilder.md

## PaginationBuilder

`PaginationBuilder` *extends* [`BaseBuilder`][BaseBuilder]

### Constructor
```js
new PaginationBuilder(message)
```

### Methods

#### trashBin([bin]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| bin | [Boolean] | Determines wheter this pagination has a trashbin |
returns `PaginationBuilder`

---
#### fastSkip([fastSkip]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| fastSkip | [Boolean] | Determines whether this pagination can skip to the first and last page. |
returns `PaginationBuilder`

---
#### setEmbeds([embeds]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| embeds | [Array]<[EmbedBuilder]> | Embeds that this pagination is initialized with. |
returns `PaginationBuilder`

---
#### addEmbeds([embed]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| embed | [EmbedBuilder] | The embed to add to this pagination |
returns `PaginationBuilder`

---
#### getEmbeds()
Gets all current options.
---
#### send()
Handles the interaction

returns `void`

---