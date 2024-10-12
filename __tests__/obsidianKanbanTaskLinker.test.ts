import TaskUpdaterLegacy from '../src/taskUpdater/kanbanFileUpdater';
import { Place, ObsidianTaskLinkerFacade } from '../src/taskUpdater/kanbanFileUpdater';

// Mock for ObsidianTaskLinkerFacade
class MockObsidianTaskLinkerFacade implements ObsidianTaskLinkerFacade {
    private mockLines: Map<string, string[]> = new Map();
    private mockPlaces: Map<string, Place> = new Map();

    findPlaceFromLink(link: string): Place | null {
        return this.mockPlaces.get(link) || null;
    }

    updateLine(place: Place, line: string): void {
        const projectLines = this.mockLines.get(place.project) || [];
        projectLines[place.lineNumber - 1] = line;
        this.mockLines.set(place.project, projectLines);
    }

    insertLine(place: Place, line: string): void {
        const projectLines = this.mockLines.get(place.project) || [];
        projectLines.splice(place.lineNumber - 1, 0, line);
        this.mockLines.set(place.project, projectLines);
    }

    getLines(project: string): string[] {
        return this.mockLines.get(project) || [];
    }

    getLine(place: Place): string {
        const projectLines = this.mockLines.get(place.project) || [];
        return projectLines[place.lineNumber - 1] || '';
    }

    // Helper methods for setting up the mock
    setMockLines(project: string, lines: string[]): void {
        this.mockLines.set(project, lines);
    }

    setMockPlace(link: string, lineNumber: number, project: string): void {
        this.mockPlaces.set(link, new Place(lineNumber, project));
    }
}

describe('ObsidianKanbanTaskLinker', () => {
    let linker: TaskUpdaterLegacy;
    let mockFacade: MockObsidianTaskLinkerFacade;

    beforeEach(() => {
        mockFacade = new MockObsidianTaskLinkerFacade();
        linker = new TaskUpdaterLegacy('KanbanProject', mockFacade, '## Inbox');
    });

    describe('updateKanbanLineFromObsidianLine', () => {
        it('should update Kanban line when Obsidian line changes', () => {
            mockFacade.setMockLines('ObsidianProject', ['- [ ] Test task ^testLink']);
            mockFacade.setMockLines('KanbanProject', ['- [ ] Old task [[KanbanProject^testLink]]']);

            linker.updateFromLine(1, 'ObsidianProject');

            const updatedLines = mockFacade.getLines('KanbanProject');
            expect(updatedLines).toEqual(['- [ ] Test task [[ObsidianProject^testLink]]']);
        });
    });

    describe('updateObsidianLineFromKanbanLine', () => {
        it('should update Obsidian line when Kanban line changes', () => {
            mockFacade.setMockPlace('testLink', 1, 'ObsidianProject');
            mockFacade.setMockLines('ObsidianProject', ['- [ ] Old task ^testLink']);

            linker.updateObsidianLineFromKanbanLine('- [x] Updated task [[KanbanProject^testLink]]');

            const updatedLine = mockFacade.getLine(new Place(1, 'ObsidianProject'));
            expect(updatedLine).toBe('- [x] Updated task ^testLink');
        });
    });

    describe('findKanbanTaskPlace', () => {
        it('should find existing Kanban task place', () => {
            mockFacade.setMockLines('KanbanProject', [
                '- [ ] Task 1 [[KanbanProject^link1]]',
                '- [ ] Task 2 [[KanbanProject^link2]]'
            ]);

            const place = linker.findKanbanTaskPlace('link2');
            expect(place).toEqual(new Place(2, 'KanbanProject'));
        });

        it('should create new Kanban task place when not found', () => {
            mockFacade.setMockLines('KanbanProject', [
                '## Inbox',
                '- [ ] Existing task [[KanbanProject^existingLink]]'
            ]);

            const place = linker.findKanbanTaskPlace('newLink');
            expect(place).toEqual(new Place(1, 'KanbanProject'));
        });
    });
});
