export const calculateDynamicTax = (cartItems, taxConfigs = []) => {
    if (!cartItems || cartItems.length === 0) return 0;

    const taxBrackets = new Set();

    // Create a map for faster lookup { "fruit": 0, "household": 18, etc }
    const configMap = new Map(taxConfigs.map(c => [c.category, c.taxRate]));

    cartItems.forEach(item => {
        const category = item.category || '';

        // If the category exists in the DB config, use that rate, else default to 0
        if (configMap.has(category)) {
            taxBrackets.add(configMap.get(category));
        } else {
            taxBrackets.add(0);
        }
    });

    const uniqueBrackets = Array.from(taxBrackets);

    if (uniqueBrackets.length === 1) {
        return uniqueBrackets[0];
    } else {
        const sum = uniqueBrackets.reduce((acc, curr) => acc + curr, 0);
        return (sum / uniqueBrackets.length);
    }
};
