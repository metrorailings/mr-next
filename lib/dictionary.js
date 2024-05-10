// File meant as a repository for fundamental keywords and platform-wide constraints

/**
 * Function designed to dispatch a custom event
 */
export const acceptableMediaExtensions = {
	'image/jpeg': true,
	'image/jpg': true,
	'image/png': true,
	'video/mp4': true
};

export const acceptableImageExtensions = {
	'image/jpeg': true,
	'image/jpg': true,
	'image/png': true
};

export const initStatus = {
	key: 'prospect',
	label: 'Prospect',
	state: 'prospect',
};

export const quoteStatus = {
	key: 'pending',
	label: 'Pending Finalization',
	state: 'prospect'
};

export const shopStatuses = [
	{
		key: 'material',
		label: 'Planning',
		state: 'open'
	},
	{
		key: 'layout',
		label: 'Layout',
		state: 'open'
	},
	{
		key: 'welding',
		label: 'Welding',
		state: 'open'
	},
	{
		key: 'grinding',
		label: 'Grinding',
		state: 'open'
	},
	{
		key: 'painting',
		label: 'Finishing',
		state: 'open'
	},
	{
		key: 'install',
		label: 'Ready for Install',
		state: 'open'
	}
];

export const closingStatus = {
	key: 'closing',
	value: 'Closing',
	state: 'open'
};

export const closedStatus = {
	key: 'closed',
	label: 'Closed',
	state: 'closed'
};

export const cancelledStatus = {
	key: 'cancelled',
	label: 'Cancelled',
	state: 'closed'
};

export const statuses = [
	{ ...initStatus },
	{ ...quoteStatus },
	...shopStatuses,
	{ ...closingStatus },
	{ ...closedStatus },
	{ ...cancelledStatus }
];

// Function meant to return a list of all open statuses
export function openStatuses() {
	return statuses.filter((status) => status.state === 'open');
}

// Function meant to return all metadata associated with a particular status
export function getStatusMetadata(statusKey) {
	for (let i = 0; i < statuses.length; i += 1) {
		if (statuses[i].key === statusKey) {
			return statuses[i];
		}
	}
}