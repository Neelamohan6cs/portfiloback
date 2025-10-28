const express = require('express');
const router = express.Router();
const Education = require("../models/Education"); // fix typo: 'Educatiton' -> 'Education'

// POST /education — create a new education record
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.log("Received Education Data:", data);

    // Save to MongoDB
    const newEducation = await Education.create(data);

    res.status(201).json({
      message: "Education data saved successfully",
      education: newEducation
    });
  } catch (error) {
    console.error("Error creating Education:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async(req,res)=>{
    try{
        const datas= await Education.find()
        console.log("Fetched Education Data:", datas);
        res.status(200).json(datas);
    }
    catch(error){
        console.error("Error fetching Education:", error);
        res.status(500).json({ error: error.message });
    }
});


router.delete("/:id", async(req,res)=>{
  try{
      const id =req.params.id;
      await Education.findByIdAndDelete(id);
      res.status(200).json({message:"Education data deleted successfully"});
  }
  catch(error){
      console.error("Error deleting Education:", error);
      res.status(500).json({ error: error.message });

  }
});

module.exports = router;
