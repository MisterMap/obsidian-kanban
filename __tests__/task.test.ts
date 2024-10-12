import { Task } from '../src/taskUpdater/task';

describe('Task', () => {
    describe('constructor', () => {
        it('should create a task with the given properties', () => {
            const task = new Task('Test task', 'TestProject', 'testBlockId', false);
            expect(task.getSummary()).toBe('Test task');
            expect(task.getProject()).toBe('TestProject');
            expect(task.getBlockId()).toBe('testBlockId');
            expect(task.getIsCompleted()).toBe(false);
        });
    });

    describe('fromObsidianLine', () => {
        it('should create a task from a valid Obsidian line', () => {
            const line = '- [ ] Test task ^testBlockId';
            const task = Task.fromObsidianLine(line, 'TestProject');
            expect(task).not.toBeNull();
            if (task) {
                expect(task.getSummary()).toBe('Test task');
                expect(task.getProject()).toBe('TestProject');
                expect(task.getBlockId()).toBe('testBlockId');
                expect(task.getIsCompleted()).toBe(false);
            }
        });

        it('should return null for an invalid Obsidian line', () => {
            const line = 'This is not a valid Obsidian task line';
            const task = Task.fromObsidianLine(line, 'TestProject');
            expect(task).toBeNull();
        });

        it('should correctly parse a completed task', () => {
            const line = '- [x] Completed task ^doneBlockId';
            const task = Task.fromObsidianLine(line, 'DoneProject');
            expect(task).not.toBeNull();
            if (task) {
                expect(task.getIsCompleted()).toBe(true);
                expect(task.getSummary()).toBe('Completed task');
                expect(task.getProject()).toBe('DoneProject');
                expect(task.getBlockId()).toBe('doneBlockId');
            }
        });
    });

    describe('toObsidianLine', () => {
        it('should convert a task to a valid Obsidian line', () => {
            const task = new Task('Test task', 'TestProject', 'testBlockId', false);
            const line = task.toObsidianLine();
            expect(line).toBe('- [ ] Test task ^testBlockId');
        });

        it('should correctly represent a completed task', () => {
            const task = new Task('Completed task', 'DoneProject', 'doneBlockId', true);
            const line = task.toObsidianLine();
            expect(line).toBe('- [x] Completed task ^doneBlockId');
        });
    });

    describe('setters', () => {
        it('should update task properties', () => {
            const task = new Task('Initial task', 'InitialProject', 'initialBlockId', false);
            task.setSummary('Updated task');
            task.setProject('UpdatedProject');
            task.setBlockId('updatedBlockId');
            task.setIsCompleted(true);

            expect(task.getSummary()).toBe('Updated task');
            expect(task.getProject()).toBe('UpdatedProject');
            expect(task.getBlockId()).toBe('updatedBlockId');
            expect(task.getIsCompleted()).toBe(true);
        });
    });

    describe('fromKanbanLine', () => {
        it('should create a task from a valid Kanban line', () => {
            const line = '- [ ] Test task [[TestProject/Column^testBlockId]]';
            const task = Task.fromKanbanLine(line);
            expect(task).not.toBeNull();
            if (task) {
                expect(task.getSummary()).toBe('Test task');
                expect(task.getIsCompleted()).toBe(false);
                expect(task.getProject()).toBe('TestProject/Column');
                expect(task.getBlockId()).toBe('testBlockId');
            }
        });

        it('should return null for an invalid Kanban line', () => {
            const line = 'This is not a valid Kanban task line';
            const task = Task.fromKanbanLine(line);
            expect(task).toBeNull();
        });

        it('should correctly parse a completed task', () => {
            const line = '- [x] Completed task [[DoneProject/Done^doneBlockId]]';
            const task = Task.fromKanbanLine(line);
            expect(task).not.toBeNull();
            if (task) {
                expect(task.getIsCompleted()).toBe(true);
                expect(task.getSummary()).toBe('Completed task');
                expect(task.getProject()).toBe('DoneProject/Done');
                expect(task.getBlockId()).toBe('doneBlockId');
            }
        });
    });

    describe('toKanbanLine', () => {
        it('should convert a task to a valid Kanban line', () => {
            const task = new Task('Test task', 'TestProject/Column', 'testBlockId', false);
            const line = task.toKanbanLine();
            expect(line).toBe('- [ ] Test task [[TestProject/Column^testBlockId]]');
        });

        it('should correctly represent a completed task', () => {
            const task = new Task('Completed task', 'DoneProject/Done', 'doneBlockId', true);
            const line = task.toKanbanLine();
            expect(line).toBe('- [x] Completed task [[DoneProject/Done^doneBlockId]]');
        });
    });
});
