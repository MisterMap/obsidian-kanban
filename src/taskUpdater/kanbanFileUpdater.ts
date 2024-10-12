import { Task } from "./task";
import { Vault } from "obsidian";

export class KanbanBoardUpdater {
    kanbanProject: string;
    inboxColumnHeader: string;
    vault: Vault;

    constructor(kanbanProject: string, vault: Vault, inboxColumnHeader: string) {
        this.kanbanProject = kanbanProject;
        this.vault = vault;
        this.inboxColumnHeader = inboxColumnHeader;
        console.log(`[KanbanBoardUpdater][constructor] KanbanBoardUpdater initialized with project: ${kanbanProject}, inbox header: ${inboxColumnHeader}`);
    }

    update(task: Task): void {   
        console.log(`[KanbanBoardUpdater][update] Updating task: ${task.toKanbanLine()}`);
        const lineText = task.toKanbanLine();
        const file = this.vault.getFileByPath(this.kanbanProject);
        if (!file) {
            console.error(`[KanbanBoardUpdater][update] File not found: ${this.kanbanProject}`);
            return;
        }
        this.vault.process(file, (data) => {
            return this.updateKanbanLineText(lineText, task.getBlockId(), data);
        });
    }

    updateKanbanLineText(lineText: string, obsidianLink: string, data: string): string {
        console.log(`[KanbanBoardUpdater][updateKanbanLineText] Updating Kanban line text for link: ${obsidianLink}`);
        let taskLineNumber = -1;
        const lines = data.split('\n');
        taskLineNumber = lines.findIndex(line => line.includes(obsidianLink));
        if (taskLineNumber === -1) {
            console.log(`[KanbanBoardUpdater][updateKanbanLineText] Task not found in existing lines`);
            return this.createAndInsertLineText(lineText, data);
        }   
        console.log(`[KanbanBoardUpdater][updateKanbanLineText] Task found at line ${taskLineNumber}, updating`);
        lines[taskLineNumber] = lineText;
        return lines.join('\n');
    }

    createAndInsertLineText(lineText: string, data: string): string {
        console.log(`[KanbanBoardUpdater][createAndInsertLineText] Creating and inserting new line: ${lineText}`);
        const lines = data.split('\n');
        const inboxColumnIndex = lines.findIndex(line => line.trim().startsWith(this.inboxColumnHeader));
        if (inboxColumnIndex === -1) {
            console.log(`[KanbanBoardUpdater][createAndInsertLineText] Inbox column not found`);
            return data;
        }
        console.log(`[KanbanBoardUpdater][createAndInsertLineText] Inbox column found at line ${inboxColumnIndex}, inserting task`);
        lines.splice(inboxColumnIndex + 1, 0, lineText);
        return lines.join('\n');
    }
}

export default KanbanBoardUpdater;