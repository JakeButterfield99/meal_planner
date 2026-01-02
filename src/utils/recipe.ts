export interface IngredientCategory {
    category: string;
    ingredients: string[];
}

export function parseIngredientCategories(text: string): IngredientCategory[] {
    const lines = text
        .split("\n")
        .map(l => l.trim())
        .filter(Boolean);

    const categories: IngredientCategory[] = [];
    let currentCategory: IngredientCategory | null = null;

    const isCategoryLine = (line: string) =>
        line === line.toUpperCase() && !/\d/.test(line);

    for (let rawLine of lines) {
        // Remove bullets / squares / tabs / paste artifacts
        let line = rawLine.replace(/^[•▢\-\t\u2022]+/g, "").trim();

        // Detect category headers
        if (isCategoryLine(line)) {
            currentCategory = {
                category: line,
                ingredients: []
            };
            categories.push(currentCategory);
            continue;
        }

        // Ensure a global category exists
        if (!currentCategory) {
            currentCategory = {
                category: "global",
                ingredients: []
            };
            categories.push(currentCategory);
        }

        // Remove parenthetical notes (Note 1, (500 ml), etc.)
        line = line.replace(/\([^)]*\)/g, "").trim();

        // Remove "sub ..." text
        line = line.replace(/sub\s+[^,]+/gi, "").trim();

        if (line.length > 0) {
            currentCategory.ingredients.push(line);
        }
    }

    return categories;
}