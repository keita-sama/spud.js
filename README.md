# spud.js

The unreleased v3 of spud.js - support for v14!

### Changelog

#### Additions:
- added `disableMentions` and `setContent`
- added `setMenuOptions` to add parity to as `PaginationBuilder` had a similar method
- added `getOptions` and `getEmbeds` to their respective classes
- added Declarations

#### Changes:
- altered the logic of how mentions are handled in classes
- altered how `MenuOption`'s `value` is assigned, no longer requiring you to manually call `setValue()` if you don't want to set a specfic value