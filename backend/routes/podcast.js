const router = require("express").Router();
const category = require("../models/category.js");
const Podcast = require("../models/podcast.js");
const User = require("../models/user.js");
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

  const newPodcast = new Podcast({
    title,
    description,
    category: catid,
    frontImage,
    audioFile,
    user: userid,
  });

  await newPodcast.save();
  await category.findByIdAndUpdate(catid, { $push: { newPodcast_id } });
});

//get all podcasts
router.get("/get-podcast", async (req, res) => {
  try {
    const podcasts = await Podcast.find()
      .populate("category")
      .sort({ createdAt: -1 });
    return res.status(200).json({ data: podcasts });
  } catch (error) {
    return res.status(400).json({ message: "internal server error" });
  }
});

//get user podacst
router.get("/get-user-podcasts", auth, async (req, res) => {
  try {
    const { user } = req;
    const userid = user._id;
    const data = await User.findById(userid)
      .populate({ path: "podcasts" }, populate({ path: "category" }))
      .select("-password");
    if (data && data.podcasts) {
      data.podcasts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return res.status(200).json({ data: data.podcasts });
  } catch (error) {
    return res.status(400).json({ message: "internal server error" });
  }
});

// Get podcast by id
router.get("/get-podcast/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const podcasts = await Podcast.findById(id).populate("category");
    return res.status(200).json({ data: podcasts });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
