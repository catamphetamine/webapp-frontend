import React from 'react'
import { postShape } from '../PropTypes'

export default function Post({ post }) {
	return (
		<div className="post">
			{post.account.name}
			{post.content && post.content.map((content, i) => {
				if (typeof content === 'string') {
					return (
						<p key={i}>
							{content}
						</p>
					);
				} else if (content.type === 'list') {
					return (
						<ul key={i}>
							{content.items.map((item, i) => (
								<li>{item}</li>
							))}
						</ul>
					);
				} else {
					console.error(`Unsupported post content:\n`, content)
					return <p key={i}/>
				}
			})}
		</div>
	);
}

Post.propTypes = {
	post: postShape.isRequired
}