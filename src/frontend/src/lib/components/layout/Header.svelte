<script lang="ts">
	import LanguageSelector from "../LanguageSelector.svelte"; 
	import Avatar from "../ui/Avatar.svelte";
	import { currentTranslations } from "../../locales/i18n";
	import { user } from "../../stores/user.ts";
	import { push } from "svelte-spa-router";
	import { clearToken } from "../../auth.ts";
	import NotificationCenter from "../features/Notification.svelte";
	import { onMount, onDestroy } from "svelte";
	import { routeToItem } from '../../route.ts';
	import { location } from "svelte-spa-router";

	let currentNavIndex = 0; 
	let navItems: string[];

	// Watch for changes in currentTranslations to update the nav items
	$: navItems = [
		"home",
		"catalog",
		"classrooms",
		"assignments",
	];

	$: {
		const path = $location.split('/')[1]; // First part of path after '/'
		const navMap: Record<string, number> = {
			'home': 0,
			'catalog': 1,
			'classrooms': 2,
			'assignments': 3
		};
		
		if (path in navMap) {
			currentNavIndex = navMap[path];
		} else {
			currentNavIndex = -1; // No tab highlighted if path doesn't match
		}
	}

	function handleNavClick(index: number) {
		currentNavIndex = index;
		routeToItem(navItems[index]);
	}

	function logOut() {
		clearToken();
		user.set({role: "", name: "", id: ""});
		push("/");
	}

	let lastClickTime = 0;
	let audio = new Audio("../../../../static/music/Avatar Soundtrack_ Momo's Theme.mp3");

	let counter = 0;
	function handleTripleClick(event: MouseEvent) {
		const element = document.querySelector(".dwengo-logo");
		if (element && element.contains(event.target as Node)) {
			const now = Date.now();

			if (now - lastClickTime < 500) {
				counter++;
			} else {
				counter = 1;
			}

			lastClickTime = now;

			if (counter === 3) {
				counter = 0;
				audio.play().catch(console.error);
			}
		}
	}

	onMount(() => {
		document.addEventListener("click", handleTripleClick);
	});

	onDestroy(() => {
		document.removeEventListener("click", handleTripleClick);
	});

</script>

<header>
	<div class="header-container">
        <img src="../../../../static/images/dwengo-groen-zwart.svg" class="dwengo-logo" alt="Dwengo Logo" />

        <nav class="nav">
            {#each navItems as item, index}
                <button
                    class:active={index === currentNavIndex}
                    class="nav-link custom-button"
                    on:click={() => handleNavClick(index)}
                    aria-label="Navigate to {item}"
                >
                    {$currentTranslations.header[item]}
                </button>
            {/each}
        </nav>

        <div class="right-section">
            <button class="logout" on:click={() => logOut()}>logout</button>
            <NotificationCenter />
            <LanguageSelector />
            <Avatar name={$user.name} />
            <div class="user-info">
                <p>{$user.name}</p>
                <p class="role">{$user.role}</p>
            </div>
            <div class="search-box">
                <button class="btn-search">
                    <img src="../../../../static/images/magnifying_glass.png" alt="Search" class="search-icon" />
                </button>
                <input type="text" class="input-search" placeholder="Type to Search..." />
            </div>
        </div>
	</div>
</header>

<style>
    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .right-section {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0 5px;
        font-size: 24px;
    }

    .role {
        font-size: medium;
        margin-top: -26px;
    }

    img {
        display: block;
        max-width: 230px;
        max-height: 95px;
        width: auto;
        height: auto;
    }

    * {
        box-sizing: border-box;
    }

    .search-box {
        width: fit-content;
        height: fit-content;
        position: relative;
    }

    .input-search {
        height: 50px;
        width: 50px;
        border-style: none;
        padding: 10px;
        font-size: 18px;
        letter-spacing: 2px;
        outline: none;
        border-radius: 25px;
        transition: all 0.5s ease-in-out;
        background-color: var(--dwengo-green);
        padding-right: 40px;
        color: #000000;
    }

    .input-search::placeholder {
        color: black;
        font-size: 18px;
        letter-spacing: 2px;
        font-weight: 100;
    }

    .btn-search {
        width: 50px;
        height: 50px;
        border-style: none;
        font-size: 20px;
        font-weight: bold;
        outline: none;
        cursor: pointer;
        border-radius: 50%;
        position: absolute;
        right: 0px;
        color: black;
        background-color: transparent;
        pointer-events: painted;
    }

    .btn-search:focus ~ .input-search {
        width: 300px;
        border-radius: 0px;
        background-color: transparent;
        border-bottom: 1px solid black;
        transition: all 500ms cubic-bezier(0, 0.11, 0.35, 2);
    }

    .input-search:focus {
        width: 300px;
        border-radius: 0px;
        background-color: transparent;
        border-bottom: 1px solid black;
        transition: all 500ms cubic-bezier(0, 0.11, 0.35, 2);
    }

    .search-icon {
        width: 30px;
        height: 30px;
    }

    .nav {
        padding: 1rem;
        display: flex;
        gap: 3rem;
        font-size: 1.125rem;
        font-weight: 500;
        font-family: 'C059-Roman';
    }

    .nav-link {
        text-decoration: none;
        color: #374151; /* gray-700 */
        padding-bottom: 0.25rem;
        transition: color 0.2s;
        color: inherit;
        font-size: inherit;
    }

    .custom-button {
        appearance: none;
        border: none;
        background: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
        text-align: left;
    }

    .active {
        color: var(--dwengo-green);
    }
</style>