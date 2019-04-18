import trimText from './trimText'
import { trim } from './trimWhitespace'
import searchContent from './searchContent'
import findLastSentenceEnd from './findLastSentenceEnd'
import splitContent from './splitContent'

const NEW_LINE_COST = 30
const NEW_PARAGRAPH_COST = 40
const EMBEDDED_ATTACHMENT_COST = 100
const EMBEDDED_PICTURE_COST = 200
const EMBEDDED_VIDEO_COST = 200
const EMBEDDED_AUDIO_COST = 100

// // Could somehow be used to compensate for long posts with short lines.
// // Example:
// // "Ratings:
// //  8/10
// //  9/10
// //  ..."
// const AVERAGE_LINE_CHARACTERS = 70

// If the total content length doesn't exceed
// `(1 + FIT_FACTOR) * limit` then preview is not neccessary.
const FIT_FACTOR = 0.2

const ENOUGH_CONTENT_FACTOR = 0.75

export default function generatePostPreview(post, options) {
	if (!post.content) {
		return
	}
	return new PreviewGenerator(post, options).generate()
}

class PreviewGenerator {
	preview = []

	characterCount = 0
	characterPoints = 0

	// This is used to decide whether to trim at
	// sentence end mid-paragraph or at paragraph end.
	blockLevelTrimCharacterCount = 0
	blockLevelTrimCharacterPoints = 0

	constructor({ content, attachments }, options) {
		this.content = content
		this.attachments = attachments
		this.options = options
	}

