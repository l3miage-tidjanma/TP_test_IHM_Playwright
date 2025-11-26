import { test, expect } from '@playwright/test';
import { ajouterTache, recupererTodoList, supprimerTache } from './fonctions_utiles';
import {
	verifierTacheSupprimee,
	verifierNombreTachesAvecLabel,
	verifierTachesDifferentes
} from './verifications';

// Fonctions utiles à implémenter :
/**
 * Supprime une tâche de la todo-list via l'UI.
 * @param page La page Playwright.
 * @param label Le label de la tâche à supprimer.
 */
// export async function supprimerTache(page: Page, label: string): Promise<void> { ... }

test.describe('supprimer une tâche de la todo-list', () => {
	test('possible de supprimer une tâche existante', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const label = 'tâche à supprimer';
		await ajouterTache(page, label);
		await supprimerTache(page, label);
		const todoList = await recupererTodoList(page);
		verifierTacheSupprimee(todoList, label);
	});

	test('possible de supprimer une tâche parmi plusieurs', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const labels = ['tâche 1', 'tâche 2', 'tâche 3'];
		for (const label of labels) {
			await ajouterTache(page, label);
		}
		await supprimerTache(page, 'tâche 2');
		const todoList = await recupererTodoList(page);
		verifierTacheSupprimee(todoList, 'tâche 2');
		verifierTachesDifferentes(todoList, ['tâche 1', 'tâche 3']);
	});

	test('supprimer toutes les tâches une à une', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const labels = ['a', 'b', 'c'];
		for (const label of labels) {
			await ajouterTache(page, label);
		}
		for (const label of labels) {
			await supprimerTache(page, label);
		}
		const todoList = await recupererTodoList(page);
		expect(todoList.length).toBe(0);
	});

	// Test inutile ! on ne peut pas supprimer une tâche que l'on a pas ajouté préalablement
	// test('supprimer une tâche qui n\'existe pas ne modifie pas la liste', async ({ page }) => {
	// 	await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
	// 	const labels = ['x', 'y'];
	// 	for (const label of labels) {
	// 		await ajouterTache(page, label);
	// 	}
	// 	await supprimerTache(page, 'z');
	// 	const todoList = await recupererTodoList(page);
	// 	verifierTachesDifferentes(todoList, labels);
	// 	verifierNombreTachesAvecLabel(todoList, 'z', 0);
	// });
});
