/**
 * Compte le nombre de tâches ayant un label donné dans la todo-list.
 * @param todoList La liste des tâches.
 * @param label Le label à rechercher.
 * @returns Le nombre de tâches avec ce label.
 */
export function compterTachesAvecLabel(todoList: TodoListData, label: string): number {
	return todoList.filter(item => item.label === label).length;
}

import { Page } from '@playwright/test';

/**
 * Ajoute une tâche à la todo-list via l'UI.
 * @param page La page Playwright.
 * @param label Le texte de la tâche à ajouter.
 */
export async function ajouterTache(page: Page, label: string): Promise<void> {
	// Cible le champ de saisie "Que faire?" ou le textbox principal
	if (await page.locator('input[placeholder="Que faire?"]').count() > 0) {
		await page.fill('input[placeholder="Que faire?"]', label);
	} else {
		await page.getByRole('textbox').fill(label);
	}
	// Clique sur le bouton "Ajouter" (texte ou icône)
	await page.keyboard.press('Enter');
}

/**
 * Récupère la liste des tâches affichées sur la page.
 * @param page La page Playwright.
 * @returns La liste des tâches sous forme de tableau d'objets Item.
 */
export async function recupererTodoList(page: Page): Promise<TodoListData> {
	// Sélectionne tous les items de la liste
	const items = await page.$$eval('.todo-list li', (elements) => {
		return elements.map((el, idx) => {
			const label = (el.querySelector('.todo-label') as HTMLElement)?.innerText || el.textContent || '';
			const done = (el.querySelector('input[type="checkbox"]') as HTMLInputElement)?.checked || false;
			return {
				label: label.trim(),
				done,
				uid: idx // L'uid n'est pas récupérable, on met l'index pour le test
			};
		});
	});
	return items;
}
/**
 * Représente une tâche de la todo-list.
 */
export interface Item {
	label: string;
	done: boolean;
	uid: number;
}

/**
 * Type pour la liste des tâches.
 */
export type TodoListData = Item[];
