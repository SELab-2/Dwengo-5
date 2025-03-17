<script>
	import Header from "./lib/components/Header.svelte";
	import Footer from "./lib/components/Footer.svelte";
	import Loginpage from "./routes/login/loginpage.svelte";

	export let name;
</script>

<main>
	<Loginpage/>
	
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>