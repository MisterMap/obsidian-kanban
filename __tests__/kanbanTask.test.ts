import { KanbanTask } from '../src/taskUpdater/kanbanTask';

describe('KanbanTask', () => {
    describe('constructor', () => {
        it('should create a task with the given properties', () => {
            const task = new KanbanTask('Test task', false, 'TestProject', 'TestProject/Column', 'testLink', 1);
            expect(task.getSummary()).toBe('Test task');
            expect(task.getIsCompleted()).toBe(false);
            expect(task.getProject()).toBe('TestProject');
            expect(task.getKanbanProject()).toBe('TestProject/Column');
            expect(task.getObsidianLink()).toBe('testLink');
            expect(task.getLineNumber()).toBe(1);
        });
    });


});
