<script lang="ts">
    export let label: string = "Password";
    export let value: string;
    export let required: boolean = false;
    export let id: string = "password";
  
    let showPassword = false;
  
    // Dynamically choose the icon based on visibility
    const getIconSrc = () =>
      showPassword
        ? "../../../../static/images/icons/password_not_hidden.png"
        : "../../../../static/images/icons/password_hidden.png";
  </script>
  
  <div class="password-input">
    <label for={id}>{label}</label>
    <div class="input-wrapper" style="position: relative;">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        bind:value={value}
        {required}
      />
  
      <img
        src={getIconSrc()}
        alt={showPassword ? "Hide password" : "Show password"}
        class="password-toggle-icon"
        on:click={() => (showPassword = !showPassword)}
      />
    </div>
  </div>
  
  <style>
    .password-input {
      display: flex;
      flex-direction: column;
    }
  
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
 
    input {
      width: 100%;
      padding-right: 2.5rem;
    }
  
    .password-toggle-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      height: 20px;
      width: 20px;
      cursor: pointer;
    }
  </style>
  