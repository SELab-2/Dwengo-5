<script lang="ts">
    import LoginForm from "$lib/components/LoginForm.svelte";
    import TextToggle from "$lib/components/TextToggle.svelte";
</script>

<div class="container">
    <h1 class="title">
        Change the <br> future of  
        <span class="green">STEM</span>
    </h1>
    <div class="login-form">
        <h1>Login</h1>
        <LoginForm />
    </div>
    <div class="login-backdrop">
        <img src="/images/login-dwengo-backdrop.png" alt="login backdrop" />
    </div>
    <div class="logo-dwengo">
        <img src="/images/dwengo-groen-zwart.png" alt="logo dwengo" />
    </div>
    <div class="toggle-lang">
        <input type="checkbox" id="toggle" class="toggleCheckbox" />
            <label for="toggle" class='toggleContainer'>
                <div>EN</div>   
                <div>NL</div>
            </label>
    </div>
    <div class="toggle-profile">
        <input type="checkbox" id="toggle2" class="toggleCheckbox" />
            <label for="toggle2" class='toggleContainer'>
                <div>Student</div>   
                <div>Teacher</div>
            </label>
    </div>
    
   
</div>

<style>
    .container {
        display: flex;
        height: 100vh; 
        width: 100vw;
    }

    .login-form {
        flex:1; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: white;
    }
    .login-backdrop {
        flex:1; 
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .login-backdrop img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Crop image to fill container */
    }

    .logo-dwengo {
        position: absolute;
        top: 0;
        left: 40%;
        padding: 1rem;
    }
    .logo-dwengo img{
        width: 45%;
    }

    .toggle-lang {
        position: absolute;
        top: 0;
        right: 0;
        padding: 1rem;
    }

    .toggle-profile {
        position: absolute;
        top: 20%;
        right: 44%;
        padding: 1rem;
    }

    .title {
        font-size: 66px;
        position: absolute;
        top: 0;
        left: 0;
        padding: 1rem;
    }
    .green {
        color: green;
    }

    h1 {
        margin-bottom: 1rem;
    }

    .toggleContainer {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        width: fit-content;
        border: 3px solid #343434;
        border-radius: 20px;
        background: #343434;
        font-weight: bold;
        color: #343434;
        cursor: pointer;
    }
    .toggleContainer::before {
        content: '';
        position: absolute;
        width: 50%;
        height: 100%;
        left: 0%;
        border-radius:20px;
        background: #80cc5d;
        transition: all 0.3s;
    }
    .toggleCheckbox:checked + .toggleContainer::before {
        left: 50%;
    }
    .toggleContainer div {
        padding: 6px;
        text-align: center;
        z-index: 1;
    }
    .toggleCheckbox {
        display: none;
    }
    .toggleCheckbox:checked + .toggleContainer div:first-child{
        color: white;
        transition: color 0.3s;
    }
    .toggleCheckbox:checked + .toggleContainer div:last-child{
        color: #343434;
        transition: color 0.3s;
    }
    .toggleCheckbox + .toggleContainer div:first-child{
        color: #343434;
        transition: color 0.3s;
    }
    .toggleCheckbox + .toggleContainer div:last-child{
        color: white;
        transition: color 0.3s;
    }
</style>
