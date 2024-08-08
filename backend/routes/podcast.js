const router = require("express").Router();
const category = require("../models/category.js");
const podcast = require("../models/podcast.js");
//add-podcast
router.post("/add-podcast", auth, upload, async (req, res) => {
  const { title, description, category } = req.body;
  const frontImage = req.files["frontImage"][0].path;
  const audioFile = req.files["audioFile"][0].path;

  if (!title || !description || !frontImage || !audioFile) {
    return res.status(400).json({ message: "Kindly send all required fields" });
  }

  const { user } = req;
  const cat = await category.findOne({ categoryName: category });
  if (!cat) {
    return res.status(400).json({ message: "no such category found" });
  }
  const catid = cat._id;
  const userid = user._id;

  const newPodcast = new podcast({
    title,
    description,
    category: cat_id,
    frontImage,
    audioFile,
    user: userid,
  });

  await newPodcast.save();
  await category.findByIdAndUpdate(catid,{$push:{newPodcast._id},})
});

module.exports = router;