	generate() {
		for (const block of this.content) {
			let trimmedBlock
			if (typeof block === 'string') {
				if (block === '\n') {
					if (this.willOverflow(NEW_LINE_COST)) {
						// Whitespace serves the purpose of making it
						// move `{ type: "read-more" }` to a new paragraph.
						trimmedBlock = ' '
					} else {
						trimmedBlock = block
					}
					this.characterPoints += NEW_LINE_COST
				} else {
					const points = countCharacters(block, 'points')
					const characters = countCharacters(block, 'characters')
					if (this.countIfFits(points, characters, 1)) {
						trimmedBlock = block
					} else {
						if (!this.willTrimLongEnoughAt(this.blockLevelTrimCharacterCount)) {
							trimmedBlock = this.trimTextContentPreferrable(block, 0) ||
								this.trimTextContentPreferrable(block, 1)
							if (!trimmedBlock) {
								if (this.countIfFits(points, characters, 2)) {
									trimmedBlock = block
								} else {
									trimmedBlock = this.trimTextContentPreferrable(block, 2) ||
										this.trimTextContentFallback(block) ||
										this.trimTextContentAsIs(block)
								}
							}
						}
					}
				}
			}
			else if (Array.isArray(block)) {
				const points = countCharacters(block, 'points')
				const characters = countCharacters(block, 'characters')
				if (this.countIfFits(points, characters, 1)) {
					trimmedBlock = block
				} else {
					if (!this.willTrimLongEnoughAt(this.blockLevelTrimCharacterCount)) {
						// Trimming at "\n" leaves the "\n" at the end so that
						// later it detects a "new line" trim point and appends
						// `{ type: 'read-more' }` as a block-level part.
						trimmedBlock = this.trimTextContentAtNewLine(block, 0) ||
							this.trimTextContentAtNewLine(block, 1) ||
							this.trimTextContentPreferrable(block, 0) ||
							this.trimTextContentPreferrable(block, 1)
						if (!trimmedBlock) {
							if (this.countIfFits(points, characters, 2)) {
								trimmedBlock = block
							} else {
								// Trimming at "\n" leaves the "\n" at the end so that
								// later it detects a "new line" trim point and appends
								// `{ type: 'read-more' }` as a block-level part.
								trimmedBlock = this.trimTextContentAtNewLine(block, 2) ||
									this.trimTextContentPreferrable(block, 2) ||
									this.trimTextContentFallback(block) ||
									this.trimTextContentAsIs(block)
							}
						}
					}
				}
			} else {
				const blockType = CONTENT_BLOCKS[block.type]
				if (blockType) {
					let _block = block
					if (block.type === 'attachment') {
						_block = this.getAttachmentById(block.attachmentId)
					}
					if (_block) {
						const result = blockType.countIfFits(_block, this.countIfFits)
						if (result) {
							if (result === true) {
								trimmedBlock = block
							} else {
								trimmedBlock = result
							}
						}
					}
				} else {
					console.error(`Unsupported post block type: ${block.type}`)
				}
			}
			if (trimmedBlock) {
				this.preview.push(trimmedBlock)
			}
			if (trimmedBlock === block && this.characterPoints > this.options.limit) {
				trimmedBlock = undefined
			}
			// If trim point reached.
			if (trimmedBlock !== block) {
				// See if the rest content exceeds the threshold.
				let points = this.blockLevelTrimCharacterPoints
				let i = this.content.indexOf(block)
				let restContentExceedsThreshold = false
				const countIfFits = (count) => {
					if (typeof count !== 'number') {
						count = countCharacters(count, 'points')
					}
					if (!this.doesExceedThreshold(points + count)) {
						points += count
						return true
					}
				}
				while (i < this.content.length) {
					const block = this.content[i]
					if (typeof block === 'string' || Array.isArray(block)) {
						points += countCharacters(block, 'points')
						if (this.doesExceedThreshold(points)) {
							restContentExceedsThreshold = true
						}
					} else {
						const blockType = CONTENT_BLOCKS[block.type]
						restContentExceedsThreshold = true
						if (blockType) {
							let _block = block
							if (block.type === 'attachment') {
								_block = this.getAttachmentById(block.attachmentId)
							}
							if (_block) {
								if (blockType.countIfFits(_block, countIfFits) === true) {
									restContentExceedsThreshold = false
								}
							}
						} else {
							console.error(`Unsupported post block type: ${block.type}`)
						}
					}
					if (restContentExceedsThreshold) {
						break
					}
					points += NEW_PARAGRAPH_COST
					i++
				}
				// If the rest content doesn't exceed the threshold
				// then don't generate a preview.
				if (!restContentExceedsThreshold) {
					return
				}
				// Add "Read more" button and return the preview.
				const hadNewLinesAtTheEnd = trimmedBlock && typeof trimmedBlock !== 'string' && trim(trimmedBlock, 'right')
				if (trimmedBlock && !hadNewLinesAtTheEnd) {
					// Append "Read more" button to the end of the last paragraph.
					this.preview[this.preview.length - 1] = addReadMore(trimmedBlock)
				} else {
					// Append "Read more" button in a new paragraph.
					this.preview.push({ type: 'read-more' })
				}
				return this.preview
			}
			this.characterPoints += NEW_PARAGRAPH_COST
			this.blockLevelTrimCharacterCount = this.characterCount
			this.blockLevelTrimCharacterPoints = this.characterPoints
		}
	}

	doesExceedThreshold(points) {
		return points > this.characterPoints * (1 + this.getFitFactor())
	}

	getFitFactor() {
		return this.options.fitFactor === undefined ? FIT_FACTOR : this.options.fitFactor
	}

	// Returns whether it would be ok to trim at some previous point (relative to the limit point).
	// Is used to test whether it would be ok to discard current paragraph.
	//
	// It would be more preferable to use "characters left" instead of "character points left"
	// but calculating "characters left" in context of a non-fitting block is extra computation
	// which is chosen to be avoided here for simplicity.
	//
	willTrimLongEnoughAt(characterCount) {
		return characterCount > ENOUGH_CONTENT_FACTOR * (this.characterCount + this.getCharacterPointsLeft())
	}

	// Returns whether it would be ok to trim at some previous point (relative to the limit point).
	// Is used to test whether it would be ok to trim in the middle of current paragraph.
	//
	willTrimLongEnoughAfter(estimatedCharacterCount) {
		return this.willTrimLongEnoughAt(this.characterCount + estimatedCharacterCount)
	}

