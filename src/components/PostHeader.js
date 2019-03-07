import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-website'

import AccountPicture from './AccountPicture'
import PostInlineContent from './PostInlineContent'
import PostDate from './PostDate'
import { accountLink } from './AccountLink'
import { postShape } from '../PropTypes'

import './PostHeader.css'

export default function PostHeader({ url, locale, post }) {
	return (
		<header className="post__header">
			<div className="post__summary">
				{post.account &&
					<React.Fragment>
						<Link to={accountLink(post.account)}>
							<AccountPicture
								account={post.account}
								className="post__account-picture"/>
						</Link>
						<div className="post__name-and-date">
							<Link
								to={accountLink(post.account)}
								rel="author"
								className="post__name">
								{post.account.name}
							</Link>
							<PostDate
								date={post.createdAt}
								link={url}
								locale={locale}/>
						</div>
					</React.Fragment>
				}
				{!post.account &&
					<PostDate
						date={post.createdAt}
						link={url}
						locale={locale}/>
				}
			</div>
			{post.title &&
				<h1 className="post__heading">
					{post.titleCensored &&
						<PostInlineContent>
							{post.titleCensored}
						</PostInlineContent>
					}
					{!post.titleCensored && post.title}
				</h1>
			}
		</header>
	)
}

PostHeader.propTypes = {
	post: postShape.isRequired,
	url: PropTypes.string,
	locale: PropTypes.string
}