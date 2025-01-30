# CHANGELOG - 4.0.0-dev

### New features
- A completely new paradigm for adding pages. Now takes in a `Page` object.
```js
{
    embed: new EmbedBuilder()
    components: new ActionRowBuilder()
}
```
- - Proper support for custom components - local (page-bound) and global (available on all pages)
also includes a custom handler function that lets you handle `collect` and `end` events respectively
- Pagination chaining! Chain paginations via linking them with buttons!
- - NB: This is still pretty experimental but it's pretty cool. 
- Dynamic Pages. Woooo!
- - existed prior to this update, but I wanted to mention it's possible. If the content you want to paginate is from an API or something similar, you can can initialise the pagination with just two pages and automatically generate them as your user pages to get more.

## Major changes (somewhat) 
- Renamed old methods for consistency.
- - e.g `fastSkip -> addFastSkip` or `trashBin -> addTrashBin`.
- Adjusted the argument `addTrashBin` accepts.
- - now takes in `deleteMessage` to delete the initial message rather than a dummy true value.
- Ditched the callback inside `.send` in favour of the new custom handler method.

## Removals
- Removed Group and Menu builders. 
- - To me, they always felt out of place and now that there are many types of Select Menus it was hard to justify supporting  this somewhat trivial feature, especially when the logic was easy enough to implement yourself. As for the Group, they're now possible to implement with the new custom handler system :) You need to do a bit more work yourself, but it gives you the flexibility that standard pagination has.
