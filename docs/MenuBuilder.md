[String]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

[Object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object

[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

[MenuOption]: ./MenuOption.md

[BaseBuilder]: ./BaseBuilder.md

## MenuBuilder

`MenuBuilder` *extends* [`BaseBuilder`][BaseBuilder]

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
| options | [Array]<[MenuOption]> or [Object] | Options initialized with the Select Menu |
returns `MenuBuilder`

---
#### addMenuOption([option]())

| PARAMETER | TYPE | DESCRIPTION |
|:-:|:-:|:-:|
| option | [MenuOption] or [Object] | The placeholder text seen |
returns `MenuBuilder`

---
#### send()
Handles the interaction

returns `void`

---