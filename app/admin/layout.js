'use client'

import React, { useState, useEffect } from 'react';

import { UserContext, UserMapContext } from 'app/admin/userContext';

import { buildUserMap, getUserSession } from 'lib/userInfo';

import Header from 'components/admin/header';
import EventOrganizer from 'components/eventOrganizer';
import CustomToaster from 'components/customToaster';

// @TODO - Beautify the admin system on mobile sometime in the far future
export const viewport = {
	width: '1201',
}

export default function RootLayout({ children }) {

	const [user, setUser] = useState(null);
	const [userMap, setUserMap] = useState({});

	useEffect(() => {
		setUser(getUserSession());

		const userLoader = async () => {
			const users = await buildUserMap();
			setUserMap(users);
		}
		userLoader();
	}, []);

	return (
		<html lang='en'>
			<head>
				<title>Metro Railings Admin Platform</title>
			</head>
			<body>
				<UserContext.Provider value={ user }>
					<UserMapContext.Provider value={ userMap }>
						<Header />
						{ children }

						<EventOrganizer />
						<CustomToaster />
					</UserMapContext.Provider>
				</UserContext.Provider>
			</body>
		</html>
	);
}