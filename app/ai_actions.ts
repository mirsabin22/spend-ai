"use server"

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { DEFAULT_SYSTEM } from "./constants";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

const expense_schema = z.object({
    name: z.string().describe("Name of the expense"),
    description: z.string().describe("If more information is available, describe it here"),
    category: z.string().describe("Category of the expense"),
    amount: z.number().describe("Amount of the expense"),
    currency: z.string().describe("Currency of the expense, like 'IDR', 'USD', etc."),
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
