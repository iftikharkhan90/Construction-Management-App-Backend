import material from "../../models/material.js";
import constructor from "../../models/constructor.js";

export const getTotalExpensives = async (req, res) => {
    try {
        // Fetching data from both collections
        const materialData = await material.find();
        const constructorData = await constructor.find();

        // Function to calculate total fields from an array of objects
        const calculateTotals = (data) => {
            return data.reduce(
                (acc, item) => {
                    acc.totalAmount += item.totalAmount || 0;
                    acc.payAmount += item.payAmount || 0;
                    acc.remainingAmount += item.remainingAmount || 0;
                    return acc;
                },
                { totalAmount: 0, payAmount: 0, remainingAmount: 0 }
            );
        };

        // Calculate totals from both collections
        const materialTotals = calculateTotals(materialData);
        const constructorTotals = calculateTotals(constructorData);

        // Combine totals
        const combinedTotals = {
            totalAmount: materialTotals.totalAmount + constructorTotals.totalAmount,
            payAmount: materialTotals.payAmount + constructorTotals.payAmount,
            remainingAmount:
                materialTotals.remainingAmount + constructorTotals.remainingAmount,
        };

        return res.status(200).json({
            message: "Totals fetched successfully",
            totalAmount: combinedTotals.totalAmount,
            payAmount: combinedTotals.payAmount,
            remainingAmount: combinedTotals.remainingAmount,
        });
    } catch (error) {
        console.log("Error in getTotalExpensives:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
