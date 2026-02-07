import { render, fireEvent } from '@testing-library/svelte';
import FileUpload from './FileUpload.svelte';
import { loadFollowersFile, FollowersFileWrongFormatError } from '$lib/shared/loadFollowersFile';
import { type User } from '$lib/shared/User';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the loadFollowersFile function
vi.mock('$lib/shared/loadFollowersFile');

const mockTrigger = vi.fn();
vi.mock('@skeletonlabs/skeleton', async (importOriginal) => {
	const original: any = await importOriginal();
	return {
		...original,
		getToastStore: () => ({
			trigger: mockTrigger
		})
	};
});

describe('FileUpload Component', () => {
	beforeEach(() => {
		mockTrigger.mockClear();
	});

	it('dispatches uploadComplete event with followers and following on successful file load', async () => {
		// Arrange
		const mockFollowers: User[] = [
			{ href: 'youDontFollow', timestamp: 0, value: 'youDontFollow' },
			{ href: 'mutual', timestamp: 0, value: 'mutual' }
		];
		const mockFollowing: User[] = [
			{ href: 'youDontFollow', timestamp: 0, value: 'youDontFollow' },
			{ href: 'mutual', timestamp: 0, value: 'mutual' }
		];

		// Mocking loadFollowersFile to resolve with the expected data
		(loadFollowersFile as any).mockResolvedValue({
			followers: mockFollowers,
			following: mockFollowing
		});

		// Listen for the 'uploadComplete' event
		const uploadComplete = vi.fn();

		// Render the component with the event handler
		const { getByTestId } = render(FileUpload, {
			props: {},
			events: {
				uploadComplete
			}
		});

		// Act
		const button = getByTestId('file-dropzone').querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		expect(button).toBeInTheDocument();
		const file = new File(['content'], 'followers.zip', { type: 'application/zip' });

		// Trigger file input change event
		await fireEvent.change(button, { target: { files: [file] } });

		// Assert
		expect(loadFollowersFile).toHaveBeenCalledWith(file);
		expect(uploadComplete).toHaveBeenCalledWith(
			expect.objectContaining({
				detail: { followers: mockFollowers, following: mockFollowing }
			})
		);
	});

	it('alerts with error message when an invalid file is uploaded', async () => {
		// Arrange
		const mockErrorMessage = 'El fichero no tiene el formato correcto. Revisa su estructura.';

		(loadFollowersFile as any).mockImplementation(() => {
			throw new FollowersFileWrongFormatError(mockErrorMessage);
		});

		// Render the component
		const { getByTestId } = render(FileUpload);

		// Act
		const button = getByTestId('file-dropzone').querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		expect(button).toBeInTheDocument();
		const file = new File(['invalid content'], 'invalid.zip', { type: 'application/zip' });

		// Trigger file input change event
		await fireEvent.change(button, { target: { files: [file] } });

		// Assert
		expect(loadFollowersFile).toHaveBeenCalledWith(file);

		expect(mockTrigger).toHaveBeenCalledWith({
			message:
				'El fichero no tiene el formato correcto. Revisa las instrucciones en el botón de ayuda.',
			background: 'variant-filled-error',
			timeout: 6000
		});
	});
});
