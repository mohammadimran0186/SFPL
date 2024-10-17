const fs = require('fs');
const path = require('path');

// List uploaded files
exports.listFiles = (req, res) => {
  fs.readdir('./uploads', (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan files.');
    }
    const fileList = files.map(file => ({
      fileName: file,
      path: `/uploads/${file}`
    }));
    res.render('files', { files: fileList });
  });
};

// Download file
exports.downloadFile = (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.fileName);
  res.download(filePath, req.params.fileName, (err) => {
    if (err) {
      res.status(404).send('File not found.');
    }
  });
};
