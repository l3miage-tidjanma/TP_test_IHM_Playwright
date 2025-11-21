import { test, expect } from '@playwright/test';
import { ajouterTache, modifierTache, recupererTodoList } from './fonctions_utiles';
import {
	verifierTacheModifiee,
	verifierTachesDifferentes,
	verifierNombreTachesAvecLabel
} from './verifications';

// Fonction utile à implémenter :
/**
 * Modifie une tâche de la todo-list via l'UI.
 * @param page La page Playwright.
 * @param ancienLabel Le label de la tâche à modifier.
 * @param nouveauLabel Le nouveau label à appliquer.
 */
// export async function modifierTache(page: Page, ancienLabel: string, nouveauLabel: string): Promise<void> { ... }

test.describe('modifier une tâche de la todo-list', () => {
	test('possible de modifier le label d\'une tâche existante', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const ancienLabel = 'ancienne tâche';
		const nouveauLabel = 'nouvelle tâche';
		await ajouterTache(page, ancienLabel);
		await modifierTache(page, ancienLabel, nouveauLabel);
		const todoList = await recupererTodoList(page);
		verifierTacheModifiee(todoList, ancienLabel, nouveauLabel);
	});

	test('possible de modifier une tâche parmi plusieurs', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const labels = ['a', 'b', 'c'];
		for (const label of labels) {
			await ajouterTache(page, label);
		}
		await modifierTache(page, 'b', 'modifiée');
		const todoList = await recupererTodoList(page);
		verifierTacheModifiee(todoList, 'b', 'modifiée');
		verifierTachesDifferentes(todoList, ['a', 'c', 'modifiée']);
	});

	test('modifier une tâche en un label déjà existant (doublon)', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const labels = ['x', 'y'];
		for (const label of labels) {
			await ajouterTache(page, label);
		}
		await modifierTache(page, 'x', 'y');
		const todoList = await recupererTodoList(page);
		verifierNombreTachesAvecLabel(todoList, 'y', 2);
	});

	test('modifier une tâche qui n\'existe pas ne modifie pas la liste', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const labels = ['t1', 't2'];
		for (const label of labels) {
			await ajouterTache(page, label);
		}
		await modifierTache(page, 'inexistante', 'nouveau');
		const todoList = await recupererTodoList(page);
		verifierTachesDifferentes(todoList, labels);
		verifierNombreTachesAvecLabel(todoList, 'nouveau', 0);
	});
});
