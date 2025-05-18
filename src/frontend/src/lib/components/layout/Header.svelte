<script lang="ts">
	import LanguageSelector from "../LanguageSelector.svelte"; 
	import Avatar from "../ui/Avatar.svelte";
	import { currentTranslations } from "../../locales/i18n";
	import { user } from "../../stores/user.ts";
	import { clearToken } from "../../auth.ts";
	import NotificationCenter from "../features/Notification.svelte";
	import { onMount, onDestroy } from "svelte";
	import { routeToItem } from '../../route.ts';
    import { goto } from '$app/navigation';
	import { routeTo } from "../../route.ts";

	let currentNavIndex = -1; // default to no tab highlighted
	let navItems: string[];
    let dropdownOpen = false;
	let isMobileMenuOpen = false;

	// Watch for changes in currentTranslations to update the nav items
	$: navItems = [
		"home",
		"classrooms",
        "assignments",
        "questions",
		"catalog"
	];

	onMount(() => {
        const path = window.location.pathname.split('/')[1] // zou hetzelfde moeten zijn als .slice(1)
		const navMap: Record<string, number> = {
			'home': 0,
			'classrooms': 1,
            'assignments': 2,
            'questions': 3,
			'catalog': 4
		};
		
		if (path in navMap) {
			currentNavIndex = navMap[path];
		} else {
			currentNavIndex = -1; // No tab highlighted if path doesn't match
		}
	});

	function handleNavClick(index: number) {
		currentNavIndex = index;
        routeToItem(navItems[index]);
	}

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
    }

    function toggleMobileMenu() {
        console.log("Mobile menu toggled");
		isMobileMenuOpen = !isMobileMenuOpen;
	}

    function goToSettings() {
        // TODO Nyah you can add the logic to navigate to the settings page
    }

	function logOut() {
		clearToken();
		user.set({role: "", name: "", id: ""});
		goto("/");
	}

	let lastClickTime = 0;
    let audio = new Audio("/music/Avatar Soundtrack_ Momo's Theme.mp3");

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

	function handleResize() {
		if (window.innerWidth > 1125 && isMobileMenuOpen) {
			isMobileMenuOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener("click", handleTripleClick);
		window.addEventListener("resize", handleResize);
	});

	onDestroy(() => {
        if (typeof document !== 'undefined') {
            document.removeEventListener("click", handleTripleClick);
        }
        if (typeof window !== 'undefined') {
            window.removeEventListener("resize", handleResize);
        }
	});

</script>

<div class="header-wrapper">
    <header>
        <div class="header-container">
            <img src="/images/dwengo-groen-zwart.svg" class="dwengo-logo" alt="Dwengo Logo" />
    
            <nav class="nav desktop-nav">
                {#each navItems as item, index}
                    <a
                        href={`/${item}`}
                        class:active={index === currentNavIndex}
                        class="nav-link custom-button"
                        aria-label="Navigate to {item}"
                        on:click={(e) => {
                            // prevent full page reload unless modifier keys are used
                            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.button === 0) {
                                e.preventDefault();
                                handleNavClick(index);
                            }
                        }}
                    >
                    {$currentTranslations.header[item]}
                </a>
            
                {/each}
            </nav>
    
            <div class="right-section">
                <NotificationCenter />
                <LanguageSelector />
                <button class="user-info-wrapper desktop-user-info" on:click={() => routeTo(`/profile`)}>
                    <Avatar name={$user.name} />
                    <div class="user-info" aria-label="User options">
                        <p class="name" style="margin: 2px">{$user.name}</p>
                        <p class="role" style="margin: 2px">{$user.role}</p>
                    </div>
                </button>
    
                <!-- Hamburger menu button -->
                <button class="hamburger-menu" on:click={toggleMobileMenu} aria-label="Toggle menu">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </button>
            </div>
        </div>
    </header>
    
    {#if isMobileMenuOpen}
        <div class="mobile-menu {isMobileMenuOpen ? 'open' : ''}">
            <div class="menu-content">
                    <nav class="mobile-nav">
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
            
                <!-- Full right-side section for mobile -->
                <div class="mobile-right-section">
        
                        <!--<NotificationCenter />-->
                        <LanguageSelector />
                
                        <div class="user-info-wrapper">
                            <Avatar name={$user.name} />
                            <div class="user-info">
                                <p class="name" style="margin: 2px">{$user.name}</p>
                                <p class="role" style="margin: 2px">{$user.role}</p>
                            </div>
                        </div>
            
                        <div class="menu-buttons">
                            <button class="button" on:click={goToSettings}>Settings</button>
                            <button class="button" on:click={logOut}>Log Out</button>
                        </div>
                </div>
            </div>
        </div>
    {/if}
</div>


<style>
    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* light, subtle line */
    }

    .right-section {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-right: 5px;
        font-size: 24px;
        font: inherit;
        text-align: left;
        cursor: pointer;
    }

    .user-info-wrapper {
        display: flex;
        flex-direction: row;
        gap: 5px;
        background: none;
        border: none;
    }

    .name {
        font-size: x-large;
        font-weight: bold;
        margin-top: -10px;
    }

    .role {
        font-size: medium;
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

	.desktop-nav, .desktop-user-info {
		display: flex;
	}

	.hamburger-menu {
		display: none;
		flex-direction: column;
		gap: 5px;
		background: none;
		border: none;
		cursor: pointer;
	}

	.hamburger-menu .bar {
		width: 25px;
		height: 3px;
		background-color: #374151;
	}

    .mobile-menu {
        position: absolute;
        top: 100%;
        right: -300px; /* Move it completely off the page */
        background-color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 300px;
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        align-items: center;
        right: 0; /* Bring it back into view */
        transform: translateX(0);


    }

    .menu-content {
        width: 100%;
        max-width: 250px;
    }


    .header-wrapper {
        position: relative;
    }

    .mobile-right-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
    }

    .menu-buttons {
        padding-top: 1rem;
        display: flex;
        flex-direction: row;
        gap: 10px;
        justify-content: center;
    }

	.mobile-nav {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (max-width: 1125px) {
		.desktop-nav, .desktop-user-info {
			display: none;
		}

		.hamburger-menu {
			display: flex;
		}
	}
</style>