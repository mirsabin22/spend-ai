"use server"

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { DEFAULT_SYSTEM, CATEGORIES, INSIGHTS_SYSTEM } from "./constants";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

const expense_schema = z.object({
    name: z.string().describe("Name of the expense"),
    description: z.string().describe("If more information is available, describe it here"),
    category: z.string().describe("Category of the expense, must be one of: " + CATEGORIES.join(", ")),
    amount: z.number().describe("Amount of the expense"),
    currency: z.string().describe("Currency of the expense in ISO 4217 format, like 'IDR', 'USD', etc."),
});

const insights_schema = z.object({
    insights: z.array(z.string()).describe("List of insight strings")
});

export async function textToExpense({system, input}: {system?: string, input: string}) {
    if (!system) {
        system = DEFAULT_SYSTEM
    }
    const promptTemplate = ChatPromptTemplate.fromMessages([
        [
            "system",
            system
          ],
          ["user", "{input}"]    
    ]);
    const modelWithStructure = model.withStructuredOutput(expense_schema);
    const messages = await promptTemplate.invoke({ input });
    const response = await modelWithStructure.invoke(messages);
    const expense = response;
    return expense;
}

export async function getInsights({system, input}: {system?: string, input: string}) {
    if (!system) {
        system = INSIGHTS_SYSTEM
    }
    const promptTemplate = ChatPromptTemplate.fromMessages([
        [
            "system",
            system
          ],
          ["user", "{input}"]    
    ]);
    const modelWithStructure = model.withStructuredOutput(insights_schema);
    const messages = await promptTemplate.invoke({ input });
    const response = await modelWithStructure.invoke(messages);
    const insights = response.insights;
    return insights;
}