<script lang="ts">

</script>

<div class="search-box">
    <button class="btn-search">
        <img src="images/magnifying_glass.png" alt="Search" class="search-icon" />
    </button>
    <input type="text" class="input-search" placeholder="Type to Search..." />
</div>

<style>
    .input-search {
        height: 50px;
        border-style: none;
        padding: 10px;
        font-size: 18px;
        letter-spacing: 2px;
        outline: none;
        transition: all 0.5s ease-in-out;
        padding-right: 40px;
        color: #000000;
        width: 300px;
        border-radius: 0px;
        background-color: transparent;
        border-bottom: 1px solid black;
    }

    .search-icon {
        width: 30px;
        height: 30px;
    }

    .search-box { 
        display: flex; /* Add this to position the button correctly within this container */
        align-items: center;
        gap: 10px; /* Space between input and button */
        padding-left: 20px;
        padding-bottom: 15px;
    }

    .btn-search {
        width: 30px;
        height: 30px;
        border-style: none; 
        font-size: 20px;
        font-weight: bold;
        outline: none;
        cursor: pointer;
        background-color: transparent;
        pointer-events: auto;
    }

</style>