<script lang="ts">
    export let icon : string = '';
    export let css : string = '';
	export let width : string = "24";
	export let height : string = "24";
	export let color : string = "currentColor";

</script>

{#if icon == "bug"}
<svg viewBox="0 0 20 20" class={css} version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g transform="translate(-180.000000, -4519.000000)">
        <g transform="translate(56.000000, 160.000000)">
            <path d="M138,4363 C138,4361.895 137.105,4361 136,4361 L132,4361 C130.895,4361 130,4361.895 130,4363 L130,4365 L130,4368 L130,4370 L130,4373 L130,4375 C130,4376.105 130.895,4377 132,4377 L136,4377 C137.105,4377 138,4376.105 138,4375 L138,4373 L138,4370 L138,4368 L138,4365 L138,4363 Z M140,4365 L140,4366 L143,4366 C143.552,4366 144,4366.448 144,4367 C144,4367.552 143.552,4368 143,4368 L140,4368 L140,4370 L143,4370 C143.552,4370 144,4370.448 144,4371 C144,4371.552 143.552,4372 143,4372 L140,4372 L140,4373 C142.209,4373 144,4374.791 144,4377 L144,4378 C144,4378.552 143.552,4379 143,4379 C142.448,4379 142,4378.552 142,4378 L142,4377 C142,4375.895 141.105,4375 140,4375 C140,4377.209 138.209,4379 136,4379 L132,4379 C129.791,4379 128,4377.209 128,4375 C126.895,4375 126,4375.895 126,4377 L126,4378 C126,4378.552 125.552,4379 125,4379 C124.448,4379 124,4378.552 124,4378 L124,4377 C124,4374.791 125.791,4373 128,4373 L128,4372 L125,4372 C124.448,4372 124,4371.552 124,4371 C124,4370.448 124.448,4370 125,4370 L128,4370 L128,4368 L125,4368 C124.448,4368 124,4367.552 124,4367 C124,4366.448 124.448,4366 125,4366 L128,4366 L128,4365 C125.791,4365 124,4363.209 124,4361 L124,4360 C124,4359.448 124.448,4359 125,4359 C125.552,4359 126,4359.448 126,4360 L126,4361 C126,4362.105 126.895,4363 128,4363 C128,4360.791 129.791,4359 132,4359 L136,4359 C138.209,4359 140,4360.791 140,4363 C141.105,4363 142,4362.105 142,4361 L142,4360 C142,4359.448 142.448,4359 143,4359 C143.552,4359 144,4359.448 144,4360 L144,4361 C144,4363.209 142.209,4365 140,4365 L140,4365 Z M136,4373 C135.448,4373 135,4373.448 135,4374 C135,4374.552 135.448,4375 136,4375 C136.552,4375 137,4374.552 137,4374 C137,4373.448 136.552,4373 136,4373 L136,4373 Z M133,4374 C133,4374.552 132.552,4375 132,4375 C131.448,4375 131,4374.552 131,4374 C131,4373.448 131.448,4373 132,4373 C132.552,4373 133,4373.448 133,4374 L133,4374 Z">
        </path>
        </g>
    </g>
</svg>
{:else if icon == "bell"}
<svg viewBox="0 0 24 24" width={width} height={height} class={css} xmlns="http://www.w3.org/2000/svg">
    <g>
        <path d="M18.9,11.2s0-8.7-6.9-8.7-6.9,8.7-6.9,8.7v3.9L2.5,17.5h19l-2.6-2.4Z"></path>
        <path d="M14.5,20.5s-.5,1-2.5,1-2.5-1-2.5-1"></path>
    </g>
</svg>
{:else if icon == "exit"}
<svg viewBox="0 0 24 24" width={width} height={height} class={css} xmlns="http://www.w3.org/2000/svg">
    <g>
        <path d="M4,12a1,1,0,0,0,1,1h7.59l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H5A1,1,0,0,0,4,12ZM17,2H7A3,3,0,0,0,4,5V8A1,1,0,0,0,6,8V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Z"></path>
    </g>
</svg>

{:else if icon == "send"}
<svg viewBox="0 0 24 24" class={css} xmlns="http://www.w3.org/2000/svg">
    <g>
        <path d="M20 12L4 4L6 12M20 12L4 20L6 12M20 12H6" stroke-width="1" ></path>
    </g>
</svg>
{:else if icon == "log"}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} class={css}>
<path fill={color} d="M12 13q-.425 0-.713-.288T11 12V4q0-.425.288-.713T12 3q.425 0 .713.288T13 4v8q0 .425-.288.713T12 13Zm0 8q-1.875 0-3.513-.713t-2.85-1.924q-1.212-1.213-1.924-2.85T3 12q0-1.725.625-3.3t1.8-2.85q.275-.3.7-.3t.725.3q.275.275.25.688t-.3.737q-.875.975-1.337 2.188T5 12q0 2.925 2.038 4.963T12 19q2.925 0 4.963-2.038T19 12q0-1.325-.475-2.563t-1.35-2.212q-.275-.3-.288-.7t.263-.675q.3-.3.725-.3t.7.3q1.175 1.275 1.8 2.85T21 12q0 1.875-.713 3.513t-1.924 2.85q-1.213 1.212-2.85 1.925T12 21Z" />
</svg>
{:else if icon == "modify"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 14 14" class={css}>
	<g fill="none" stroke={color} stroke-linecap="round" stroke-linejoin="round">
		<path d="m7.5 9l-3 .54L5 6.5L10.73.79a1 1 0 0 1 1.42 0l1.06 1.06a1 1 0 0 1 0 1.42Z"/>
		<path d="M12 9.5v3a1 1 0 0 1-1 1H1.5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3"/>
	</g>
</svg>
{:else if icon === "cup"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" class={css}>
	<g fill="none" stroke={color} stroke-width="1.5">
		<path d="M12 16c-5.76 0-6.78-5.74-6.96-10.294c-.051-1.266-.076-1.9.4-2.485c.475-.586 1.044-.682 2.183-.874A26.374 26.374 0 0 1 12 2c1.784 0 3.253.157 4.377.347c1.139.192 1.708.288 2.184.874c.476.586.45 1.219.4 2.485c-.18 4.553-1.2 10.294-6.96 10.294Z"/>
		<path stroke-linecap="round" d="M12 16v3"/><path stroke-linecap="round" stroke-linejoin="round" d="M15.5 22h-7l.34-1.696a1 1 0 0 1 .98-.804h4.36a1 1 0 0 1 .98.804L15.5 22Z"/>
		<path d="m19 5l.949.316c.99.33 1.485.495 1.768.888c.283.393.283.915.283 1.958v.073c0 .86 0 1.291-.207 1.643c-.207.352-.584.561-1.336.98L17.5 12.5M5 5l-.949.316c-.99.33-1.485.495-1.768.888C2 6.597 2 7.12 2 8.162v.073c0 .86 0 1.291.207 1.643c.207.352.584.561 1.336.98L6.5 12.5m4.646-6.477C11.526 5.34 11.716 5 12 5c.284 0 .474.34.854 1.023l.098.176c.108.194.162.29.246.354c.085.064.19.088.4.135l.19.044c.738.167 1.107.25 1.195.532c.088.283-.164.577-.667 1.165l-.13.152c-.143.167-.215.25-.247.354c-.032.104-.021.215 0 .438l.02.203c.076.785.114 1.178-.115 1.352c-.23.174-.576.015-1.267-.303l-.178-.082c-.197-.09-.295-.135-.399-.135c-.104 0-.202.045-.399.135l-.178.082c-.691.319-1.037.477-1.267.303c-.23-.174-.191-.567-.115-1.352l.02-.203c.021-.223.032-.334 0-.438c-.032-.103-.104-.187-.247-.354l-.13-.152c-.503-.588-.755-.882-.667-1.165c.088-.282.457-.365 1.195-.532l.19-.044c.21-.047.315-.07.4-.135c.084-.064.138-.16.246-.354l.098-.176Z"/>
		<path stroke-linecap="round" d="M18 22H6"/>
	</g>
</svg>
{:else if icon === "menu"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" class={css}>
	<path fill={color} d="M3 18v-2h18v2H3Zm0-5v-2h18v2H3Zm0-5V6h18v2H3Z"/>
</svg>
{:else if icon === "friends"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 640 512" class={css}>
	<path fill={color} d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32S80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96s43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4c24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48c0-61.9-50.1-112-112-112z"/>
</svg>
{:else if icon === "user-block"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={width} viewBox="0 0 24 24" class={css}>
	<path fill={color} d="M6.25 7.5a3.75 3.75 0 1 1 7.5 0a3.75 3.75 0 0 1-7.5 0Zm-4 9.5A3.75 3.75 0 0 1 6 13.25h.34c.185 0 .369.03.544.086l.866.283a7.251 7.251 0 0 0 2.967.323a.22.22 0 0 1 .223.3a5.983 5.983 0 0 0-.44 2.258c0 1.252.384 2.415 1.04 3.377c.091.134.003.323-.16.328a40.077 40.077 0 0 1-7.84-.5a1.537 1.537 0 0 1-1.29-1.517V17Z"/>
	<path fill={color} fill-rule="evenodd" d="M12 16.5c0 .972.308 1.872.832 2.607A4.48 4.48 0 0 0 16.5 21a4.5 4.5 0 1 0-4.5-4.5Zm4.5 3a2.985 2.985 0 0 1-1.524-.415l4.109-4.109A3 3 0 0 1 16.5 19.5Zm-2.585-1.476l4.109-4.109a3 3 0 0 0-4.109 4.109Z" clip-rule="evenodd"/>
</svg>
{:else if icon === "chat"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 2048 2048" class={css}>
	<path fill={color} d="M1792 128v512H640v859l-384 384v-475H0V128h1792zM768 768h1280v896h-256v347l-347-347H768V768z"/>
</svg>
{:else if icon === "chatrooms"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
	<g fill={color}>
		<path d="m17.814 21.236l-.27.458a.635.635 0 0 1-1.087 0l-.271-.458c-.21-.355-.316-.533-.485-.631c-.168-.098-.381-.102-.806-.11c-.628-.01-1.022-.049-1.352-.185a2.5 2.5 0 0 1-1.353-1.353c-.19-.46-.19-1.042-.19-2.207v-.5c0-1.637 0-2.455.368-3.056a2.5 2.5 0 0 1 .826-.826c.6-.368 1.42-.368 3.056-.368h1.5c1.637 0 2.455 0 3.056.368a2.5 2.5 0 0 1 .826.826c.368.6.368 1.42.368 3.056v.5c0 1.165 0 1.747-.19 2.207a2.5 2.5 0 0 1-1.353 1.353c-.33.136-.724.175-1.352.186c-.425.007-.638.01-.806.109c-.17.098-.274.276-.485.63Z"/>
		<path fill-rule="evenodd" d="M10.2 2.277a.75.75 0 0 1 .523.924L9.32 8.25h7.443l1.514-5.45a.75.75 0 1 1 1.446.4L18.32 8.25H22a.75.75 0 0 1 0 1.5h-4.098a.75.75 0 0 1-1.415 0H8.903l-1.527 5.5H9a.75.75 0 0 1 0 1.5H6.959L5.723 21.2a.75.75 0 0 1-1.446-.4l1.125-4.05H2a.75.75 0 1 1 0-1.5h3.819l1.528-5.5H4a.75.75 0 0 1 0-1.5h3.763L9.277 2.8a.75.75 0 0 1 .924-.523Z" clip-rule="evenodd"/>
	</g>
</svg>
{:else if icon === "load"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" class="animate-spin-slow {css}">
	<defs>
		<linearGradient id="mingcuteLoadingFill0" x1="50%" x2="50%" y1="5.271%" y2="91.793%">
			<stop offset="0%" stop-color={color}/>
			<stop offset="100%" stop-color={color} stop-opacity=".55"/>
		</linearGradient>
		<linearGradient id="mingcuteLoadingFill1" x1="50%" x2="50%" y1="15.24%" y2="87.15%">
			<stop offset="0%" stop-color={color} stop-opacity="0"/>
			<stop offset="100%" stop-color={color} stop-opacity=".55"/>
		</linearGradient>
	</defs>
	<g fill="none">
		<path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
		<path fill="url(#mingcuteLoadingFill0)" d="M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.502 7.502 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021Z" transform="translate(1.5 1.625)"/>
		<path fill="url(#mingcuteLoadingFill1)" d="M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.475 10.475 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084a1.5 1.5 0 0 1-.115-2.118Z" transform="translate(1.5 1.625)"/>
	</g>
</svg>
{:else if icon === "game"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" class={css}>
	<path fill={color} d="M7 6h10a6 6 0 0 1 6 6a6 6 0 0 1-6 6c-1.78 0-3.37-.77-4.47-2h-1.06c-1.1 1.23-2.69 2-4.47 2a6 6 0 0 1-6-6a6 6 0 0 1 6-6M6 9v2H4v2h2v2h2v-2h2v-2H8V9H6m9.5 3a1.5 1.5 0 0 0-1.5 1.5a1.5 1.5 0 0 0 1.5 1.5a1.5 1.5 0 0 0 1.5-1.5a1.5 1.5 0 0 0-1.5-1.5m3-3a1.5 1.5 0 0 0-1.5 1.5a1.5 1.5 0 0 0 1.5 1.5a1.5 1.5 0 0 0 1.5-1.5A1.5 1.5 0 0 0 18.5 9Z"/>
</svg>
{:else if icon === "chevron"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" class={css}>
	<path fill={color} d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z"/>
</svg>
{:else if icon === "settings"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 1024 1024">
	<path fill={color} d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088l-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36l-116.224-25.088l-65.28 113.152l79.68 88.192l-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136l-79.808 88.192l65.344 113.152l116.224-25.024l22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152l24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296l116.288 25.024l65.28-113.152l-79.744-88.192l1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136l79.808-88.128l-65.344-113.152l-116.288 24.96l-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384a192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256a128 128 0 0 0 0-256z"/>
</svg>
{:else if icon === "right-arrow"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
	<path fill={color} d="M11.3 19.3q-.275-.275-.288-.7t.263-.7l4.9-4.9H5q-.425 0-.713-.288T4 12q0-.425.288-.713T5 11h11.175l-4.9-4.9q-.275-.275-.263-.7t.288-.7q.275-.275.7-.275t.7.275l6.6 6.6q.15.125.213.313t.062.387q0 .2-.062.375t-.213.325l-6.6 6.6q-.275.275-.7.275t-.7-.275Z"/>
</svg>
{:else if icon == "left-arrow"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
	<path fill={color} d="m10.875 19.3l-6.6-6.6q-.15-.15-.213-.325T4 12q0-.2.063-.375t.212-.325l6.6-6.6q.275-.275.688-.287t.712.287q.3.275.313.688T12.3 6.1L7.4 11h11.175q.425 0 .713.288t.287.712q0 .425-.287.713t-.713.287H7.4l4.9 4.9q.275.275.288.7t-.288.7q-.275.3-.7.3t-.725-.3Z"/>
</svg>
{:else if icon == "history"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
	<path fill={color} d="M12 21q-3.45 0-6.013-2.288T3.05 13H5.1q.35 2.6 2.313 4.3T12 19q2.925 0 4.963-2.038T19 12q0-2.925-2.038-4.963T12 5q-1.725 0-3.225.8T6.25 8H9v2H3V4h2v2.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924q1.212 1.213 1.925 2.85T21 12q0 1.875-.713 3.513t-1.924 2.85q-1.213 1.212-2.85 1.925T12 21Zm2.8-4.8L11 12.4V7h2v4.6l3.2 3.2l-1.4 1.4Z"/>
</svg>
{:else if icon == "blackhole"}
<svg xmlns="http://www.w3.org/2000/svg"width={width} height={height} viewBox="0 0 24 24">
	<g fill="none" stroke={color} stroke-width="1.5">
		<circle cx="12" cy="12" r="2"/>
		<path stroke-linecap="round" d="M12 10c5 0 4.6 12-3 12"/>
		<path stroke-linecap="round" d="M12.312 14c-5 0-4.6-12 3-12"/>
		<path stroke-dasharray="2 2" stroke-linecap="round" d="M10.631 10.696c3.536-3.535 11.738 5.233 6.364 10.607" opacity=".5"/>
		<path stroke-dasharray="2 2" stroke-linecap="round" d="M13.68 13.304C10.145 16.84 1.942 8.07 7.316 2.697" opacity=".5"/>
		<path stroke-dasharray="2 2" stroke-linecap="round" d="M10.852 13.524C7.316 9.99 16.084 1.786 21.458 7.16" opacity=".5"/>
		<path stroke-dasharray="2 2" stroke-linecap="round" d="M13.46 10.476c3.535 3.535-5.233 11.738-10.607 6.364" opacity=".5"/>
		<path stroke-linecap="round" d="M10 12.312c0-5 12-4.6 12 3"/>
		<path stroke-linecap="round" d="M14 12c0 5-12 4.6-12-3"/>
	</g>
</svg>
{:else if icon == "delete"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
	<path fill={color} d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8s8-3.582 8-8s-3.581-8-8-8zm3.707 10.293a.999.999 0 1 1-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 0 1-1.414 0a.999.999 0 0 1 0-1.414L10.586 12L8.293 9.707a.999.999 0 1 1 1.414-1.414L12 10.586l2.293-2.293a.999.999 0 1 1 1.414 1.414L13.414 12l2.293 2.293z"/>
</svg>
{:else if icon == "banUser"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 512 512">
	<path fill={color} d="M384 256c-70.7 0-128 57.3-128 128s57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128zm85.3 149.3H298.7v-42.7h170.7v42.7zm-256-21.3c0-87 65.2-158.7 149.3-169.2v-1.5c5.5-8 21.3-21.3 21.3-42.7s-21.3-42.7-21.3-53.3C362.7 32 319.2 0 256 0c-60.5 0-106.7 32-106.7 117.3c0 10.7-21.3 32-21.3 53.3s15.2 35.4 21.3 42.7c0 0 0 21.3 10.7 53.3c0 10.7 21.3 21.3 32 32c0 10.7 0 21.3-10.7 42.7L64 362.7C21.3 373.3 0 448 0 512h271.4c-35.5-31.3-58.1-77-58.1-128z"/>
</svg>
{:else if icon == "addUser"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 512 512">
	<path fill={color} d="M213.3 384c0-87 65.2-158.7 149.3-169.2v-1.5c5.5-8 21.3-21.3 21.3-42.7s-21.3-42.7-21.3-53.3C362.7 32 319.2 0 256 0c-60.5 0-106.7 32-106.7 117.3c0 10.7-21.3 32-21.3 53.3s15.2 35.4 21.3 42.7c0 0 0 21.3 10.7 53.3c0 10.7 21.3 21.3 32 32c0 10.7 0 21.3-10.7 42.7L64 362.7C21.3 373.3 0 448 0 512h271.4c-35.5-31.3-58.1-77-58.1-128zM384 256c-70.7 0-128 57.3-128 128s57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128zm85.3 149.3h-64v64h-42.7v-64h-64v-42.7h64v-64h42.7v64h64v42.7z"/>
</svg>
{:else if icon == "crown"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
	<path fill={color} d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1Z"/>
</svg>
{:else if icon == "new-chat"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
	<path fill={color} d="M6.455 19L2 22.5V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.455ZM11 10H8v2h3v3h2v-3h3v-2h-3V7h-2v3Z"/>
</svg>
{:else if icon == "lock"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20">
	<path fill={color} d="M4 8V6a6 6 0 1 1 12 0h-3v2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z"/>
</svg>
{:else if icon == "mute"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
	<path fill={color} d="m7.727 6.313l-4.02-4.02l-1.414 1.414l18 18l1.414-1.414l-2.02-2.02A9.578 9.578 0 0 0 21.999 12c0-4.091-2.472-7.453-5.999-9v2c2.387 1.386 3.999 4.047 3.999 7a8.13 8.13 0 0 1-1.671 4.914l-1.286-1.286C17.644 14.536 18 13.19 18 12c0-1.771-.775-3.9-2-5v7.586l-2-2V2.132L7.727 6.313zM4 17h2.697L14 21.868v-3.747L3.102 7.223A1.995 1.995 0 0 0 2 9v6c0 1.103.897 2 2 2z"/>
</svg>
{:else if icon =="ban"}
<svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 512 512">
	<path fill={color} d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5l267.7 267.7zM0 256a256 256 0 1 1 512 0a256 256 0 1 1-512 0z"/>
</svg>
{/if}
