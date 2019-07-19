import React from 'react'

import ApplicationMenu from './ApplicationMenu'

import './Footer.css'

export default function Footer() {
	return (
		<footer className="webpage__footer">
			<div className="webpage__footer__menu rrui__fixed-full-width">
				<ApplicationMenu/>
			</div>
		</footer>
	)
}