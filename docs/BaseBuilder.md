[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

[Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number

[Boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object

[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

## BaseBuilder

⚠ This class is not usable!

### Constructor
```js
new BaseBuilder(message)
```

### Methods

#### setTime([duration]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| duration | [Number] | How long the interaction lasts. |

returns `BaseBuilder`

---
#### setMax([max]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| max | [Number] | Maximum amount of times the interaction can be used. |

returns `BaseBuilder`

---
#### setIdle([idle]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| idle | [Boolean] | Determines if this interaction can idle. |

returns `BaseBuilder`

---
#### setContent([content]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| content | [String] | Sets the content used in reply. |

returns `BaseBuilder`

---
#### disableMention([mention]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| mention | [Boolean] | Determines if the reply will mention the user. |

returns `BaseBuilder`

---

