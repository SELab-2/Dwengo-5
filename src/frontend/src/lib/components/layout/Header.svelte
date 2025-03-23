<script lang="ts">
    import Tab from "../../shared/Tab.svelte"; 
    import LanguageSelector from "../LanguageSelector.svelte"; 
    import Avatar from "../ui/Avatar.svelte";
    import { currentTranslations } from "../../locales/i18n";
    import {user} from "../../stores/user.ts";
    import { push } from "svelte-spa-router";
    import {clearToken} from "../../auth.ts";


    // Reactive items array
    $: items = [
      $currentTranslations.header.base,
      $currentTranslations.header.catalog,
      $currentTranslations.header.classroom,
      $currentTranslations.header.assignments,
    ];


  </script>
  
  <header>
    <div class="header-container">
      <img src="../../../../static/images/dwengo-groen-zwart.svg" alt="Dwengo Logo" />
      <Tab {items} />
  
      <div class="right-section">
        <button class="logout" on:click={() => {push("/"); clearToken();}}>logout</button>
        <LanguageSelector />
        <Avatar name={$user.name} /><!--TODO dit verbeteren-->
        <div class="user-info">
          <p>{$user.name}</p>
          <p class="role">{$user.role}</p>
        </div>
        <div class="search-box">
          <button class="btn-search">
            <img src="../../../../static/images/magnifying_glass.png" alt="Search" class="search-icon" />
          </button>
          <input type="text" class="input-search" placeholder="Type to Search..." />
        </div>
      </div>
    </div>
  </header>
  
  <style>
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  
    .right-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }
  
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 5px;
      font-size: 24px;
    }
  
    .role {
      font-size: medium;
      margin-top: -26px;
    }
  
    img {
      display: block;
      max-width: 230px;
      max-height: 95px;
      width: auto;
      height: auto;
    }
  
    * {
      box-sizing: border-box;
    }
  
    .search-box {
      width: fit-content;
      height: fit-content;
      position: relative;
    }
  
    .input-search {
      height: 50px;
      width: 50px;
      border-style: none;
      padding: 10px;
      font-size: 18px;
      letter-spacing: 2px;
      outline: none;
      border-radius: 25px;
      transition: all 0.5s ease-in-out;
      background-color: var(--dwengo-green);
      padding-right: 40px;
      color: #000000;
    }
  
    .input-search::placeholder {
      color: black;
      font-size: 18px;
      letter-spacing: 2px;
      font-weight: 100;
    }
  
    .btn-search {
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
      color: black;
      background-color: transparent;
      pointer-events: painted;
    }
  
    .btn-search:focus ~ .input-search {
      width: 300px;
      border-radius: 0px;
      background-color: transparent;
      border-bottom: 1px solid black;
      transition: all 500ms cubic-bezier(0, 0.11, 0.35, 2);
    }
  
    .input-search:focus {
      width: 300px;
      border-radius: 0px;
      background-color: transparent;
      border-bottom: 1px solid black;
      transition: all 500ms cubic-bezier(0, 0.11, 0.35, 2);
    }
  
    .search-icon {
      width: 30px;
      height: 30px;
    }
  </style>