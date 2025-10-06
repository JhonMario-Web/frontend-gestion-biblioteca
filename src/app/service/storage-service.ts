import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	setItem<T>(key: string, value: T): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

	getItem<T>(key: string): T | null {
		const raw = localStorage.getItem(key);
		if (!raw || raw === 'undefined') {
			return null;
		}

		try {
			return JSON.parse(raw) as T;
		} catch (error) {
			console.error('Error parsing storage value', error);
			return null;
		}
	}

	removeItem(key: string): void {
		localStorage.removeItem(key);
	}

	clear(): void {
		localStorage.clear();
	}
}
