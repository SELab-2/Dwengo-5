<script>
    
</script>
<input type="checkbox" id="toggle" class="toggleCheckbox" />
<label for="toggle" class='toggleContainer'>
    <div>EN</div>   
    <div>NL</div>
</label>

<style>
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