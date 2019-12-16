// import CommentIcon from '../../assets/images/icons/menu/message-outline.svg'
import CommentIcon from '../../assets/images/icons/message-rounded-rect-square.svg'
import ReplyIcon from '../../assets/images/icons/reply.svg'

export const CommentsCountBadge = {
	name: 'comments-count',
	icon: CommentIcon,
	title: (post, locale, messages) => messages && messages.commentsCount,
	condition: (post) => post.commentsCount > 0,
	content: (post) => post.commentsCount
}

export const RepliesCountBadge = {
	name: 'replies-count',
	icon: ReplyIcon,
	title: (post, locale, messages) => messages && messages.repliesCount,
	condition: (post) => post.replies && post.replies.length > 0,
	content: (post) => post.replies.length
}