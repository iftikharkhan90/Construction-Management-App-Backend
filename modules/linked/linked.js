import material from "../../models/material.js";
import mongoose from "mongoose";
import moment from "moment";

export const createLinkedItem = async (req, res) => {
    try {
        const { payAmount, date, type, linked, userId, selectedItem } = req.body;
        const formattedDate = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");

        if (!linked) {
            return res.status(400).json({ message: "Linked is false, no action taken" });
        }

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(selectedItem) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid selectedItem or userId" });
        }

        // Fetch selected item from DB
        const selected = await material.findOne({
            _id: mongoose.Types.ObjectId.createFromHexString(selectedItem),
            userId: mongoose.Types.ObjectId.createFromHexString(userId)
        });

        if (!selected) {
            return res.status(404).json({ message: "Selected item not found" });
        }

        // Backup original state
        const originalSelected = { ...selected._doc };

        // Calculate updated remaining amount
        const updatedRemaining = selected.remainingAmount - payAmount;
        if (updatedRemaining < 0) {
            return res.status(400).json({ message: "Pay amount is greater than remaining amount" });
        }

        // Update and save selected item
        selected.remainingAmount = updatedRemaining;
        await selected.save();

        // Create new linked item
        const newLinkedItem = await material.create({
            itemName: selected.itemName,
            itemPrice: selected.itemPrice,
            totalItems: 0,
            totalAmount: 0,
            payAmount,
            remainingAmount: updatedRemaining,
            type,
            date: formattedDate,
            userId,
            isLinked: true,
            selectedItem: selected._id.toString()
        });

        // Return both original + updated + linked item
        return res.status(200).json({
            message: "Linked item processed successfully",
            originalSelectedItem: originalSelected,
            updatedSelectedItem: selected,
            newLinkedItem
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error while processing linked item" });
    }
};



export const getLinkedItem = async (req, res) => {
    try {
        const { type, userId } = req.query;

        // Basic validation
        if (!type || !userId) {
            return res.status(400).json({ message: "Missing type or userId in query" });
        }

        // Find only linked items
        const data = await material.find({
            type,
            userId,
            isLinked: true
        });

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No linked items found" });
        }

        return res.status(200).json({
            message: "Linked items fetched successfully",
            data
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error while fetching linked materials" });
    }
};


