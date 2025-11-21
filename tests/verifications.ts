/**
 * Vérifie que toutes les tâches ayant un label donné sont identiques (label, état done).
 * @param todoList La liste des tâches.
 * @param label Le label à vérifier.
 */
export function verifierTachesIdentiques(todoList: TodoListData, label: string) {
	const items = todoList.filter(item => item.label === label);
	if (items.length < 2) return;
	const ref = items[0];
	for (const item of items) {
		expect(item.label).toBe(ref.label);
		expect(item.done).toBe(ref.done);
	}
}
import { expect } from '@playwright/test';
import { TodoListData, compterTachesAvecLabel } from './fonctions_utiles';

/**
 * Vérifie qu'une tâche a bien été ajoutée à la todo-list.
 * @param todoList La liste des tâches.
 * @param label Le label à vérifier.
 */
export function verifierTacheAjoutee(todoList: TodoListData, label: string) {
	expect(compterTachesAvecLabel(todoList, label)).toBeGreaterThan(0);
}

/**
 * Vérifie qu'aucune tâche vide n'est présente dans la todo-list.
 * @param todoList La liste des tâches.
 */
export function verifierAucuneTacheVide(todoList: TodoListData) {
	expect(compterTachesAvecLabel(todoList, '')).toBe(0);
}

/**
 * Vérifie le nombre d'occurrences d'un label dans la todo-list (pour doublons).
 * @param todoList La liste des tâches.
 * @param label Le label à vérifier.
 * @param attendu Le nombre attendu d'occurrences.
 */
export function verifierNombreTachesAvecLabel(todoList: TodoListData, label: string, attendu: number) {
	expect(compterTachesAvecLabel(todoList, label)).toBe(attendu);
}

/**
 * Vérifie la présence d'une tâche avec caractères spéciaux dans la todo-list.
 * @param todoList La liste des tâches.
 * @param label Le label à vérifier (avec caractères spéciaux).
 */
export function verifierTacheCaractereSpeciaux(todoList: TodoListData, label: string) {
	const trouvee = todoList.some(item => item.label === label);
	expect(trouvee).toBe(true);
}

/**
 * Vérifie la présence d'une tâche très longue dans la todo-list.
 * @param todoList La liste des tâches.
 * @param longueur La longueur attendue du label.
 */
export function verifierTacheLongue(todoList: TodoListData, longueur: number) {
	const trouvee = todoList.some(item => item.label.length === longueur);
	expect(trouvee).toBe(true);
}

/**
 * Vérifie la présence de plusieurs tâches différentes dans la todo-list.
 * @param todoList La liste des tâches.
 * @param labels Les labels à vérifier.
 */
export function verifierTachesDifferentes(todoList: TodoListData, labels: string[]) {
	for (const label of labels) {
		const trouvee = todoList.some(item => item.label === label);
		expect(trouvee).toBe(true);
	}
}
