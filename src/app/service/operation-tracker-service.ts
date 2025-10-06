import { computed, Injectable, signal } from '@angular/core';

type EntityType = 'BOOK' | 'USER' | 'LOAN' | 'AUTH';
type ActionType = 'CREATED' | 'UPDATED' | 'DELETED' | 'LOGIN' | 'LOGOUT' | 'RETURNED' | 'QUEUED';

export interface OperationEntry {
	timestamp: number;
	entity: EntityType;
	type: ActionType;
	metadata?: Record<string, unknown>;
}

@Injectable({
	providedIn: 'root'
})
export class OperationTrackerService {

	private readonly historyList = signal<OperationEntry[]>([]);
	private readonly undoStack: OperationEntry[] = [];
	private readonly waitingQueue = signal<OperationEntry[]>([]);

	readonly recentHistory = computed(() => this.historyList().slice(-10).reverse());
	readonly queueSize = computed(() => this.waitingQueue().length);

	pushRecentAction(entry: OperationEntry): void {
		const enhanced: OperationEntry = {
			timestamp: entry.timestamp ?? Date.now(),
			entity: entry.entity,
			type: entry.type,
			metadata: entry.metadata
		};

		const list = [...this.historyList(), enhanced];
		if (list.length > 50) {
			list.shift();
		}
		this.historyList.set(list);
		this.undoStack.push(enhanced);
	}

	enqueueDeferred(entry: OperationEntry): void {
		this.waitingQueue.update((queue) => [...queue, entry]);
	}

	consumeNextDeferred(): OperationEntry | undefined {
		let action: OperationEntry | undefined;
		this.waitingQueue.update((queue) => {
			if (queue.length === 0) {
				return queue;
			}
			const [next, ...rest] = queue;
			action = next;
			return rest;
		});
		if (action) {
			this.pushRecentAction({ ...action, type: action.type ?? 'UPDATED' });
		}
		return action;
	}

	peekUndo(): OperationEntry | undefined {
		return this.undoStack[this.undoStack.length - 1];
	}

	popUndo(): OperationEntry | undefined {
		return this.undoStack.pop();
	}
}
