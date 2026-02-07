<script lang="ts">
	import type { User } from '$lib/shared/User';
	import UserCard from '$lib/components/UserCard.svelte';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';

	let activeTab = 'followingThatDontFollowYou';

	const tabs = [
		{
			id: 'followingThatDontFollowYou',
			label: 'Unfollowers',
			icon: 'fas fa-thumbs-down'
		},
		{
			id: 'followersThatYouDontFollow',
			label: 'Fans',
			icon: 'fas fa-thumbs-up'
		}
	];

	export let followers: User[] | null = [];
	export let following: User[] | null = [];

	const followersArray = followers ?? [];
	const followingArray = following ?? [];

	const followersSet = new Set(followersArray.map((user) => user.value));
	const followingSet = new Set(followingArray.map((user) => user.value));

	const followersThatYouDontFollow = followersArray.filter((user) => !followingSet.has(user.value));
	const followingThatDontFollowYou = followingArray.filter((user) => !followersSet.has(user.value));

	const setActiveTab = (tabId: string) => {
		activeTab = tabId;
	};

	function getBadgeNumber(id: string) {
		return id === 'followingThatDontFollowYou'
			? followingThatDontFollowYou.length
			: followersThatYouDontFollow.length;
	}

	function getColorClass(id: string) {
		return id === 'followingThatDontFollowYou' ? 'bg-error-700' : 'bg-success-500';
	}
</script>

<div class="flex flex-col justify-start items-center h-full w-full">
	<TabGroup
		justify="justify-center"
		active="variant-filled-primary"
		hover="hover:variant-soft-primary"
		flex="flex-auto lg:flex-none"
		rounded="rounded-container-token"
		border=""
		class="bg-surface-100-800-token w-full md:w-2/5"
	>
		{#each tabs as { id, label, icon }}
			<TabAnchor
				href="#"
				selected={activeTab === id}
				on:click={() => setActiveTab(id)}
				data-testid={id}
			>
				<svelte:fragment slot="lead">
					<div class="flex flex-row justify-center gap-2">
						<span class="icon is-small">
							<i class={icon} aria-hidden="true"></i>
						</span>
						<span class={`badge-icon ${getColorClass(id)}`}>
							{getBadgeNumber(id)}
						</span>
					</div>
				</svelte:fragment>
				<span>{label}</span>
			</TabAnchor>
		{/each}
	</TabGroup>

	<div
		class="overflow-x-hidden overflow-y-auto w-full max-w-lg h-xl md:h-full mt-4 pl-2 pr-2"
		data-testid="users-list"
	>
		{#if activeTab === 'followingThatDontFollowYou'}
			{#each followingThatDontFollowYou as user}
				<UserCard {user} />
			{/each}
		{:else if activeTab === 'followersThatYouDontFollow'}
			{#each followersThatYouDontFollow as user}
				<UserCard {user} />
			{/each}
		{/if}
	</div>
</div>

<style>
	.ig-icon {
		color: #ff5aa7;
	}
</style>
