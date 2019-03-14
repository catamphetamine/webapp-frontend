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
							trimmedBlock = this.trimTextAtPoint(block, 'sentence-end')
							if (!trimmedBlock || !this.willTrimLongEnoughAfter(countCharacters(trimmedBlock, 'points'))) {
								trimmedBlock = this.trimTextAtPoint(block, 'whitespace')
								if (!trimmedBlock || !this.willTrimLongEnoughAfter(countCharacters(trimmedBlock, 'points'))) {
									trimmedBlock = this.trimTextAtPoint(block, 'any')
								}
							}
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
							trimmedBlock = this.trimAtPoint(block, 'sentence-end')
							if (!trimmedBlock || !this.willTrimLongEnoughAfter(countCharacters(trimmedBlock, 'points'))) {
								trimmedBlock = this.trimAtPoint(block, 'whitespace')
								if (!trimmedBlock || !this.willTrimLongEnoughAfter(countCharacters(trimmedBlock, 'points'))) {
									trimmedBlock = this.trimAtPoint(block, 'any')
								}
							}
						}
					}
				}
			} else {
				switch (block.type) {
					case 'attachment':
						if (this.countAttachmentIfFits(this.getAttachmentById(block.attachmentId))) {
							trimmedBlock = block
						}
						break
					case 'heading':
						if (!this.countIfFits(block.content)) {
							trimmedBlock = block
						}
						break
					case 'list':
						const trimmedItems = []
						for (const item of block.items) {
							if (this.countIfFits(item)) {
								break
							}
							trimmedItems.push(item)
						}
						if (trimmedItems.length === block.items.length) {
							trimmedBlock = block
						} else if (trimmedItems.length > 0 && trimmedItems.length < block.items.length) {
							trimmedBlock = {
								...block,
								items: trimmedItems
							}
						}
						break
					case 'quote':
						if (block.source) {
							this.countIfFits(block.source)
						}
						// Won't trim mid-quote.
						if (this.countIfFits(block.content)) {
							trimmedBlock = block
						}
						break
					default:
						console.error(`Unsupported post block type: ${block.type}`)
						break
				}
			}
			if (trimmedBlock) {
				this.preview.push(trimmedBlock)
			}
			if (trimmedBlock !== block) {
				// Add "Read more" button.
				const hadNewLinesAtTheEnd = trimmedBlock && typeof trimmedBlock !== 'string' && trim(trimmedBlock, 'right')
				if (trimmedBlock && !hadNewLinesAtTheEnd) {
					this.preview[this.preview.length - 1] = addReadMore(this.preview[this.preview.length - 1])
				} else {
					this.preview.push({ type: 'read-more' })
				}
				return this.preview
			}
			this.characterPoints += NEW_PARAGRAPH_COST
			this.blockLevelTrimCharacterCount = this.characterCount
			this.blockLevelTrimCharacterPoints = this.characterPoints
		}
	}

	// It would be more preferable to use "characters left" instead of "character points left"
	// but calculating "characters left" in context of a non-fitting block is extra computation
	// which is chosen to be avoided here for simplicity.
	willTrimLongEnoughAt(characterCount) {
		return characterCount > 0.7 * (this.characterCount + this.getCharacterPointsLeft())
	}

	willTrimLongEnoughAfter(characterCount) {
		return this.willTrimLongEnoughAt(this.characterCount + characterCount)
	}

	getCharacterPointsLeft() {
		return this.options.limit - this.characterPoints
	}

	willOverflow(points) {
		return points > this.getCharacterPointsLeft()
	}

	countIfFits(content) {
		const points = countCharacters(content, 'points')
		if (this.willOverflow(points)) {
			return
		}
		this.characterCount += countCharacters(content, 'characters')
		this.characterPoints += points
		return true
	}

	trimTextAtPoint(text, type) {
		if (this.getCharacterPointsLeft() == 0) {
			return
		}
		const index = this.findTrimPoint(text, type, this.getCharacterPointsLeft() - 1)
		if (index >= 0) {
			text = text.slice(0, index + 1)
			if (type === 'any' || type === 'whitespace') {
				text += '…'
			}
			return text
		}
	}

	trimAtPoint(block, type) {
		let trimPointIndex
		let overflow = countCharacters(block, 'points') - this.getCharacterPointsLeft()
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

	countAttachmentIfFits(attachment) {
		if (!attachment) {
			console.error(`Attachment not found`)
			console.error(this.content)
			console.error(this.attachments)
			return
		}
		const points = this.getAttachmentCharacterPoints(attachment)
		if (this.willOverflow(points)) {
			return
		}
		this.characterPoints += points
		return true
	}

	getAttachmentCharacterPoints(attachment) {
		switch (attachment.type) {
			case 'picture':
				return EMBEDDED_PICTURE_COST
			case 'video':
				return EMBEDDED_VIDEO_COST
			default:
				return EMBEDDED_ATTACHMENT_COST
		}
	}

	getAttachmentById(id) {
		return this.attachments.find(_ => _.id === id)
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