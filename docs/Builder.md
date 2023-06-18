[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number

[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object

[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

## Builder

⚠ This class is not usable!

### Constructor
```js
new Builder(interactionType)
```

### Methods

#### setTime([duration]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| duration | [Number] | How long the interaction lasts. |

returns `Builder`

---
#### setMax([max]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| max | [Number] | Maximum amount of times the interaction can be used. |

returns `Builder`

---
#### setIdle([idle]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| idle | [Boolean] | Determines if this interaction can idle. |

returns `Builder`

---
#### setContent([content]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| content | [String] | Sets the content used in reply. |

returns `Builder`

---
#### disableMention([mention]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| mention | [Boolean] | Determines if the reply will mention the user. |

returns `Builder`

---
#### setInteraction([options]() = { type: 'reply' })

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| mention | [Object] | Set the method used for the interaction |

returns `Builder`

---
