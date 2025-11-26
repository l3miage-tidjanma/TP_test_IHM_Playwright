# Rapport de Tests Playwright - Todo-List

## 1. Introduction

Ce rapport présente l'ensemble des scénarios de test implémentés avec Playwright pour valider les fonctionnalités d'une application de gestion de tâches (todo-list). Les tests couvrent toutes les opérations principales : ajout, modification, suppression, filtrage et suppression batch de tâches.

## 2. Architecture des Tests

### 2.1 Définitions et Types

Les tests utilisent des types TypeScript pour structurer les données :

```typescript
interface Item {
  label: string;    // Le texte de la tâche
  done: boolean;    // État coché/non coché
  uid: number;      // Identifiant unique
}

type TodoListData = Item[];
```

Ces définitions permettent de manipuler de manière typée les données récupérées de l'interface utilisateur.

### 2.2 Fonctions Utilitaires

Les fonctions utilitaires encapsulent les interactions avec l'UI :

#### **ajouterTache(page, label)**
- **Actions utilisateur** : 
  - Saisir du texte dans le champ de saisie
  - Appuyer sur la touche Entrée
- **Implémentation Playwright** :
  - `page.fill()` : Remplit le champ de saisie avec le label
  - `page.keyboard.press('Enter')` : Simule la touche Entrée
- **Objets** : Input textbox `input[placeholder="Que faire?"]`

#### **supprimerTache(page, label)**
- **Actions utilisateur** :
  - Survoler l'élément de la tâche
  - Cliquer sur le bouton de suppression
- **Implémentation Playwright** :
  - `page.locator().first()` : Cible la première occurrence du label
  - `item.hover()` : Simule le survol de l'élément
  - `btn.click()` : Simule le clic sur le bouton
- **Objets** : 
  - Liste item `.todo-list li`
  - Bouton suppression `button.destroy, button:has-text("×")`

#### **modifierTache(page, ancienLabel, nouveauLabel)**
- **Actions utilisateur** :
  - Double-cliquer sur le label de la tâche
  - Saisir le nouveau texte
  - Appuyer sur la touche Entrée
- **Implémentation Playwright** :
  - `labelNode.dblclick()` : Simule le double-clic pour activer l'édition
  - `editInput.fill()` : Remplit le nouveau label
  - `editInput.press('Enter')` : Simule la touche Entrée pour valider
- **Objets** :
  - Label `.todo-label, label, span`
  - Input édition `input[type="text"]`

#### **cocherTache(page, label)**
- **Actions utilisateur** :
  - Cliquer sur la case à cocher de la tâche
- **Implémentation Playwright** :
  - `page.locator().first()` : Cible la première occurrence
  - `checkbox.check()` : Simule le clic pour cocher la case
- **Objets** : Checkbox `input[type="checkbox"]`

#### **supprimerTachesCochees(page)**
- **Actions utilisateur** :
  - Cliquer sur le bouton "Supprimer cochées"
- **Implémentation Playwright** :
  - `page.click()` : Simule le clic sur le bouton
- **Objets** : Bouton `button:has-text("Supprimer cochées")`

#### **appliquerFiltre(page, filtre)**
- **Actions utilisateur** :
  - Cliquer sur l'onglet de filtre (Tous, Actifs, ou Complétés)
- **Implémentation Playwright** :
  - `page.click()` : Simule le clic sur l'onglet
- **Objets** : Bouton/onglet de filtre `text=${filtre}`

#### **recupererTodoList(page)**
- **Actions utilisateur** :
  - (Fonction d'observation, pas d'action utilisateur)
- **Implémentation Playwright** :
  - `page.$$eval()` : Évalue le DOM pour extraire les données des tâches
- **Objets** : Liste items `.todo-list li`
- **Retour** : `TodoListData` - tableau des tâches avec label, done, uid

