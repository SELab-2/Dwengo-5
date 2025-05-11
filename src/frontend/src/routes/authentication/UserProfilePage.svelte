<script lang="ts">
    import Header from "../../lib/components/layout/Header.svelte";
    import Avatar from "../../lib/components/ui/Avatar.svelte";
    import { user } from "../../lib/stores/user.ts";
	import { clearToken } from "../../lib/auth.ts";
    import { push } from "svelte-spa-router";
    import { currentTranslations } from "../../lib/locales/i18n";
    import { onMount } from "svelte";
    import { apiRequest } from "../../lib/api.ts";

	let userName = $user.name;

    let userData: any = {};
    let email = "";
    let password = "";

    // Local edit fields
    let editUserName = userName;
    let editEmail = email;

    onMount(async () => {
        userData = await apiRequest(`/users/${$user.id}`, "GET");
        email = userData.email;
        userName = $user.name;
        // Initialize edit fields with current values
        editUserName = userName;
        editEmail = email;
    });

    let showPassword = false;
    let confirmPassword = '';
    let passwordError = false;

    let isEditing = false;

    function toggleEdit() {
        isEditing = !isEditing;
        if (isEditing) {
            // When entering edit mode, copy current values to edit fields
            editUserName = userName;
            editEmail = email;
        }
    }

    async function saveChanges() {
        // Only check password if either field is filled
        if ((password || confirmPassword) && password !== confirmPassword) {
            passwordError = true;
            return;
        }

        // Prepare data for PATCH request
        const id = $user.id;
        const patchData = {
            username: editUserName,
            email: editEmail,
        };
        if (password && password === confirmPassword) {
            patchData.password = password;
        }

        try {
            const response = await apiRequest(`/users/${id}`, "PATCH",
                { body: JSON.stringify(patchData) }
            );

            if (response !== undefined) {
                userName = editUserName;
                email = editEmail;
                $user.name = userName;
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }

        isEditing = false;
        passwordError = false;
    }

    function logOut() {
		clearToken();
		user.set({role: "", name: "", id: ""});
		push("/");
	}

    $: if (password === confirmPassword) {
        passwordError = false;
    }
</script>

<main>
    <Header/>

    <div class="container">
        <div class="header">
                <h2>{$currentTranslations.profile.welcome}, {$user.name}</h2>
                <button class="button logout" style="margin-left:auto;" on:click={() => logOut()}>
                    Log out
                </button>
        </div>
    
        <div class="card">
            <div class="profile-info">
                <Avatar name={$user.name}/>
                <div>
                    <h3 class="name">{userName}</h3>
                    <p class="email">{email}</p>
                </div>
                <button class="button" style="margin-left:auto;" on:click={toggleEdit}>
                    {isEditing ? $currentTranslations.profile.cancel : $currentTranslations.profile.edit}
                </button>
            </div>
    
            <div class="profile-details">
                <div class="row">
                    <span class="label">{$currentTranslations.profile.username}</span>
                    {#if isEditing}
                        <input type="text" bind:value={editUserName} class="input-inline" />
                    {:else}
                        <span class="value">{userName}</span>
                    {/if}
                </div>
                <div class="row">
                    <span class="label">{$currentTranslations.profile.email}</span>
                    {#if isEditing}
                        <input type="text" bind:value={editEmail} class="input-inline" />
                    {:else}
                        <span class="value">{email}</span>
                    {/if}
                    <!--<p class="email">{$user.email}</p>-->
                </div>
                <div class="row">
                    <span class="label">{$currentTranslations.profile.password}</span>
                        {#if isEditing}
                        <div class="password-group">
                            <input
                                type="text"
                                bind:value={password}
                                class:error-border={passwordError}
                                class="input-inline-password"
                                placeholder="New password"
                            />
                            <input
                                type="text"
                                bind:value={confirmPassword}
                                class:error-border={passwordError}
                                class="input-inline-password"
                                placeholder="Confirm password"
                            />
                        </div>
                        {:else}
                            <button class="value" on:click={() => showPassword = !showPassword}>
                                {showPassword ? password : "•".repeat(password.length)}
                            </button>
                        {/if}
                </div>
                {#if isEditing}
                    <div class="save-row">
                        <button class="button" on:click={saveChanges}>{$currentTranslations.profile.save}</button>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</main>



<style>
    main {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-content: center;
    }
	.container {
		max-width: 1000px;
		margin: auto;
		padding: 2rem;
		font-family: 'Inter', sans-serif;
        width: 80%;
        margin-top: 150px;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}
	.card {
		background: #fff;
		border-radius: 20px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
		padding: 2rem;
	}
	.profile-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

    .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding: 1rem 0;
    }

    .label {
        color: #555;
        font-weight: 599;
    }

    .value {
        color: #333;
        padding-bottom: 9px;
        padding-top: 9px;
        background: none;
        border: none;
    }
    .name {
        font-size: 1.5rem;
        margin: 0;
    }
    .email {
        font-size: 1rem;
        color: #888;
        margin: 0;
    }
    .input-inline {
        padding: 0.5rem 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
        flex: 1;
        max-width: 250px;
        margin-left: auto;
    }

    .input-inline-password {
        padding: 0.5rem 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
        width: 250px;
    }

    .save-row {
        text-align: right;
        margin-top: 1.5rem;
    }
    .password-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
        max-width: 250px;
        align-items: flex-end;
    }

    .error-border {
        border: 1.5px solid #e53935;
        background-color: #fff5f5;
    }

    .logout {
        margin-right: 32px;
    }
</style>