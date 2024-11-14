# Explore Game - Core

# Pré-requis

## Docker Compose (Optionnel)

Pour faciliter le développement, il est possible d'utiliser `Docker` pour lancer une base de donnée `PostgreSQL` en local.

Avant, veillez à désactiver si vous avez déjà un service `PostgreSQL` qui tourne sur votre machine.

```bash
sudo service postgresql stop
```

Pour lancer le service `PostgreSQL` avec `Docker`, effectuez la commande suivante

```bash
docker compose -f docker-compose.dev.yml up -d
```

## Corepack

Ouvrir une `invite de commande` en **administrateur**.

```bash
corepack enable
```

## Yarn

Toujours dans la même invite de commande, pour initialiser `yarn`, effectuez la commande suivante

```bash
yarn
```

> Vérifiez que la version de `yarn` est bien `v1.22.22`.


## SQLite

Si vous souhaitez utiliser `SQLite` pour le développement, il vous faudra créer un fichier `.env` à la racine du projet et y écrire cette instruction.

```bash
DATABASE_URL=file:./dev.db
```

Cette instruction permet d'utiliser la base de donnée par défaut du framework `Redwood`, cela hébergera une base de donnée en **locale** sur votre machine. Ainsi les données ne seront pas synchronisées entre les développeurs.

## PostgreSQL

Si vous souhaitez utiliser `postgreSQL` pour le développement, il faudra suivre les instructions d'installations suivantes

### Linux

...

### Windows

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

# Installation

Pour installer les dépendances, effectuez la commande à la racine du projet

```bash
yarn install
```

# Générer les secrets

Génerer un secret de session
```bash
yarn rw g secret
```

Génerer un secret de JWT
```bash
openssl rand -base64 32
```

Puis créer un fichier `.env`

```bash
cp .env.defaults .env
```

Puis ajouter la ligne

```
SESSION_SECRET = <secret>
```

# Migrations

Pour récupérer la migration actuelle, effectuez la commande

```
yarn rw prisma migrate dev
```

_Vous n'êtes pas obligé de renseigner un nom à la migration._

# Seed

Pour ajouter des données dans la base de donnée, effectuez la commande

```bash
yarn rw exec seed
```

# Lancement

Pour lancer l'application, effectuez la commande

```
yarn rw dev
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
- `8911/graphql` - UI de l'ORM

# Modèles

Pour ajouter un `model` à notre base de donnée, il faut ajouter le modèle dans le fichier `api/db/schema.prisma`.

## Appliquer la migration

```
yarn rw migrate dev
```


## Générer les types
```
yarn rw g types
```


## Génerer les scaffold (UI)

```
yarn rw g scaffold <model>
```