	getCharacterPointsLeft(fitFactor) {
		return this.withFitFactor(this.options.limit, fitFactor) - this.characterPoints
	}

	countIn(content, arg2) {
		if (typeof content === 'number') {
			this.characterPoints += content
			this.characterCount += arg2
		} else {
			this.characterPoints += countCharacters(content, 'points')
			this.characterCount += countCharacters(content, 'characters')
		}
	}

	willOverflow(points, fitFactor) {
		return this.characterPoints + points > this.withFitFactor(this.options.limit, fitFactor)
	}

	withFitFactor(points, fitFactor = 0) {
		if (fitFactor) {
			return Math.floor(points * (1 + fitFactor * this.getFitFactor()))
		} else {
			return points
		}
	}

	countIfFits = (content, fitFactor, arg3) => {
		if (typeof content === 'number') {
			const points = content
			const characters = fitFactor
			fitFactor = arg3
			if (this.willOverflow(points, fitFactor)) {
				return
			}
			this.characterCount += characters
			this.characterPoints += points
			return true
		}
		const points = countCharacters(content, 'points')
		if (this.willOverflow(points, fitFactor)) {
			return
		}
		this.characterCount += countCharacters(content, 'characters')
		this.characterPoints += points
		return true
	}

	trimTextContent(content, type, fitFactor) {
		const trimmedBlock = this.trimAtPoint(content, type, fitFactor)
		if (trimmedBlock) {
			const points = countCharacters(trimmedBlock, 'points')
			const characters = countCharacters(trimmedBlock, 'characters')
			if (this.willTrimLongEnoughAfter(points)) {
				this.countIn(points, characters)
				return trimmedBlock
			}
		}
	}

	trimTextContentAtNewLine(content, fitFactor) {
		return this.trimTextContent(content, 'new-line', fitFactor)
	}

	trimTextContentPreferrable(content, fitFactor) {
		return this.trimTextContent(content, 'sentence-end', fitFactor)
	}

	trimTextContentFallback(content, fitFactor) {
		return this.trimTextContent(content, 'whitespace', fitFactor)
	}

	trimTextContentAsIs(content, fitFactor) {
		return this.trimTextContent(content, 'any', fitFactor)
	}

	trimTextAtPoint(text, type, fitFactor) {
		if (this.getCharacterPointsLeft(fitFactor) === 0) {
			return
		}
		const index = this.findTrimPoint(text, type, this.getCharacterPointsLeft(fitFactor) - 1)
		if (index >= 0) {
			text = text.slice(0, index + 1)
			if (type === 'any' || type === 'whitespace') {
				text += '…'
			}
			return text
		}
	}

	trimAtPoint(block, type, fitFactor) {
		if (typeof block === 'string') {
			return this.trimTextAtPoint(block, type, fitFactor)
		}
		let trimPointIndex
		let overflow = countCharacters(block, 'points') - this.getCharacterPointsLeft(fitFactor)
		const indexes = searchContent(block, (content) => {
			if (typeof content === 'string') {
				const characterPoints = countCharacters(content, 'points')
				overflow -= characterPoints
				if (overflow < 0) {
					if (type === 'new-line') {
						return content === '\n'
					}
					let index = content.length - (overflow + characterPoints)
					while ((index = this.findTrimPoint(content, type, index - 1)) >= 0) {
						if (overflow + (index + 1) <= 0) {
							trimPointIndex = index
							return true
						}
					}
				}
			}
		}, { backwards: true })
		if (indexes) {
			const [left, right] = splitContent(block, indexes, {
				// Leaves the "\n" character for detecting block-level trim later in `.generate()`.
				// include: type === 'new-line' ? false : undefined,
				transform: type === 'new-line' ? undefined : (part) => {
					if (typeof part === 'string') {
						return trimTextAtIndex(part, trimPointIndex + 1, type)
					} else if (typeof part.content === 'string') {
						return {
							...part,
							content: trimTextAtIndex(part.content, trimPointIndex + 1, type)
						}
					} else {
						console.error('Unsupported content part for trimming')
						console.error(part)
						return part
					}
				}
			})
			return left
		}
	}

