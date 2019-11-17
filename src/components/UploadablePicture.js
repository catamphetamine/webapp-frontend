import React, { useCallback, useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FileUpload, ActivityIndicator, DropFileUpload } from 'react-responsive-ui'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

import './UploadablePicture.css'

import ResponsivePicture, { getPreferredSize, preloadImage } from './Picture'

import { uploadPicture } from '../redux/uploadablePicture'
import { notify } from '../redux/notifications'

const PICTURE_COMPONENT_CLASS = <ResponsivePicture/>.type

export default function UploadablePicture({
	onError,
	editMode,
	acceptedFileTypes,
	maxFileSize,
	changeLabel,
	onChange,
	disabled,
	children,
	style,
	className
}) {
	const container = useRef()
	const [uploading, setUploading] = useState()
	const [newPicture, setNewPicture] = useState()

	// useImperativeHandle()
	// width = () => this.container.current.offsetWidth

	const _onError = useCallback((error) => {
		console.error(error)
		if (onError) {
			return onError(error)
		}
		dispatch(notify(error.message, { type: 'critical' }))
	}, [dispatch, onError])

	const upload = useCallback(async (file) => {
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
			return _onError(new Error('UNSUPPORTED_FILE_TYPE'))
		}

		// Check file size limit
		if (maxFileSize && file.size > maxFileSize) {
			return _onError(new Error('MAX_FILE_SIZE_EXCEEDED'))
		}

		// Set "uploading" flag.
		setUploading(true)

		// if (onUpload) {
		// 	onUpload()
		// }

		try
		{
			// Upload the picture.
			const newPicture = await dispatch(uploadPicture(file))
			// Prefetch the uploaded picture to avoid a flash of a not yet loaded image.
			await preloadImage(getPreferredSize(newPicture, this.container.current.clientWidth).url)
			// Show the uploaded picture.
			setNewPicture(newPicture)
			if (onChange) {
				onChange(newPicture)
			}
		}
		catch (error)
		{
			console.error(error)
			// Who returns such an error? Sharp?
			if (error.message.indexOf('unsupported image format') >= 0) {
				error = new Error('UNSUPPORTED_FILE_TYPE')
			}
			return _onError(error)
		}
		finally
		{
			// Reset "uploading" flag.
			setUploading(false)
		}
	}, [
		editMode,
		_onError,
		onChange,
		dispatch,
		newPicture,
		setNewPicture,
		uploading,
		setUploading,
		maxFileSize,
		acceptedFileTypes
	])

	componentDidUpdate(prevProps)
	{
		// Reset state on "cancel".
		if (prevProps.editMode && !this.props.editMode) {
			setUploading(false)
			setNewPicture(undefined)
			if (onChange) {
				onChange(newPicture)
			}
		}
	}

	const dispatch = useDispatch()

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
					if (child.type === PICTURE_COMPONENT_CLASS)
					{
						if (newPicture)
						{
							return React.cloneElement(child,
							{
								sizes : newPicture.sizes,
								// className : classNames(child.props.className, {
								// 	// 'uploadable-picture__picture--change' : uploading
								// })
							})
						}
					}

					return child
				})
			}

			{/* "Change picture" file uploader and overlay. */}
			{ editMode &&
				<DropFileUpload
					disabled={ disabled }
					onChange={ upload }>
					{/* An overlay indicating that a picture can be uploaded. */}
					<div
						className={ classNames('uploadable-picture__change-overlay', {
							'uploadable-picture__change-overlay--uploading' : uploading,
							'uploadable-picture__change-overlay--uploaded'  : newPicture
						}) }>
						{/* "Change picture" label. */}
						{ !newPicture && !uploading && changeLabel }
					</div>

					{/* "Uploading picture" spinner. */}
					{ uploading &&
						<ActivityIndicator
							className="uploadable-picture__progress-indicator"/>
					}
				</DropFileUpload>
			}
		</div>
	)
}

UploadablePicture.propTypes = {
	editMode        : PropTypes.bool.isRequired,
	changeLabel     : PropTypes.node,
	disabled        : PropTypes.bool.isRequired,
	onChange        : PropTypes.func,
	onError         : PropTypes.func,
	maxFileSize     : PropTypes.number.isRequired,
	acceptedFileTypes : PropTypes.arrayOf(PropTypes.string).isRequired,
	children        : PropTypes.node.isRequired,
	style           : PropTypes.object,
	className       : PropTypes.string
}

UploadablePicture.defaultProps = {
	editMode : false,
	acceptedFileTypes : ['image/jpeg', 'image/png', 'image/svg+xml'],
	maxFileSize : 5.9 * 1024 * 1024,
	disabled : false,
	changeLabel : 'Change picture'
}

export function Picture({
	defaultPicture,
	picture,
	...rest
}) {
	return (
		<ResponsivePicture
			{...rest}
			picture={picture || defaultPicture}/>
	)
}

Picture.propTypes = {
	defaultPicture: PropTypes.object,
	picture: PropTypes.object
}