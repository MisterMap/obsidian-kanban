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
        console.log(`KanbanBoardUpdater initialized with project: ${kanbanProject}, inbox header: ${inboxColumnHeader}`);
    }

    update(task: Task): void {   
        console.log(`Updating task: ${JSON.stringify(task)}`);
        const lineText = task.toKanbanLine()
        console.log(`Generated Kanban line: ${lineText}`);
        this.updateKanbanLineText(lineText, task.getBlockId());
    }

    updateKanbanLineText(lineText: string, obsidianLink: string) {
        console.log(`Updating Kanban line text for link: ${obsidianLink}`);
        let taskLineNumber = -1;
        const file = this.vault.getFileByPath(this.kanbanProject);
        if (!file) {
            console.log(`File not found: ${this.kanbanProject}`);
            return;
        }
        this.vault.process(file, (data) => {
            console.log(`Processing file: ${file.path}`);
            const lines = data.split('\n');
            taskLineNumber = lines.findIndex(line => line.includes(obsidianLink));
            if (taskLineNumber !== -1) {
                console.log(`Task found at line ${taskLineNumber}, updating`);
                lines[taskLineNumber] = lineText;
                return lines.join('\n');
            }   
            console.log(`Task not found in existing lines`);
            return data; // Return unmodified data
        });
        if (taskLineNumber === -1) {
            console.log(`Task not found, creating new line`);
            this.createAndInsertLineText(lineText);
        }
    }

    createAndInsertLineText(lineText: string) {
        console.log(`Creating and inserting new line: ${lineText}`);
        const file = this.vault.getFileByPath(this.kanbanProject);
        if (!file) {
            console.log(`File not found: ${this.kanbanProject}`);
            return;
        }
        this.vault.process(file, (data) => {
            console.log(`Processing file to insert new line: ${file.path}`);
            const lines = data.split('\n');
            const inboxColumnIndex = lines.findIndex(line => line.trim().startsWith(this.inboxColumnHeader));
            if (inboxColumnIndex !== -1) {
                console.log(`Inbox column found at line ${inboxColumnIndex}, inserting task`);
                lines.splice(inboxColumnIndex + 1, 0, lineText);
                return lines.join('\n');
            }
            console.log(`Inbox column not found`);
            return data;
        });
    }
}

export default KanbanBoardUpdater;