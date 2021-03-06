// import { json } from "sequelize/types";

//all notes get pushed into here
let notes = [];

//the value of the notes in the editor
let currentIndex = null;

$(".back-button").hide();
$(".update-button").hide();
$(".delete-button").hide();

$(document).on("click", ".delete-button", function() {
  deleteNote(notes[currentIndex]);
  notes.splice(currentIndex, 1);
  renderNotes(); 
  clearValue(); 
});

function renderNotes() {
  $(".items").html("");
  for (var i = 0; i < notes.length; i++) {
    $(".items").append("<li><textarea class=\"items-input\" data-index=\"" + i + "\">" + notes[i].title + "\n" + notes[i].body.slice(0, 11) + "...</textarea></li>");
  }
}

renderNotes();
clearValue();

$(document).on("click", ".log-out", function() {
  window.location.assign("/");
});

$(document).on("click", ".add-code-button", function() {
  $(".notes").hide();
});

function renderNotes() {
  $(".items").html("");
  for (var i = 0; i < notes.length; i++) {
    $(".items").append(
      "<li><textarea class=\"items-input\" data-index=\"" +
        i +
        '">' +
        notes[i].title +
        "\n" +
        notes[i].body +
        "</textarea></li>"
    );
  }
}

//// SENDING INFO TO BACK END

var titleInput = $("#title-name");
var bodyInput = $("#write-notes");
var noteId;
var updating = false;

getNoteData();

$(".save-button").on("click", function handleFormSubmit(event) {
  event.preventDefault();
  // Wont submit the post if we are missing a body or a title
  if (titleInput.val().trim() === "" || bodyInput.val().trim() === "") {
    return;
  }
  // Constructing a newPost object to hand to the database
  var newNote = {
    title: titleInput.val().trim(),
    body: bodyInput.val().trim()
  };

  console.log(newNote);

  // If we're updating a post run updateNote to update a note
  // Otherwise run submitNote to create a whole new post
  if (updating) {
    newNote.id = noteId;
    updateNote(newNote);
  } else {
    submitNote(newNote);
  }
});

// Gets post data for a post if we're editing
// function getNoteData(id) {
//   $.get("/api/notes/" + id, function(data) {
//     if (data) {
//       titleInput.val(data.title);
//       bodyInput.val(data.body);
//       // If we have a post with this id, set a flag for us to know to update the post
//       // when we hit submit
//       updating = true;
//     }
//   });
// }

function getNoteData() {
  fetch("/api/user/notes")
    .then(res => res.json())
    .then(data => data.map(item => notes.push(item)))

    .then(renderNotes)
    .catch(err => console.error(err));
}


function submitNote(note) {
  $.ajax({
    method: "POST",
    url: "/api/user/notes",
    data: note
  }).then(function(response) {
    console.log(response);
    window.location.href = "/index";
  });
}
function deleteNote(note) {
  $.ajax({
    method: "DELETE",
    url: "/api/notes/" + note.id
  }).then(function(response) {
    console.log(response);
    window.location.href = "/index";
  });
}
// }); // to close document ready function


//notes
$(".save-note-button").on("click", function (event) {
  event.preventDefault();

  var title = $("#title-name").val();
  var content = $("#write-notes").val();

  const note = {
    title,
    content
  };

  notes.push(note);
  renderNotes();

  submitNote({
    title: title,
    body: content
  }); 

  clearValue();  
});;

//Title and Name show up again after being clicked
$(document).on("click", ".items-input", function () {
  const index = $(this).data("index");
  currentIndex = index;       
  $("#title-name").val(notes[index].title);
  $("#write-notes").val(notes[index].body);
  $(".delete-button").show();
});


function clearValue() {
  $("#title-name").val("");
  $("#write-notes").val("");
}
