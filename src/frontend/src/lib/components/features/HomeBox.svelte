<!-- Description: This component is used to display a card with a title, subtitle, background color, and an image. -->
<script lang="ts">
    export let title: string = "";
    export let subtitle: string = "";
    export let bgColor: string = "";
    export let paint_stroke_path: string = ""; 
</script>

<main>
    <div class="card" style="background-color: {bgColor};">
        <div class="icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H15M12 3V3C7.03 3 4 7.03 4 10.5C4 13.5 6.03 15.74 7.68 17.11C8.2 17.55 8.5 18.16 8.5 18.82V19H15.5V18.82C15.5 18.16 15.8 17.55 16.32 17.11C17.97 15.74 20 13.5 20 10.5C20 7.03 16.97 3 12 3Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>

        <h1>{title}</h1>
        <p>{subtitle}</p>

        <div class="paint-stroke">
            <img src={"/images/" + paint_stroke_path + "_paint_stroke.png"} alt="Paint stroke" />
        </div>
    </div>
</main>

<style>
    .card {
        width: 250px;
        height: 280px;
        border-radius: 25px;
        padding: 20px;
        color: white;
        font-family: 'Georgia', serif;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: left;
        transform: rotate(-5deg);
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
    }
    .card:hover {
        transform: rotate(0deg);
    }
    .card {
        transform: rotate(-5deg); 
        transition: transform 0.5s;
    }
    .icon {
        position: absolute;
        top: 15px;
        left: 15px;
    }

    h1 {
        font-size: 44px;
        margin: 50px 0 5px;
        font-family: "C059-Bold";
    }

    p {
        font-size: 14px;
        margin: 0;
        font-family: "C059-Italic";
    }

    .paint-stroke {
        position: absolute;
        top: 10px;
        right: 33px;
        width: 80px;
        height: 40px;
        background-size: cover;
    }
</style>
