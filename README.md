# Explore Game - Core

## Pré-requis

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

...

Créer un fichier `.env` à la racine du projet et y écrire cette instruction et adapter les données.

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

## Installation

Pour installer les dépendances, effectuez la commande à la racine du projet

```bash
yarn
```

## Migrations

Pour récupérer la migration actuelle, effectuez la commande

```
yarn rw migrate dev
```

_Vous n'êtes pas obligé de renseigner un nom à la migration._

>**⚠** Cette commande affecte automatiquement la seed initiale. (jeu de données)

## Lancement

Pour lancer l'application, effectuez la commande

```
yarn rw dev
```

## Informations importantes

Le lancement du projet ouvre des instances sur différents ports :

- `8910` - UI
- `8911` - API
- `8911/graphql` - UI de l'ORM


## Modèles

Pour ajouter un `model` à notre base de donnée, il faut ajouter le modèle dans le fichier `api/db/schema.prisma`.

### Appliquer la migration

```
yarn rw migrate dev
```


### Générer les types
```
yarn rw g types
```


### Génerer les scaffold (UI)

```
yarn rw g scaffold <model>
```


