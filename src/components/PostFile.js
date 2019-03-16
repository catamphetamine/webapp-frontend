import React from 'react'
import PropTypes from 'prop-types'
import filesize from 'filesize'

import { postFile } from '../PropTypes'

import DocumentIcon from '../../assets/images/icons/document.svg'
import DownloadIcon from '../../assets/images/icons/download-cloud.svg'

import './PostFile.css'

export default function PostFile({ file }) {
	return (
		<div className="post__file">
			<FileIcon
				contentType={file.contentType}
				className="post__file-icon"/>
			<a
				target="_blank"
				href={file.url}>
				{`${file.name}${file.ext || ''}`}
			</a>
			{file.size &&
				<span className="post__file-size">
					{filesize(file.size)}
				</span>
			}
		</div>
	)
}

PostFile.propTypes = {
	file: postFile.isRequired
}

function FileIcon({ contentType, ...rest }) {
	switch (contentType) {
		case 'application/pdf':
			return <DocumentIcon {...rest}/>
		default:
			return <DownloadIcon {...rest}/>
	}
}

FileIcon.propTypes = {
	contentType: PropTypes.string
}

export const EXAMPLE_1 = {
	contentType: 'application/x-shockwave-flash',
	name: 'How to Raise a Dragon',
	// ext: '.swf',
	size: 5.5 * 1024 * 1024,
	url: 'https://google.com'
}

export const EXAMPLE_2 = {
	contentType: 'application/pdf',
	name: 'Industrial society and its future',
	ext: '.pdf',
	size: 350 * 1024,
	url: 'https://google.com'
}