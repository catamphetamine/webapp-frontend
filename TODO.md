<!-- * (мб) Прятать кнопки, если мышь не двигается, и нет тачей. -->

* For non-inline slideshow: When swiping on first/last image: hide controls and reduce the opacity to 0 (reversible by swiping in opposite direction) (both via CSS .style and in .render()).

<!-- * Add fullscreen button. -->

* Maybe remove scale down/up buttons leaving just a single scale button.

* For YouTube videos set default size to FullHD.

* Add "Download" button (both pictures and videos).

* Add "Copy URL" button (sharing, will display an animated checkmark on click).

* На десктопе выводить picture или video attachment слева. А если их несколько?

* Add post buttons: +, -, repost, view comments, "more" (report, copy URL for sharing).

* Add "load more on scroll" for posts.

* In image upload lambda: Add width and height for SVG images too because that will be used for `Picture.getAspectRatio()`.

* Delete previous account picture when changing it.

<!-- * Add zoom buttons section in the bottom. -->

<!--
* On next/prev show "preloading" spinner and only after the next/previous image loads do next/prev navigation. Lock while "preloading" (click, pan, keyboard).

* Add moving a picture on mouse down and mouse move (disable next/prev navigation in such case). Only allow moving if picture size exceeds screen size, and not allowing moving outside the picture bounds.

* Add "-" and "+" buttons for scaling (and the "initial scale" button between them) + mouse wheel + alt or shift.

* Sort post attachments in their order of embedding in the post, e.g. pictures. This is better for slideshow. Remove re-sorting in `Post.js` after that.
-->