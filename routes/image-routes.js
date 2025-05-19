const express=require('express')
const router=express.Router();
const authMiddleware=require('../middleware/auth-middleware')
const adminMiddleware=require('../middleware/admin-middleware')
const uploadMiddleware=require('../middleware/upload-middleware')
const {uploadImageController,fetchImageController, deleteImageController}=require('../controllers/image-controller')

//upload the image
router.post("/upload",authMiddleware,adminMiddleware,uploadMiddleware.single("image"),uploadImageController)


//get all the images
router.get('/get',authMiddleware,fetchImageController);

//delete image route
//68282681642b5617ee89fbc9
router.delete('/:id',authMiddleware,adminMiddleware,deleteImageController)


module.exports=router