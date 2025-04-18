import material from "../../models/material.js";
import mongoose from "mongoose";
import moment from "moment";
import constructor from "../../models/constructor.js";

export const createLinkedItem = async (req, res) => {
    try {
        const { payAmount, date, type, isLinked, userId, selectedItem } = req.body;
        const formattedDate = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
        if (!isLinked) {
            return res.status(400).json({ message: "Linked is false, no action taken" });
        }
        if (!mongoose.Types.ObjectId.isValid(selectedItem) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid selectedItem or userId" });
        }

        const selected = await material.findOne({
            _id: mongoose.Types.ObjectId.createFromHexString(selectedItem),
            userId: mongoose.Types.ObjectId.createFromHexString(userId)
        })
        console.log(selected)
        if (!selected ) {
            return res.status(404).json({ message: "Selected item not found" })
        }

        const originalSelected = { ...selected._doc }
        const updatedRemaining = selected.remainingAmount - payAmount
        if (updatedRemaining < 0) {
            return res.status(400).json({ message: "Pay amount incorrect" });
        }

        selected.remainingAmount = updatedRemaining;
        await selected.save();

        // const newLinkedItem = await material.create({
        //     name: selected.itemName,
        //     itemPrice: selected.itemPrice,
        //     // totalItems: 0,
        //     // totalAmount: 0,
        //     linkedAmount:payAmount,
        //     // remainingAmount: updatedRemaining,
        //     type,
        //     date: formattedDate,
        //     userId,
        //     isLinked: true,
        //     selectedItem: selected._id.toString()
        // })
        const newLinkedItem = await material.create({
            name: selected.itemName,           
            itemPrice: selected.itemPrice,
            linkedAmount: payAmount,
            type,
            date: formattedDate,
            userId,
            isLinked: true,
            selectedItem: selected._id.toString()
        })

        console.log("new " , newLinkedItem);
        
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
}

export const createLinkedItemConstructor = async (req, res) => {
    try {
        const { payAmount, date, type, isLinked, userId, selectedItem } = req.body;
        const formattedDate = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD");
        if (!isLinked) {
            return res.status(400).json({ message: "Linked is false, no action taken" });
        }
        if (!mongoose.Types.ObjectId.isValid(selectedItem) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid selectedItem or userId" });
        }

        const selected = await constructor.findOne({
            _id: mongoose.Types.ObjectId.createFromHexString(selectedItem),
            userId: mongoose.Types.ObjectId.createFromHexString(userId)
        })
        console.log(selected)
        if (!selected ) {
            return res.status(404).json({ message: "Selected item not found" })
        }

        const originalSelected = { ...selected._doc }
        const updatedRemaining = selected.remainingAmount - payAmount
        if (updatedRemaining < 0) {
            return res.status(400).json({ message: "Pay amount incorrect" });
        }

        selected.remainingAmount = updatedRemaining;
        await selected.save();

        const newLinkedItem = await material.create({
            name: selected.itemName,
            itemPrice: selected.itemPrice,
            linkedAmount: payAmount,
            type:selected.type,
            date: formattedDate,
            userId,
            isLinked: true,
            selectedItem: selected._id.toString()
        })

        console.log("new ", newLinkedItem);
        
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
}

export const getLinkedItem = async (req, res) => {
    try {
        const { type, userId } = req.query
        // if (!type || !userId) {
        //     return res.status(400).json({ message: "Missing type or userId in query" })
        // }
        const materials = await material.find({
            type,
            userId,
            isLinked: true
        }).sort({ date: -1 })
        const cons = await constructor.find({
            type,
            userId,
            isLinked: true
        }).sort({ date: -1 })
        
        // if (materials.length === 0 && cons.length === 0) {
        //     return res.status(404).json({ message: "No linked items found"  });
        // }
        return res.status(200).json({
            message: "Linked items fetched successfully",
            data: materials, 
            Constructor: cons
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error while fetching linked materials" });
    }
}

export const getSelctedItems = async (req, res) => {

    try {
        const { type, userId } = req.query;

        // if (!type || !userId) {
        //      res.status(400).json({ message: "Missing type or userId" });
        // }
        console.log('{type , userId}', { type, userId })
        const items = await material.find({
            type,
            userId,
            remainingAmount: { $gt: 0 },
            isLinked: false,
        }).sort({ date: -1 })
        const consItems = await constructor.find({
            // type,
            userId,
            remainingAmount: { $gt: 0 },
            isLinked: false,
        }).sort({ date: -1 })
        console.log("Items found:", items);
        console.log("Constructor's items:", consItems);
        if ( items.length === 0 &&  consItems.length === 0) {
            return res.status(404).json({ message: "Items not found" });
        }

        return res.status(200).json({ message: items, ConstructorItems: consItems });
    } catch (error) {
        console.error("Error in getSelctedItems:", error);
        return res.status(500).json({ message: "Error while getting selected item" });
    }
}
