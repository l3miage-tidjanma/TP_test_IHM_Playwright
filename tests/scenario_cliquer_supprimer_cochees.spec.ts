import { test } from '@playwright/test';
import { ajouterTache, recupererTodoList } from './fonctions_utiles';
import { verifierTacheSupprimee, verifierTachesDifferentes } from './verifications';
import { cocherTache, supprimerTachesCochees } from './fonctions_utiles';

test.describe('supprimer les tâches cochées via le bouton dédié', () => {
	test('supprimer plusieurs tâches cochées', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const labels = ['a', 'b', 'c', 'd'];
		for (const label of labels) {
			await ajouterTache(page, label);
		}
		// Cocher les tâches à supprimer
		await cocherTache(page, 'b');
		await cocherTache(page, 'd');
		// Cliquer sur le bouton "Supprimer cochées"
		await supprimerTachesCochees(page);
		const todoList = await recupererTodoList(page);
		// Vérifier que les tâches cochées ont bien été supprimées
		verifierTacheSupprimee(todoList, 'b');
		verifierTacheSupprimee(todoList, 'd');
		// Vérifier que les autres tâches sont toujours présentes
		verifierTachesDifferentes(todoList, ['a', 'c']);
	});
});
