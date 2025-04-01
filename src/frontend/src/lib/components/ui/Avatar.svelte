<script lang="ts">
    export let name: string = "";
    export let color: string = "";

    //Change if we get full name to first leter of name and first letter of second name.
    const initials: string = name.charAt(0).toUpperCase();

    // TODO: current way to make sure the same name has the same color -> find a better way
    function hashStringToNumber(str: string): number {
        return Array.from(str).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    }

    function getRandomColor(name: string) {
        const hash = hashStringToNumber(name);
        const hue = hash % 360;
        const saturation = 50 + (hash % 30);
        const lightness = 70 + (hash % 20);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    let backgroundColor = getRandomColor(name);
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
