<script>
    import Tab from "$lib/shared/Tab.svelte";
  import LanguageSelector from "./LanguageSelector.svelte";
    let items = ["Home", "Catalog", "Classrooms", "Assignments"];
    export let name = "Pedro"; // This should be fetched from the backend
    export let role = "Teacher"; //This should be fetched from the backend
</script>

<header>
    <h1>
        <img src="/images/dwengo-groen-zwart.svg" alt="Dwengo Logo">
        <Tab activeItem items={items}/>
        
        <div class="language-selector">        
            <LanguageSelector />
        </div>

        <img src="/images/blank_avatar.png" alt="Avatar" class="profile_pic">
        <div style="display: flex; flex-direction: column; align-items: flex-start; padding: 0 5px; margin-top: 20px;">
            <p style="margin: 0;">{name}</p>
            <p style="margin: 0; font-size: medium;">{role}</p>
        </div>

        <div class="search-box" style="padding: 0 5px; margin-top: 20px;">
            <button class="btn-search">
            <img src="/images/magnifying_glass.png" alt="Search" class="search-icon" />
            </button>
            <input type="text" class="input-search" placeholder="Type to Search...">
        </div>
    </h1>
    
</header>

<style>
    
    h1 {
        text-align: left;
        list-style-type: none;
        display: flex;
    }
    img {
        display: block;
        max-width:230px;
        max-height:95px;
        width: auto;
        height: auto;
    }
    .profile_pic {
        margin-left: auto;
        border-radius: 50%;
        width: 120px;
        height: 120px;
        background-image: "";
    }

    .language-selector {
        display: flex;         
            
        margin-left: auto;
    }

    *{
        box-sizing: border-box;
    }
    .search-box{
        width: fit-content;
        height: fit-content;
        position: relative;
    }
    .input-search{
        height: 50px;
        width: 50px;
        border-style: none;
        padding: 10px;
        font-size: 18px;
        letter-spacing: 2px;
        outline: none;
        border-radius: 25px;
        transition: all .5s ease-in-out;
        background-color: var(--dwengo-green);
        padding-right: 40px;
        color:#000000;
    }
    .input-search::placeholder{
        color:black;
        font-size: 18px;
        letter-spacing: 2px;
        font-weight: 100;
    }
    .btn-search{
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
        color:black ;
        background-color:transparent;
        pointer-events: painted;  
    }
    .btn-search:focus ~ .input-search{
        width: 300px;
        border-radius: 0px;
        background-color: transparent;
        border-bottom:1px solid black;
        transition: all 500ms cubic-bezier(0, 0.110, 0.35, 2);
    }
    .input-search:focus{
        width: 300px;
        border-radius: 0px;
        background-color: transparent;
        border-bottom:1px solid black;
        transition: all 500ms cubic-bezier(0, 0.110, 0.35, 2);
    }
    .search-icon{
        width: 30px;
        height: 30px;
    }
</style>