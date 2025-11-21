import { test, expect } from '@playwright/test';
import { ajouterTache, appliquerFiltre, recupererTodoList } from './fonctions_utiles';
import {
	verifierAffichageTaches,
	verifierCompteurRestantes
} from './verifications';

// Fonctions utiles à implémenter :
/**
 * Applique un filtre sur la todo-list via l'UI.
 * @param page La page Playwright.
 * @param filtre Le filtre à appliquer ('Tous', 'Actifs', 'Complétées').
 */
// export async function appliquerFiltre(page: Page, filtre: string): Promise<void> { ... }

test.describe('filtrer les tâches de la todo-list', () => {
	test('affichage correct avec le filtre "Tous"', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const labels = ['a', 'b', 'c'];
		for (const label of labels) {
			await ajouterTache(page, label);
		}
		await appliquerFiltre(page, 'Tous');
		const todoList = await recupererTodoList(page);
		verifierAffichageTaches(todoList, labels);
		verifierCompteurRestantes(page, 3);
	});

	test('affichage correct avec le filtre "Actifs"', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const labels = ['a', 'b', 'c'];
		for (const label of labels) {
			await ajouterTache(page, label);
		}
		// Marquer une tâche comme complétée
		await page.locator('.todo-list li', { hasText: 'b' }).locator('input[type="checkbox"]').check();
		await appliquerFiltre(page, 'Actifs');
		const todoList = await recupererTodoList(page);
		verifierAffichageTaches(todoList, ['a', 'c']);
		verifierCompteurRestantes(page, 2);
	});

	test('affichage correct avec le filtre "Complétées"', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const labels = ['a', 'b', 'c'];
		for (const label of labels) {
			await ajouterTache(page, label);
		}
		// Marquer deux tâches comme complétées
		await page.locator('.todo-list li', { hasText: 'a' }).locator('input[type="checkbox"]').check();
		await page.locator('.todo-list li', { hasText: 'c' }).locator('input[type="checkbox"]').check();
		await appliquerFiltre(page, 'Complétés');
		const todoList = await recupererTodoList(page);
		verifierAffichageTaches(todoList, ['a', 'c']);
		verifierCompteurRestantes(page, 1);
	});
});
