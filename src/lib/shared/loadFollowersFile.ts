import JSZip from 'jszip';
import type { User } from './User';

export class FollowersFileWrongFormatError extends Error {
	constructor(message: string) {
		super(message);
	}
}

type RawUser = {
	title: string; // empty
	media_list_data: []; // empty
	string_list_data: User[]; // always contains only 1 user
};

type Following = {
	relationships_following: RawUser[];
};

const FOLLOWERS_FOLDER = 'connections/followers_and_following';

export async function loadFollowersFile(file: File | undefined): Promise<{
	followers: User[];
	following: User[];
}> {
	if (!file) {
		throw new FollowersFileWrongFormatError('File is undefined');
	}
	try {
		const zip = await JSZip.loadAsync(file);

		// Extract followers.json
		const followersFile = zip.file(`${FOLLOWERS_FOLDER}/followers_1.json`);
		if (!followersFile)
			throw new FollowersFileWrongFormatError('followers.json not found in the zip file');

		const followersContent = await followersFile.async('string');
		const followersData: RawUser[] = JSON.parse(followersContent);

		// Extract followed.json
		const followedFile = zip.file(`${FOLLOWERS_FOLDER}/following.json`);
		if (!followedFile)
			throw new FollowersFileWrongFormatError('followed.json not found in the zip file');

		const followedContent = await followedFile.async('string');
		const followingData: Following = JSON.parse(followedContent);

		const followers: User[] = followersData.map((rawUser) => rawUser.string_list_data[0]);
		const following: User[] = followingData.relationships_following.map(
			(rawUser) => rawUser.string_list_data[0]
		);

		// seems like instagram following.json file doesn't contain "value" field, so we need to extract it from the href
		following.forEach((user) => {
			if (!user.value) {
				user.value = user.href.split("/").pop() as string; // Extract username from URL if value is null
			}
		});
		followers.forEach((user) => {
			if (!user.value) {
				user.value = user.href.split("/").pop() as string; // Extract username from URL if value is null
			}
		});

		return {
			followers: followers,
			following: following
		};
	} catch (error) {
		throw new FollowersFileWrongFormatError('There was an error reading the zip file');
	}
}
