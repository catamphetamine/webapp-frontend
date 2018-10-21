* Fix next/prev navigation animation on both slides on touch panning.

* On next/prev show "preloading" spinner and only after the next/previous image loads do next/prev navigation. Lock while "preloading" (click, pan, keyboard).

* Show pagination "x/y" (when there are more than 8 pictures) or dots (when there are up to 8 pictures).

* Add "more" button: download original, copy URL for sharing.

* Add post buttons: +, -, repost, view comments, "more" (report, copy URL for sharing).

* Add "load more on scroll" for posts.

* Add width and height for SVG images too because that will be used for `Picture.getAspectRatio()`.

// * Sort post attachments in their order of embedding in the post, e.g. pictures. This is better for slideshow. Remove re-sorting in `Post.js` after that.