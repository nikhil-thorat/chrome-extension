import React from "react";
import { createRoot } from "react-dom/client";
import { defineContentScript } from "wxt/sandbox";
import FollowAllButton from "../../components/FollowAllButton";

export default defineContentScript({
	// Loading script on below URL's
	matches: ["https://twitter.com/home", "https://x.com/home"],
	main() {
		// Injecting Follow Button in the DOM
		function injectFollowButton() {
			// Creating a div to append FollowAllButton
			const container = document.createElement("div");
			document.body.appendChild(container);

			// Creating root element for rendering the FollowAllButton
			const root = createRoot(container);
			root.render(React.createElement(FollowAllButton));
		}

		// Injecting Script when page is loaded
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", injectFollowButton);
		} else {
			injectFollowButton();
		}
	},
});
