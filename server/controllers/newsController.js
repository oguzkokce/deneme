const News = require("../models/News");

exports.addNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.session.user._id;
    const newNews = new News({ title, content, author });
    await newNews.save();
    req.flash("success_msg", "Haber eklendi.");
    res.redirect("/news");
  } catch (error) {
    res.status(500).send("Bir hata oluştu.");
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { newsId, title, content } = req.body;
    await News.findByIdAndUpdate(newsId, { title, content });
    req.flash("success_msg", "Haber güncellendi.");
    res.redirect("/news");
  } catch (error) {
    res.status(500).send("Bir hata oluştu.");
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { newsId } = req.body;
    await News.findByIdAndDelete(newsId);
    req.flash("success_msg", "Haber silindi.");
    res.redirect("/news");
  } catch (error) {
    res.status(500).send("Bir hata oluştu.");
  }
};

exports.getNews = async (req, res) => {
  try {
    const news = await News.find({}).populate("author", "name");
    res.render("news", { title: "Haberler", news });
  } catch (error) {
    res.status(500).send("Bir hata oluştu.");
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate("author", "name");
    res.render("newsDetail", { title: news.title, news });
  } catch (error) {
    res.status(500).send("Bir hata oluştu.");
  }
};
