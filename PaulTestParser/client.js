  $form.on('submit', function(e) {
    if ($form.hasClass('is-uploading')) return false;
  
    $form.addClass('is-uploading').removeClass('is-error');
  
    if (isAdvancedUpload) {
      var droppedFiles = false;
  
      $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', function() {
        $form.addClass('is-dragover');
      })
      .on('dragleave dragend drop', function() {
        $form.removeClass('is-dragover');
      })
      .on('drop', function(e) {
        droppedFiles = e.originalEvent.dataTransfer.files;
      });    } else {
      // ajax for legacy browsers
    }
  });