import trimText from './trimText'
import { trim } from './trimWhitespace'
import searchContent from './searchContent'
import findLastSentenceEnd from './findLastSentenceEnd'
import splitContent from './splitContent'

const NEW_LINE_COST = 20
const NEW_PARAGRAPH_COST = 40
const EMBEDDED_ATTACHMENT_COST = 100
const EMBEDDED_PICTURE_COST = 200
const EMBEDDED_VIDEO_COST = 200

// If the total content length doesn't exceed
// `(1 + FIT_FACTOR) * limit` then preview is not neccessary.
const FIT_FACTOR = 0.2

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
					if (this.willOverflow(NEW_LINE_COST, false)) {
						// Whitespace serves the purpose of making it
						// move `{ type: "read-more" }` to a new paragraph.
						trimmedBlock = ' '
					} else {
						trimmedBlock = block
					}
					this.characterPoints += NEW_LINE_COST
				} else {
					if (this.countIfFits(block)) {
						trimmedBlock = block
					} else {
						if (!this.willTrimLongEnoughAt(this.blockLevelTrimCharacterCount)) {
							trimmedBlock = this.trimTextContent(block)
							this.characterPoints += countCharacters(trimmedBlock, 'points')
						}
					}
				}
			}
			else if (Array.isArray(block)) {
				if (this.countIfFits(block)) {
					trimmedBlock = block
				} else {
					if (!this.willTrimLongEnoughAt(this.blockLevelTrimCharacterCount)) {
						// Leaves "\n" at the end so that later it detects a "new line" trim point
						// and appends `{ type: 'read-more' }` as a block-level part.
						trimmedBlock = this.trimAtPoint(block, 'new-line')
						if (!trimmedBlock || !this.willTrimLongEnoughAfter(countCharacters(trimmedBlock, 'points'))) {
							trimmedBlock = this.trimTextContent(block)
						}
						if (trimmedBlock) {
							this.characterPoints += countCharacters(trimmedBlock, 'points')
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
		return characterCount > 0.7 * (this.characterCount + this.getCharacterPointsLeft())
	}

	// Returns whether it would be ok to trim at some previous point (relative to the limit point).
	// Is used to test whether it would be ok to trim in the middle of current paragraph.
	//
	willTrimLongEnoughAfter(characterCount) {
		return this.willTrimLongEnoughAt(this.characterCount + characterCount)
	}

	getCharacterPointsLeft(withFitFactor) {
		return this.withFitFactor(this.options.limit, withFitFactor) - this.characterPoints
	}

	willOverflow(points, withFitFactor = true) {
		return this.characterPoints + points > this.withFitFactor(this.options.limit, withFitFactor)
	}

	withFitFactor(points, withFitFactor) {
		if (withFitFactor) {
			return Math.floor(points * (1 + this.getFitFactor()))
		} else {
			return points
		}
	}

	countIfFits = (content) => {
		if (typeof content === 'number') {
			if (this.willOverflow(content)) {
				return
			}
			this.characterPoints += content
			return true
		}
		const points = countCharacters(content, 'points')
		if (this.willOverflow(points)) {
			return
		}
		this.characterCount += countCharacters(content, 'characters')
		this.characterPoints += points
		return true
	}

	trimTextContent(content) {
		let trimmedBlock = this.trimAtPoint(content, 'sentence-end')
		if (trimmedBlock && this.willTrimLongEnoughAfter(countCharacters(trimmedBlock, 'points'))) {
			return trimmedBlock
		}
		trimmedBlock = this.trimAtPoint(content, 'whitespace', false)
		if (trimmedBlock && this.willTrimLongEnoughAfter(countCharacters(trimmedBlock, 'points'))) {
			return trimmedBlock
		}
		return this.trimAtPoint(content, 'any', false)
	}

	trimTextAtPoint(text, type, withFitFactor) {
		if (this.getCharacterPointsLeft(withFitFactor) === 0) {
			return
		}
		const index = this.findTrimPoint(text, type, this.getCharacterPointsLeft(withFitFactor) - 1)
		if (index >= 0) {
			text = text.slice(0, index + 1)
			if (type === 'any' || type === 'whitespace') {
				text += '…'
			}
			return text
		}
	}

	trimAtPoint(block, type, withFitFactor = true) {
		if (typeof block === 'string') {
			return this.trimTextAtPoint(block, type, withFitFactor)
		}
		let trimPointIndex
		let overflow = countCharacters(block, 'points') - this.getCharacterPointsLeft(withFitFactor)
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
		return countCharacters(content.content, mode)
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
			return countIfFits(getAttachmentCharacterPoints(attachment))
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
		default:
			return EMBEDDED_ATTACHMENT_COST
	}
}