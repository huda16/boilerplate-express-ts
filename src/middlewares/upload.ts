import multer from "multer";

// Configure multer storage (you can customize this as needed)
const storage = multer.memoryStorage(); // Use memory storage or diskStorage based on your needs
const upload = multer({ storage });

export default upload;
