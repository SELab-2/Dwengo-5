<script lang="ts">
    export let name = "";

    //Change if we get full name to first leter of name and first letter of second name.
    const initials = name.charAt(0).toUpperCase();

    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 30) + 50;
        const lightness = Math.floor(Math.random() * 20) + 70;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    let backgroundColor = getRandomColor();
</script>

<div class="avatar" style="background-color: {backgroundColor};">
    {initials}
</div>

<style>
    .avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        font-weight: bold;
        text-transform: uppercase;
        line-height: 50px;
    }
</style>
