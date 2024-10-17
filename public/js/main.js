// Enable upload button only if comment is added
const commentField = document.getElementById('comment');
const uploadBtn = document.getElementById('uploadBtn');

commentField.addEventListener('input', function () {
  if (commentField.value.trim()) {
    uploadBtn.disabled = false;
  } else {
    uploadBtn.disabled = true;
  }
});
