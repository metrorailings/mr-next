/**
 * A module listing important information about all the handrailing designs
 *
 * @module handrailingDesigns
 */
// ----------------- MODULE DEFINITION --------------------------

const handrailingDesigns =
{
	options:
	[
		{
			id: 'H-S',
			label: 'Dixie',
			technicalLabel: 'Dixie',
			spanishLabel: 'Dixie',
			description: 'All railings will be topped off with a sleek handrail that curves slightly upward along' +
				' its centerline. Basically, these handrails resemble a shallow parabola.'
		},
		{
			id: 'H-C',
			label: 'Colonial',
			technicalLabel: 'Colonial',
			spanishLabel: 'Colonial',
			description: 'All railings will be topped off with a prominent handrail that angles ever so' +
				' slightly upward along its centerline. The sides of the handrail are grooved for decorative effect.'
		},
		{
			id: 'H-P',
			label: 'Pipe',
			technicalLabel: 'Pipe',
			spanishLabel: 'Tubo',
			description: 'All railings will be topped off with a hollow pipe handrail. The pipe is 1.5" in diameter.' +
				' All pipe ends will be capped with a welded cross-section of metal.'
		},
		{
			id: 'H-MS',
			label: 'Modern Slim (2" x 1")',
			technicalLabel: '2" x 1"',
			spanishLabel: '2" x 1"',
			description: 'All railings will be topped off with a hollow rectangular handrail. The width of the rail' +
				' will be 2" while the height of the rail will be 1". '
		},
		{
			id: 'H-MW',
			label: 'Modern Wide (3" x 1")',
			technicalLabel: '3" x 1"',
			spanishLabel: '3" x 1"',
			description: 'All railings will be topped off with a hollow rectangular handrail. The width of the rail' +
				' will be 3" while the height of the rail will be 1". '
		},
		{
			id: 'H-L',
			label: 'Laguna',
			technicalLabel: 'Laguna',
			spanishLabel: 'Laguna',
			description: 'All railings will be topped off with a handrail that curves slightly outward along its' +
				' upper edges. Think of a rectangular tube with the long edges of its top face jutting out ever so' +
				' slightly.'
		},
		{
			id: 'H-HS',
			label: 'Hemisphere',
			technicalLabel: 'Semicircle',
			spanishLabel: 'Semicírculo',
			description: 'All railings will be topped off with a handrail with a rounded top. The round part will be' +
				' 1.5" in diameter.'
		},
		{
			id: 'H-W',
			label: 'Stained Wood',
			technicalLabel: 'Wood',
			spanishLabel: 'Madera',
			description: 'All railings will be topped off with a grooved wooden handrail. The handrail will be set' +
				' firmly into place on top of the railing via screws.'
		},
	],
	designMetadata: [],
	technicalLabel: 'Handrailing',
	spanishLabel: 'Maldura'
};

// ----------------- EXPORT --------------------------

module.exports = handrailingDesigns;