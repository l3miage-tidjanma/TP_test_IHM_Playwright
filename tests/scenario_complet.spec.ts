import { test, expect } from '@playwright/test';
import {
  ajouterTache,
  recupererTodoList,
  compterTachesAvecLabel,
  supprimerTache,
  modifierTache,
  appliquerFiltre,
  cocherTache,
  supprimerTachesCochees
} from './fonctions_utiles';
import {
  verifierTacheAjoutee,
  verifierAucuneTacheVide,
  verifierNombreTachesAvecLabel,
  verifierTacheCaractereSpeciaux,
  verifierTacheLongue,
  verifierTachesDifferentes,
  verifierTachesIdentiques,
  verifierTacheSupprimee,
  verifierTacheModifiee,
  verifierAffichageTaches,
  verifierCompteurRestantes
} from './verifications';

test.describe('scénario complet todo-list', () => {
  test('toutes les fonctionnalités principales', async ({ page }) => {
    await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');

    // Ajout de tâches
    await ajouterTache(page, 'tâche 1');
    await ajouterTache(page, 'tâche 2');
    await ajouterTache(page, 'tâche 3');
    // await ajouterTache(page, ''); // tâche vide
    await ajouterTache(page, 'tâche spéciale ع!@#$%^&*()_+');
    await ajouterTache(page, 'a'.repeat(256)); // tâche longue
    await ajouterTache(page, 'doublon');
    await ajouterTache(page, 'doublon');

    let todoList = await recupererTodoList(page);
    verifierTacheAjoutee(todoList, 'tâche 1');
    verifierTacheAjoutee(todoList, 'tâche 2');
    verifierTacheAjoutee(todoList, 'tâche 3');
    verifierAucuneTacheVide(todoList);
    verifierTacheCaractereSpeciaux(todoList, 'tâche spéciale ع!@#$%^&*()_+');
    verifierTacheLongue(todoList, 256);
    verifierNombreTachesAvecLabel(todoList, 'doublon', 2);
    verifierTachesIdentiques(todoList, 'doublon');
    verifierTachesDifferentes(todoList, ['tâche 1', 'tâche 2', 'tâche 3', 'tâche spéciale ع!@#$%^&*()_+', 'a'.repeat(256), 'doublon']);

    // Modification
    await modifierTache(page, 'tâche 1', 'tâche 1 modifiée');
    todoList = await recupererTodoList(page);
    verifierTacheModifiee(todoList, 'tâche 1', 'tâche 1 modifiée');
    await modifierTache(page, 'tâche 2', 'doublon'); // doublon
    todoList = await recupererTodoList(page);
    verifierNombreTachesAvecLabel(todoList, 'doublon', 3);
    await modifierTache(page, 'inexistante', 'nouveau'); // tâche inexistante
    todoList = await recupererTodoList(page);
    verifierNombreTachesAvecLabel(todoList, 'nouveau', 0);
    await modifierTache(page, 'tâche 3', ''); // modif à vide
    todoList = await recupererTodoList(page);
    verifierTacheSupprimee(todoList, 'tâche 3');
    verifierTacheSupprimee(todoList, '');

    // Suppression
    await supprimerTache(page, 'tâche 1 modifiée');
    todoList = await recupererTodoList(page);
    verifierTacheSupprimee(todoList, 'tâche 1 modifiée');
    await supprimerTache(page, 'doublon'); // supprime un doublon
    todoList = await recupererTodoList(page);
    verifierNombreTachesAvecLabel(todoList, 'doublon', 2);
    await supprimerTache(page, 'tâche spéciale ع!@#$%^&*()_+');
    todoList = await recupererTodoList(page);
    verifierTacheSupprimee(todoList, 'tâche spéciale ع!@#$%^&*()_+');

    // Filtrage
    await cocherTache(page, 'doublon'); // coche un doublon
    await appliquerFiltre(page, 'Tous');
    todoList = await recupererTodoList(page);
    verifierAffichageTaches(todoList, todoList.map(item => item.label));
    await appliquerFiltre(page, 'Actifs');
    todoList = await recupererTodoList(page);
    verifierAffichageTaches(todoList, todoList.filter(item => !item.done).map(item => item.label));
    await appliquerFiltre(page, 'Complétés');
    todoList = await recupererTodoList(page);
    verifierAffichageTaches(todoList, todoList.filter(item => item.done).map(item => item.label));
    await appliquerFiltre(page, 'Tous');
    todoList = await recupererTodoList(page);
    await verifierCompteurRestantes(page, todoList.filter(item => !item.done).length);

    // Suppression des tâches cochées
    // Cocher toutes les tâches 'doublon' (même celles non cochées) avant suppression batch
    const doublonItems = page.locator('.todo-list li').filter({ hasText: 'doublon' });
    const count = await doublonItems.count();
    for (let i = 0; i < count; i++) {
      const checkbox = doublonItems.nth(i).locator('input[type="checkbox"]');
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    }
    await supprimerTachesCochees(page);
    todoList = await recupererTodoList(page);
    verifierTacheSupprimee(todoList, 'doublon');
    // Vérifier que le compteur de tâches restantes est correct (nombre réel de tâches non cochées)
    await verifierCompteurRestantes(page, todoList.filter(item => !item.done).length);

    // Suppression finale de toutes les tâches
    for (const item of todoList) {
      await supprimerTache(page, item.label);
    }
    todoList = await recupererTodoList(page);
    expect(todoList.length).toBe(0);
  });
});
