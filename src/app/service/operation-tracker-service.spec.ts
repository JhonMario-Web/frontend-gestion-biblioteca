import { TestBed } from '@angular/core/testing';
import { OperationTrackerService } from './operation-tracker-service';


describe('OperationTrackerService', () => {
	let service: OperationTrackerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(OperationTrackerService);
	});

	it('should push operations and keep a maximum of 50 entries', () => {
		for (let i = 0; i < 60; i++) {
			service.pushRecentAction({ entity: 'BOOK', type: 'CREATED', timestamp: Date.now(), metadata: { index: i } });
		}
		expect(service.recentHistory().length).toBeLessThanOrEqual(10);
		expect(service.peekUndo()).toBeTruthy();
	});

	it('should manage queue operations', () => {
		service.enqueueDeferred({ entity: 'LOAN', type: 'QUEUED', metadata: { id: 1 }, timestamp: Date.now() });
		expect(service.queueSize()).toBe(1);
		const processed = service.consumeNextDeferred();
		expect(processed?.entity).toBe('LOAN');
		expect(service.queueSize()).toBe(0);
	});
});