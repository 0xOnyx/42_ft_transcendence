<script>
    import "../app.css";
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Itim" rel="stylesheet">
</svelte:head>


<div class=" relative overflow-hidden items-center text-slate-50 bg-gradient-to-tr from-process-green to-thread-blue h-screen font-arial-black">
	<div class="absolute -bottom-36 -left-36 w-72 h-72 bg-process-green rounded-full filter mix-blend-multiply blur-3xl animate-idle"></div>
	<div class="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-bl from-process-green to-thread-blue rounded-full filter mix-blend-overlay blur-3xl animate-idle animation-delay-4000"></div>
	<div class="absolute -top-36 -right-36 w-72 h-72 bg-thread-blue rounded-full filter mix-blend-multiply blur-3xl animate-idle animation-delay-2000"></div>

	<div class="z-10 relative h-screen">
		<slot />
	</div>

</div>
