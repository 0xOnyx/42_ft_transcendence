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

svelte2:
	echo "Start front (svelte)"
	$(DOCKER) build -t front docker/front
	$(DOCKER) run -p 3000:3000 -v $(PWD)/front:/app --name front front

svelte:
	$(DOCKER) exec -ti frontend bash

postgres:
	$(DOCKER) exec -ti postgres bash

nestjs:
	$(DOCKER) exec -ti backend bash

run:
	echo "start project"
	cd docker && docker compose up --build

clean:
	echo "clean all"
	docker compose -f docker/docker-compose.yml rm
	docker image rm docker-backend -f
	docker image rm docker-frontend -f
	docker image rm postgres -f
	docker image rm nginx -f
	docker system prune -f


s: 
	sudo service docker start
