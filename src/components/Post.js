import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-website'

import { postShape } from '../PropTypes'
import { accountLink } from './AccountLink'
import AccountPicture from './AccountPicture'

import './Post.css'

export default function Post({ post }) {
	return (
		<div className="post">
			<div className="post__summary">
				<Link to={accountLink(post.account)}>
					<AccountPicture
						account={post.account}
						className="post__account-picture"/>
				</Link>
				<div className="post__name-and-date">
					<Link to={accountLink(post.account)}>
						{post.account.name}
					</Link>
					<div className="post__date">
						<ReactTimeAgo tooltipClassName="post__date-tooltip">
							{post.date}
						</ReactTimeAgo>
					</div>
				</div>
			</div>
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