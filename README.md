# Explore Game - Core

Cette application décrit le coeur de l'application `Explore Game`, elle est basée sur le framework `RedwoodJS`.

Elle intègre une base de donnée `PostgreSQL` ou `SQLite` pour le stockage des données, et une interface `GraphQL` pour les requêtes.

Elle fournie une API pour les autres micro-services de l'application.

# Clone

Pour cloner le projet, effectuez la commande suivante

```bash
git clone https://github.com/jordanlavenant/exploregame-core.git
```

Dans le dossier du projet, effectuez la commande suivante pour récupérer le sous-module [exploregame-types](https://github.com/jordanlavenant/exploregame-types.git)

```bash
git submodule update --init --recursive
```

# Docker installation

## Pre-requisites

* Docker
* Docker Compose
* Node.js 20.11.1+ (included)
* Yarn (included)
* Postgresql 16.0+ (included)

## Development environment

Pour faciliter le développement, il est possible d'utiliser `Docker` pour lancer une base de donnée `PostgreSQL` en local.

Si vous ne souhaitez pas utiliser `Docker` pour votre environnement de Développement, veuillez ignorer cette étape.

### Docker compose

Avant, veillez à désactiver si vous avez déjà un service `PostgreSQL` qui tourne sur votre machine.

```bash
# /bin/bash
sudo service postgresql stop
```

Pour lancer le service `PostgreSQL` avec `Docker`, effectuez la commande suivante

```bash
# /bin/bash
docker compose -f docker-compose.dev.yml up --build
```

### Migration

Entrer dans le conteneur `console` pour effectuer les migrations et les seeds.


```bash
# /bin/bash
docker compose -f ./docker-compose.dev.yml run --rm -it console bash
```

Effectuer les migrations puis seed la base de donnée.
```bash
# /home/node/app#
yarn redwood prisma migrate dev
yarn redwood exec seed
```

## Production environment

Effectuez la commande suivante pour lancer les conteneurs en production, **sur la machine de production**.

### Docker compose

```bash
# /bin/bash
docker compose -f docker-compose.prod.yml up --build
```

### Migration

Entrer dans le conteneur `console` pour effectuer les migrations et les seeds.


```bash
# /bin/bash
docker compose -f ./docker-compose.prod.yml run --rm -it console /bin/bash
```

Effectuer les migrations puis seed la base de donnée.
```bash
# /home/node/app#
yarn redwood prisma migrate dev
yarn redwood exec seed
```

# Classic installation

## Development environment

### Pre-requisites

* Corepack
* Yarn
* Node.js 20.11.1+

### Corepack
Ouvrir une `invite de commande` en **administrateur**.

```bash
corepack enable
```

### Yarn

Toujours dans la même invite de commande, pour initialiser `yarn`, effectuez la commande suivante

```bash
yarn
```

> Vérifiez que la version de `yarn` est bien `v1.22.22`.


### SQLite

Si vous souhaitez utiliser `SQLite` pour le développement, il vous faudra créer un fichier `.env` à la racine du projet et y écrire cette instruction.

```bash
DATABASE_URL=file:./dev.db
```

Cette instruction permet d'utiliser la base de donnée par défaut du framework `Redwood`, cela hébergera une base de donnée en **locale** sur votre machine. Ainsi les données ne seront pas synchronisées entre les développeurs.

### PostgreSQL

Si vous souhaitez utiliser `postgreSQL` pour le développement, il faudra suivre les instructions d'installations suivantes

#### Linux

...

#### Windows

**postgreSQL** - Base de donnée

Lien de téléchargement
> https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

Ce lien téléchargera un installeur pour `postgreSQL` sur votre machine, et un gestionnaire de base de donnée `pgAdmin4`.

>**⚠** Souvenez-vous des identifiants que vous avez renseigné lors de l'installation de `postgreSQL`.


**pgAdmin4** - Gestionnaire de base de donnée

* Lancez l'application `pgAdmin4` et connectez-vous avec les identifiants que vous avez renseigné lors de l'installation de `postgreSQL`.

* Supprimer le serveur `PostgreSQL 17` par défaut.

* Créer un serveur, nommez-le `ExploreGame` et renseignez les informations suivantes :

```bash
Host: localhost
Port: 5432
Username: postgres
Password: <votre mot de passe identifiant>
```

* Créez une base de donnée nommée `ExploreGame` et sauvegarder.

* Créer un fichier `.env` à la racine du projet

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
```
* Modifier les champs `USER`, `PASSWORD`, `HOST` et `DATABASE` avec les informations que vous avez renseigné lors de l'installation de `postgreSQL`.

```bash
USER=postgres
PASSWORD=<votre mot de passe identifiant>
HOST=localhost
DATABASE=ExploreGame
```

* Commenter la ligne `provider = "sqlite"` dans le fichier `api/db/schema.prisma` et décommenter la ligne `provider = "postgresql"` comme suit :

```prisma
datasource db {
  // provider = "sqlite"
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Dependances

Pour installer les dépendances, effectuez la commande à la racine du projet

```bash
yarn install
```

### Secrets

Génerer un secret de session
```bash
yarn rw g secret
```

Génerer un secret de `JWT`
```bash
openssl rand -base64 32
```

Puis créer un fichier `.env`

```bash
cp .env.defaults .env
```

Puis ajouter la ligne

```
# .env
DATABASE_URL=file:./dev.db
SESSION_SECRET=<yarn rw g secret>
JWT_SECRET_KEY=<openssl rand -base64 32>
```

# Migrations

Pour récupérer la migration actuelle, effectuez la commande

```
yarn redwood prisma migrate dev
```

_Vous n'êtes pas obligé de renseigner un nom à la migration._

# Seed

Pour ajouter des données dans la base de donnée, effectuez la commande

```bash
yarn redwood exec seed
```

# Lancement

Pour lancer l'application, effectuez la commande

```
yarn redwood dev
```

# Identifiants

Il existe des identifiants par-défaut pour accéder à l'interface administrateur

`admin@admin` - `admin`

**ou**

`root@root` - `root`

# Informations importantes

Le lancement du projet ouvre des instances sur différents ports :

- `8910` - UI
- `8911` - API
- `8911/graphql` - Explorer GraphQL

# Modèles

Pour ajouter un `model` à notre base de donnée, il faut ajouter le modèle dans le fichier `api/db/schema.prisma`.

## Appliquer la migration

```
yarn redwood migrate dev
```


## Générer les types
```
yarn redwood g types
```


## Génerer les scaffold (UI)

```
yarn redwood g scaffold <model>
```


# Docker hub

Pour pousser les images sur le `Docker Hub`, il faut suivre les instructions suivantes.

### Api

Construction de l'image

```bash
docker build --target api_serve -t jordaaaaaan/exploregame-core-api:latest .
```

Pousser l'image

```bash
docker push jordaaaaaan/exploregame-core-api:latest
```

### Web

Construction de l'image

```bash
docker build --target web_serve -t jordaaaaaan/exploregame-core-web:latest .
```

Pousser l'image

```bash
docker push jordaaaaaan/exploregame-core-web:latest
```

### Console

Construction de l'image

```bash
docker build --target console -t jordaaaaaan/exploregame-core-console:latest .
```

Pousser l'image

```bash
docker push jordaaaaaan/exploregame-core-console:latest
```
