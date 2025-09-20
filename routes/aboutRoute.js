const express = require('express');
const router = express.Router();
const About = require("../models/About"); // ✅ use require, not import

// ---------------- CREATE About ----------------
router.post("/", async (req, res) => {
    try {
        // Delete old About document (if you want only one)
        await About.deleteMany({});

        // Create new About
        const about = await About.create(req.body);

        res.status(201).json(about);
    } catch (error) {
        console.error("Error creating About:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async(req,res)=>{
   try {
    const about = await About.find();
    if (about){
        res.status(200).json(about);
    }else{
        res.status(404).json({message:"about not found"});
    }
    
   } catch (error) {
    res.status(500).json({error:error.message});
    
   }

});

router.delete("/", async (req, res) => {
   try {
      await About.deleteMany({});
      res.status(200).json({ message: "Deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: "Some error occurred", error: error.message });
   }
});

router.put("/:id", async (req, res) => {
    try {
        if(!req.params.id){
            return res.status(400).json({message:"ID parameter is required"});
        }
        const about = await About.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }  
        );
        if(!about){
            return res.status(404).json({message:"About not found"});
        }
        res.status(200).json(about);
        
    } catch (error) {
        console.error("Error updating About:", error);
        res.status(500).json({ error: error.message }); 
    }
});


module.exports = router;
