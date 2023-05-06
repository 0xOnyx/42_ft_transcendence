# DB Seeder

## remplir la base de donnée avec des données fictif

pour pouvoir remplir la DB avec des utilisateurs fictifs, il faut suivre les étapes suivantes.

On commence par démarrer les container docker à l'aide de la commande suivante :

```bash
make run
```

Une fois que les container sont démarrer, il faut se connecter au bash du backend. Dans le fichier make file, il y a une aide pour se connecter directement.

Il faut donc lancer la commande suivante :


```bash
make nestjs
```

Une fois que l'on est dans le container de nest, la commande suivante remplie la base de donnée avec des utilisateurs fictifs 

```bash
npx prisma db seed
```

Le script `backend/prisma/seed.ts` est executé lorsque la commande ci-dessus est lancé.

Il est possible d'enrichir les seed dans ce code.

Les données fictives sont générés au moyen du module fakerjs.

La documentation se trouve à l'adresse suivante : [https://fakerjs.dev/](https://fakerjs.dev/)

