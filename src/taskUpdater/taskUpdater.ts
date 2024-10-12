import { MarkdownView, Vault } from 'obsidian';
import { Task } from './task';
import KanbanBoardUpdater from './kanbanFileUpdater';

export class TaskUpdater {
    kanbanFileUpdater: KanbanBoardUpdater;

    constructor(kanbanProject: string, vault: Vault, inboxColumnHeader: string) {
        this.kanbanFileUpdater = new KanbanBoardUpdater(kanbanProject, vault, inboxColumnHeader);
    }

    updateFromView(view: MarkdownView): void {
        console.log(`Updating tasks for view: ${view.file.name}`);
        const project = view.file.name.replace(/\.md$/, "")
        const lineCount = view.editor.lineCount()
        console.log(`Total lines to process: ${lineCount}`);
		for (let i = 0; i < lineCount; i++) {
            this.updateFromLineAndView(i, project, view)
		}
        console.log(`Finished updating tasks for ${view.file.name}`);
    }

    updateFromLineAndView(lineNumber: number, project: string, view: MarkdownView) {
        console.log("----------------------------------------");
        console.log(`Processing line ${lineNumber}`);
        const text = view.editor.getLine(lineNumber)
        console.log(`Line content: ${text}`);
        const task = Task.fromObsidianLine(text, project)
        if (!task) {
            console.log(`No task found on line ${lineNumber}`);
            return;
        }
        console.log(`Task found: ${JSON.stringify(task)}`);
        this.updateLine(lineNumber, task, view)
        this.updateKanbanTask(task)
    }

    updateLine(lineNumber: number, task: Task, view: MarkdownView) {
        console.log(`Updating line ${lineNumber}`);
        const text = task.toObsidianLine()
        const lineEnd = view.editor.getLine(lineNumber).length;
        view.editor.replaceRange(text, {line: lineNumber, ch: 0}, {line: lineNumber, ch: lineEnd})
        console.log(`Line ${lineNumber} updated`);
    }

    updateKanbanTask(task: Task) {
        console.log(`Updating Kanban task: ${JSON.stringify(task)}`);
        this.kanbanFileUpdater.update(task);
    }
}
