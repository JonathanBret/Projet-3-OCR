const db = require('./../models');
const Works = db.works;

exports.findAll = async (req, res) => {
  try {
    const works = await Works.findAll({ include: 'category' });

    // Modification de l'URL de l'image si elle contient 'localhost'
    const updatedWorks = works.map(work => {
      const workJson = work.toJSON();
      if (workJson.imageUrl && workJson.imageUrl.includes('localhost')) {
        // Remplacer localhost par le domaine de production
        workJson.imageUrl = `https://${process.env.HOST}/images/${workJson.imageUrl.split('/').pop()}`;
      }
      return workJson;
    });

    return res.status(200).json(updatedWorks);  // Retourner la liste mise à jour
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.create = async (req, res) => {
  const host = req.get('host');
  const title = req.body.title;
  const categoryId = req.body.category;
  const userId = req.auth.userId;
  const imageUrl = `https://${process.env.HOST}/images/${req.file.filename}`;

  try {
    const work = await Works.create({
      title,
      imageUrl,
      categoryId,
      userId
    });
    return res.status(201).json(work);
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Works.destroy({ where: { id: req.params.id } });
    return res.status(204).json({ message: 'Work Deleted Successfully' });
  } catch (e) {
    return res.status(500).json({ error: new Error('Something went wrong') });
  }
};
