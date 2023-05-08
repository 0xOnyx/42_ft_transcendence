<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  let otpInputs: HTMLInputElement[];
  let inputValue : string = '';

  const dispatch = createEventDispatcher();

  function updateInputValue () {
	inputValue = otpInputs.reduce((acc, curr) => acc + curr.value, '');
	dispatch('inputValueChange', {
		text: inputValue
	});
  }
  
  onMount(() => {
    otpInputs = Array.from(document.querySelectorAll<HTMLInputElement>('.otp'));

    otpInputs.forEach((input, index) => {
      input.addEventListener('input', () => {
        if (input.value) {
			
          if (index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
          } else if (index != otpInputs.length -1) {
            input.blur();
          }
		  updateInputValue();
        }
      });
	  input.addEventListener('keydown', (event) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];

        if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
        	event.preventDefault();
        } else if (event.key === 'ArrowLeft' && index > 0) {
        	otpInputs[index - 1].focus();
        } else if (event.key === 'ArrowRight' && index < otpInputs.length - 1) {
        	otpInputs[index + 1].focus();
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
			otpInputs[index].value = '';
			updateInputValue();
		}
      });
    });
  });
</script>

<style>
	.otp {
		@apply rounded-md bg-gray-700 max-h-[6vh] text-lg border-gray-500 border-2 text-gray-300 items-center justify-center;
		aspect-ratio: 2/3;
		caret-color: transparent; 
		text-align: center;
		
	}

	.otp:focus {
		@apply outline-none border-thread-blue border-2 shadow-md shadow-thread-blue;
	}

</style>

<div class="otp-container flex gap-3 rounded-sm">
	<div>
		<input class="otp" type="text" inputmode="numeric" maxlength="1">
		<input class="otp" type="text" inputmode="numeric" maxlength="1">
		<input class="otp" type="text" inputmode="numeric" maxlength="1">
	</div>
	<div>
		<input class="otp" type="text" inputmode="numeric" maxlength="1">
		<input class="otp" type="text" inputmode="numeric" maxlength="1">
		<input class="otp" type="text" inputmode="numeric" maxlength="1">
	</div>
</div>
  