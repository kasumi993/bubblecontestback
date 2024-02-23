# Documentation de l'API "Bubbleback"

## Pré-requis

Avant de démarrer avec l'API "Bubbleback", assurez-vous d'avoir les pré-requis suivants installés sur votre machine :

- **Docker** : L'API "Bubbleback" est conteneurisée avec Docker, permettant une installation et un lancement simplifiés. Vous pouvez télécharger Docker depuis [le site officiel](https://www.docker.com/).
- **Docker Compose** : Utilisé pour définir et exécuter des applications Docker multi-conteneurs. Assurez-vous d'avoir Docker Compose installé pour simplifier le lancement de l'API. Les instructions d'installation sont disponibles sur [la documentation officielle de Docker Compose](https://docs.docker.com/compose/install/).

## Technologies Utilisées

L'API "Bubbleback" utilise une pile technologique moderne pour offrir performance et facilité de développement :

- **Express** : Un framework web minimaliste et flexible pour Node.js, facilitant la création de serveurs API.
- **Pocketbase** : Une solution légère pour la gestion des utilisateurs, utilisant SQLite comme base de données backend.
- **SQLite** : Un moteur de base de données SQL embarqué, léger, rapide et autonome.
- **ESLint** : Un outil d'analyse statique de code pour identifier et rapporter les motifs trouvés dans le code JavaScript, améliorant ainsi la qualité et la cohérence du code.
- **SonarQube** : Un outil d'analyse de qualité de code automatique pour détecter des bugs, vulnérabilités de sécurité, et mauvaises pratiques dans le code.
- **Jest** : Un framework de tests JavaScript populaire, axé sur la simplicité, utilisé pour les tests unitaires et d'intégration.

## Lancement de l'API avec Docker

Pour lancer l'API "Bubbleback", suivez ces étapes simples :

1. **Clonage du dépôt Git** : Clonez le dépôt de l'API "Bubbleback" sur votre machine locale.
`
` git clone https://gitlab.com/bubbleproject/bubbleback.git `


2. **Lancement de l'API** : Ouvrez un terminal à la racine du dossier cloné et lancez l'API à l'aide de Docker Compose.

`docker-compose up -d`


Cette commande construit et démarre les conteneurs nécessaires pour l'API, y compris toutes les dépendances et services liés.

## Tests

Les tests sont effectués via GitLab CI au moment des pushs. Ils incluent :

- **Tests unitaires avec Jest** : Pour valider chaque partie du code indépendamment des autres.

- **Analyse de la qualité du code avec SonarQube** : Pour assurer un code propre et maintenable.

Pour exécuter les tests manuellement, utilisez les commandes suivantes dans votre terminal à la racine du projet :

- **Tests unitaires** : `npm run test`

- **Analyse SonarQube** : Assurez-vous que SonarQube est correctement configuré et lancé, puis exécutez : `npm run sonar`

## Branche par défaut
Veuillez vous placer sur la branche develop plutôt que main




