import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FileUpload, ActivityIndicator, DropFileUpload } from 'react-responsive-ui'
import { connect } from 'react-redux'
import classNames from 'classnames'

import './UploadablePicture.css'

import ResponsivePicture, { getPreferredSize } from './Picture'

import { uploadPicture } from '../redux/uploadablePicture'
import { notify } from '../redux/notifications'

@connect(() => ({}), {
	uploadPicture,
	notify
})
export default class UploadablePicture extends Component
{
	static propTypes =
	{
		editMode        : PropTypes.bool.isRequired,
		changeLabel     : PropTypes.node,
		disabled        : PropTypes.bool.isRequired,
		onUpload        : PropTypes.func,
		onError         : PropTypes.func,
		onUploaded      : PropTypes.func.isRequired,
		maxFileSize     : PropTypes.number.isRequired,
		acceptedFileTypes : PropTypes.arrayOf(PropTypes.string).isRequired,
		// children        : PropTypes.element.isRequired,
		style           : PropTypes.object,
		className       : PropTypes.string
	}

	static defaultProps =
	{
		editMode : false,
		acceptedFileTypes : ['image/jpeg', 'image/png', 'image/svg+xml'],
		maxFileSize : 5.9 * 1024 * 1024,
		disabled : false,
		changeLabel : 'Change picture'
	}

	state = {}

	container = React.createRef()

	constructor()
	{
		super()
		this.upload = this.upload.bind(this)
	}

	componentDidUpdate(prevProps)
	{
		// Reset the uploaded picture on "cancel".
		if (prevProps.editMode && !this.props.editMode)
		{
			// const { onFinished } = this.props

			// onFinished()
			this.setState({ uploadedPicture: undefined })
		}
	}

	render()
	{
		const {
			editMode,
			changeLabel,
			onChange,
			disabled,
			children,
			style,
			className
		} = this.props

		const {
			uploading,
			uploadedPicture
		} = this.state

		return (
			<div
				ref={ this.container }
				style={ style }
				className={ classNames(className, 'uploadable-picture',
				{
					'uploadable-picture--accepts-drop' : editMode,
					// 'uploadable-picture--can-drop'     : editMode && draggedOver
				}) }>

				{/* The picture itself */}
				{
					React.Children.map(children, (child) =>
					{
						if (child.type && typeof(child.type) !== 'string' &&
							child.type.propTypes.picture && child.type.propTypes.uploaded)
						{
							if (uploadedPicture)
							{
								return React.cloneElement(child,
								{
									picture   : uploadedPicture,
									className : classNames(child.props.className, {
										// 'uploadable-picture__picture--change' : uploading
									})
								})
							}
						}

						return child
					})
				}

				{/* "Change picture" file uploader and overlay */}
				{ editMode &&
					<DropFileUpload
						disabled={ disabled }
						onChange={ this.upload }
						className={ classNames('uploadable-picture__change-overlay', {
							'uploadable-picture__change-overlay--uploading' : uploading,
							'uploadable-picture__change-overlay--uploaded'  : uploadedPicture
						}) }>
						{/* A colored overlay indicating "can drop image file here" situation */}
						<div
							className={ classNames('uploadable-picture__droppable-overlay', {
								// 'uploadable-picture__droppable-overlay--can-drop',
								// 'uploadable-picture__droppable-overlay--cannot-drop' : draggedOver && !canDrop
							}) }/>

						{/* "Change picture" label */}
						{ !uploadedPicture && !uploading && changeLabel }

						{/* "Uploading picture" spinner */}
						{ uploading &&
							<ActivityIndicator
								className="uploadable-picture__progress-indicator"/>
						}
					</DropFileUpload>
				}
			</div>
		)
	}

	width = () => this.container.current.offsetWidth

	onError(error)
	{
		const { onError, notify } = this.props

		console.error(error)

		if (onError) {
			return onError(error)
		}

		notify(error.message, { type: 'error' })
	}

	async upload(file)
	{
		const {
			editMode,
			acceptedFileTypes,
			uploadPicture,
			onUpload,
			onUploaded
		} = this.props

		const { uploading } = this.state

		// If the picture is not in upload mode
		// then don't react to a file drop.
		if (!editMode) {
			return
		}

		// Do nothing if currently busy
		if (uploading) {
			return
		}

		// Check file format
		if (acceptedFileTypes && acceptedFileTypes.indexOf(file.type) < 0) {
			return this.onError('UNSUPPORTED_FILE_TYPE')
		}

		// Check file size limit
		if (maxFixSize && file.size > maxFileSize) {
			return this.onError('MAX_FILE_SIZE_EXCEEDED')
		}

		// Set "uploading" flag.
		this.setState({
			uploading : true
		})

		if (onUpload) {
			onUpload()
		}

		let uploadedPicture

		try
		{
			// Upload the picture.
			uploadedPicture = await uploadPicture(file)
			// Prefetch the uploaded picture to avoid a flash of a not yet loaded image.
			await prefetchImage(getPreferredSize(uploadedPicture.sizes, component.width()).url)
			// Show the uploaded picture.
			onUploaded(uploadedPicture)
		}
		catch (error)
		{
			console.error(error)
			error = error.message
			// Who returns such an error? Sharp?
			if (error.indexOf('unsupported image format') >= 0) {
				error = 'UNSUPPORTED_FILE_TYPE'
			}
			return this.onError(error)
		}
		finally
		{
			// Reset "uploading" flag.
			this.setState({
				uploading : false
			})

			// If the picture was uploaded then render it.
			if (uploadedPicture)
			{
				this.setState({
					uploadedPicture
				})
			}
		}
	}
}

const pictureShape = PropTypes.shape
({
	sizes: PropTypes.arrayOf(PropTypes.object).isRequired
})

export class Picture extends Component
{
	static propTypes =
	{
		defaultPicture : pictureShape,
		picture : pictureShape
	}

	render()
	{
		const {
			defaultPicture,
			picture,
			...rest
		} = this.props

		return (
			<ResponsivePicture
				{...rest}
				sizes={ picture && picture.sizes || defaultPicture && defaultPicture.sizes }/>
		)
	}
}

// Preloads an image before displaying it
function prefetchImage(url)
{
	return new Promise((resolve, reject) =>
	{
		const image = new Image()
		image.onload = () => resolve()
		image.onerror = reject
		image.src = url
	})
}