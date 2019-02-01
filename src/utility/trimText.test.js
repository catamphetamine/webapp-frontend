import expectToEqual from './expectToEqual'

export default function(trimText) {
	function test(input, maxLength, output) {
		expectToEqual(trimText(input, maxLength), output)
	}

	const text = 'Сергей Галёнкин заявил, что блогеры-участники программы Support-A-Creator получили по три бесплатных игры из стартовой линейки Epic Games Store.'
	test(text, text.length - 1, 'Сергей Галёнкин заявил, что блогеры-участники программы Support-A-Creator получили по три бесплатных игры из стартовой линейки Epic Games …')

	test('A b c. D e f. G h', 17, 'A b c. D e f. G h')
	test('A b c. D e f. G h', 16, 'A b c. D e f.')
	test('A b c. D e f. G', 12, 'A b c.')
	test('A b c. D e f. G', 6, 'A b …')
	test('A b c. D e f. G', 4, 'A b …')
	test('A b c. D e f. G', 3, 'A …')
	test('A b c. D e f. G', 2, 'A …')
	test('A b c. D e f. G', 1, 'A…')
	test('A b c. D e f. G', 0, '…')

	test('Abc.', 2, 'Ab…')
	test('Abc? Def.', 7, 'Abc?')
	test('Abc! Def.', 7, 'Abc!')

	test('Abc. Def? Ghi', 12, 'Abc. Def?')
	test('Abc. Def! Ghi', 12, 'Abc. Def!')

	test('A b c\nD e f\nG h i', 16, 'A b c\nD e f')
}