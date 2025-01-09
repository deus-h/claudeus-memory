// src/tools/handlers/SearchToolHandler.ts

import {BaseToolHandler} from './BaseToolHandler.js';
import {formatToolResponse, formatToolError} from '@shared/index.js';
import type {ToolResponse} from '@shared/index.js';

export class SearchToolHandler extends BaseToolHandler {
    async handleTool(name: string, args: Record<string, any>): Promise<ToolResponse> {
        try {
            this.validateArguments(args);

            switch (name) {
                case "read_graph":
                    const graph = await this.knowledgeGraphManager.readGraph();
                    return formatToolResponse({
                        data: graph,
                        actionTaken: "Read complete knowledge graph"
                    });

                case "search_nodes":
                    const searchResults = await this.knowledgeGraphManager.searchNodes(args.query);
                    return formatToolResponse({
                        data: searchResults,
                        actionTaken: `Searched nodes with query: ${args.query}`
                    });

                case "open_nodes":
                    const nodes = await this.knowledgeGraphManager.openNodes(args.names);
                    return formatToolResponse({
                        data: nodes,
                        actionTaken: `Retrieved nodes: ${args.names.join(', ')}`
                    });

                default:
                    throw new Error(`Unknown search operation: ${name}`);
            }
        } catch (error) {
            return formatToolError({
                operation: name,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                context: {args},
                suggestions: [
                    "Check node names exist",
                    "Verify search query format"
                ],
                recoverySteps: [
                    "Try with different node names",
                    "Adjust search query parameters"
                ]
            });
        }
    }
}