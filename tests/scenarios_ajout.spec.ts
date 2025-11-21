import { test, expect } from '@playwright/test';
import { ajouterTache, recupererTodoList, compterTachesAvecLabel } from './fonctions_utiles';
import {
	verifierTacheAjoutee,
	verifierAucuneTacheVide,
	verifierNombreTachesAvecLabel,
	verifierTacheCaractereSpeciaux,
	verifierTacheLongue,
	verifierTachesDifferentes,
	verifierTachesIdentiques
} from './verifications';

// Scénario 1 : Ajouter une tâche à la todo-list
test.describe('ajouter une tâche à la todo-list', () => {
	test('possible d\'ajouter 1 item', async ({ page }: { page: import('@playwright/test').Page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const label = 'écrire les scénarios nominaux';
		await ajouterTache(page, label);
		const todoList = await recupererTodoList(page);
		verifierTacheAjoutee(todoList, label);
	});

		test('ne doit pas ajouter une tâche vide', async ({ page }) => {
			await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
			const label = '';
			await ajouterTache(page, label);
			const todoList = await recupererTodoList(page);
			verifierAucuneTacheVide(todoList);
		});

		test('possible d\'ajouter deux tâches identiques (doublon)', async ({ page }) => {
			await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
			const label = 'tâche en double';
			await ajouterTache(page, label);
			await ajouterTache(page, label);
			const todoList = await recupererTodoList(page);
			const nbTaches = compterTachesAvecLabel(todoList, label);
			verifierNombreTachesAvecLabel(todoList, label, 2);
			// Vérifie que les deux tâches sont identiques (même label, même état)
			verifierTachesIdentiques(todoList, label);
		});

		test('possible d\'ajouter une tâche avec caractères spéciaux', async ({ page }) => {
			await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
			const label = 'tâche spéciale ع!@#$%^&*()_+';
			await ajouterTache(page, label);
			const todoList = await recupererTodoList(page);
			verifierTacheCaractereSpeciaux(todoList, label);
		});

		test('possible d\'ajouter une tâche très longue', async ({ page }) => {
			await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
			const label = 'a'.repeat(256);
			await ajouterTache(page, label);
			const todoList = await recupererTodoList(page);
			verifierTacheLongue(todoList, 256);
		});

		test('possible d\'ajouter plusieurs tâches différentes', async ({ page }) => {
			await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
			const labels = ['tâche 1', 'tâche 2', 'tâche 3'];
			for (const label of labels) {
				await ajouterTache(page, label);
			}
			const todoList = await recupererTodoList(page);
			verifierTachesDifferentes(todoList, labels);
		});
});