	findTrimPoint(text, type, startFromIndex) {
		if (type === 'sentence-end') {
			return findLastSentenceEnd(text, startFromIndex)
		}
		if (type === 'whitespace') {
			return text.lastIndexOf(' ', startFromIndex)
		}
		return startFromIndex
	}

	getAttachmentById(id) {
		const attachment = this.attachments.find(_ => _.id === id)
		if (!attachment) {
			console.error(`Attachment ${id} not found`)
			console.error(this.content)
			console.error(this.attachments)
		}
		return attachment
	}
}

function addReadMore(content) {
	if (!Array.isArray(content)) {
		content = [content]
	}
	content.push({ type: 'read-more' })
	return content
	// `trimWhitespace` mutates content, so no point in immutability.
	// return content.concat({ type: 'read-more' })
}

function countCharacters(content, mode) {
	if (Array.isArray(content)) {
		let count = 0
		for (const part of content) {
			count += countCharacters(part, mode)
		}
		return count
	} else if (typeof content === 'string') {
		if (content === '\n') {
			if (mode === 'points') {
				return NEW_LINE_COST
			} else if (mode === 'characters') {
				return 0
			}
		}
		return content.length
	} else if (content.content) {
		if (content.type === 'post-link' && (content.quote || content.quotes)) {
			return countCharacters(content.quote || content.quotes, mode)
		} else {
			return countCharacters(content.content, mode)
		}
	} else {
		console.error(`No "content" is present for an inline-level paragraph part:`)
		console.error(content)
	}
}

function trimTextAtIndex(text, index, type) {
	text = text.slice(0, index)
	if (type === 'any' || type === 'whitespace') {
		text += '…'
	}
	return text
}

const CONTENT_BLOCKS = {
	'attachment': {
		countIfFits(attachment, countIfFits) {
			return countIfFits(getAttachmentCharacterPoints(attachment), 1)
		}
	},
	'heading': {
		countIfFits(block, countIfFits) {
			return countIfFits(block.content)
		}
	},
	'monospace': {
		countIfFits(block, countIfFits) {
			return countIfFits(block.content)
		}
	},
	'list': {
		countIfFits(block, countIfFits) {
			const trimmedItems = []
			for (const item of block.items) {
				if (!countIfFits(item)) {
					break
				}
				trimmedItems.push(item)
				if (!countIfFits('\n')) {
					break
				}
			}
			if (trimmedItems.length === block.items.length) {
				return true
			} else if (trimmedItems.length > 0 && trimmedItems.length < block.items.length) {
				return {
					...block,
					items: trimmedItems
				}
			}
		}
	},
	'quote': {
		countIfFits(block, countIfFits) {
			return countIfFits(block.source) && countIfFits(block.content)
		}
	}
}

function getAttachmentCharacterPoints(attachment) {
	switch (attachment.type) {
		case 'picture':
			return EMBEDDED_PICTURE_COST
		case 'video':
			return EMBEDDED_VIDEO_COST
		case 'audio':
			return EMBEDDED_AUDIO_COST
		case 'social':
			const social = attachment.social
			let points = EMBEDDED_ATTACHMENT_COST
			if (social.author.id) {
				points += countCharacters(social.author.id, 'points')
			}
			if (social.author.name) {
				points += countCharacters(social.author.name, 'points')
			}
			if (social.content) {
				points += countCharacters(social.content, 'points')
			}
			if (social.attachments) {
				for (const attachment of social.attachments) {
					points += getAttachmentCharacterPoints(attachment)
				}
			}
			return points
		default:
			return EMBEDDED_ATTACHMENT_COST
	}
}