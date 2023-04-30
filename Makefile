DOCKER=docker


all:
	@printf "\n\033[94m"
	@printf "  ::::::::::: :::::::::      :::     ::::    :::  ::::::::   ::::::::  :::::::::: ::::    ::: :::::::::  :::::::::: ::::    :::  ::::::::  ::::::::::\n"
	@printf "     :+:     :+:    :+:   :+: :+:   :+:+:   :+: :+:    :+: :+:    :+: :+:        :+:+:   :+: :+:    :+: :+:        :+:+:   :+: :+:    :+: :+:        \n"
	@printf "    +:+     +:+    +:+  +:+   +:+  :+:+:+  +:+ +:+        +:+        +:+        :+:+:+  +:+ +:+    +:+ +:+        :+:+:+  +:+ +:+        +:+         \n"
	@printf "   +#+     +#++:++#:  +#++:++#++: +#+ +:+ +#+ +#++:++#++ +#+        +#++:++#   +#+ +:+ +#+ +#+    +:+ +#++:++#   +#+ +:+ +#+ +#+        +#++:++#     \n"
	@printf "  +#+     +#+    +#+ +#+     +#+ +#+  +#+#+#        +#+ +#+        +#+        +#+  +#+#+# +#+    +#+ +#+        +#+  +#+#+# +#+        +#+           \n"
	@printf " #+#     #+#    #+# #+#     #+# #+#   #+#+# #+#    #+# #+#    #+# #+#        #+#   #+#+# #+#    #+# #+#        #+#   #+#+# #+#    #+# #+#            \n"
	@printf "###     ###    ### ###     ### ###    ####  ########   ########  ########## ###    #### #########  ########## ###    ####  ########  ##########      \n"
	@printf "\033[m"
	@printf "\nfor start developpement environment of svelte, type 'make svelte'\n\n"

svelte:
	echo "Start front (svelte)"
	$(DOCKER) build -t front docker/front
	$(DOCKER) run -p 3000:3000 -v $(PWD)/front:/app --name front front

postgres:
	$(DOCKER) exec -ti postgres bash

nestjs:
	$(DOCKER) exec -ti backend bash

run:
	echo "start project"
	cd docker && docker compose up --build