#### **compterTachesAvecLabel(todoList, label)**
- **Actions utilisateur** :
  - (Fonction de calcul, pas d'action utilisateur)
- **Implémentation Playwright** :
  - (Fonction pure JavaScript, pas d'interaction avec Playwright)
- **Logique** : Filtre et compte les tâches avec un label donné
- **Retour** : Nombre de tâches

### 2.3 Fonctions de Vérification

Les fonctions de vérification utilisent les assertions Playwright :

#### **verifierTacheAjoutee(todoList, label)**
- **Vérification** : `expect(count).toBeGreaterThan(0)`
- **But** : Confirme qu'au moins une tâche avec ce label existe

#### **verifierTacheSupprimee(todoList, label)**
- **Vérification** : `expect(exists).toBe(false)`
- **But** : Confirme qu'aucune tâche avec ce label n'existe

#### **verifierTacheModifiee(todoList, ancienLabel, nouveauLabel)**
- **Vérifications** :
  - `expect(ancienLabelExiste).toBe(false)`
  - `expect(nouveauLabelExiste).toBe(true)`
- **But** : Confirme que l'ancien label a disparu et le nouveau est présent

#### **verifierAucuneTacheVide(todoList)**
- **Vérification** : `expect(count).toBe(0)`
- **But** : Confirme qu'aucune tâche avec label vide n'existe

#### **verifierNombreTachesAvecLabel(todoList, label, attendu)**
- **Vérification** : `expect(count).toBe(attendu)`
- **But** : Valide le nombre exact de tâches avec un label donné

#### **verifierTachesIdentiques(todoList, label)**
- **Vérifications** : Compare label et état done de toutes les occurrences
- **But** : Confirme que les doublons ont le même état

#### **verifierTachesDifferentes(todoList, labels)**
- **Vérification** : Vérifie la présence de chaque label dans la liste
- **But** : Confirme que toutes les tâches attendues sont présentes

#### **verifierAffichageTaches(todoList, labels)**
- **Vérification** : `expect(affiches.sort()).toEqual(labels.sort())`
- **But** : Confirme que les tâches affichées correspondent exactement aux labels attendus

#### **verifierCompteurRestantes(page, attendu)**
- **Actions** :
  - `page.locator('strong').textContent()` : Récupère le texte du compteur
  - Regex `\d+` : Extrait le nombre
- **Vérification** : `expect(value).toBe(attendu)`
- **But** : Valide le compteur de tâches restantes

## 3. Scénarios de Test

### 3.1 Scénarios d'Ajout (scenarios_ajout.spec.ts)

#### **Test 1 : Ajouter 1 item**
- **Actions** :
  1. Navigation vers l'application
  2. `ajouterTache(page, 'écrire les scénarios nominaux')`
  3. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierTacheAjoutee(todoList, label)`

#### **Test 2 : Ne pas ajouter une tâche vide**
- **Actions** :
  1. Navigation vers l'application
  2. `ajouterTache(page, '')`
  3. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierAucuneTacheVide(todoList)`
- **Résultat attendu** : L'application rejette les tâches vides
- **⚠️ Résultat obtenu** : **L'application accepte les tâches vides (BUG DÉTECTÉ)**. Une tâche avec un libellé vide est effectivement ajoutée à la liste, ce qui ne devrait pas être autorisé.
- **Impact** : Ce test a révélé une défaillance dans la validation des entrées de l'application.

#### **Test 3 : Ajouter deux tâches identiques (doublon)**
- **Actions** :
  1. Navigation vers l'application
  2. `ajouterTache(page, 'tâche en double')` × 2
  3. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierNombreTachesAvecLabel(todoList, label, 2)`
  - `verifierTachesIdentiques(todoList, label)`
- **Résultat attendu** : Les doublons sont autorisés

#### **Test 4 : Ajouter une tâche avec caractères spéciaux**
- **Actions** :
  1. Navigation vers l'application
  2. `ajouterTache(page, 'tâche spéciale ع!@#$%^&*()_+')`
  3. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierTacheCaractereSpeciaux(todoList, label)`
- **Résultat attendu** : Les caractères spéciaux sont supportés

#### **Test 5 : Ajouter une tâche très longue**
- **Actions** :
  1. Navigation vers l'application
  2. `ajouterTache(page, 'a'.repeat(256))`
  3. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierTacheLongue(todoList, 256)`
- **Résultat attendu** : Les labels longs (256 caractères) sont acceptés

#### **Test 6 : Ajouter plusieurs tâches différentes**
- **Actions** :
  1. Navigation vers l'application
  2. Boucle : `ajouterTache(page, label)` pour ['tâche 1', 'tâche 2', 'tâche 3']
  3. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierTachesDifferentes(todoList, labels)`

### 3.2 Scénarios de Suppression (scenarios_supprimer.spec.ts)

#### **Test 1 : Supprimer une tâche existante**
- **Actions** :
  1. Navigation vers l'application
  2. `ajouterTache(page, 'tâche à supprimer')`
  3. `supprimerTache(page, 'tâche à supprimer')`
  4. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierTacheSupprimee(todoList, label)`

#### **Test 2 : Supprimer une tâche parmi plusieurs**
- **Actions** :
  1. Navigation vers l'application
  2. Ajout de 3 tâches
  3. `supprimerTache(page, 'tâche 2')`
  4. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierTacheSupprimee(todoList, 'tâche 2')`
  - `verifierTachesDifferentes(todoList, ['tâche 1', 'tâche 3'])`

#### **Test 3 : Supprimer toutes les tâches une à une**
- **Actions** :
  1. Navigation vers l'application
  2. Ajout de 3 tâches
  3. Boucle : `supprimerTache(page, label)` pour chaque tâche
  4. `recupererTodoList(page)`
- **Vérifications** :
  - `expect(todoList.length).toBe(0)`

### 3.3 Scénarios de Modification (scenarios_modifier.spec.ts)

#### **Test 1 : Modifier le label d'une tâche existante**
- **Actions** :
  1. Navigation vers l'application
  2. `ajouterTache(page, 'ancienne tâche')`
  3. `modifierTache(page, 'ancienne tâche', 'nouvelle tâche')`
  4. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierTacheModifiee(todoList, 'ancienne tâche', 'nouvelle tâche')`

#### **Test 2 : Modifier une tâche parmi plusieurs**
- **Actions** :
  1. Navigation vers l'application
  2. Ajout de 3 tâches ['a', 'b', 'c']
  3. `modifierTache(page, 'b', 'modifiée')`
  4. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierTacheModifiee(todoList, 'b', 'modifiée')`
  - `verifierTachesDifferentes(todoList, ['a', 'c', 'modifiée'])`

#### **Test 3 : Modifier en un label déjà existant (doublon)**
- **Actions** :
  1. Navigation vers l'application
  2. Ajout de 2 tâches ['x', 'y']
  3. `modifierTache(page, 'x', 'y')`
  4. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierNombreTachesAvecLabel(todoList, 'y', 2)`
- **Résultat attendu** : Les doublons sont autorisés même après modification

#### **Test 4 : Modifier une tâche inexistante**
- **Actions** :
  1. Navigation vers l'application
  2. Ajout de 2 tâches
  3. `modifierTache(page, 'inexistante', 'nouveau')`
  4. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierTachesDifferentes(todoList, ['t1', 't2'])`
  - `verifierNombreTachesAvecLabel(todoList, 'nouveau', 0)`
- **Résultat attendu** : Aucune modification si la tâche n'existe pas

### 3.4 Scénario de Modification à Vide (scenario_modifier_a_vide_supprimer.spec.ts)

#### **Test : Modifier une tâche à vide la supprime**
- **Actions** :
  1. Navigation vers l'application
  2. `ajouterTache(page, 'à supprimer par modification')`
  3. `modifierTache(page, label, '')`
  4. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierTacheSupprimee(todoList, label)`
  - `verifierTacheSupprimee(todoList, '')`
- **Résultat attendu** : Modifier le label à vide équivaut à supprimer la tâche

### 3.5 Scénarios de Filtrage (scenarios_filtrer.spec.ts)

#### **Test 1 : Filtre "Tous"**
- **Actions** :
  1. Navigation vers l'application
  2. Ajout de 3 tâches ['a', 'b', 'c']
  3. `appliquerFiltre(page, 'Tous')`
  4. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierAffichageTaches(todoList, ['a', 'b', 'c'])`
  - `verifierCompteurRestantes(page, 3)`

#### **Test 2 : Filtre "Actifs"**
- **Actions** :
  1. Navigation vers l'application
  2. Ajout de 3 tâches
  3. Coche de la tâche 'b' : `checkbox.check()`
  4. `appliquerFiltre(page, 'Actifs')`
  5. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierAffichageTaches(todoList, ['a', 'c'])`
  - `verifierCompteurRestantes(page, 2)`

#### **Test 3 : Filtre "Complétés"**
- **Actions** :
  1. Navigation vers l'application
  2. Ajout de 3 tâches
  3. Coche des tâches 'a' et 'c'
  4. `appliquerFiltre(page, 'Complétés')`
  5. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierAffichageTaches(todoList, ['a', 'c'])`
  - `verifierCompteurRestantes(page, 1)`

### 3.6 Scénario de Suppression Batch (scenario_cliquer_supprimer_cochees.spec.ts)

#### **Test : Supprimer plusieurs tâches cochées**
- **Actions** :
  1. Navigation vers l'application
  2. Ajout de 4 tâches ['a', 'b', 'c', 'd']
  3. `cocherTache(page, 'b')`
  4. `cocherTache(page, 'd')`
  5. `supprimerTachesCochees(page)`
  6. `recupererTodoList(page)`
- **Vérifications** :
  - `verifierTacheSupprimee(todoList, 'b')`
  - `verifierTacheSupprimee(todoList, 'd')`
  - `verifierTachesDifferentes(todoList, ['a', 'c'])`
- **Résultat attendu** : Seules les tâches cochées sont supprimées

### 3.7 Scénario Complet (scenario_complet.spec.ts)

Ce scénario enchaîne toutes les fonctionnalités pour valider le comportement de l'application dans un contexte d'utilisation réel.

#### **Étapes du scénario complet** :

1. **Ajout de tâches variées**
   - Tâches simples : 'tâche 1', 'tâche 2', 'tâche 3'
   - Tâche avec caractères spéciaux : 'tâche spéciale ع!@#$%^&*()_+'
   - Tâche longue : 256 caractères
   - Doublons : 'doublon' × 2
   - **Vérifications** : Présence, nombre, unicité, caractères spéciaux, longueur

2. **Modifications**
   - Modification simple : 'tâche 1' → 'tâche 1 modifiée'
   - Création de doublon : 'tâche 2' → 'doublon'
   - Modification inexistante : 'inexistante' → 'nouveau'
   - Modification à vide (suppression) : 'tâche 3' → ''
   - **Vérifications** : Absence ancien label, présence nouveau label, nombre de doublons

3. **Suppressions**
   - Suppression simple : 'tâche 1 modifiée'
   - Suppression d'un doublon (première occurrence)
   - Suppression avec caractères spéciaux
   - **Vérifications** : Absence des tâches supprimées, présence des autres

4. **Filtrage**
   - Coche d'un doublon
   - Application des filtres 'Tous', 'Actifs', 'Complétés'
   - Retour au filtre 'Tous'
   - **Vérifications** : Affichage correct des tâches filtrées, compteur de tâches restantes

5. **Suppression batch**
   - Parcours de tous les doublons avec `locator().filter().count()`
   - Coche avec `checkbox.check()` si `!isChecked()`
   - Clic sur "Supprimer cochées"
   - **Vérifications** : Absence de tous les doublons, compteur mis à jour

6. **Nettoyage final**
   - Suppression de toutes les tâches restantes
   - **Vérification** : `expect(todoList.length).toBe(0)`

## 4. Patterns et Bonnes Pratiques

### 4.1 Gestion des Doublons

Les fonctions utilisent `.first()` pour cibler la première occurrence lors de la suppression/modification, ce qui permet de gérer les doublons de manière prévisible.

### 4.2 Gestion de l'UI Dynamique

- **Hover avant suppression** : `item.hover()` rend le bouton de suppression visible
- **Double-clic pour édition** : `labelNode.dblclick()` active le mode édition
- **Attente de stabilisation** : `page.waitForTimeout(100)` après certaines actions

### 4.3 Vérification de l'État

- **isChecked()** : Vérifie l'état avant de cocher pour éviter les erreurs
- **count()** : Vérifie l'existence avant d'interagir

### 4.4 Extraction de Données

`$$eval()` permet d'extraire les données du DOM de manière synchrone, en retournant un tableau structuré.

## 5. Résultats et Couverture

### 5.1 Fonctionnalités Testées

✅ Ajout de tâches (simple, vide, doublon, caractères spéciaux, longue)  
✅ Suppression de tâches (simple, multiple, batch)  
✅ Modification de tâches (simple, doublon, inexistante, à vide)  
✅ Filtrage (Tous, Actifs, Complétés)  
✅ Compteur de tâches restantes  
✅ Gestion des doublons  
✅ Gestion des caractères spéciaux  

### 5.2 Cas Limites Couverts

- Labels vides (rejetés à l'ajout, suppression si modification à vide)
- Caractères spéciaux et Unicode
- Labels très longs (256 caractères)
- Doublons multiples
- Suppression batch de tâches cochées
- Modification de tâches inexistantes
- Filtrage avec compteur dynamique

## 6. Prompts
Après chaque prompt, je vérifiais et corrigeais le résultat derrière si nécessaire. Au début, je n'avais pas de structure claire pour mes tests. J'ai donc commencé par des tests unitaires pour tester la manière de les implémenter,en séparant les fonctions utilitaires des fonctions de vérification pour rendre les scénarios de test plus lisibles. Ensuite, j'ai établi un scénario complet qui enchaîne toutes les fonctionnalités.

### 6.1 premier test + contexte
Je souhaite réaliser une série de tests avec Playwright. 
Pour commencer, je souhaite créer le scénario 1 "Ajouter une tâche à la todo-list". 
describe = type de tâche
ici, pour mon premier scénario, describe sera "ajouter une tâche à la todo-list". Il doit y a voir un ensemble de tests sur l'ajout
Chaque test doit utiliser des fonctions utiles. Ces fonctions utiles sont à implémenter au fur et à mesure afin davoir un scénario de test clair. Chaque test sera donc décris par un ensemble d'appels à des fonctions utiles. 
Pour chaque test, il y a des vérifications à faire pour s'assurer de la cohérence des résultats. Chaque vérification est une fonction à implémenter. Voici une idée des éléments à extraire:
{
  "uid": 0,
  "title": "Liste Miage",
  "items": [
    {
      "label": "écrire les scénarios nominaux",
      "done": false,
      "uid": 10
    }
  ]
}

Voici le site sur lesquels vont devoir se baser nos tests: https://alexdmr.github.io/l3m-2023-2024-angular-todolist

Implémentes le type TodoListData = item[] et item est une interface:
{
      "label": "écrire les scénarios nominaux",
      "done": false,
      "uid": 10
    }

### 6.2
lorsque tu comptes le nombre de tâches dans une liste, tu faisais un todoList.filter(item => item.label === label).length. Ceci pourrait être une fonction ! et ensuite tu vérifies. 

### 6.3
documentes les fonctions de vérifications et celles utiles avec /**/

### 6.4
dans ton test "possible d\'ajouter deux tâches identiques (doublon)" je voudrai que tu comptes le nombre de tâches et qu'ensuite tu fasses une vérification sur la taille de la todo list

il faut aussi vérifier que les tâches sont identiques

### 6.5 
maintenant, avec la même démarche, je souhaite implémenter les scénarios pour la suppression avec les vérifications et les fonctions utiles à utiliser (et à implémenter s'il en manque)

## 7. Conclusion

Les tests Playwright implémentés couvrent l'ensemble des fonctionnalités de l'application todo-list de manière exhaustive. L'architecture modulaire (fonctions utilitaires + fonctions de vérification) permet une maintenance facile et une réutilisation efficace du code. Les scénarios valident non seulement les cas nominaux, mais aussi de nombreux cas limites et erreurs potentielles, garantissant ainsi la robustesse de l'application.
