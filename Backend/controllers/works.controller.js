const db = require('./../models');
const Works = db.works

exports.findAll = async (req, res) => {
	try {
	  const works = await Works.findAll({ include: 'category' });
  
	  const host = req.get('host');
	  const protocol = req.protocol;
  
	  const updatedWorks = works.map(work => {
		const workJson = work.toJSON(); 
		if (workJson.imageUrl && workJson.imageUrl.includes('localhost')) {
		  workJson.imageUrl = `${protocol}://${host}/images/${workJson.imageUrl.split('/').pop()}`;
		}
		return workJson;
	  });
	  
  
	  return res.status(200).json(updatedWorks);
	} catch (err) {
	  return res.status(500).json({ error: 'Something went wrong' });
	}
  };
  

exports.delete = async (req, res) => {
	try{
		await Works.destroy({where:{id: req.params.id}})
		return res.status(204).json({message: 'Work Deleted Successfully'})
	}catch(e){
		return res.status(500).json({error: new Error('Something went wrong')})
	}

}
