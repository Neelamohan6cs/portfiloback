const express = require('express');
const router = express.Router();
const Certification = require('../models/certification');

// ✅ POST: Create new certification
router.post('/', async (req, res) => {
  try {
    const { title, img, desc } = req.body; // fixed spelling
    const data = new Certification({
      title,
      img,
      desc,
    });

    const savedData = await data.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET: Fetch all certifications
router.get('/', async (req, res) => {
  try {
    const datas = await Certification.find();
    res.status(200).json(datas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req,res)=>{
    const id=req.params.id;
    try{
        await Certification.findByIdAndDelete(id);
        res.status(200).json({message:"Certification deleted successfully"});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

module.exports = router;
