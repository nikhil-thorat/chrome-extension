import { useState } from "react";
import "../styles/style.css";

function FollowAllButton() {
	const [isFollowing, setIsFollowing] = useState(false);

	async function followAllUsers() {
		try {
			console.log("Starting follow-all process...");

			// Switching to the "For You" tab
			const navTabs = document.querySelector('[data-testid="ScrollSnap-List"]');
			if (!navTabs) {
				console.error("Navigation tabs not found!");
				return;
			}

			const forYouTab = navTabs.childNodes[0] as HTMLElement;
			const forYouTabLink = forYouTab.querySelector("a");
			if (!forYouTabLink) {
				console.error("For You tab not found!");
				return;
			}

			// Waiting to load page
			forYouTabLink.click();
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Starting processing users
			let totalFollowed = 0;

			while (true) {
				// Fetching all visible usernames
				const usernames = Array.from(
					document.querySelectorAll('[data-testid="User-Name"]')
				);

				if (!usernames.length) {
					console.log("No more users to process!");
					break;
				}

				let userFollowed = false;

				// Processing each username
				for (const username of usernames) {
					const userProfileLink = username.querySelector("a");
					if (!userProfileLink) continue;

					// Hovering over the user profile
					const hoverEvent = new MouseEvent("mouseover", {
						view: window,
						bubbles: true,
						cancelable: true,
					});
					userProfileLink.dispatchEvent(hoverEvent);

					// Waiting for the hover card to load
					await new Promise((resolve) => setTimeout(resolve, 800));

					const hoverCard = document.querySelector(
						'[data-testid="HoverCard"]'
					) as HTMLElement;

					if (hoverCard) {
						const followButton = hoverCard.querySelector("button");
						if (followButton && followButton.textContent === "Follow") {
							followButton.click();
							userFollowed = true;
							totalFollowed++;

							console.log(`Followed user: ${username.textContent}`);

							// Waiting for sometime before processing next req
							await new Promise((resolve) =>
								setTimeout(resolve, 400 + Math.random() * 600)
							);
						}
					}
				}

				// Scrolling to load more users
				if (!userFollowed) {
					window.scrollBy(0, 1000);
					await new Promise((resolve) => setTimeout(resolve, 800));
					const currentScrollHeight = document.documentElement.scrollHeight;
					if (currentScrollHeight === document.body.scrollHeight) {
						console.log("Reached end of the page, no more users.");
						break;
					}
				}
			}

			console.log(`Total users followed: ${totalFollowed}`);
		} catch (error) {
			console.error("An error occurred while following users:", error);
		}
	}

	async function handleFollowAll() {
		setIsFollowing(true);
		try {
			// Calling followAllUsers
			await followAllUsers();
		} catch (error) {
			console.error("Error in handleFollowAll:", error);
		} finally {
			setIsFollowing(false);
		}
	}

	return (
		<button
			className="follow-all-button"
			onClick={handleFollowAll}
			disabled={isFollowing}
		>
			{isFollowing ? "Following..." : "Follow All"}
		</button>
	);
}

export default FollowAllButton;
