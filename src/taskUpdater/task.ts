export function generateInstanceId(len: number = 9): string {
  return Math.random().toString(36).slice(2, 2 + len);
}

export class Task {
  private static readonly OBSIDIAN_TASK_REGEX = /^- \[([ xX])\] (.+?)( \^(\w+))?$/;
    private static readonly KANBAN_TASK_REGEX = /^- \[([ xX])\] (.+?) \[\[([^\]]+)\^(\w+)\]\]$/;

    private summary: string;
    private project: string;
    private blockId: string;
    private isCompleted: boolean;

    constructor(summary: string, project: string, blockId: string = '', isCompleted: boolean = false) {
        this.summary = summary;
        this.project = project;
        this.blockId = blockId || generateInstanceId();
        this.isCompleted = isCompleted;
    }

    getSummary(): string {
        return this.summary;
    }

    getProject(): string {
        return this.project;
    }

    getBlockId(): string {
        return this.blockId;
    }

    getIsCompleted(): boolean {
        return this.isCompleted;
    }

    setSummary(summary: string): void {
        this.summary = summary;
    }

    setProject(project: string): void {
        this.project = project;
    }

    setBlockId(blockId: string): void {
        this.blockId = blockId;
    }

    setIsCompleted(isCompleted: boolean): void {
        this.isCompleted = isCompleted;
    }

    static fromObsidianLine(line: string, project: string): Task | null {
        console.log(`Parsing Obsidian line: ${line}`);
        const match = line.match(this.OBSIDIAN_TASK_REGEX);
        if (!match) {
            console.log('No match found for Obsidian task regex');
            return null;
        }

        const [, status, summary, , link] = match;
        console.log(`Matched components: status=${status}, summary=${summary}, link=${link}`);
        const isCompleted = status === 'x' || status === 'X';
        const task = new Task(summary.trim(), project, link || '', isCompleted);
        console.log(`Created task: ${JSON.stringify(task)}`);
        return task;
    }

    toObsidianLine(): string {
        const checkboxStatus = this.getIsCompleted() ? 'x' : ' ';
        return `- [${checkboxStatus}] ${this.getSummary()} ^${this.getBlockId()}`;
    }

    static fromKanbanLine(line: string): Task | null {
        const match = line.match(this.KANBAN_TASK_REGEX);
        if (!match) return null;

        const [, status, summary, project, obsidianLink] = match;
        const isCompleted = status === 'x' || status === 'X';
        return new Task(summary.trim(), project, obsidianLink || '', isCompleted);
    }

    toKanbanLine(): string {
        const checkboxStatus = this.getIsCompleted() ? 'x' : ' ';
        return `- [${checkboxStatus}] ${this.getSummary()} [[${this.getProject()}^${this.getBlockId()}]]`;
    }
}
