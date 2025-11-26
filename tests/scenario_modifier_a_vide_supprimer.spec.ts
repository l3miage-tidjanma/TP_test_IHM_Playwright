import { test } from '@playwright/test';
import { ajouterTache, modifierTache, recupererTodoList } from './fonctions_utiles';
import { verifierTacheSupprimee } from './verifications';

test.describe('modifier une tâche en label vide supprime la tâche', () => {
	test('modifier une tâche existante à vide la supprime', async ({ page }) => {
		await page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist');
		const label = 'à supprimer par modification';
		await ajouterTache(page, label);
		await modifierTache(page, label, '');
		const todoList = await recupererTodoList(page);
		verifierTacheSupprimee(todoList, label);
		// On peut aussi vérifier qu'il n'y a aucune tâche vide
		verifierTacheSupprimee(todoList, '');
	});
});
