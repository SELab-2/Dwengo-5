<script lang="ts">
    export let name: string = "";

    //Change if we get full name to first leter of name and first letter of second name.
    let initials: string = name.charAt(0).toUpperCase();

    $: {
        if (name.length > 1) {
            initials = name.charAt(0).toUpperCase();
        }
    }

    // TODO: current way to make sure the same name has the same color -> find a better way
    function hashStringToNumber(str: string): number {
        let hash = 0x811c9dc5; // FNV offset basis
        for (let i = 0; i < str.length; i++) {
            hash ^= str.charCodeAt(i);
            hash *= 0x01000193; // FNV prime
            hash >>>= 0; // Convert to unsigned 32-bit
        }
        return hash;
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
